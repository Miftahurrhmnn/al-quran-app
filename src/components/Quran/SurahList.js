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
    <div>

      <h1 className="text-2xl font-semibold mb-6">
        Al-Qur’an
      </h1>

      {/* SEARCH */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

        <input
          type="text"
          placeholder="Cari surat..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white
                     border border-gray-200 focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 text-sm">Memuat daftar surat...</p>
      )}

      {/* LIST */}
      <div className="space-y-3">

        {filtered.map((surah) => (
          <div
            key={surah.number}
            onClick={() => history.push(`/quran/${surah.number}`)}
            className="bg-white p-4 rounded-2xl shadow-sm 
                       hover:shadow-md transition cursor-pointer
                       flex justify-between items-center"
          >

            <div>
              <p className="text-sm text-gray-500">
                {surah.number}.
              </p>

              <h2 className="font-semibold">
                {surah.englishName}
              </h2>

              <p className="text-xs text-gray-400">
                {surah.revelationType} • {surah.numberOfAyahs} Ayat
              </p>
            </div>

            <p className="text-2xl font-arabic">
              {surah.name}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default SurahList;
