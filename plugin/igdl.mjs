import { instagramGetUrl } from "instagram-url-direct";
import axios from "axios";

export default async (soket) => {
  const version =
    "`igdl v0.2`\nplugin igdl berfungsi untuk mengunduh reels dari instagram";

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

      if (isiPesan.startsWith(".igdl")) {
        await soket.sendMessage(kontak, {
          text: "bentar",
        });

        let link = isiPesan.split(" ");
        let cleanLink = link[1];
        const linkData = await instagramGetUrl(`${cleanLink}`);

        let directLink = linkData.url_list[0];

        saveVideo(directLink, kontak);
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
