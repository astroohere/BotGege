const version =
  "`udl v0.1\nUDL (Universal Downloader) is a powerful downloader tool for WhatsApp powered by popular YT-DLP tool!`";
import { spawn } from "child_process";

export default async (soket) => {
  async function downloadVideo(kontak, url) {
    try {
      const ytdlp = spawn("yt-dlp", ["-f", "b[ext=mp4]/b", "-o", "-", url]);

      await soket.sendMessage(kontak, {
        video: {
          stream: ytdlp.stdout,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const messagesUpsertHandler = async ({ messages }) => {
    try {
      if (!messages || !messages.length) return; // return if the message is empty or self

      const pesan = messages[0];
      const kontak = pesan.key.remoteJid;
      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";

      if (isiPesan === ".udl") {
        await soket.sendMessage(kontak, {
          text: "mana linknya?\ncontoh: .udl https://youtu.be/dQw4w9WgXcQ",
        });
      }

      if (isiPesan.startsWith(".udl")) {
        const cleanURL = isiPesan.slice(5);

        await soket.sendMessage(kontak, {
          react: {
            text: "⏳",
            key: pesan.key,
          },
        });
        await downloadVideo(kontak, cleanURL);
        await soket.sendMessage(kontak, {
          react: {
            text: "",
            key: pesan.key,
          },
        });
      }
    } catch (error) {
      console.log(`[Saki] terjadi error di: ${error}`);
    }
  };

  if (!soket._ytdlListenerRegistered) {
    soket.ev.on("messages.upsert", messagesUpsertHandler);
    soket._ytdlListenerRegistered = true;
  }
};
