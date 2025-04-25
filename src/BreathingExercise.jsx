"use client";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ExerciseScreen, ResultsScreen } from "./Wim.jsx";
import { useSettings } from "./SettingsContext";

export default function BreathingExercise({ onComplete }) {
  // Get settings from context
  const { settings } = useSettings();

  // Use settings from context instead of defaults
  const [numberOfRounds] = useState(settings.rounds);
  const [numberOfBreaths] = useState(settings.breaths);
  const [breathingSpeed] = useState(settings.breathingSpeed);

  // App state management
  const [appPhase, setAppPhase] = useState("breathing"); // Start directly in breathing phase
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBreath, setCurrentBreath] = useState(0);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [timer, setTimer] = useState(0);
  const [maxHoldTime, setMaxHoldTime] = useState(0);
  const [roundResults, setRoundResults] = useState([]);

  // Timer references
  const timerRef = useRef(null);
  const breathingTimerRef = useRef(null);

  // Controls the breathing animation cycle
  useEffect(() => {
    if (appPhase !== "breathing") return;

    if (currentBreath >= numberOfBreaths) {
      setAppPhase("holdBreath");
      setBreathPhase("hold");
      setCurrentBreath(0);
      startHoldTimer();
      return;
    }

    const breathDuration = breathingSpeed / 2;

    let phaseTimer;
    if (breathPhase === "inhale") {
      phaseTimer = setTimeout(() => {
        setBreathPhase("exhale");
      }, breathDuration * 1000);
    } else if (breathPhase === "exhale") {
      phaseTimer = setTimeout(() => {
        setBreathPhase("inhale");
        setCurrentBreath((prev) => prev + 1);
      }, breathDuration * 1000);
    }

    return () => {
      if (phaseTimer) clearTimeout(phaseTimer);
    };
  }, [appPhase, breathPhase, currentBreath, numberOfBreaths, breathingSpeed]);

  // Start the hold breath timer
  const startHoldTimer = () => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 0.1);
    }, 100);
  };

  // User stopped holding breath
  const stopHoldBreath = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    const currentHoldTime = timer;
    setRoundResults((prev) => [...prev, currentHoldTime]);
    if (currentHoldTime > maxHoldTime) setMaxHoldTime(currentHoldTime);

    setAppPhase("recoveryBreath");
    startRecoveryBreath();
  };

  const startRecoveryBreath = () => {
    setTimer(15);
    setBreathPhase("deepInhale");
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        const nextTime = prev - 0.1;
        if (nextTime <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          startExhale();
          return 0;
        }
        return nextTime;
      });
    }, 100);

    setTimeout(() => {
      // Check phase before setting, ensure timer still running
      if (appPhase === "recoveryBreath" && timerRef.current) {
        setBreathPhase("holdInhale");
      }
    }, 3000); // Keep this at 3 seconds for the initial deep inhale before holding
  };

  // Handle the final exhale after recovery
  const startExhale = () => {
    setBreathPhase("exhale");
    setTimer(5);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        const nextTime = prev - 0.1;
        if (nextTime <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          completeRound();
          return 0;
        }
        return nextTime;
      });
    }, 100);
  };

  // Complete the current round
  const completeRound = () => {
    // Statt currentRound mit dem Wert zu erhöhen, direkt den nächsten Wert berechnen
    if (currentRound + 1 <= numberOfRounds) {
      setCurrentRound(currentRound + 1); // Setze die nächste Runde
      setAppPhase("breathing"); // Setze die Phase zurück zur Atmung
      setBreathPhase("inhale");
      setCurrentBreath(0); // Setze die Atemzahl zurück
      setTimer(0); // Setze den Timer zurück
    } else {
      setAppPhase("results"); // Wenn alle Runden abgeschlossen sind, zeige die Ergebnisse
    }
  };
  // Reset exercise and notify parent component
  const resetExercise = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current); // Clear this too if used
    timerRef.current = null;
    breathingTimerRef.current = null;
    // Call the onComplete prop function passed from Header2alt
    if (onComplete) {
      onComplete();
    }
    // No need to reset state here if the component unmounts
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    };
  }, []);

  // Render Exercise or Results Screen
  return (
    <>
      {(appPhase === "breathing" ||
        appPhase === "holdBreath" ||
        appPhase === "recoveryBreath") && (
        <div className="w-full max-w-lg flex justify-center items-center p-4 relative z-10">
          <ExerciseScreen
            phase={appPhase}
            breathPhase={breathPhase}
            currentRound={currentRound}
            totalRounds={numberOfRounds}
            currentBreath={currentBreath} // Pass currentBreath directly
            totalBreaths={numberOfBreaths}
            timer={timer}
            stopHoldBreath={stopHoldBreath}
            resetExercise={resetExercise}
            breathingSpeed={breathingSpeed}
          />
        </div>
      )}

      {appPhase === "results" && (
        <div className="w-full max-w-md flex justify-center items-center p-4 relative z-10">
          <ResultsScreen
            roundResults={roundResults}
            maxHoldTime={maxHoldTime}
            resetExercise={resetExercise}
          />
        </div>
      )}
    </>
  );
}

BreathingExercise.propTypes = {
  onComplete: PropTypes.func,
};
