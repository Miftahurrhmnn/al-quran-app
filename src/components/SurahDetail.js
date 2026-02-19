import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import AyatCard from "./AyatCard";

function SurahDetail({ surahNumber, onBack }) {
  const [ayahs, setAyahs] = useState([]);
  const [currentAyah, setCurrentAyah] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

 useEffect(() => {
  let isMounted = true; // cegah memory leak

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/ar.alafasy,id.indonesian`
      );

      if (!isMounted) return;

      const arabic = res.data.data[0].ayahs;
      const translation = res.data.data[1].ayahs;

      const merged = arabic.map((ayah, index) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        audio: ayah.audio,
        translation: translation[index]?.text || ""
      }));

      setAyahs(merged);
    } catch (error) {
      console.error("Error fetching surah:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
  };

}, [surahNumber]);


  const playAyah = useCallback((ayah) => {
  setCurrentAyah(ayah.number);
  if (audioRef.current) {
    audioRef.current.src = ayah.audio;
    audioRef.current.play();
  }
}, []);

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
      <div className="relative mb-10">
        <FaSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 
                    text-gold opacity-70 
                    group-focus-within:opacity-100
                    transition duration-300
                    pointer-events-none z-10"
        />

        <input
          type="text"
          placeholder="Cari nomor ayat atau kata terjemahan..."
          className="w-full pl-12 pr-4 py-4 rounded-xl
               bg-white/10 backdrop-blur-md
               border border-gold/40
               text-cream placeholder-cream/60
               focus:outline-none focus:ring-2 focus:ring-gold
               transition duration-300"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
        <AyatCard 
          key={ayah.number}
          ayah={ayah}
          currentAyah={currentAyah}
          playAyah={playAyah}
        />
      ))}

    </div>
  )

}

export default SurahDetail;