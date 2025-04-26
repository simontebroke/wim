"use client";

import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ExerciseScreen, ResultsScreen } from "./Wim.jsx";
import { useSettings } from "./SettingsContext";

export default function BreathingExercise({ onComplete }) {
  const { settings } = useSettings();

  const [numberOfRounds] = useState(settings.rounds);
  const [numberOfBreaths] = useState(settings.breaths);
  const [breathingSpeed] = useState(settings.breathingSpeed);

  const [appPhase, setAppPhase] = useState("breathing");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBreath, setCurrentBreath] = useState(0);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [timer, setTimer] = useState(0);
  const [maxHoldTime, setMaxHoldTime] = useState(0);
  const [roundResults, setRoundResults] = useState([]);

  const timerRef = useRef(null);
  const breathingTimerRef = useRef(null);

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

  const startHoldTimer = () => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 0.1);
    }, 100);
  };

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
    setTimer(15.9);
    setBreathPhase("deepInhale");
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        const nextTime = prev - 0.1;
        if (nextTime <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          startExhale();
          return 1;
        }
        return nextTime;
      });
    }, 100);

    setTimeout(() => {
      if (appPhase === "recoveryBreath" && timerRef.current) {
        setBreathPhase("holdInhale");
      }
    }, 3000);
  };

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

  const completeRound = () => {
    if (currentRound + 1 <= numberOfRounds) {
      setCurrentRound(currentRound + 1);
      setAppPhase("breathing");
      setBreathPhase("inhale");
      setCurrentBreath(0);
      setTimer(0);
    } else {
      setAppPhase("results");
    }
  };
  const resetExercise = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    timerRef.current = null;
    breathingTimerRef.current = null;
    if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    };
  }, []);

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
            currentBreath={currentBreath}
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
