import axios from "axios";
import { writeFile } from "fs/promises";

const version =
  "`udl v0.1`\nPlugin downloader universal yang dibangun menggunakan ytdlp";

export default function main(soket) {
  soket.ev.on("messages.upsert", async ({ messages }) => {
    const pesan = messages[0];
    const kontak = pesan.key.remoteJid;
    const isiPesan =
      pesan.message?.conversation ||
      pesan.message?.extendedTextMessage?.text ||
      pesan.message?.imageMessage?.caption ||
      "";

    if (isiPesan === ".udl -v") {
      await soket.sendMessage(kontak, { text: version });
    }

    if (isiPesan.startsWith(".ytdl")) {
      await soket.sendMessage(kontak, {
        react: {
          text: "⏳",
          key: pesan.key,
        },
      });
      youtubeDownloader(soket, pesan, isiPesan, kontak);
    }
  });
}

async function youtubeDownloader(soket, pesan, isiPesan, kontak) {
  const URL = isiPesan.split(" ");
  const API_ENDPOINT = `https://api.astr.my.id/download`;

  try {
    const response = await axios.get(API_ENDPOINT, {
      params: {
        link_youtube: URL[1], // clean link
      },
      responseType: "stream",
    });

    await writeFile(response.data)

    await soket.sendMessage(kontak, {
      video: { stream: response.data },
      caption: "nih",
    });
    await soket.sendMessage(kontak, {
      react: {
        text: "✅",
        key: pesan.key,
      },
    });
  } catch (error) {
    console.log(`[Rin:udl-ytdl] Terjadi error di: ${error}`);
    await soket.sendMessage(kontak, {
      react: {
        text: "❌",
        key: pesan.key,
      },
    });
  }
}