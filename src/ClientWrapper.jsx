"use client";

import { useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

export default function ClientWrapper({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  const increase = () => setValue((v) => Math.min(v + 10, 90));
  const decrease = () => setValue((v) => Math.max(v - 10, 10));

  return (
    <div className="flex flex-col mt-4 gap-2 text-xl">
      <p className="text-black font-semibold text-lg text-center">
        Number of Breaths
      </p>
      <div className="flex items-center justify-center gap-2 text-xl">
        <button
          onClick={decrease}
          className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer"
        >
          -10
        </button>

        <div className="text-4xl font-semibold min-w-[5ch] text-center select-none">
          <AnimatedNumber value={value} />
        </div>

        <button
          onClick={increase}
          className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer"
        >
          +10
        </button>
      </div>
    </div>
  );
}
