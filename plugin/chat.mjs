export default async (soket) => {
  /**
   * Listener untuk messages.upsert yang lebih aman dan rapih.
   * Perbaikan yang dilakukan:
   * - Cek keberadaan pesan sebelum mengakses propertinya (optional chaining)
   * - Normalisasi isi pesan (toLowerCase + trim)
   * - Ganti rangkaian `if` dengan `switch` untuk readability
   * - Bungkus handler dengan try/catch agar error tidak mempropagasi
   * - Hindari mendaftarkan listener berkali-kali dengan flag pada objek soket
   */

  // Handler terpisah supaya mudah dihapus/di-test jika perlu
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

      // if (
      //   (isiPesan.includes("rin") && isiPesan.includes("siapa")) ||
      //   (isiPesan.includes("rin") &&
      //     isiPesan.includes("siapa") &&
      //     isiPesan.includes("lu")) ||
      //   (isiPesan.includes("rin") &&
      //     isiPesan.includes("apa") &&
      //     isiPesan.includes("lu")) ||
      //   (isiPesan.includes("rin") &&
      //     isiPesan.includes("apa") &&
      //     isiPesan.includes("kamu"))
      // ) {
      //   await soket.sendMessage(kontak, { text: "aku rin" });
      // }

      // if (
      //   (isiPesan.includes("rin") &&
      //     isiPesan.includes("apa") &&
      //     isiPesan.includes("lu")) ||
      //   (isiPesan.includes("rin") &&
      //     isiPesan.includes("apa") &&
      //     isiPesan.includes("kamu"))
      // ) {
      //   await soket.sendMessage(kontak, { text: "aku karakter gak nyata si" });
      // }

      // if (isiPesan.includes("sekarang") && isiPesan.includes("hari")) {
      //   await soket.sendMessage(kontak, { text: "minggu bang" });
      // }

      // if (isiPesan.includes("besok") && isiPesan.includes("hari")) {
      //   await soket.sendMessage(kontak, { text: "senin" });
      // }

      // if (isiPesan.includes("lusa") && isiPesan.includes("hari")) {
      //   await soket.sendMessage(kontak, { text: "selasa" });
      // }

      switch (isiPesan) {
        case "rin":
          await soket.sendMessage(kontak, { text: "hm?" });
          break;
        case "hi rin":
          await soket.sendMessage(kontak, { text: "iya?" });
          break;
        case "rinn":
          await soket.sendMessage(kontak, { text: "apa?" });
          break;

        default:
          // Tidak ada aksi untuk pesan lain
          break;
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
