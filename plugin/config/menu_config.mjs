import { menuHit } from "../menu.mjs";

// Ekspor menuContents sebagai fungsi agar uptime selalu update saat dipanggil
// const menuContents = () => {
//   return (
//     "> *TOOLS*\n" +
//     ".s `buat stiker`\n" +
//     ".toimg `ubah stiker ke gambar`\n" +
//     ".igdl `unduh reels Instagram`\n" +
//     ".ttdl `unduh video TikTok`\n\n" +
//     "> *SPECIAL*\n" +
//     ".eksekusi `percantik waifu~`\n\n" +
//     "> *INFO*\n" +
//     ".about `menampilkan informasi bot`\n" +
//     ".info `menampilkan informasi sistem host`\n\n" +
//     "`Rin desu.`\n" +
//     "`©botgege-beta-dev`\n" +
//     `#${menuHit}`
//   );
// };

const menuContents = () => {
  return (
    "> *TOOLS*\n" +
    ".s `buat stiker`\n" +
    ".toimg `ubah stiker ke gambar`\n" +
    ".igdl `unduh reels Instagram`\n" +
    ".ttdl `unduh video TikTok`\n\n" +
    "> *SEARCH*\n" +
    ".genius `cari lirik lagu`\n\n" +
    "> *INFO*\n" +
    ".about `menampilkan informasi bot`\n" +
    ".info `menampilkan informasi sistem host`\n\n" +
    "`Rin desu.`\n" +
    "`©botgege-beta-dev`\n" +
    `#${menuHit}`
  );
};

const about = `>*botgege 0.6 BETA-DEV* by Astroo\n` + "*Owner*: Astroo";

export { menuContents, about };
