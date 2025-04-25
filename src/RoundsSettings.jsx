"use client";

import { useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

export default function RoundsSettings({ initialValue }) {
  const [value, setValue] = useState(initialValue);

  const increase = () => setValue((v) => Math.min(v + 1, 15));
  const decrease = () => setValue((v) => Math.max(v - 1, 1));

  return (
    <div className="flex flex-col mt-4 gap-1">
      <p className="text-gray-950 text-xl font-semibold">Number of Rounds</p>
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
