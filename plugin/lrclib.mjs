// lrclib 0.1-beta
const version =
  "`lrclib v0.1`\nLRCLIB is a open-source database of song lyrics, this plugin can search any song from LRCLIB.";

export default async (soket) => {
  async function searchLyrics(keyword) {
    const data = await response.json();
    console.log(data); // Mengembalikan array berisi maksimal 20 hasil
  }

  function lrclib() {
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

      if (isiPesan === ".lrclib -v") {
        await soket.sendMessage(kontak, { text: version });
      } else if (isiPesan === ".lrclib") {
        await soket.sendMessage(kontak, {
          text: "berikan lirik lagu yang ingin dicari\n*contoh: .lrclib multo*",
        });
      } else if (isiPesan.startsWith(".lrclib")) {
        try {
          const sentMSG = await soket.sendMessage(kontak, {
            react: {
              text: "🫸",
              key: pesan.key,
            },
          });

          const query = await isiPesan.slice(7).trim();

          const response = await fetch(
            `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`,
            {
              headers: {
                // Wajib/disarankan memberikan identitas bot/aplikasi kamu
                "Lrclib-Client":
                  "AstrooApp/1.0.0 (https://github.com/username/project)",
              },
            },
          );

          const data = await response.json();
          const lyric = data[0]?.trackName;
          if (!lyric) {
            throw new Error();
          }

          const result =
            "> " +
            data[0]?.trackName +
            " - " +
            data[0]?.artistName +
            "\n\n" +
            data[0]?.plainLyrics;

          await soket.sendMessage(kontak, {
            text: result,
          });
          await soket.sendMessage(kontak, {
            react: {
              text: "",
              key: pesan.key,
            },
          });
        } catch (error) {
          console.log("[Saki] Error LRCLIB, lagu tidak ditemukan: ", error);
          await soket.sendMessage(kontak, { text: "nggak nemu" });
          await soket.sendMessage(kontak, {
            react: {
              text: "❌",
              key: pesan.key,
            },
          });
        }
      }
    });
  }

  lrclib();
};
