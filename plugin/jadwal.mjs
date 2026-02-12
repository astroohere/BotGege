import { SongsClient } from "genius-lyrics";

export default async (soket) => {
  const version = "jadwal v0.1";

  async function jadwal() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      const pesan = messages[0];
      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";
      const kontak = pesan.key.remoteJid;
      if (
        !pesan.message ||
        pesan.key.fromMe ||
        kontak === "status@broadcast" ||
        // kontak.endsWith("@g.us") ||
        isiPesan === ".s" ||
        isiPesan === "eksekusi"
      )
        return;

      if (isiPesan === ".jadwal --version") {
        await soket.sendMessage(kontak, { text: version });
      }

      const jadwal = `*jabwal pelajaran*

*senin:* 
jam ke 1 = kokurikuler
jam ke 2 - 3 = bahasa inggris 
jam ke 4 - 5 = ips
jam ke 6 - 7 = Pend. Agama islam
jam ke 8 = Bimbingan Konseling 

*selasa:* 
jam ke 1 - 2 = ips 
jam ke 3 - 4 = Bahasa Inggris 
jam ke 5 - 6 = Pendidikan Pancasila 
jam ke 7 - 9 = matematika  

*rabu:* 
jam ke 1 - 3 = Seni Budaya 
jam ke 4 - 6 = ipa
jam ke 7 - 9 = informatika 

*kamis:* 
jam ke 1 = kokurikuler
jam ke 2 = tadarus
jam ke 3 - 4 = PJOK
jam ke 5 - 7 = Bahasa Indonesia

*jum'at:* 
jam ke 1 - 3 = Bahasa Indonesia (PM TKA) 
jam ke 4 - 5 = Matematika 
jam ke 6 - 7 = ipa`;

      if (isiPesan === ".jadwal") {
        await soket.sendMessage(kontak, { text: jadwal });
      }

      if (isiPesan.includes("jadwal") && isiPesan.includes("rin")) {
        await soket.sendMessage(kontak, { text: jadwal });
      }
    });
  }

  jadwal();
};
