import React, { useEffect, useState } from "react";
import axios from "axios";

function SurahList({ onSelect }) {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("https://api.alquran.cloud/v1/surah")
        .then(res => setSurahs(res.data.data));
  }, []);

  const filtered = surahs.filter(s =>
    s.englishName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input 
        type="text"
        placeholder="Cari surat..."
        className="w-full mb-10 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-gold/40 focus:outline-none focus:ring-2 focus:ring-gold placeholder-cream/60"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {filtered.map(surah => (
          <div
            key={surah.number}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 cursor-pointer
                       hover:scale-105 hover:border-gold hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]
                       transition duration-500"
            onClick={() => onSelect(surah.number)}
          >
            <div className="text-gold text-sm mb-2">
              {surah.number}
            </div>

            <h3 className="text-lg font-semibold cursor-pointer">{surah.englishName}</h3>
            
            <p className="text-2xl text-right mt-4 font-arabic text-cream">{surah.name}</p>
            
            <p className="text-xs mt-2 opacity-60">
              {surah.numberOfAyahs} Ayat
            </p>
          </div>
        ))}
        
      </div>
    </div>
  )

}

export default SurahList;