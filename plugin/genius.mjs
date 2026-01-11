// genius.mjs
const version =
  "`genius v1`\ngenius adalah platform untuk mencari lirik lagu dari berbagai artis di seluruh dunia.";
import Genius from "genius-lyrics";

const Client = new Genius.Client("ISI APIKEY"); // Scrapes if no key is provided

export default async (soket) => {
  function genius() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      const pesan = messages[0];
      if (!pesan || pesan.key.fromMe) return;

      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";
      const kontak = pesan.key.remoteJid;
      if (!isiPesan || kontak === "status@broadcast") return;

      if (isiPesan === ".genius -v") {
        await soket.sendMessage(kontak, { text: version });
      } else if (isiPesan === ".genius") {
        await soket.sendMessage(kontak, {
          text: "berikan lirik lagu yang ingin dicari\n*contoh: .genius multo*",
        });
      } else if (isiPesan.startsWith(".genius")) {
        try {
          const sentMSG = await soket.sendMessage(kontak, {
            text: "bentar aku cari",
          });

          const query = await isiPesan.slice(7).trim();

          const searches = await Client.songs.search(query);

          // Pick first one
          const firstSong = searches[0];
          // console.log("About the Song:\n", firstSong, "\n");

          // Ok lets get the lyrics
          let lyrics = await firstSong.lyrics();

          // --- BAGIAN EDIT MULAI ---
          // Mencari posisi pertama tanda kurung siku '[' (biasanya [Intro], [Verse 1], dll)
          const firstTagIndex = lyrics.indexOf("[");

          // Jika tanda '[' ditemukan, potong teks sebelumnya (yang berisi kontributor/sampah)
          if (firstTagIndex !== -1) {
            lyrics = lyrics.substring(firstTagIndex);
          }
          // --- BAGIAN EDIT SELESAI ---

          await soket.sendMessage(kontak, {
            text:
              "`" +
              firstSong.title +
              "`\n`By: " +
              firstSong.artist.name +
              "`\n\n" +
              lyrics,
            edit: sentMSG.key,
          });
        } catch (error) {
          console.log("[ERROR GENIUS] lagu tidak ditemukan: ", error);
          await soket.sendMessage(kontak, { text: "nggak nemu" });
        }
      }
    });
  }

  genius();
};
