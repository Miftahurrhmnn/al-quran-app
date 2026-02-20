import React, { useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { FaPlay, FaPause, FaBookmark } from "react-icons/fa";

function SurahDetail() {

  const { id } = useParams();
  const history = useHistory();
  const surahNumber = id;

  const [ayahs, setAyahs] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [search, setSearch] = useState("");

  const audioRef = useRef(null);

  /* ================= FETCH ================= */

  useEffect(() => {

    const fetchData = async () => {

      const res = await axios.get(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/ar.alafasy,id.indonesian`
      );

      const arabic = res.data.data[0];
      const translation = res.data.data[1];

      setSurahInfo(arabic);

      const merged = arabic.ayahs.map((ayah, i) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        audio: ayah.audio,
        translation: translation.ayahs[i].text
      }));

      setAyahs(merged);
    };

    fetchData();

  }, [surahNumber]);

  /* ================= PLAY SINGLE ================= */

  const playAyah = (index) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    audioRef.current.src = ayahs[index].audio;
    audioRef.current.play();
  };

  /* ================= PLAY ALL ================= */

  useEffect(() => {

    if (!isPlaying || currentIndex === null) return;

    audioRef.current.onended = () => {

      if (currentIndex < ayahs.length - 1) {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        audioRef.current.src = ayahs[next].audio;
        audioRef.current.play();
      } else {
        setIsPlaying(false);
      }

    };

  }, [currentIndex, isPlaying, ayahs]);

  const togglePlayAll = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAyah(currentIndex ?? 0);
    }
  };

  /* ================= BOOKMARK ================= */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarks(saved);
  }, []);

  const toggleBookmark = (ayahNumber) => {
    let updated;
    if (bookmarks.includes(ayahNumber)) {
      updated = bookmarks.filter(b => b !== ayahNumber);
    } else {
      updated = [...bookmarks, ayahNumber];
    }
    setBookmarks(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  /* ================= LAST READ ================= */

  useEffect(() => {
    if (currentIndex !== null) {
      localStorage.setItem("lastRead", JSON.stringify({
        surah: surahNumber,
        ayah: ayahs[currentIndex]?.number
      }));
    }
  }, [currentIndex, surahNumber, ayahs]);

  /* ================= SEARCH ================= */

  const highlightText = (text) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const filteredAyahs = ayahs.filter(a =>
    a.translation.toLowerCase().includes(search.toLowerCase()) ||
    a.number.toString() === search
  );

return (
  <div className="min-h-screen bg-gray-50">

    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* Back */}
      <button 
        onClick={() => history.goBack()} 
        className="text-lg text-purple-600 mb-4 hover:underline"
      >
        ← Back
      </button>

      {/* Header */}
      {surahInfo && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl p-6 shadow-lg mb-6">
          <h1 className="text-2xl font-semibold">
            {surahInfo.englishName}
          </h1>
          <p className="text-sm opacity-80 mt-1">
            {surahInfo.numberOfAyahs} Ayat
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex items-center gap-3">

        <button
          onClick={togglePlayAll}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
        </button>

        <input
          type="text"
          placeholder="Cari arti ayat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <audio ref={audioRef} />

      {/* Ayah List */}
      <div className="space-y-5">

        {filteredAyahs.map((ayah, index) => {

          const isActive = currentIndex === index;
          const isBookmarked = bookmarks.includes(ayah.number);

          return (
            <div
              key={ayah.number}
              className={`bg-white rounded-2xl p-5 shadow-sm transition 
              ${isActive ? "ring-2 ring-purple-500 bg-purple-50" : ""}`}
            >

              {/* Top Row */}
              <div className="flex justify-between items-center mb-3">

                <span className="text-xs text-gray-400">
                  Ayat {ayah.number}
                </span>

                <FaBookmark
                  onClick={() => toggleBookmark(ayah.number)}
                  className={`cursor-pointer transition 
                    ${isBookmarked ? "text-purple-600" : "text-gray-300 hover:text-purple-400"}`}
                />
              </div>

              {/* Arabic */}
              <p className="text-right text-3xl leading-loose font-semibold text-gray-800">
                {ayah.text}
              </p>

              {/* Translation */}
              <p
                className="mt-4 text-sm text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: highlightText(ayah.translation)
                }}
              />

              {/* Play Button */}
              <button
                onClick={() => playAyah(index)}
                className="mt-4 text-xs text-purple-600 hover:underline"
              >
                Play Ayat
              </button>

            </div>
          );
        })}

      </div>

    </div>
  </div>
);
}

export default SurahDetail;
