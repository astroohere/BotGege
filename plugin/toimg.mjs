const version = "toimg v1.2";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export default async (soket) => {
  function setup() {
    const fileName = new Date().toISOString().replace(/:/g, "-") + ".png";
    const filePath = "./plugin/toimg";
    const outputPath = join(filePath, "toimg-" + fileName);

    if (!existsSync(filePath)) mkdirSync(filePath);

    return outputPath;
  }

  async function buatStiker() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      const pesan = messages[0];
      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";
      const contextInfo = pesan.message?.extendedTextMessage?.contextInfo;

      const kontak = pesan.key.remoteJid;
      const outputPath = setup();

      if (isiPesan === ".toimg -v") {
        await soket.sendMessage(kontak, { text: version });
        console.log(pesan);
      }

      if (contextInfo?.quotedMessage) {
        // Cek apakah pesan yang dibalas adalah media
        const quotedMessage = contextInfo.quotedMessage;
        if (
          (quotedMessage.stickerMessage && isiPesan === ".toimg") ||
          (quotedMessage.stickerMessage && isiPesan.includes("gambar"))
        ) {
          console.log("[toimg] memproses gambar...");

          // Unduh media dari pesan yang dibalas
          const stream = await downloadMediaMessage(
            { key: contextInfo.stanzaId, message: quotedMessage },
            "buffer"
          );

          // Simpan media ke file

          writeFileSync(outputPath, stream);
          console.log(`[toimg] gambar berhasil diproses!: ${outputPath}`);

          await soket.sendMessage(kontak, {
            image: { url: outputPath },
            caption: "nih",
          });
        }
      }
    });
  }

  setup();
  buatStiker();
};
