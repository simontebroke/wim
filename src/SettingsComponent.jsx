"use client";

import { useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

export default function SettingsComponent({
  initialRounds = 3,
  initialBreaths = 30,
}) {
  const [roundsValue, setRoundsValue] = useState(initialRounds);
  const [breathsValue, setBreathsValue] = useState(initialBreaths);

  const increaseRounds = () => setRoundsValue((v) => Math.min(v + 1, 15));
  const decreaseRounds = () => setRoundsValue((v) => Math.max(v - 1, 1));

  const increaseBreaths = () => setBreathsValue((v) => Math.min(v + 10, 90));
  const decreaseBreaths = () => setBreathsValue((v) => Math.max(v - 10, 10));

  return (
    <div className="flex gap-2 flex-col">
      {/* Speed Settings */}
      <div>
        <p className="text-gray-950 text-xl font-semibold">Speed</p>

        <div className="grid grid-cols-3 gap-2">
          <button className="bg-transparent hover:bg-gray-900 transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5">
            <a
              href="#"
              className="text-sm font-semibold text-black block text-center"
            >
              Slow
            </a>
          </button>
          <button className="bg-transparent hover:bg-apple transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5">
            <a
              href="#"
              className="text-sm font-semibold text-black block text-center"
            >
              Normal
            </a>
          </button>
          <button className="bg-transparent hover:bg-gray-900 transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5">
            <a
              href="#"
              className="text-sm font-semibold text-black block text-center"
            >
              Fast
            </a>
          </button>
        </div>
      </div>

      {/* Breath Settings */}
      <div className="flex flex-col mt-4 gap-1">
        <p className="text-gray-950 text-lg font-semibold">Number of Breaths</p>
        <div className="flex items-center text-xl">
          <button
            onClick={decreaseBreaths}
            className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer
             text-lg"
          >
            -
          </button>

          <div className="text-2xl font-semibold min-w-[4ch] text-center select-none">
            <AnimatedNumber value={breathsValue} />
          </div>

          <button
            onClick={increaseBreaths}
            className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Rounds Settings */}
      <div className="flex flex-col mt-4 gap-1">
        <p className="text-gray-950 text-xl font-semibold">Number of Rounds</p>
        <div className="flex items-center text-xl">
          <button
            onClick={decreaseRounds}
            className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer
             text-lg"
          >
            -
          </button>

          <div className="text-2xl font-semibold min-w-[4ch] text-center select-none">
            <AnimatedNumber value={roundsValue} />
          </div>

          <button
            onClick={increaseRounds}
            className="text-gray-400 hover:text-black transition-colors duration-200 cursor-pointer text-lg"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
