import { instagramGetUrl } from "instagram-url-direct";
import axios from "axios";

export default async (soket) => {
  const version =
    "`igdl v0.5`\nplugin igdl berfungsi untuk mengunduh reels dari instagram";

  async function getDirectLink() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      const pesan = messages[0];
      const kontak = pesan.key.remoteJid;
      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";

      if (isiPesan === ".igdl -v") {
        await soket.sendMessage(kontak, { text: version });
      }

      try {
        if (isiPesan === ".igdl") {
          await soket.sendMessage(kontak, {
            text: "kirim linknya\n*contoh: .igdl https://www.instagram.com/reel/DJJ1z1oyWSH/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==*",
          });
        } else if (isiPesan.startsWith(".igdl")) {
          await soket.sendMessage(kontak, {
            text: "bentar",
          });

          let link = isiPesan.split(" ");
          let cleanLink = link[1];
          const linkData = await instagramGetUrl(`${cleanLink}`);

          let directLink = linkData.url_list[0];

          saveVideo(directLink, kontak);
        }
      } catch (error) {
        console.log("[Rin:igdl] Link tidak valid!");
        await soket.sendMessage(kontak, { text: "linknya nggak valid" });
      }
    });
  }
  async function saveVideo(reelsURL, kontak) {
    const resource = await axios({
      method: "get",
      url: reelsURL,
      responseType: "arraybuffer",
      headers: {
        // penting buat CDN IG
        "User-Agent": "Mozilla/5.0",
      },
    });

    const buffer = Buffer.from(resource.data);

    const mimeType = resource.headers["content-type"];

    if (!mimeType) return;

    try {
      if (mimeType === "image/jpeg") {
        await soket.sendMessage(kontak, {
          image: buffer,
          caption: "nih",
        });
      } else {
        await soket.sendMessage(kontak, {
          video: buffer,
          caption: "nih",
        });
      }
    } catch (error) {
      console.error("yah error jing:", error);
    }
  }

  getDirectLink();
};
