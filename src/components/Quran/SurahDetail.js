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
    <div>

      <button onClick={() => history.goBack()} className="mb-4 text-purple-500">
        ← Back
      </button>

      {surahInfo && (
        <>
          <h1 className="text-xl font-semibold">
            {surahInfo.englishName}
          </h1>
          <p className="text-sm opacity-60 mb-4">
            {surahInfo.numberOfAyahs} Ayat
          </p>
        </>
      )}

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <button onClick={togglePlayAll} className="px-4 py-2 bg-purple-600 text-white rounded-xl">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-2 rounded-lg text-black border"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <audio ref={audioRef} />

      <div className="space-y-6">

        {filteredAyahs.map((ayah, index) => (
          <div key={ayah.number}
               className={`p-4 rounded-2xl shadow-md 
               ${currentIndex === index ? "bg-purple-100" : ""}`}>

            <div className="flex justify-between items-center">

              <p className="text-sm opacity-60">
                Ayat {ayah.number}
              </p>

              <FaBookmark
                className={`${bookmarks.includes(ayah.number) ? "text-purple-600" : "text-gray-400"} cursor-pointer`}
                onClick={() => toggleBookmark(ayah.number)}
              />

            </div>

            <p className="text-right text-2xl font-arabic mt-3">
              {ayah.text}
            </p>

            <p
              className="mt-4 text-sm"
              dangerouslySetInnerHTML={{
                __html: highlightText(ayah.translation)
              }}
            />

            <button
              onClick={() => playAyah(index)}
              className="mt-3 text-purple-600 text-sm"
            >
              Play
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default SurahDetail;
