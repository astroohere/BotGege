import { menuHit } from "../menu.mjs";

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

const about = `>*botgege 0.7-beta* by Astroo\n`;

export { menuContents, about };
