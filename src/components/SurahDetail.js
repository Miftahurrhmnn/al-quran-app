import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function SurahDetail({ surahNumber, onBack }) {
  const [ayahs, setAyahs] = useState([]);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [search, setSearch] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    axios.get(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/ar.alafasy,id.indonesian`)
        .then(res => {

          const arabic = res.data.data[0].ayahs;
          const translation = res.data.data[1].ayahs;

          const merged = arabic.map((ayah, index) => ({
            number: ayah.numberInSurah,
            text: ayah.text,
            audio: ayah.audio,
            translation: translation[index].text
          }));

          setAyahs(merged);

        });
  }, [surahNumber]);

  const playAyah = (ayah) => {
    setCurrentAyah(ayah.number);
    if (audioRef.current) {
      audioRef.current.src = ayah.audio;
      audioRef.current.play();
    }
  };

  const progress = currentAyah && ayahs.length > 0 ? (currentAyah / ayahs.length) * 100 : 0;

  // FILTER AYAT
  const filteredAyahs = ayahs.filter(ayah => {
    if (!search) return true;

    // Search by nomor ayat
    if (ayah.number.toString() === search) return true;

    // Search by translation
    if (ayah.translation.toLowerCase().includes(search.toLowerCase()))
      return true;

    return false;
  });

  return (
    <div>
      <button 
        onClick={onBack} 
        className="mb-10 px-6 py-2 border border-gold text-gold rounded-full
                   hover:bg-gold hover:text-primary transition duration-300"
      >
        ← Kembali
      </button>

      {/* SEARCH AYAT */}
      <input
        type="text"
        placeholder="Cari nomor ayat atau kata terjemahan..."
        className="w-full mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-md 
                   border border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PROGRESS BAR */}
      <div className="w-full bg-white/10 h-3 rounded-full mb-10">
        <div
          className="h-3 bg-gold rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hidden Global Audio Player */}
      <audio ref={audioRef} />

      {filteredAyahs.length === 0 && (
        <p className="text-center opacity-70">Ayat tidak ditemukan</p>
      )}

      {filteredAyahs.map((ayah) => (
        <div
          key={ayah.number}
          className={`mb-8 p-8 rounded-3xl backdrop-blur-lg border transition duration-500
            ${currentAyah === ayah.number
              ? "border-gold bg-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              : "border-white/10 bg-white/5 hover:border-gold"}`}
        >

          {/* Arabic */}
          <p className="text-3xl md:text-4xl font-arabic text-right leading-loose mb-6">
            {ayah.text}
          </p>

          {/* Translation */}
          <p className="text-lg opacity-80 mb-6 italic">
            {ayah.translation}
          </p>

          {/* Play Button */}
          <button
            onClick={() => playAyah(ayah)}
            className="px-5 py-2 rounded-full border border-gold text-gold
                       hover:bg-gold hover:text-primary transition"
          >
            Play Ayat {ayah.number}
          </button>

        </div>
      ))}

    </div>
  )

}

export default SurahDetail;