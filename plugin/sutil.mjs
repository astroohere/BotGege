// sutil 1.5
const version =
  "`sutil v1.5`\nsticker utility atau disingkat sutil adalah utilitas untuk membuat stiker dan dapat mengonversi stiker menjadi gambar.";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

export default async (soket) => {
  async function main() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      const pesan = messages[0];
      const kontak = pesan.key.remoteJid;
      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";

      const caption = pesan.message?.imageMessage?.caption || "";

      if (pesan.key.fromMe) return; // Ignore self messages
      if (!pesan.message) return; // Ignore if theres no text or media

      if (isiPesan === ".s -v") {
        await soket.sendMessage(kontak, { text: version });
      } // Check plugin version

      if (caption === ".s" || caption.includes("stiker")) {
        useCaption(pesan, kontak);
      } // Create sticker using image with caption
    });
  }

  async function useCaption(pesan, kontak) {
    const buffer = await downloadMediaMessage(pesan, "buffer"); // Download the media

    const konfigurasiStiker = new Sticker(buffer, {
      pack: "", // The pack name
      author: "", // The author name
      type: StickerTypes.FULL, // The sticker type
      categories: [], // The sticker category
      id: "12345", // The sticker id
      quality: 100, // The quality of the output file
    });

    soket.sendMessage(kontak, await konfigurasiStiker.toMessage()); // Send sticker
    console.log("[Rin:sutil] Berhasil membuat stiker!");
  }
  async function useReply() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      for (const pesan of messages) {
        if (pesan.message?.extendedTextMessage?.contextInfo) {
          const pesan = messages[0];
          const isiPesan =
            pesan.message?.conversation ||
            pesan.message?.extendedTextMessage?.text ||
            pesan.message?.imageMessage?.caption ||
            "";
          const contextInfo = pesan.message.extendedTextMessage.contextInfo;
          const kontak = pesan.key.remoteJid;

          if (pesan.key.fromMe) return; // Abaikan pesan dari diri sendiri
          if (!pesan.message) return; // Abaikan jika pesan tidak ada teks atau media

          // Cek apakah pesan yang dibalas adalah media
          const quotedMessage = contextInfo.quotedMessage;
          if (
            (quotedMessage.imageMessage && isiPesan === ".s") ||
            (quotedMessage.imageMessage && isiPesan.includes("stiker"))
          ) {
            console.log("[s] Memproses gambar...");
            console.warn(contextInfo);

            const buffer = await downloadMediaMessage(
              { key: contextInfo.stanzaId, message: quotedMessage },
              "buffer"
            );

            const konfigurasiStiker = new Sticker(buffer, {
              pack: "", // The pack name
              author: "", // The author name
              type: StickerTypes.FULL, // The sticker type
              categories: [], // The sticker category
              id: "12345", // The sticker id
              quality: 100, // The quality of the output file
            });

            console.log(`[s] Gambar berhasil diproses!`);
            soket.sendMessage(kontak, await konfigurasiStiker.toMessage());
          }
        }
      }
    });
  }

  async function toImg() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      const pesan = messages[0];
      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";
      const contextInfo = pesan.message?.extendedTextMessage?.contextInfo;

      const kontak = pesan.key.remoteJid;

      if (contextInfo?.quotedMessage) {
        // Cek apakah pesan yang dibalas adalah media
        const quotedMessage = contextInfo.quotedMessage;
        if (
          (quotedMessage.stickerMessage && isiPesan === ".toimg") ||
          (quotedMessage.stickerMessage && isiPesan.includes("gambar"))
        ) {
          // Unduh media dari pesan yang dibalas
          const stream = await downloadMediaMessage(
            { key: contextInfo.stanzaId, message: quotedMessage },
            "buffer"
          );

          console.log(`[Rin:sutil] gambar berhasil diproses!`);

          await soket.sendMessage(kontak, {
            image: stream,
            caption: "nih",
          });
        }
      }
    });
  }

  main();
  useReply();
  toImg();
};
