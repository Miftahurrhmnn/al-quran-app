import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function SurahList() {

  const history = useHistory();
  const [surahs, setSurahs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://api.alquran.cloud/v1/surah")
      .then(res => {
        setSurahs(res.data.data);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return surahs.filter(s =>
      s.englishName.toLowerCase().includes(search.toLowerCase())
      || s.name.includes(search)
      || s.number.toString().includes(search)
    );
  }, [surahs, search]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <h1 className="m-4 text-2xl font-semibold">
        Al-Qur’an
      </h1>

      {/* SEARCH */}
      <div className="relative mx-4 mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Cari surat..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white
                     border border-gray-200 focus:ring-2 focus:ring-purple-500
                     shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 text-sm mx-4">
          Memuat daftar surat...
        </p>
      )}

      {/* LIST */}
      <div className="px-4 space-y-4">

        {filtered.map((surah) => (
          <div
            key={surah.number}
            onClick={() => history.push(`/quran/${surah.number}`)}
            className="bg-white px-4 py-5 rounded-2xl shadow-sm
                       hover:shadow-md active:scale-[0.98]
                       transition-all duration-300 cursor-pointer"
          >

            <div className="flex justify-between items-start">

              {/* LEFT SIDE */}
              <div className="flex items-start gap-3">

                {/* NUMBER BADGE */}
                <div className="bg-purple-100 text-purple-600 
                                w-10 h-10 
                                flex items-center justify-center 
                                rounded-xl text-sm font-semibold">
                  {surah.number}
                </div>

                {/* NAME + INFO */}
                <div>
                  <h2 className="font-semibold text-base">
                    {surah.englishName}
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {surah.revelationType} • {surah.numberOfAyahs} Ayat
                  </p>
                </div>

              </div>

              {/* ARAB NAME */}
              <div className="text-right ml-4">
                <p className="text-2xl font-arabic leading-loose">
                  {surah.name}
                </p>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default SurahList;