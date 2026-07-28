// elaina 0.1-beta
const version = "`elaina v0.1-beta`\nidk.";

export default async (soket) => {
  async function elaina() {
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

      if (isiPesan === ".elaina --version") {
        await soket.sendMessage(kontak, { text: version });
      }

      const elaina = `*100 alasan elaina adalah my mine gweh*\n\
1. Cerdas.\n\
2. Humoris.\n\
3. Berwawasan luas.\n\
4. Berani.\n\
5. Mandiri.\n\
6. Percaya diri.\n\
7. Peduli.\n\
8. Karismatik.\n\
9. Peka.\n\
10. Pemecah konflik yang baik.\n\
11. Penyihir berbakat.\n\
12. Menguasai sihir tingkat tinggi.\n\
13. Pelindung andal.\n\
14. Solutif.\n\
15. Adaptif.\n\
16. Ahli bertarung.\n\
17. Bisa terbang.\n\
18. Pandai membaca.\n\
19. Pintar strategi.\n\
20. Bertahan hidup.\n\
21. Rambut indah.\n\
22. Mata memesona.\n\
23. Gaya elegan.\n\
24. Selalu anggun.\n\
25. Senyumnya menawan.\n\
26. Postur sempurna.\n\
27. Aura misterius.\n\
28. Pesona luar biasa.\n\
29. Penampilan klasik.\n\
30. Gaya abadi.\n\
31. Pecinta buku.\n\
32. Suka menjelajah.\n\
33. Rasa ingin tahu besar.\n\
34. Terbuka pengalaman baru.\n\
35. Berbagi cerita menarik.\n\
36. Pecinta seni.\n\
37. Dokumentator ulung.\n\
38. Menghargai alam.\n\
39. Memahami budaya baru.\n\
40. Humor unik.\n\
41. Berani risiko.\n\
42. Tidak mudah menyerah.\n\
43. Menghargai kebebasan.\n\
44. Bijaksana.\n\
45. Penghibur ulung.\n\
46. Berhati besar.\n\
47. Rendah hati.\n\
48. Setia pada prinsip.\n\
49. Terbuka diskusi.\n\
50. Pandangan unik.\n\
51. Pendengar baik.\n\
52. Pendukung sejati.\n\
53. Hormat ruang pribadi.\n\
54. Percaya pada pasangan.\n\
55. Harmonisasi.\n\
56. Tidak mudah marah.\n\
57. Ada saat dibutuhkan.\n\
58. Motivator ulung.\n\
59. Menghargai usaha kecil.\n\
60. Tidak membosankan.\n\
61. Optimis.\n\
62. Belajar dari kegagalan.\n\
63. Selalu memperbaiki diri.\n\
64. Etos kerja kuat.\n\
65. Tak henti belajar.\n\
66. Pandangan luas.\n\
67. Menghargai kebebasan.\n\
68. Suara berani.\n\
69. Menerima kritik.\n\
70. Tak berhenti bermimpi.\n\
71. Romantis.\n\
72. Mengekspresikan cinta.\n\
73. Menciptakan momen spesial.\n\
74. Memberi kejutan manis.\n\
75. Ungkap perasaan.\n\
76. Cinta sepenuh hati.\n\
77. Memberi kehangatan.\n\
78. Perhatian pada detail.\n\
79. Membuat dihargai.\n\
80. Kenangan indah.\n\
81. Aura petualang.\n\
82. Penuh cerita menarik.\n\
83. Diskusi cerdas.\n\
84. Ide-ide segar.\n\
85. Memberi rasa aman.\n\
86. Berani menginspirasi.\n\
87. Menghadapi masa depan.\n\
88. Menjaga rahasia.\n\
89. Sahabat sejati.\n\
90. Bijaksana.\n\
91. Tidak terintimidasi.\n\
92. Tepati janji.\n\
93. Berprinsip.\n\
94. Hormati semua orang.\n\
95. Penuh kejutan.\n\
96. Sahabat sekaligus pasangan.\n\
97. Membuat hari indah.\n\
98. Seimbang hidup.\n\
99. Berwarna.\n\
100. Aku mencintainya.\n`;

      if (isiPesan === ".elaina") {
        await soket.sendMessage(kontak, { text: elaina });
      }
    });
  }

  elaina();
};
