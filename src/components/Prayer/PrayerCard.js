import React, { useEffect, useState } from "react";
import axios from "axios";

function PrayerCard() {

  const [times, setTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [countdown, setCountdown] = useState("");

  /* ================= FETCH DATA (TAHUN 2026) ================= */

  useEffect(() => {

    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = "2026"; // FIX TAHUN 2026

    const dateString = `${day}-${month}-${year}`;

    axios.get(
      `https://api.aladhan.com/v1/timingsByCity/${dateString}`,
      {
        params: {
          city: "Jakarta",
          country: "Indonesia",
          method: 11
        }
      }
    )
    .then(res => {
      setTimes(res.data.data.timings);
    })
    .catch(err => console.log(err));

  }, []);

  /* ================= COUNTDOWN REAL TIME ================= */

  useEffect(() => {

    if (!times) return;

    const interval = setInterval(() => {

      const now = new Date();

      const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

      let upcoming = null;

      for (let prayer of prayerOrder) {

        const [hour, minute] = times[prayer].split(":");

        const prayerTime = new Date();
        prayerTime.setHours(hour, minute, 0, 0);

        if (prayerTime > now) {
          upcoming = { name: prayer, time: prayerTime };
          break;
        }
      }

      if (!upcoming) {
        // kalau sudah lewat semua waktu → set ke Fajr besok
        const [hour, minute] = times["Fajr"].split(":");
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(hour, minute, 0, 0);
        upcoming = { name: "Fajr", time: tomorrow };
      }

      setNextPrayer(upcoming.name);

      const diff = upcoming.time - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${hours}h ${minutes}m ${seconds}s`);

    }, 1000);

    return () => clearInterval(interval);

  }, [times]);

  if (!times) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600
                      rounded-3xl p-6 text-white shadow-xl">
        Memuat waktu sholat...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600
                    rounded-3xl p-6 text-white shadow-xl">

      {/* IMSAK */}
      <p className="text-sm opacity-80">Imsak</p>
      <h1 className="text-3xl font-bold">
        {times.Imsak}
      </h1>

      {/* COUNTDOWN */}
      <p className="text-xs mt-2">
        Next: {nextPrayer} • {countdown}
      </p>

      {/* PRAYER ROW */}
      <div className="flex justify-between text-xs mt-6">

        {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(prayer => (
          <div
            key={prayer}
            className={`text-center ${
              nextPrayer === prayer ? "font-bold text-yellow-300" : ""
            }`}
          >
            <p>{prayer}</p>
            <p>{times[prayer]}</p>
          </div>
        ))}

      </div>

    </div>
  );
}

export default PrayerCard;
