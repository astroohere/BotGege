// info 0.1-beta
const version =
  "`info v0.1-beta`\nBotGege system monitor! (currently doesnt work with pterodactyl panel)";
import os from "os";

export default async (soket) => {
  async function info() {
    soket.ev.on("messages.upsert", async ({ messages }) => {
      const pesan = messages[0];
      const isiPesan =
        pesan.message?.conversation ||
        pesan.message?.extendedTextMessage?.text ||
        pesan.message?.imageMessage?.caption ||
        "";
      const kontak = pesan.key.remoteJid;
      if (!pesan.message || pesan.key.fromMe || kontak === "status@broadcast")
        return;

      const getInfo = {
        hostname: os.hostname(),
        platform: os.platform(),
        distroHint: os.type(), // nama kernel / tipe OS (bisa "Linux", "Windows_NT")
        release: os.release(),
        arch: os.arch(),
        uptime_seconds: os.uptime(),
        loadavg: os.loadavg(), // 1/5/15 min load averages (Unix)
        cpus: os.cpus().map((c) => ({ model: c.model, speed_mhz: c.speed })),
        total_mem_bytes: os.totalmem(),
        free_mem_bytes: os.freemem(),
        network_interfaces: os.networkInterfaces(),
        homedir: os.homedir(),
        userInfo: os.userInfo(),
      };

      // Ambil model CPU dari inti pertama (gunakan ?. untuk keamanan jika array kosong)
      const cpuModel = getInfo.cpus[0]?.model || "Unknown CPU Model";
      // Hitung jumlah inti CPU
      const coreCount = getInfo.cpus.length;

      const info =
        "Host:\n`" +
        getInfo.hostname +
        "`\n" +
        "Platform:\n`" +
        getInfo.platform +
        ` ${getInfo.arch}` +
        "`\n" +
        "CPU:\n`" +
        `${cpuModel} (${coreCount} Cores)` +
        "`\n" +
        "RAM Total: \n`" +
        (getInfo.total_mem_bytes / 1048576).toFixed(2) +
        " MB`\n" +
        "RAM Free: \n`" +
        (getInfo.free_mem_bytes / 1048576).toFixed(2) +
        " MB`\n" +
        "Host Machine Uptime: \n`" +
        machineUptimeFormat(getInfo.uptime_seconds) +
        "`" +
        "\nBot Uptime:\n`" +
        botUptimeFormat(process.uptime()) +
        "`";

      function machineUptimeFormat(seconds) {
        const sec = Math.floor(seconds % 60);
        const min = Math.floor((seconds / 60) % 60);
        const hrs = Math.floor(seconds / 3600);
        return `${hrs}h ${min}m ${sec}s`;
      }

      let currentBotUptime = "0h 0m 0s";
      function botUptimeFormat(seconds) {
        const sec = Math.floor(seconds % 60);
        const min = Math.floor((seconds / 60) % 60);
        const hrs = Math.floor(seconds / 3600);
        return `${hrs}h ${min}m ${sec}s`;
      }
      setInterval(() => {
        currentBotUptime = botUptimeFormat(process.uptime());
      }, 1000);

      const botUptime = "sekitar `" + botUptimeFormat(process.uptime()) + "`";

      if (isiPesan === ".info -v") {
        await soket.sendMessage(kontak, { text: version });
      }
      if (isiPesan === ".info") {
        await soket.sendMessage(kontak, {
          text: info,
        });
      }

      if (isiPesan.includes("info") && isiPesan.includes("rin")) {
        await soket.sendMessage(kontak, {
          text: info,
        });
      }
      if (isiPesan.includes("uptime") && isiPesan.includes("rin")) {
        await soket.sendMessage(kontak, {
          text: botUptime,
        });
      }
    });
  }
  info();
};
