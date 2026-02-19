import React from "react";
import { FaBookOpen, FaPray, FaCompass, FaMosque } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

function Home() {
  const [progress, setProgress] = useState(0);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {

  const data = JSON.parse(localStorage.getItem("ramadanTracker")) || {};
  const completed = Object.values(data).filter(v => v > 0).length;
  const percentage = Math.round((completed / 30) * 100);

  setProgress(percentage);

  }, [location]);


  return (
    <div>

      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600
                      text-white rounded-b-3xl p-6 pb-10">

        <p className="text-sm opacity-80">TODAY</p>

        <h2 className="text-xl font-semibold mt-1">
          Ramadan 1
        </h2>

        <div className="mt-6">
          <p className="text-sm opacity-70">Sehri Ends</p>
          <h1 className="text-4xl font-bold mt-1">
            Imsak 04:13
          </h1>
          <p className="text-xs opacity-70 mt-1">
            4h 8m remaining
          </p>
        </div>

        {/* Prayer Times Row */}
        <div className="flex justify-between text-xs mt-6 opacity-80">
          <PrayerItem name="Imsak" time="04:13" />
          <PrayerItem name="Fajr" time="04:23" />
          <PrayerItem name="Dhuhr" time="11:52" />
          <PrayerItem name="Asr" time="15:01" />
          <PrayerItem name="Maghrib" time="18:02" />
          <PrayerItem name="Isha" time="19:13" />
        </div>
      </div>

      {/* MENU GRID */}
      <div className="px-5 -mt-8">
        <div className="bg-white rounded-3xl shadow-lg p-5 grid grid-cols-5 gap-4 text-center">

          <Link to="/quran">
            <Menu icon={<FaBookOpen />} label="Qur'an" />
          </Link>

          <Link to="/dua">
            <Menu icon={<FaPray />} label="Doa" />
          </Link>

          <Link to="/tasbih">
            <Menu icon={<FaMosque />} label="Tasbih" />
          </Link>

          <Link to="qibla">
            <Menu icon={<FaCompass />} label="Qiblat" />
          </Link>

          <Link to="hadith">
            <Menu icon={<FaBookOpen />} label="Hadis" />
          </Link>

        </div>
      </div>

      {/* DAILY TRACKER CARD */}
      <div className="px-5 mt-6">
        <div
          onClick={() => history.push("/tracker")}
          className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Daily Tracker</p>
            <p className="text-purple-600 text-sm">
              {progress}%
            </p>
          </div>

          <div className="h-2 bg-gray-200 rounded-full mt-3">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>


      {/* START READING */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-medium">Start Reading</p>
          <p className="text-xs text-gray-500 mt-1">
            Al-Fatiha, The Opening
          </p>
        </div>
      </div>

    </div>
  );
}

function PrayerItem({ name, time }) {
  return (
    <div className="text-center">
      <p>{name}</p>
      <p className="font-semibold">{time}</p>
    </div>
  );
}

function Menu({ icon, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-purple-100 text-purple-600 p-3 rounded-xl text-lg">
        {icon}
      </div>
      <p className="text-xs mt-2">{label}</p>
    </div>
  );
}

export default Home;
