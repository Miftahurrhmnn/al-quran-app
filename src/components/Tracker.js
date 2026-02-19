import React, { useState, useEffect } from "react";

function Tracker() {

  const [days, setDays] = useState({});

  const totalDays = 30;

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ramadanTracker")) || {};
    setDays(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("ramadanTracker", JSON.stringify(days));
  }, [days]);

  /* ================= TOGGLE DAY ================= */

  const toggleDay = (day) => {

    const current = days[day] || 0;

    const next = current === 2 ? 0 : current + 1;

    setDays({
      ...days,
      [day]: next
    });

  };

  /* ================= CALCULATE PROGRESS ================= */

  const completed = Object.values(days).filter(v => v > 0).length;
  const percentage = Math.round((completed / totalDays) * 100);

  /* ================= COLOR LEVEL ================= */

  const getColor = (level) => {
    switch (level) {
      case 1:
        return "bg-green-400";
      case 2:
        return "bg-green-600";
      default:
        return "bg-gray-300";
    }
  };

  const today = new Date().getDate();

  return (
    <div className="p-6 bg-[#F5F1E8] min-h-screen">

      <h1 className="text-xl font-semibold mb-2">
        Ramadan Tracker
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Klik untuk tandai puasamu
      </p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm mt-2 text-gray-600">
          {completed} / {totalDays} Hari ({percentage}%)
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-7 gap-3">

        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const level = days[day] || 0;

          return (
            <div
              key={day}
              onClick={() => toggleDay(day)}
              className={`aspect-square rounded-md cursor-pointer transition 
                ${getColor(level)}
                ${day === today ? "ring-2 ring-purple-500" : ""}
                hover:scale-105`}
            />
          );
        })}

      </div>

      <p className="text-xs text-gray-500 mt-6">
        Abu muda = puasa ✓ | Hijau tua = target ibadah tercapai
      </p>

    </div>
  );
}

export default Tracker;
