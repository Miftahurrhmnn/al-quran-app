import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";

function Hadith() {

  const [kitab, setKitab] = useState("bukhari");
  const [hadiths, setHadiths] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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

return (
    <div className="p-5">

      <h1 className="text-xl font-bold mb-4">Hadis</h1>

      {/* ================= PILIH KITAB ================= */}
      <select
        value={kitab}
        onChange={(e) => {
          setKitab(e.target.value);
          setPage(1);
        }}
        className="mb-4 w-full p-2 rounded-lg border"
      >
        <option value="bukhari">Sahih Bukhari</option>
        <option value="muslim">Sahih Muslim</option>
        <option value="tirmidzi">Tirmidzi</option>
        <option value="abu-daud">Abu Daud</option>
      </select>

      {loading && <p>Loading hadis...</p>}

      
      <input  
        type="text"
        placeholder="Cari hadis..."
        className="mb-4 p-2 pl-5 w-full rounded"
      />

      {/* ================= LIST HADIS ================= */}
      {hadiths.map((item) => (
        <div
          key={item.number}
          className="bg-white rounded-2xl p-4 mb-4 shadow"
        >
          <p className="text-xs text-gray-500 mb-2">
            Hadis No. {item.number}
          </p>

          <p className="text-right text-lg leading-loose mb-3">
            {item.arab}
          </p>

          <p className="text-sm text-gray-700">
            {item.id}
          </p>
        </div>
      ))}

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => page > 1 && setPage(page - 10)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Prev
        </button>

        <button
          onClick={() => setPage(page + 10)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default Hadith;
