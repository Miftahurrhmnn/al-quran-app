function Dua() {

  const duas = [
    {
      title: "Doa Sebelum Makan",
      arabic: "اللهم بارك لنا فيما رزقتنا...",
      translation: "Ya Allah berkahilah rezeki yang Engkau berikan..."
    },
    {
      title: "Doa Sesudah Makan",
      arabic: "الحمد لله الذي أطعمنا...",
      translation: "Segala puji bagi Allah yang telah memberi kami makan..."
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
