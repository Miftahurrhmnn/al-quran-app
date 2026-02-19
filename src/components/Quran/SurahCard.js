import React from "react";

function SurahCard({ surah, onClick }) {

  return (
    <div
      onClick={() => onClick(surah.number)}
      className="bg-white/5 backdrop-blur-lg border border-white/10 
                 rounded-3xl p-6 cursor-pointer
                 hover:scale-105 hover:border-gold
                 transition duration-500"
    >
      <div className="text-gold text-sm mb-2">
        {surah.number}
      </div>

      <h3 className="text-lg font-semibold">
        {surah.englishName}
      </h3>

      <p className="text-2xl text-right mt-4 font-arabic text-cream">
        {surah.name}
      </p>

      <p className="text-xs mt-2 opacity-60">
        {surah.numberOfAyahs} Ayat
      </p>
    </div>
  );
}

export default React.memo(SurahCard);