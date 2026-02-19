import React, { useEffect, useState } from "react";
import axios from "axios";

function PrayerCard() {

  const [times, setTimes] = useState(null);

  useEffect(() => {
    axios.get("https://api.aladhan.com/v1/timingsByCity", {
      params: {
        city: "Jakarta",
        country: "Indonesia",
        method: 11
      }
    }).then(res => {
      setTimes(res.data.data.timings);
    });
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600
                    rounded-3xl p-6 shadow-xl">

      <p className="text-sm opacity-80">Sehri Ends</p>

      <h1 className="text-4xl font-bold mt-2">
        Imsak {times?.Imsak}
      </h1>

      <div className="grid grid-cols-5 text-xs mt-6 gap-2">
        {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(p => (
          <div key={p} className="text-center">
            <p className="opacity-70">{p}</p>
            <p>{times?.[p]}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default PrayerCard;
