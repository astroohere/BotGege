// sutil 1.5
const version =
  "`sutil v1.5`\nsticker utility atau disingkat sutil adalah utilitas untuk membuat stiker dan dapat mengonversi stiker menjadi gambar, dan sekarang dapat digunakan untuk mengkoleksi stiker!";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

export default async function main(soket) {
  soket.ev.on("messages.upsert", async ({ messages }) => {
    const pesan = messages[0];
    const kontak = pesan.key.remoteJid;
    const isiPesan =
      pesan.message?.conversation ||
      pesan.message?.extendedTextMessage?.text ||
      pesan.message?.imageMessage?.caption ||
      "";

    const caption = pesan.message?.imageMessage?.caption || "";
    const contextInfo = pesan?.message?.extendedTextMessage?.contextInfo;

    if (pesan.key.fromMe) return; // Ignore self messages
    if (!pesan.message) return; // Ignore if theres no text or media

    if (isiPesan === ".s -v") {
      await soket.sendMessage(kontak, { text: version });
    } // Check plugin version

    if (caption === ".s" || caption.includes("stiker")) {
      useCaption(soket, pesan, kontak);
      return;
    }
    // Create sticker using image with caption

    if (isiPesan === ".toimg") {
      toImg(soket, pesan, isiPesan, kontak);
      return;
    } // Convert sticker to image

    if (isiPesan === ".s" || isiPesan.includes("stiker")) {
      useReply(soket, kontak, isiPesan, contextInfo);
      return;
    }
  });
}

async function useCaption(soket, pesan, kontak) {
  // Create sticker using image with caption
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
async function useReply(soket, kontak, isiPesan, contextInfo) {
  // Create sticker using replied image

  // Cek apakah pesan yang dibalas adalah media
  if (contextInfo?.quotedMessage) {
    const quotedMessage = contextInfo.quotedMessage;

    if (
      (quotedMessage.imageMessage && isiPesan === ".s") ||
      (quotedMessage.imageMessage && isiPesan.includes("stiker"))
    ) {
      console.log("[s] Memproses gambar...");

      const buffer = await downloadMediaMessage(
        { key: contextInfo.stanzaId, message: quotedMessage },
        "buffer",
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
    } else {
      console.log("[Rin:sutil] Pesan yang direply bukan gambar.");
      await soket.sendMessage(kontak, {
        text: "itu bukan gambar",
      });
    }
  } else {
    console.log("[Rin:sutil] Tidak ada pesan yang direply.");
    await soket.sendMessage(kontak, {
      text: "mana gambarnya",
    });
  }
}

async function toImg(soket, pesan, isiPesan, kontak) {
  // Convert sticker to image
  const contextInfo = pesan.message?.extendedTextMessage?.contextInfo;

  if (contextInfo?.quotedMessage) {
    // Cek apakah pesan yang dibalas adalah media
    const quotedMessage = contextInfo.quotedMessage;
    if (quotedMessage.stickerMessage && isiPesan === ".toimg") {
      // Cek apakah pesan yang direply adalah stiker
      const stream = await downloadMediaMessage(
        { key: contextInfo.stanzaId, message: quotedMessage },
        "buffer",
      ); // Unduh media dari pesan yang dibalas

      console.log(`[Rin:sutil] gambar berhasil diproses!`);

      await soket.sendMessage(kontak, {
        image: stream,
        caption: "nih",
      });
    } else {
      console.log("[Rin:sutil] Pesan yang direply bukan stiker.");
      await soket.sendMessage(kontak, {
        text: "itu bukan stiker",
      });
    }
  } else {
    console.log("[Rin:sutil] Tidak ada pesan yang direply.");
    await soket.sendMessage(kontak, {
      text: "reply stikernya",
    });
  }
}
