"use client";

import { useState, useEffect } from "react";
import { useSettings } from "./SettingsContext";
import { Gauge, Wind, Repeat } from "lucide-react";

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
  initialSpeed = 3.1, // Default speed value
}) {
  // Get settings and update function from context
  const { settings, updateSettings } = useSettings();

  // Local state for UI, initialized from context or initial props
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

  // Update context when local state changes
  useEffect(() => {
    updateSettings({
      rounds: roundsValue,
      breaths: breathsValue,
      breathingSpeed: speedValue,
    });
  }, [roundsValue, breathsValue, speedValue, updateSettings]);

  // Button styles mimicking the example's 'default' and 'secondary' variants
  // Removed cn, using template literals
  const getButtonClasses = (isActive) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
    const activeClasses =
      "bg-indigo-600 text-white hover:bg-indigo-600/90 ring-1 ring-indigo-600";
    const inactiveClasses =
      "bg-gray-100 text-gray-900 hover:bg-gray-200/80 ring-1 ring-gray-300";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex w-full flex-col items-center bg-white p-4 sm:p-8 pt-6 sm:pt-8">
      <div className="w-full max-w-sm space-y-10">
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Gauge className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-950">
                Breathing Speed
              </h2>
              <p className="text-sm text-gray-500">
                Choose how fast you want to breathe.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option.label}
                onClick={() => setSpeedValue(option.value)}
                className={`${getButtonClasses(
                  speedValue === option.value
                )} py-5 text-base`}
                aria-pressed={speedValue === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
        {/* Number of Breaths */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Wind className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-950">
                Number of Breaths
              </h2>
              <p className="text-sm text-gray-500">Number of inhalations.</p>
            </div>
          </div>
          {/* Using more columns for breaths */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {BREATH_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setBreathsValue(option)}
                // Removed cn, using template literals for additional classes
                className={`${getButtonClasses(
                  breathsValue === option
                )} py-3 text-sm`}
                aria-pressed={breathsValue === option}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
        {/* Number of Rounds */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Repeat className="h-6 w-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-950">
                Number of Rounds
              </h2>
              <p className="text-sm text-gray-500">
                How many cycles to perform.
              </p>
            </div>
          </div>
          {/* Using more columns for rounds */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {ROUND_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setRoundsValue(option)}
                // Removed cn, using template literals for additional classes
                className={`${getButtonClasses(
                  roundsValue === option
                )} py-3 text-sm`}
                aria-pressed={roundsValue === option}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
