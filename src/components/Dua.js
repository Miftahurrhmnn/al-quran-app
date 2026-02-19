function Dua() {

  const duas = [

    // ================= DOA HARIAN =================
    {
      id: 1,
      category: "Harian",
      title: "Doa Sebelum Makan",
      arabic: "اللهم بارك لنا فيما رزقتنا وقنا عذاب النار",
      translation: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan lindungilah kami dari siksa neraka."
    },
    {
      id: 2,
      category: "Harian",
      title: "Doa Sesudah Makan",
      arabic: "الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين",
      translation: "Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami sebagai muslim."
    },
    {
      id: 3,
      category: "Harian",
      title: "Doa Sebelum Tidur",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      translation: "Dengan nama-Mu ya Allah aku mati dan aku hidup."
    },
    {
      id: 4,
      category: "Harian",
      title: "Doa Bangun Tidur",
      arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا",
      translation: "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami."
    },

    // ================= DOA SHOLAT =================
    {
      id: 5,
      category: "Sholat",
      title: "Doa Iftitah",
      arabic: "اللّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلّهِ كَثِيرًا...",
      translation: "Allah Maha Besar dengan sebesar-besarnya..."
    },
    {
      id: 6,
      category: "Sholat",
      title: "Doa Setelah Sholat",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      translation: "Aku memohon ampun kepada Allah."
    },

    // ================= DOA PAGI & PETANG =================
    {
      id: 7,
      category: "Pagi & Petang",
      title: "Dzikir Pagi",
      arabic: "اللّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ",
      translation: "Allah tidak ada ilah selain Dia Yang Maha Hidup lagi Maha Berdiri sendiri."
    },
    {
      id: 8,
      category: "Pagi & Petang",
      title: "Dzikir Petang",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلّهِ",
      translation: "Kami telah memasuki waktu sore dan kerajaan hanya milik Allah."
    },

    // ================= DOA RUMAH =================
    {
      id: 9,
      category: "Rumah",
      title: "Doa Masuk Rumah",
      arabic: "بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا",
      translation: "Dengan nama Allah kami masuk dan dengan nama Allah kami keluar."
    },
    {
      id: 10,
      category: "Rumah",
      title: "Doa Keluar Rumah",
      arabic: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ",
      translation: "Dengan nama Allah, aku bertawakal kepada Allah."
    },

    // ================= DOA SAFAR =================
    {
      id: 11,
      category: "Safar",
      title: "Doa Bepergian",
      arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
      translation: "Maha Suci Allah yang telah menundukkan semua ini bagi kami."
    },

    // ================= DOA PERLINDUNGAN =================
    {
      id: 12,
      category: "Perlindungan",
      title: "Doa Terhindar dari Musibah",
      arabic: "اللهم إني أعوذ بك من زوال نعمتك",
      translation: "Ya Allah aku berlindung kepada-Mu dari hilangnya nikmat-Mu."
    },
    {
      id: 13,
      category: "Perlindungan",
      title: "Doa Memohon Kesehatan",
      arabic: "اللهم إني أسألك العفو والعافية",
      translation: "Ya Allah aku memohon ampunan dan kesehatan."
    }
  ];


  return (
    <div className="p-5">

      <h1 className="text-xl font-semibold mb-6">
        Kumpulan Doa
      </h1>

      {duas.map((dua, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="text-sm font-medium">
            {dua.title}
          </h2>

          <p className="text-right text-2xl font-arabic mt-4">
            {dua.arabic}
          </p>

          <p className="text-sm text-gray-600 mt-4">
            {dua.translation}
          </p>
        </div>
      ))}

    </div>
  );
}

export default Dua;
