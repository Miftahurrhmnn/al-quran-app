import React, { useState, useEffect } from "react";

function Tasbih() {

  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  /* ================= LOAD SAVE ================= */

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasbihData"));
    if (saved) {
      setCount(saved.count);
      setTarget(saved.target);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "tasbihData",
      JSON.stringify({ count, target })
    );
  }, [count, target]);

  /* ================= TAP ================= */

  const handleTap = () => {

    const newCount = count + 1;
    setCount(newCount);

    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    if (newCount === target) {
      alert("MasyaAllah, target tercapai!");
    }

  };

  /* ================= RESET ================= */

  const reset = () => {
    setCount(0);
  };

  /* ================= PROGRESS ================= */

  const percentage = Math.min((count / target) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F1E8] p-6">

      <h1 className="text-xl font-semibold mb-8">
        Digital Tasbih
      </h1>

      {/* Progress Circle */}
      <div className="relative w-56 h-56 mb-10">

        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="#E5E7EB"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="112"
            cy="112"
            r="100"
            stroke="#7C3AED"
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 100}
            strokeDashoffset={
              2 * Math.PI * 100 -
              (percentage / 100) * (2 * Math.PI * 100)
            }
            className="transition-all duration-300"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-purple-600">
          {count}
        </div>

      </div>

      {/* TAP BUTTON */}
      <button
        onClick={handleTap}
        className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600
                   text-white text-lg shadow-xl active:scale-95 transition"
      >
        TAP
      </button>

      {/* TARGET OPTIONS */}
      <div className="flex gap-4 mt-10">
        {[33, 99, 100].map(t => (
          <button
            key={t}
            onClick={() => {
              setTarget(t);
              setCount(0);
            }}
            className={`px-4 py-2 rounded-xl
              ${target === t
                ? "bg-purple-600 text-white"
                : "bg-white shadow"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* RESET */}
      <button
        onClick={reset}
        className="mt-6 text-sm text-gray-500"
      >
        Reset
      </button>

    </div>
  );
}

export default Tasbih;
