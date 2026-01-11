import Tiktok from "@tobyg74/tiktok-api-dl";
import axios from "axios";
import fs from "fs";
import path from "path";

// Tentukan direktori downloads dan pastikan ada
const downloadsDir = path.resolve(process.cwd(), "downloads");
fs.promises.mkdir(downloadsDir, { recursive: true }).catch(console.error);

/**
 * Mengambil metadata video dari URL TikTok.
 */
async function fetchVideoInfo(url) {
  const info = await Tiktok.Downloader(url, { version: "v3" });
  if (info.status !== "success" || !info.result) {
    throw new Error(info.message || "Gagal mendapatkan metadata video");
  }
  return info.result;
}

/**
 * Mengekstrak URL video (tanpa watermark jika tersedia) dari hasil metadata.
 */
function extractVideoUrl(result) {
  if (!result) return null;

  // Prioritaskan link HD atau video biasa
  return (
    result.videoHD ||
    result.video ||
    result.direct ||
    result.video?.downloadAddr?.[0] ||
    result.video?.playAddr?.[0] ||
    result.playAddr?.[0] ||
    result.downloadAddr?.[0] ||
    // Fallback ke regex jika ada data 'resultNotParsed'
    (result.resultNotParsed &&
      JSON.stringify(result.resultNotParsed).match(
        /https?:\/\/[^"'\s\\]+\.mp4[^"'\s\\]*/
      )?.[0])
  );
}

/**
 * Mengunduh file dari URL ke path tujuan menggunakan stream.
 */
async function downloadVideo(url, outputPath) {
  const response = await axios.get(url, {
    responseType: "stream",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      Referer: "https://www.tiktok.com/",
    },
    timeout: 60000, // Timeout 60 detik
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
    response.data.on("error", reject);
  });
}

// Regex untuk validasi URL TikTok
const TIKTOK_URL_REGEX = /https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com)\S+/;

export default (soket) => {
  soket.ev.on("messages.upsert", async ({ messages }) => {
    const pesan = messages?.[0];
    if (
      !pesan?.message ||
      pesan.key.fromMe ||
      pesan.key.remoteJid === "status@broadcast"
    ) {
      return;
    }

    const remoteJid = pesan.key.remoteJid;
    const isiPesan =
      pesan.message.conversation ||
      pesan.message.extendedTextMessage?.text ||
      pesan.message.imageMessage?.caption ||
      "";

    const [cmd, url] = isiPesan.trim().split(/\s+/);
    if (cmd.toLowerCase() !== ".ttdl") return;

    // 1. Validasi URL
    if (!url || !TIKTOK_URL_REGEX.test(url)) {
      await soket.sendMessage(remoteJid, {
        text: "Gunakan: .ttdl <url_tiktok_valid>",
      });
      return;
    }

    let outPath = null; // Definisikan di luar try untuk dipakai di finally

    try {
      await soket.sendMessage(remoteJid, {
        text: "⏳ Mengambil info video...",
      });

      // 2. Ambil Info
      const result = await fetchVideoInfo(url);
      const videoUrl = extractVideoUrl(result);
      if (!videoUrl) {
        throw new Error(
          "Tidak menemukan URL unduhan video (mungkin video slide atau non-publik)."
        );
      }

      // 3. Download
      const fileName = `tiktok_${Date.now()}.mp4`;
      outPath = path.join(downloadsDir, fileName);

      await soket.sendMessage(remoteJid, {
        text: "📥 Mulai mengunduh video...",
      });
      await downloadVideo(videoUrl, outPath);

      // 4. Kirim Video
      await soket.sendMessage(remoteJid, { text: "📤 Mengirim video..." });
      await soket.sendMessage(remoteJid, {
        video: { url: outPath },
        caption: result.description || "Nih videonya 🎥", // Gunakan deskripsi video
      });
    } catch (err) {
      console.error("Download error:", err);
      await soket.sendMessage(remoteJid, {
        text: `Gagal: ${err.message || "Terjadi kesalahan"}`,
      });
    } finally {
      // 5. Cleanup (SANGAT PENTING)
      // Selalu hapus file setelah selesai (baik sukses maupun gagal)
      if (outPath) {
        try {
          await fs.promises.unlink(outPath);
        } catch (cleanupErr) {
          console.error("Gagal menghapus file:", outPath, cleanupErr);
        }
      }
    }
  });
};
