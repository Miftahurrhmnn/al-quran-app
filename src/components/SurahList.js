import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import SurahCard from "./SurahCard";

function SurahList({ onSelect }) {
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchSurah = async () => {
      try {
        const res = await axios.get("https://api.alquran.cloud/v1/surah");
        setSurahs(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, []);

  // Memoized filter
  const filteredSurahs = useMemo(() => {
    return surahs.filter((s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase())
    );
  }, [surahs, search]);

  // Stable function reference
  const handleSelect = useCallback((number) => {
    onSelect(number);
  }, [onSelect]);


  return (
    <div>
      <div className="relative mb-10">

        {/* Icon */}
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold opacity-70 pointer-events-none z-10" />

        {/* Input */}
        <input
          type="text"
          placeholder="Cari surat..."
          className="w-full pl-12 pr-4 py-4 rounded-xl 
                    bg-white/10 backdrop-blur-md 
                    border border-gold/40 
                    focus:outline-none focus:ring-2 focus:ring-gold
                    placeholder-cream/60 text-cream
                    transition duration-300"
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {loading && (
        <div className="text-center py-20 animate-pulse opacity-70">
          Memuat daftar surat...
        </div>
      )}

      {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSurahs.map(surah => (
              <SurahCard
                  key={surah.number}
                  surah={surah}
                  onClick={handleSelect}
              />
            ))}
            
          </div>
        )
      }

    </div>
  )

}

export default SurahList;