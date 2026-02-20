import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { FaBookOpen, FaPray, FaCompass, FaMosque } from "react-icons/fa";
import { Link, useHistory, useLocation } from "react-router-dom";

import { WiMoonWaningCrescent3 } from "react-icons/wi";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

import { auth, provider } from "../firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

function Home() {

  const history = useHistory();
  const location = useLocation();

  /* ================= STATE ================= */

  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("city") || "Jakarta"
  );

  const [selectedTimezone, setSelectedTimezone] = useState(
    localStorage.getItem("timezone") || "Asia/Jakarta"
  );
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [times, setTimes] = useState(null);
  const [hijriDate, setHijriDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activePrayer, setActivePrayer] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [nextPrayerTime, setNextPrayerTime] = useState(null);
  const [countdownNext, setCountdownNext] = useState("");
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [lastPlayed, setLastPlayed] = useState(null);
  const audioRef = useRef(null);
  


   /* ================= FIREBASE LOGIN ================= */
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });

      return () => unsubscribe();
    }, []);



  /* ================= DAILY TRACKER ================= */

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
              city: selectedCity,
              country: selectedCountry,
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
  }, [selectedCity]);

  /* ================= REAL TIME CLOCK ================= */

  useEffect(() => {
    const timer = setInterval(() => {
      const nowRegional = new Date(
        new Date().toLocaleString("en-US", { timeZone: selectedTimezone })
      );
      setCurrentTime(nowRegional);
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTimezone]);

  /* ================= ACTIVE PRAYER ================= */

  useEffect(() => {

    if (!times) return;

    const now = currentTime;
    const prayerList = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

    const prayerTimes = prayerList.map(prayerName => {
      const [hour, minute] = times[prayerName].split(":");
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return { prayerName, time: date };
    });

    for (let i = 0; i < prayerTimes.length; i++) {

      const current = prayerTimes[i];
      const next = prayerTimes[i + 1];

      if (next) {
        if (now >= current.time && now < next.time) {
          setActivePrayer(current.prayerName);
          return;
        }
      } else {
        if (now >= current.time) {
          setActivePrayer(current.prayerName);
          return;
        }
      }
    }

  }, [currentTime, times]);

  /* ================= NEXT PRAYER FINDER ================= */
  useEffect(() => {
    if (!times) return;

    const prayerList = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
    const now = currentTime;

    for (let i = 0; i < prayerList.length; i++) {
      const prayerName = prayerList[i];
      const [hour, minute] = times[prayerName].split(":");

      const prayerDate = new Date();
      prayerDate.setHours(hour, minute, 0, 0);

      if (prayerDate > now) {
        setNextPrayer(prayerName);
        setNextPrayerTime(prayerDate);
        return;
      }
    }

  // Jika semua sudah lewat → Fajr besok
  const [hour, minute] = times["Fajr"].split(":");
  const fajrTomorrow = new Date();
  fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
  fajrTomorrow.setHours(hour, minute, 0, 0);

  setNextPrayer("Fajr");
  setNextPrayerTime(fajrTomorrow);

}, [currentTime, times]);

/* ================= COUNTDOWN NEXT PRAYER ================= */

useEffect(() => {
  if (!nextPrayerTime) return;

  const diff = nextPrayerTime - currentTime;
  if (diff <= 0) return;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  setCountdownNext(`${hours}h ${minutes}m`);

}, [currentTime, nextPrayerTime]);



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

  /* ================= RESET LASTPLAYED SETIAP HARI ================= */

  useEffect(() => {
    if (
      currentTime.getHours() === 0 &&
      currentTime.getMinutes() === 0 &&
      currentTime.getSeconds() === 5
    ) {
      setLastPlayed(null);
    }
  }, [currentTime]);


  /* ================= QOUTES  ================= */
  const [dailyQuote, setDailyQuote] = useState(null);
  
  useEffect(() => {
  const quotes = [
  {
    text: "Jangan pernah menunda taubat, karena kita tidak pernah tahu kapan Allah memanggil kita.",
    author: "Ustadz Hadi Hidayat"
  },
  {
    text: "Ilmu itu bukan untuk dibanggakan, tapi untuk diamalkan.",
    author: "Ustadz Hadi Hidayat"
  },
  {
    text: "Dunia itu sementara, jangan sampai hati kita lebih terikat padanya daripada akhirat.",
    author: "Ustadz Khalid Basalamah"
  },
  {
    text: "Ibadah kecil tapi istiqamah lebih dicintai Allah daripada besar tapi jarang.",
    author: "Ustadz Khalid Basalamah"
  },
  {
  text: "Kalau dia memang untukmu, Allah akan dekatkan. Kalau tidak, Allah akan gantikan dengan yang lebih baik.",
  author: "Ustadz Hadi Hidayat"
  },
  {
    text: "Cinta yang tidak membawa kita kepada Allah, biasanya hanya membawa luka.",
    author: "Ustadz Khalid Basalamah"
  },
  {
    text: "Tidak semua yang kita inginkan itu baik. Kadang Allah menjauhkan karena Dia lebih tahu.",
    author: "Ustadz Hadi Hidayat"
  },
  {
    text: "Hati yang patah karena manusia akan sembuh ketika kembali kepada Allah.",
    author: "Ustadz Khalid Basalamah"
  },
  {
    text: "Kalau kamu kehilangan dia, tapi kamu mendekat kepada Allah, maka sebenarnya kamu tidak kehilangan apa-apa.",
    author: "Ustadz Hadi Hidayat"
  },
  {
    text: "Jangan kejar yang menjauh. Kejar ridha Allah, nanti yang baik akan datang sendiri.",
    author: "Ustadz Khalid Basalamah"
  },
  {
    text: "Allah kadang mematahkan hatimu untuk menyelamatkan masa depanmu.",
    author: "Ustadz Hadi Hidayat"
  },
  {
    text: "Bersabarlah dalam luka, karena Allah sedang menyiapkan cerita yang lebih indah.",
    author: "Ustadz Khalid Basalamah"
  }
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
    setDailyQuote(quotes[randomIndex]);
  }, []);


  // Location
  const locations = [
    { label: "Jakarta & Sekitarnya (WIB)", city: "Jakarta", timezone: "Asia/Jakarta" },
    { label: "Bandung & Jawa Barat (WIB)", city: "Bandung", timezone: "Asia/Jakarta" },
    { label: "Yogyakarta & Jateng (WIB)", city: "Yogyakarta", timezone: "Asia/Jakarta" },
    { label: "Surabaya & Jawa Timur (WIB)", city: "Surabaya", timezone: "Asia/Jakarta" },
    { label: "Banda Aceh (WIB)", city: "Banda Aceh", timezone: "Asia/Jakarta" },
    { label: "Balikpapan & Kaltim (WITA)", city: "Balikpapan", timezone: "Asia/Makassar" },
    { label: "Makassar & Sulsel (WITA)", city: "Makassar", timezone: "Asia/Makassar" },
    { label: "Jayapura & Papua (WIT)", city: "Jayapura", timezone: "Asia/Jayapura" }
  ];

  const selectLocation = (loc) => {

    setIsChangingLocation(true);

    setTimeout(() => {
      setSelectedCity(loc.city);
      setSelectedTimezone(loc.timezone);

      localStorage.setItem("city", loc.city);
      localStorage.setItem("timezone", loc.timezone);

      setShowLocationModal(false);
      setIsChangingLocation(false);

    }, 300);
  };


  return (
    <div>

      <audio ref={audioRef} src="/audio/adzan.mp3" preload="auto" />

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-br from-[#5b21b6] 
                      via-[#7c3aed] 
                      to-[#1e1b4b] 
                      text-white rounded-b-3xl p-6 pb-10">

        <p className="text-sm opacity-80">
          {hijriDate?.day} {hijriDate?.month?.en} {hijriDate?.year} H
        </p>

        <div 
          onClick={() => setShowLocationModal(true)}
          className="flex items-center gap-2 text-sm mt-2 cursor-pointer opacity-80 duration-300 ease-in-out hover:font-bold"
        >
          <div className="flex justify-center items-center gap-2 duration-300 ease-in-out hover:font-bold">
            <FaLocationDot className="text-orange-500" /> 
            {selectedCity}
            <IoIosArrowDown />
          </div>
        </div>

        {/* ================= WAKTU SHOLAT ================= */}
        <div className="mt-10 text-center">
          <div className="bg-white/20 inline-block px-4 py-1 rounded-full text-xs tracking-wide">
            🟡 MENUJU {nextPrayer}
          </div>
          <h1 className={`text-6xl font-bold mt-4 transition-all duration-500
            ${isChangingLocation ? "opacity-0 scale-90" : "opacity-100 scale-100"}
          `}>
            {countdownNext}
          </h1>
          <p className="opacity-70 mt-2 text-lg">
            {nextPrayerTime?.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta"
            })}
          </p>
        </div>

        {/* ================= TOMBOL ================= */}
        {/* <div className="mt-4 space-x-2">
          <button
            onClick={() => setSoundEnabled(true)}
            className="text-xs bg-white/20 px-3 py-1 rounded-full"
          >
            Enable Adzan Sound
          </button>

          <button
            onClick={requestNotificationPermission}
            className="text-xs bg-white/20 px-3 py-1 rounded-full"
          >
            Enable Notifikasi
          </button>

          <button
            onClick={() => audioRef.current?.pause()}
            className="text-xs bg-red-500/20 px-3 py-1 rounded-full"
          >
            Stop
          </button>
        </div> */}
            
        <WiMoonWaningCrescent3 
          className="absolute top-10 right-8
             text-6xl text-yellow-300 
             drop-shadow-[0_0_20px_rgba(255,223,100,0.8)]
             animate-float z-10"
        />

        {/* ================= LOGIN ================= */}
        {/* <div className="absolute top-6 right-6">
        {user ? (
          <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-full">
            <img
              src={user.photoURL}
              alt="profile"
              className="w-6 h-6 rounded-full"
            />
            <button onClick={handleLogout} className="text-xs">
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-white/20 px-4 py-2 rounded-full text-sm"
          >
            Login
          </button>
        )}
      </div> */}


        {/* ================= PRAYER ROW ================= */}
        <div className="mt-6 backdrop-blur-lg bg-white/10 
                border border-white/20 
                rounded-2xl p-4 shadow-lg">
          <div className="flex justify-between text-xs">
            {["Imsak","Fajr","Dhuhr","Asr","Maghrib","Isha"].map(prayer => (
              <PrayerItem
                key={prayer}
                name={prayer}
                time={times?.[prayer]}
                active={activePrayer === prayer}
              />
            ))}
          </div>
        </div>

      </div>


      {/* ================= MENU GRID ================= */}
      <div className="px-5 -mt-8">
        <div className="bg-white rounded-3xl shadow-lg p-5 grid grid-cols-5 gap-4 text-center">

          <Link to="/quran"><Menu icon={<FaBookOpen />} label="Qur'an" /></Link>
          <Link to="/dua"><Menu icon={<FaPray />} label="Doa" /></Link>
          <Link to="/tasbih"><Menu icon={<FaMosque />} label="Tasbih" /></Link>
          <Link to="/qibla"><Menu icon={<FaCompass />} label="Qiblat" /></Link>
          <Link to="/hadith"><Menu icon={<FaBookOpen />} label="Hadis" /></Link>

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
            <p className="text-purple-600 text-sm">{progress}%</p>
          </div>

          <div className="h-2 bg-gray-200 rounded-full mt-3">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= DAILY QUOTE ================= */}
      <div className="px-5 mt-4">
        <div
          className="relative overflow-hidden rounded-2xl p-6 shadow-xl
                    bg-gradient-to-br 
                    from-[#5b21b6] 
                    via-[#7c3aed] 
                    to-[#1e1b4b] 
                    text-white transition-all duration-500"
        >

          {/* Soft Glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 
                          bg-pink-400/30 rounded-full blur-3xl z-0">
          </div>

          <div className="relative z-10">

            <p className="text-xs uppercase opacity-70 mb-2 tracking-wide">
              Daily Inspiration
            </p>

            <p className="text-sm leading-relaxed italic">
              “{dailyQuote?.text}”
            </p>

            <p className="text-xs mt-3 opacity-80 text-right">
              — {dailyQuote?.author}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-gray-400 mt-10 pb-28">
        © {new Date().getFullYear()} Miftahurrahman. All rights reserved.
      </div>

      {/* Location */}
      {showLocationModal && (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end">

        <div className="bg-white w-full rounded-t-3xl
                        max-h-[75vh] overflow-hidden
                        animate-slideUp relative">

          {/* HEADER MODAL */}
          <div className="p-6 border-b relative">
            <h2 className="text-lg font-semibold">
              Select Location
            </h2>

            <button
              onClick={() => setShowLocationModal(false)}
              className="absolute top-6 right-6 text-gray-500 text-xl"
            >
              ✕
            </button>
          </div>

          {/* SCROLL AREA */}
          <div className="overflow-y-auto px-6 py-4
                          max-h-[55vh]
                          pb-32"> {/* 👈 INI KUNCINYA */}

            {locations.map((loc, index) => (
              <div
                key={index}
                onClick={() => selectLocation(loc)}
                className="py-4 border-b cursor-pointer
                          transition hover:text-purple-600"
              >
                {loc.label}
              </div>
            ))}

          </div>

        </div>

      </div>
    )}

    </div>
  );
}

/* ================= COMPONENT ================= */

function PrayerItem({ name, time, active }) {
  return (
    <div
      className={`text-center transition-all duration-300
        ${active ? "text-yellow-300 scale-110 font-bold" : ""}`}
    >
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
