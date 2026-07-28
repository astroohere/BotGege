import { menuHit } from "../plugin/menu.mjs";

const menuContents = () => {
  return (
    "> *TOOLS*\n" +
    ".s `buat stiker`\n" +
    ".toimg `ubah stiker ke gambar`\n" +
    ".udl `unduh video dari mana saja!`\n\n" +
    "> *SEARCH*\n" +
    ".lrclib `cari lirik musik dari LRCLIB`\n\n" +
    "> *INFO*\n" +
    ".about `menampilkan informasi bot`\n" +
    ".info `menampilkan informasi sistem host`\n\n" +
    "`©botgege-beta-dev`\n" +
    `#${menuHit}`
  );
};

const about = `> *botgege 0.7-beta* by Astroo\n`;

export { menuContents, about };
