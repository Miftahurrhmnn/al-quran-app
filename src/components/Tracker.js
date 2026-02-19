import React, { useState, useEffect } from "react";

function Tracker() {
  const [fastingDays, setFastingDays] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("fastingTracker")) || [];
    setFastingDays(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "fastingTracker",
      JSON.stringify(fastingDays)
    );
  }, [fastingDays]);

  const toggleDay = (day) => {
    if (fastingDays.includes(day)) {
      setFastingDays(fastingDays.filter((d) => d !== day));
    } else {
      setFastingDays([...fastingDays, day]);
    }
  };

  const percentage = Math.round((fastingDays.length / 30) * 100);

  return (
    <div className="text-cream">

      <h1 className="text-2xl font-semibold text-gold mb-2">
        Tracker Puasa
      </h1>

      <p className="text-sm opacity-60 mb-6">
        Pantau ibadah puasamu selama 30 hari
      </p>

      {/* Progress */}
      <div className="mb-8">
        <div className="h-2 bg-white/10 rounded-full">
          <div
            className="h-2 bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-sm mt-2 opacity-70">
          {fastingDays.length}/30 Hari ({percentage}%)
        </p>
      </div>

      {/* Heatmap */}
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const active = fastingDays.includes(day);

          return (
            <div
              key={day}
              onClick={() => toggleDay(day)}
              className={`aspect-square rounded-md cursor-pointer transition
                ${active 
                  ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" 
                  : "bg-white/10 hover:bg-white/20"}`}
            />
          );
        })}
      </div>

    </div>
  );
}

export default Tracker;
