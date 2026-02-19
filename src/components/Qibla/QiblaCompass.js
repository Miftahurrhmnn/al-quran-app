import React, { useEffect, useState } from "react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function QiblaCompass() {

  const [heading, setHeading] = useState(0);
  const [smoothHeading, setSmoothHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(null);

  /* ================= HITUNG ARAH KIBLAT ================= */

  const calculateQibla = (lat, lng) => {

    const toRad = (deg) => deg * (Math.PI / 180);
    const toDeg = (rad) => rad * (180 / Math.PI);

    const φ1 = toRad(lat);
    const φ2 = toRad(KAABA_LAT);
    const Δλ = toRad(KAABA_LNG - lng);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);

    return (toDeg(θ) + 360) % 360;
  };

  /* ================= GET LOKASI ================= */

  useEffect(() => {

    navigator.geolocation.getCurrentPosition((pos) => {

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setQiblaDirection(calculateQibla(lat, lng));

    });

  }, []);

  /* ================= DEVICE ORIENTATION ================= */

  useEffect(() => {

    const handleOrientation = (event) => {

      if (event.alpha !== null) {
        setHeading(event.alpha);
      }

    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation);
      window.removeEventListener("deviceorientation", handleOrientation);
    };

  }, []);

  /* ================= SMOOTHING ================= */

  useEffect(() => {

    const smoothingFactor = 0.1;

    setSmoothHeading(prev =>
      prev + smoothingFactor * (heading - prev)
    );

  }, [heading]);

  const rotation =
    qiblaDirection !== null
      ? qiblaDirection - smoothHeading
      : 0;

  const isAligned = Math.abs(rotation) < 5;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F1E8]">

      <h1 className="text-xl font-semibold mb-8">
        Arah Kiblat
      </h1>

      {/* Compass Body */}
      <div className="relative w-72 h-72 rounded-full
                      bg-gradient-to-br from-white to-gray-100
                      shadow-2xl flex items-center justify-center">

        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full
                        border-4 border-purple-200" />

        {/* Needle */}
        <div
          className="absolute transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-2 h-28 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full shadow-lg" />
        </div>

        {/* Center Dot */}
        <div className="w-6 h-6 bg-purple-600 rounded-full shadow-lg z-10" />

      </div>

      <p className="mt-6 text-sm text-gray-500">
        Putar perangkat Anda perlahan
      </p>

      {isAligned && (
        <p className="mt-2 text-green-600 font-semibold">
          ✔ Arah Kiblat Tepat
        </p>
      )}

    </div>
  );
}

export default QiblaCompass;
