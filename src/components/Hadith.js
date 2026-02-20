import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

function Hadith() {

  const [kitab, setKitab] = useState("bukhari");
  const [hadiths, setHadiths] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const limit = 10;

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);

        const start = page;
        const end = page + limit - 1;

        const res = await axios.get(
          `https://api.hadith.gading.dev/books/${kitab}?range=${start}-${end}`
        );

        const data = res.data?.data?.hadiths || [];
        setHadiths(data);

      } catch (err) {
        console.log(err);
        setHadiths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [kitab, page]);

  /* ================= SEARCH ================= */

  const filteredHadiths = useMemo(() => {
    if (!search) return hadiths;

    return hadiths.filter(h =>
      h.id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, hadiths]);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-3xl p-6 shadow-lg mb-6">
          <h1 className="text-2xl font-semibold">Hadis</h1>
          <p className="text-sm opacity-80 mt-1">
            Terjemahan Indonesia
          </p>
        </div>

        {/* CONTROL */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-4">

          <select
            value={kitab}
            onChange={(e) => {
              setKitab(e.target.value);
              setPage(1);
              setExpanded(null);
            }}
            className="w-full p-3 rounded-xl border text-sm"
          >
            <option value="bukhari">Sahih Bukhari</option>
            <option value="muslim">Sahih Muslim</option>
            <option value="tirmidzi">Tirmidzi</option>
            <option value="abu-daud">Abu Daud</option>
          </select>

          <input
            type="text"
            placeholder="Cari kata..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border text-sm"
          />

        </div>

        {loading && (
          <div className="text-center py-6 text-gray-500 text-sm">
            Loading hadis...
          </div>
        )}

        {!loading && filteredHadiths.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-6">
            Tidak ada hadis ditemukan.
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">

          {filteredHadiths.map((item) => {

            const isExpanded = expanded === item.number;

            const shortText =
              item.id?.length > 300
                ? item.id.substring(0, 300) + "..."
                : item.id;

            const displayText = isExpanded ? item.id : shortText;

            return (
              <div
                key={item.number}
                className="bg-white rounded-xl p-5 shadow-sm"
              >

                <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                  Hadis No. {item.number}
                </span>

                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  {displayText}
                </p>

                {item.id?.length > 300 && (
                  <button
                    onClick={() =>
                      setExpanded(isExpanded ? null : item.number)
                    }
                    className="text-xs text-indigo-600 mt-2"
                  >
                    {isExpanded ? "Tutup" : "Baca Selengkapnya"}
                  </button>
                )}

              </div>
            );
          })}

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between mt-8">

          <button
            disabled={page <= 1}
            onClick={() => page > 1 && setPage(page - limit)}
            className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
          >
            Prev
          </button>

          <button
            onClick={() => setPage(page + limit)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}

export default Hadith;