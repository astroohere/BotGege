// git-clone v0.1
const version = "`git-clone v0,1`\nPlugin untuk clone repository GitHub";
import axios from "axios";

export default async function main(soket) {
  soket.ev.on("messages.upsert", async ({ messages }) => {
    const pesan = messages[0];
    const kontak = pesan.key.remoteJid;
    const isiPesan =
      pesan.message?.conversation ||
      pesan.message?.extendedTextMessage?.text ||
      pesan.message?.imageMessage?.caption ||
      "";

    if (isiPesan === ".git-clone -v") {
      await soket.sendMessage(kontak, { text: version });
    }

    if (isiPesan.startsWith(".git-clone")) {
      await soket.sendMessage(kontak, {
        react: {
          text: "⏳",
          key: pesan.key,
        },
      });
      const args = isiPesan.split(" ");

      if (!args[1]) {
        await soket.sendMessage(kontak, { text: "mana url github nya?" });
        return;
      }
      if (args[1].includes(".zip")) {
        await soket.sendMessage(kontak, { text: "kasih url github nya juga" });
        return;
      }

      let URL = args[1] + "/archive/refs/heads/main.zip";
      const fileName = args[2];

      if (URL.includes(".git")) {
        URL = `${args[1].replace(".git", "")}/archive/refs/heads/main.zip`;
      }

      console.log(`[Rin:gitclone] Repo: ${args}\nNama File: ${fileName}`);

      await clone(URL, fileName, soket, pesan, kontak);
    }
  });
}

async function clone(URL, fileName = "clone.zip", soket, pesan, kontak) {
  try {
    const zip = await axios(URL, {
      method: `GET`,
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    await soket.sendMessage(kontak, {
      document: { stream: zip.data },
      fileName: fileName,
      caption: "nih",
    });
    await soket.sendMessage(kontak, {
      react: {
        text: "✅",
        key: pesan.key,
      },
    });
  } catch (e) {
    await soket.sendMessage(kontak, {
      react: {
        text: "❌",
        key: pesan.key,
      },
    });

    console.log(`[Rin:gitclone] Terjadi error di: ${e}`);
    if (e.code === "ERR_INVALID_URL" || e.message.includes("Invalid URL")) {
      await soket.sendMessage(kontak, { text: "url github nya nggak valid" });
    }
    if (e.code === "404" || e.message.includes("Request failed")) {
      await soket.sendMessage(kontak, {
        text: "nggak nemu isinya, request failed error 404",
      });
    }
  }
}
