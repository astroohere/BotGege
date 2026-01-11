// menu.mjs
const version = "`menu v1`";
import { menuContents, about } from "./config/menu_config.mjs";

let menuHit = 0;

export function menu(soket) {
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
    if (isiPesan === ".s") return;

    if (isiPesan.includes("menu") && isiPesan.includes("rin")) {
      await soket.sendMessage(kontak, { text: menuContents() });
      menuHit += 1;
    }

    if (isiPesan === ".menu -v") {
      await soket.sendMessage(kontak, { text: version });
    } else if (isiPesan === ".menu") {
      menuHit += 1;
      await soket.sendMessage(kontak, { text: menuContents() });
    } else if (isiPesan === ".about") {
      await soket.sendMessage(kontak, { text: about });
    }
  });
}
export default menu;
export { menuHit };
