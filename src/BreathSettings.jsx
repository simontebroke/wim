"use client";

import { useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

export default function BreathSettings({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  const increase = () => setValue((v) => Math.min(v + 10, 90));
  const decrease = () => setValue((v) => Math.max(v - 10, 10));

  return (
    <div className="flex flex-col mt-4 gap-1">
      <p className="text-gray-950 text-lg font-semibold">Number of Breaths</p>
      <div className="flex items-center text-xl">
        <button
          onClick={decrease}
          className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer
           text-lg"
        >
          -
        </button>

        <div className="text-2xl font-semibold min-w-[4ch] text-center select-none">
          <AnimatedNumber value={value} />
        </div>

        <button
          onClick={increase}
          className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer text-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}
