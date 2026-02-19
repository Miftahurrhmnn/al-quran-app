import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBookOpen, FaPray, FaCompass, FaMosque } from "react-icons/fa";
import { Link, useHistory, useLocation } from "react-router-dom";

function Home() {

  const history = useHistory();
  const location = useLocation();

  /* ================= STATE ================= */

  const [progress, setProgress] = useState(0);
  const [times, setTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ================= DAILY TRACKER PROGRESS ================= */

  useEffect(() => {

    const data = JSON.parse(localStorage.getItem("ramadanTracker")) || {};
    const completed = Object.values(data).filter(v => v > 0).length;
    const percentage = Math.round((completed / 30) * 100);

    setProgress(percentage);

  }, [location]);

  /* ================= FETCH PRAYER TIME ================= */

  useEffect(() => {

    const fetchData = async () => {

      try {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();

        const dateString = `${day}-${month}-${year}`;

        const res = await axios.get(
          `https://api.aladhan.com/v1/timingsByCity/${dateString}`,
          {
            params: {
              city: "Jakarta",
              country: "Indonesia",
              method: 11
            }
          }
        );

        setTimes(res.data.data.timings);
        setHijriDate(res.data.data.date.hijri);

      } catch (err) {
        console.log(err);
      }

    };

    fetchData();

  }, []);

  /* ================= REAL TIME CLOCK ================= */

  useEffect(() => {

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  /* ================= COUNTDOWN IMSAK ================= */

  useEffect(() => {

    if (!times) return;

    const now = currentTime;

    const [hour, minute] = times.Imsak.split(":");

    const imsakTime = new Date();
    imsakTime.setHours(hour, minute, 0, 0);

    const diff = imsakTime - now;

    if (diff > 0) {

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);

    } else {
      setCountdown("Imsak sudah lewat");
    }

  }, [currentTime, times]);

  return (
    <div>

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600
                      text-white rounded-b-3xl p-6 pb-10">

        <p className="text-sm opacity-80">
          {currentTime.toLocaleDateString()}
        </p>

        <h2 className="text-xl font-semibold mt-1">
          {hijriDate?.month?.en === "Ramadan"
            ? `Ramadan ${hijriDate?.day}`
            : `${hijriDate?.month?.en} ${hijriDate?.day}`}
        </h2>

        <div className="mt-6">
          <p className="text-sm opacity-70">Sehri Ends</p>
          <h1 className="text-4xl font-bold mt-1">
            Imsak {times?.Imsak}
          </h1>
          <p className="text-xs opacity-70 mt-1">
            {countdown}
          </p>
        </div>

        {/* ================= PRAYER ROW ================= */}
        <div className="flex justify-between text-xs mt-6 opacity-80">
          <PrayerItem name="Imsak" time={times?.Imsak} />
          <PrayerItem name="Fajr" time={times?.Fajr} />
          <PrayerItem name="Dhuhr" time={times?.Dhuhr} />
          <PrayerItem name="Asr" time={times?.Asr} />
          <PrayerItem name="Maghrib" time={times?.Maghrib} />
          <PrayerItem name="Isha" time={times?.Isha} />
        </div>

      </div>

      {/* ================= MENU GRID ================= */}
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

          <Link to="/qibla">
            <Menu icon={<FaCompass />} label="Qiblat" />
          </Link>

          <Link to="/hadith">
            <Menu icon={<FaBookOpen />} label="Hadis" />
          </Link>

        </div>
      </div>

      {/* ================= DAILY TRACKER ================= */}
      <div className="px-5 mt-6">
        <div
          onClick={() => history.push("/daily-tracker")}
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

      {/* ================= START READING ================= */}
      <div className="px-5 mt-4">
        <div
          onClick={() => history.push("/quran")}
          className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer"
        >
          <p className="text-sm font-medium">Start Reading</p>
          <p className="text-xs text-gray-500 mt-1">
            Continue your Quran journey
          </p>
        </div>
      </div>

    </div>
  );
}

/* ================= COMPONENT ================= */

function PrayerItem({ name, time }) {
  return (
    <div className="text-center">
      <p>{name}</p>
      <p className="font-semibold">{time || "--:--"}</p>
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
