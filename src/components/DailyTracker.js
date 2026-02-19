import React, { useEffect, useState } from "react";

const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function DailyTracker() {

  const today = new Date().toISOString().split("T")[0];
  const [data, setData] = useState({});

  /* ================= LOAD ================= */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dailyPrayerTracker")) || {};
    setData(saved);
  }, []);

  /* ================= TOGGLE ================= */

  const togglePrayer = (prayer) => {

    const updated = { ...data };

    if (!updated[today]) {
      updated[today] = {};
    }

    updated[today][prayer] = !updated[today][prayer];

    setData(updated);
    localStorage.setItem("dailyPrayerTracker", JSON.stringify(updated));
  };

  /* ================= PROGRESS ================= */

  const todayData = data[today] || {};
  const completed = prayers.filter(p => todayData[p]).length;
  const percentage = Math.round((completed / prayers.length) * 100);

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">

      <h1 className="text-xl font-semibold mb-6">
        Daily Prayer Tracker
      </h1>

      {/* Progress */}
      <div className="mb-8">
        <div className="h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm mt-2 text-gray-600">
          {completed} / 5 Sholat ({percentage}%)
        </p>
      </div>

      {/* Prayer List */}
      <div className="space-y-4">

        {prayers.map((prayer) => {

          const done = todayData[prayer];

          return (
            <div
              key={prayer}
              onClick={() => togglePrayer(prayer)}
              className={`p-4 rounded-2xl shadow-sm cursor-pointer flex justify-between items-center
                ${done ? "bg-green-100" : "bg-white"}`}
            >
              <p className={`font-medium ${done ? "line-through text-green-700" : ""}`}>
                {prayer}
              </p>

              <div className={`w-6 h-6 rounded-full border-2
                ${done ? "bg-green-500 border-green-500" : "border-gray-300"}`}
              />
            </div>
          );

        })}

      </div>

    </div>
  );
}

export default DailyTracker;
