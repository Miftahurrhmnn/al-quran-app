import React from "react";

function AyatCard({ ayah, currentAyah, playAyah }) {

  return (
    <div
          key={ayah.number}
          className={`mb-8 p-8 rounded-3xl backdrop-blur-lg border transition duration-500
            ${currentAyah === ayah.number
              ? "border-gold bg-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.4)]"
              : "border-white/10 bg-white/5 hover:border-gold"}`}
        >

          {/* Arabic */}
          <p className="text-3xl md:text-4xl font-arabic text-right leading-loose mb-6">
            {ayah.text}
          </p>

          {/* Translation */}
          <p className="text-lg opacity-80 mb-6 italic">
            {ayah.translation}
          </p>

          {/* Play Button */}
          <button
            onClick={() => playAyah(ayah)}
            className="px-5 py-2 rounded-full border border-gold text-gold
                       hover:bg-gold hover:text-primary transition"
          >
            Play Ayat {ayah.number}
          </button>

        </div>
  )

}

export default React.memo(AyatCard);