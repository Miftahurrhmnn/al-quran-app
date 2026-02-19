import React, { useState } from 'react';
import SurahList from "../src/components/SurahList"
import SurahDetail from "../src/components/SurahDetail"
import './index.css';

function App() {
  const [selectedSurah, setSelectedSurah] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-black text-cream">
      
      <div className='max-w-6xl mx-auto px-6 py-10'>
        
        <h1 className='text-5xl font-light text-center mb-12 tracking-wide'>Al-Qur'an Digital</h1>

        {!selectedSurah ? (
          <SurahList onSelect={setSelectedSurah} />
        ) : (
          <SurahDetail 
              surahNumber={selectedSurah}
              onBack={() => setSelectedSurah(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
