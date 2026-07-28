// chat 0.5
const version = "`chat v0.5`\nBasic interaction with Saki.";

export default async (soket) => {
  const messagesUpsertHandler = async ({ messages }) => {
    try {
      if (!messages || !messages.length) return;

      const pesan = messages[0];
      if (!pesan || !pesan.message) return;

      const kontak = pesan.key?.remoteJid;
      // Jangan respon ke pesan sendiri atau ke status broadcast
      if (pesan.key?.fromMe || kontak === "status@broadcast") return;

      // Ambil text dari beberapa tipe pesan yang umum
      const rawIsiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";

      // Normalisasi: hindari case-sensitivity dan spasi berlebih
      const isiPesan = String(rawIsiPesan).toLowerCase().trim();

      // Ambil quoted message jika ada (aman dengan optional chaining)
      const quotedMessage =
        pesan.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      const responsesList = [
        "iya?",
        "iyaa?",
        "hm?",
        "hmm?",
        "apa?",
        "apaa?",
        "apaaa?",
        "ya?",
        "yaa?",
        "apaan",
        "ape",
        "?",
      ];
      const randomIndex = Math.floor(Math.random() * responsesList.length);

      if (isiPesan === ".chat -v") {
        await soket.sendMessage(kontak, { text: version });
      }
      if (isiPesan.includes("saki")) {
        await soket.sendMessage(kontak, { text: responsesList[randomIndex] });
      }
    } catch (err) {
      console.error("Error in messages.upsert handler:", err);
    }
  };

  // Jangan daftar listener berkali-kali (mis. saat hot-reload)
  if (!soket._chisaListenerRegistered) {
    soket.ev.on("messages.upsert", messagesUpsertHandler);
    soket._chisaListenerRegistered = true;
  }
};
