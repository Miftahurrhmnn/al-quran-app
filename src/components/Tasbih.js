import React, { useState } from "react";

function Tasbih() {

  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">

      <h1 className="text-xl mb-6">
        Digital Tasbih
      </h1>

      <div className="text-6xl font-bold text-purple-600 mb-10">
        {count}
      </div>

      <button
        onClick={() => setCount(count + 1)}
        className="w-40 h-40 rounded-full bg-purple-600 text-white text-xl shadow-xl"
      >
        Tap
      </button>

      <button
        onClick={() => setCount(0)}
        className="mt-6 text-sm text-gray-500"
      >
        Reset
      </button>

    </div>
  );
}

export default Tasbih;
