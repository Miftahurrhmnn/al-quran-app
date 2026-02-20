import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

function Hadith() {

  const [kitab, setKitab] = useState("bukhari");
  const [hadiths, setHadiths] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */

  const fetchHadith = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://api.hadith.gading.dev/books/${kitab}?range=${page}-${page+9}`
      );

      setHadiths(res.data.data.hadiths);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [kitab, page]);

  useEffect(() => {
    fetchHadith();
  }, [fetchHadith]);

  /* ================= SEARCH FILTER ================= */

  const filteredHadiths = useMemo(() => {
    if (!search) return hadiths;

    return hadiths.filter(h =>
      h.id.toLowerCase().includes(search.toLowerCase()) ||
      h.arab.includes(search)
    );
  }, [search, hadiths]);

  /* ================= HIGHLIGHT SEARCH ================= */

  const highlight = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark class='bg-yellow-200 px-1 rounded'>$1</mark>");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl p-6 shadow-lg mb-6">
          <h1 className="text-2xl font-semibold">Hadis</h1>
          <p className="text-sm opacity-80 mt-1">
            Jelajahi hadis dari berbagai kitab
          </p>
        </div>

        {/* CONTROLS */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 space-y-4">

          <select
            value={kitab}
            onChange={(e) => {
              setKitab(e.target.value);
              setPage(1);
            }}
            className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="bukhari">Sahih Bukhari</option>
            <option value="muslim">Sahih Muslim</option>
            <option value="tirmidzi">Tirmidzi</option>
            <option value="abu-daud">Abu Daud</option>
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari hadis..."
            className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Loading hadis...
          </div>
        )}

        {/* EMPTY SEARCH */}
        {!loading && filteredHadiths.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-10">
            Hadis tidak ditemukan.
          </div>
        )}

        {/* LIST HADIS */}
        <div className="space-y-6">

          {filteredHadiths.map((item) => (
            <div
              key={item.number}
              className="bg-white rounded-2xl p-6 shadow-sm transition hover:shadow-md"
            >

              {/* Badge */}
              <div className="mb-4">
                <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                  Hadis No. {item.number}
                </span>
              </div>

              {/* Arabic */}
              <p className="
                text-right 
                text-[22px] 
                sm:text-2xl 
                leading-loose 
                text-gray-800 
                font-medium 
                mb-6
              ">
                {item.arab}
              </p>

              {/* Translation */}
              <p
                className="text-sm sm:text-base text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlight(item.id)
                }}
              />

            </div>
          ))}

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-8">

          <button
            disabled={page <= 1}
            onClick={() => page > 1 && setPage(page - 10)}
            className={`px-5 py-2 rounded-xl text-sm transition 
              ${page <= 1 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            Prev
          </button>

          <button
            onClick={() => setPage(page + 10)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}

export default Hadith;