// main-t.mjs
import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode-terminal";
import { readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Pino from "pino";

function listPluginFiles() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  // baca folder plugin relatif ke file ini
  return readdirSync(join(__dirname, "plugin"))
    .filter((file) => file.endsWith(".mjs"))
    .map((file) => join(__dirname, "plugin", file));
}

async function sambungkanKeWhatsApp() {
  const { version } = await fetchLatestBaileysVersion();
  const { saveCreds, state } = await useMultiFileAuthState("sesi");
  const soket = makeWASocket({
    version,
    auth: state,
    logger: Pino({ level: "silent" }),
  });

  soket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      console.log("[Rin] QR Code diterima, silakan scan:");
      QRCode.generate(qr, { small: true });
    }
    if (connection === "close") {
      console.log("[Rin] Koneksi terputus, menyambungkan kembali...");
      console.log(lastDisconnect);
      setTimeout(() => sambungkanKeWhatsApp(), 1000); 
    }
    if (connection === "open") {
      console.warn("[Rin] botgege 0.7 is under beta development!");
      console.log("[Rin] Koneksi tersambung!");
    }
  });

  // DYNAMIC IMPORT plugin ESM dan jalankan default export
  const pluginFiles = listPluginFiles();
  for (const pluginPath of pluginFiles) {
    try {
      // gunakan pathToFileURL agar import() menerima file path
      const mod = await import(pathToFileURL(pluginPath).href);
      const plugin = mod.default ?? mod;
      if (typeof plugin === "function") {
        await plugin(soket);
        console.log(`[Rin] plugin dimuat: ${pluginPath}`);
      } else {
        console.warn(
          `[Rin] Module tidak mengekspor fungsi default: ${pluginPath}`
        );
      }
    } catch (err) {
      console.error("Plugin error:", err);
    }
  }

  soket.ev.on("creds.update", saveCreds);
}

sambungkanKeWhatsApp();
