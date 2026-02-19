import React, { useEffect, useState } from "react";

function QiblaCompass() {

  const [direction, setDirection] = useState(0);

  useEffect(() => {
    window.addEventListener("deviceorientation", (event) => {
      if (event.alpha !== null) {
        setDirection(event.alpha);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center text-cream">

      <h1 className="text-xl text-gold mb-6">
        Arah Kiblat
      </h1>

      <div className="relative w-60 h-60 border-4 border-gold rounded-full flex items-center justify-center">

        <div
          className="absolute w-1 h-24 bg-red-500 origin-bottom"
          style={{ transform: `rotate(${direction}deg)` }}
        />

      </div>

      <p className="mt-6 opacity-70 text-sm">
        Putar perangkat untuk mencari arah
      </p>

    </div>
  );
}

export default QiblaCompass;
