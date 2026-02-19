import React, { useEffect, useRef, useState } from "react";

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function QiblaCompass() {

  const needleRef = useRef(null);
  const [qibla, setQibla] = useState(0);
  const headingRef = useRef(0);

  /* ================= HITUNG BEARING ================= */

  const calculateQibla = (lat, lng) => {

    const toRad = deg => deg * (Math.PI / 180);
    const toDeg = rad => rad * (180 / Math.PI);

    const φ1 = toRad(lat);
    const φ2 = toRad(KAABA_LAT);
    const Δλ = toRad(KAABA_LNG - lng);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  };

  /* ================= GET USER LOCATION ================= */

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(
      pos => {
        const direction = calculateQibla(
          pos.coords.latitude,
          pos.coords.longitude
        );
        setQibla(direction);
      },
      err => console.log(err),
      { enableHighAccuracy: true }
    );

  }, []);

  /* ================= DEVICE ORIENTATION ================= */

  useEffect(() => {

    const enableCompass = async () => {

      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") return;
      }

      window.addEventListener("deviceorientation", handleOrientation, true);

    };

    enableCompass();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };

  }, []);

  const handleOrientation = (event) => {

    let heading;

    // iPhone
    if (event.webkitCompassHeading) {
      heading = event.webkitCompassHeading;
    } 
    // Android
    else if (event.alpha !== null) {
      heading = 360 - event.alpha;
    }

    if (heading !== undefined) {
      headingRef.current = heading;
    }

  };

  /* ================= SMOOTH ANIMATION LOOP ================= */

  useEffect(() => {

    let animationFrame;

    const animate = () => {

      const currentHeading = headingRef.current;
      const rotation = qibla - currentHeading;

      if (needleRef.current) {

        needleRef.current.style.transform =
          `rotate(${rotation}deg)`;

      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);

  }, [qibla]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F1E8]">

      <h1 className="text-xl font-semibold mb-8">
        Arah Kiblat
      </h1>

      <div className="relative w-72 h-72 rounded-full
                      bg-gradient-to-br from-white to-gray-100
                      shadow-2xl flex items-center justify-center">

        <div
          ref={needleRef}
          className="absolute transition-transform"
        >
          <div className="w-2 h-32 bg-gradient-to-t from-purple-600 to-pink-500 rounded-full shadow-lg" />
        </div>

        <div className="w-6 h-6 bg-purple-600 rounded-full z-10 rounded-full" />

      </div>

      <p className="mt-6 text-sm text-gray-500">
        Putar perangkat Anda secara perlahan
      </p>

    </div>
  );
}

export default QiblaCompass;
