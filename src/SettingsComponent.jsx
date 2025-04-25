"use client";

import { useState, useEffect } from "react";
import { useSettings } from "./SettingsContext";
import { Gauge, Wind, Repeat } from "lucide-react";
import { motion } from "framer-motion";

const SPEED_OPTIONS = [
  { label: "Slow", value: 3.5 },
  { label: "Normal", value: 3.1 },
  { label: "Fast", value: 2.9 },
];

const BREATH_OPTIONS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const ROUND_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function SettingsComponent({
  initialRounds = 3,
  initialBreaths = 30,
  initialSpeed = 3.1,
}) {
  const { settings, updateSettings } = useSettings();

  const [roundsValue, setRoundsValue] = useState(
    settings.rounds !== undefined ? settings.rounds : initialRounds
  );
  const [breathsValue, setBreathsValue] = useState(
    settings.breaths !== undefined ? settings.breaths : initialBreaths
  );
  const [speedValue, setSpeedValue] = useState(
    settings.breathingSpeed !== undefined
      ? settings.breathingSpeed
      : initialSpeed
  );

  useEffect(() => {
    updateSettings({
      rounds: roundsValue,
      breaths: breathsValue,
      breathingSpeed: speedValue,
    });
  }, [roundsValue, breathsValue, speedValue, updateSettings]);

  const getButtonClasses = (isActive) => {
    const baseClasses =
      "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 z-10";
    const activeClasses = "text-white z-1000 transition duration-100 ease-in";
    const inactiveClasses = "bg-gray-100 text-gray-950 hover:bg-gray-200";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const bubbleTransition = { type: "spring", bounce: 0.2, duration: 0.4 };

  return (
    <div className="flex w-full flex-col items-center bg-white p-4 sm:p-8 pt-6 sm:pt-8">
      <div className="w-full max-w-sm space-y-10">
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Gauge className="h-6 w-6 text-indigo-700" />
            <div>
              <h2 className="text-xl font-semibold tracking-tighter text-gray-950">
                Breathing Speed
              </h2>
              <p className="text-sm text-gray-500">
                Choose how fast you want to breathe.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 relative">
            {SPEED_OPTIONS.map((option) => {
              const isActive = speedValue === option.value;
              return (
                <button
                  key={option.label}
                  onClick={() => setSpeedValue(option.value)}
                  className={`${getButtonClasses(isActive)} py-5 text-base`}
                  aria-pressed={isActive}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="bubble-speed"
                      className="absolute inset-0 z-2 bg-indigo-700 rounded-md"
                      transition={bubbleTransition}
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Wind className="h-6 w-6 text-indigo-700" />
            <div>
              <h2 className="text-xl tracking-tighter font-semibold text-gray-950">
                Number of Breaths
              </h2>
              <p className="text-sm text-gray-500">Number of inhalations.</p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3 relative">
            {" "}
            {/* Added relative here */}
            {BREATH_OPTIONS.map((option) => {
              const isActive = breathsValue === option;
              return (
                <button
                  key={option}
                  onClick={() => setBreathsValue(option)}
                  className={`${getButtonClasses(isActive)} py-3 text-sm`}
                  aria-pressed={isActive}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="bubble-breaths" // Unique layoutId for this group
                      className="absolute inset-0 z-0 bg-indigo-700 rounded-md"
                      transition={bubbleTransition}
                    />
                  )}
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Rounds Section */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Repeat className="h-6 w-6 text-indigo-700" />
            <div>
              <h2 className="text-xl tracking-tighter font-semibold text-gray-950">
                Number of Rounds
              </h2>
              <p className="text-sm text-gray-500">
                How many cycles to perform.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3 relative">
            {" "}
            {/* Added relative here */}
            {ROUND_OPTIONS.map((option) => {
              const isActive = roundsValue === option;
              return (
                <button
                  key={option}
                  onClick={() => setRoundsValue(option)}
                  className={`${getButtonClasses(isActive)} py-3 text-sm`}
                  aria-pressed={isActive}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="bubble-rounds" // Unique layoutId for this group
                      className="absolute inset-0 z-0 bg-indigo-700 rounded-md"
                      transition={bubbleTransition}
                    />
                  )}
                  <span className="relative z-10">{option}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
