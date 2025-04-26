import React, { useState, useEffect, useRef } from "react";

function WimHofApp() {
  const [numberOfRounds, setNumberOfRounds] = useState(3);
  const [numberOfBreaths, setNumberOfBreaths] = useState(30);
  const [breathingSpeed, setBreathingSpeed] = useState(3.1);

  const [appPhase, setAppPhase] = useState("setup");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBreath, setCurrentBreath] = useState(0);
  const [breathPhase, setBreathPhase] = useState("inhale");
  const [timer, setTimer] = useState(0);
  const [maxHoldTime, setMaxHoldTime] = useState(0);
  const [roundResults, setRoundResults] = useState([]);

  const timerRef = useRef(null);
  const breathingTimerRef = useRef(null);

  useEffect(() => {
    if (appPhase !== "breathing") {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
      return;
    }

    if (currentBreath >= numberOfBreaths) {
      setAppPhase("holdBreath");
      setBreathPhase("hold");
      startHoldTimer();
      return;
    }

    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }

    const breathDuration = breathingSpeed / 2;

    if (breathPhase === "inhale") {
      breathingTimerRef.current = setTimeout(() => {
        if (appPhase === "breathing") {
          setBreathPhase("exhale");
        }
      }, breathDuration * 1000);
    } else {
      breathingTimerRef.current = setTimeout(() => {
        if (appPhase === "breathing") {
          setCurrentBreath((prev) => prev + 1);
          setBreathPhase("inhale");
        }
      }, breathDuration * 1000);
    }

    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
    };
  }, [appPhase, breathPhase, currentBreath, numberOfBreaths, breathingSpeed]);

  const startHoldTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
    timerRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 0.1);
    }, 100);
  };

  const stopHoldBreath = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const holdTime = timer;

    setRoundResults((prev) => [...prev, holdTime]);
    setMaxHoldTime((prevMax) => Math.max(prevMax, holdTime));

    setAppPhase("recoveryBreath");
    startRecoveryBreath();
  };

  const startRecoveryBreath = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(15);
    setBreathPhase("deepInhale");

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
      if (appPhase === "recoveryBreath") {
        setBreathPhase("holdInhale");
      }
    }, 3000);
  };

  const startExhale = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBreathPhase("exhale");
    setTimer(5);

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
    if (currentRound < numberOfRounds) {
      setCurrentRound((prev) => prev + 1);
      setAppPhase("breathing");
      setBreathPhase("inhale");
      setCurrentBreath(0);
      setTimer(0);
    } else {
      setAppPhase("results");
    }
  };

  const startExercise = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    timerRef.current = null;
    breathingTimerRef.current = null;

    setCurrentRound(1);
    setCurrentBreath(0);
    setBreathPhase("inhale");
    setAppPhase("breathing");
    setRoundResults([]);
    setMaxHoldTime(0);
    setTimer(0);
  };

  const resetExercise = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }
    setAppPhase("setup");
    setCurrentRound(1);
    setCurrentBreath(0);
    setTimer(0);
    setRoundResults([]);
    setMaxHoldTime(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4"
      data-breathing-speed={breathingSpeed}
    >
      {appPhase === "setup" && (
        <SettingsPanel
          numberOfRounds={numberOfRounds}
          setNumberOfRounds={setNumberOfRounds}
          numberOfBreaths={numberOfBreaths}
          setNumberOfBreaths={setNumberOfBreaths}
          breathingSpeed={breathingSpeed}
          setBreathingSpeed={setBreathingSpeed}
          startExercise={startExercise}
        />
      )}

      {(appPhase === "breathing" ||
        appPhase === "holdBreath" ||
        appPhase === "recoveryBreath") && (
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
      )}

      {appPhase === "results" && (
        <ResultsScreen
          roundResults={roundResults}
          maxHoldTime={maxHoldTime}
          resetExercise={resetExercise}
        />
      )}
    </div>
  );
}

function SettingsPanel({
  numberOfRounds,
  setNumberOfRounds,
  numberOfBreaths,
  setNumberOfBreaths,
  breathingSpeed,
  setBreathingSpeed,
  startExercise,
}) {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Number of Rounds:
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={numberOfRounds}
          onChange={(e) => setNumberOfRounds(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Breaths per Round:
        </label>
        <input
          type="number"
          min="10"
          max="50"
          value={numberOfBreaths}
          onChange={(e) => setNumberOfBreaths(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Breathing Speed (seconds per cycle):
        </label>
        <input
          type="range"
          min="3"
          max="8"
          step="0.5"
          value={breathingSpeed}
          onChange={(e) => setBreathingSpeed(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-600 mt-1 block">
          {breathingSpeed} seconds
        </span>
      </div>

      <button
        onClick={startExercise}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Start Breathing Exercise
      </button>
    </div>
  );
}

function ExerciseScreen({
  phase,
  breathPhase,
  currentRound,
  totalRounds,
  currentBreath,
  totalBreaths,
  timer,
  stopHoldBreath,
  resetExercise,
  breathingSpeed,
}) {
  const [scaleValue, setScaleValue] = useState(0.25);
  const [timerOpacity, setTimerOpacity] = useState(1);

  useEffect(() => {
    if (phase === "breathing") {
      if (breathPhase === "inhale") {
        setScaleValue(1);
      } else if (breathPhase === "exhale") {
        setScaleValue(0.25);
      }
    } else if (phase === "holdBreath") {
    } else if (phase === "recoveryBreath") {
      if (breathPhase === "deepInhale") {
        setScaleValue(1);
        setTimerOpacity(1);

        const fadeTimeout = setTimeout(() => {
          setTimerOpacity(0);
        }, 13000);

        return () => clearTimeout(fadeTimeout);
      } else if (breathPhase === "holdInhale") {
        setScaleValue(1);
        setTimerOpacity(1);
      } else if (breathPhase === "exhale") {
        setScaleValue(0.25);
        setTimerOpacity(1);
      }
    } else {
      setScaleValue(0.25);
    }
  }, [phase, breathPhase]);

  const getTransitionDuration = () => {
    if (phase === "breathing") {
      return `${breathingSpeed / 2}s`;
    } else if (phase === "holdBreath") {
      return "2s";
    } else if (phase === "recoveryBreath") {
      if (breathPhase === "deepInhale") return "3s";
      if (breathPhase === "exhale") return "5s";
      if (breathPhase === "holdInhale") return "0.3s";
    }
    return "0.3s";
  };

  const textOpacity = scaleValue > 0.5 ? 1 : 0;
  const scaleTransitionDuration = getTransitionDuration();
  const opacityTransitionDuration =
    phase === "breathing"
      ? `${(breathingSpeed / 2) * 0.7}s`
      : scaleTransitionDuration;

  const outerScale = scaleValue === 1 ? 1.2 : scaleValue;

  const formatTime = (timeInSeconds) => {
    const totalSeconds = Math.floor(timeInSeconds);
    if (totalSeconds < 60) {
      return totalSeconds;
    } else {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedSeconds = String(seconds).padStart(2, "0");
      return `${minutes}:${formattedSeconds}`;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg text-center">
      <div
        className={`w-64 h-64 rounded-full border-2 border-white/20 flex items-center justify-center`}
        style={{
          transform: `scale(${outerScale})`,
          transition: `transform ${scaleTransitionDuration} ease-in-out`,
        }}
      >
        <div
          className={`w-48 h-48 rounded-full border-3 border-white/40 flex items-center justify-center transition-transform duration-1000 ${
            phase === "holdBreath" ? "scale-90" : "scale-100"
          }`}
        >
          <div
            className={`w-32 h-32 rounded-full border-4 border-white/60 flex flex-col items-center justify-center transition-transform duration-1000 ${
              phase === "holdBreath" ? "scale-90" : "scale-100"
            } h-20`}
          >
            {phase === "breathing" && (
              <span
                className="text-5xl font-semibold text-white select-none"
                style={{
                  opacity: textOpacity,
                  transition: `opacity ${opacityTransitionDuration} ease-in-out`,
                }}
              >
                {currentBreath + 1}
              </span>
            )}
            {(phase === "holdBreath" ||
              (phase === "recoveryBreath" && breathPhase !== "exhale")) && (
              <div
                className="text-4xl font-bold text-white"
                style={{
                  opacity:
                    phase === "recoveryBreath" && breathPhase === "deepInhale"
                      ? timerOpacity
                      : 1,
                  transition: `opacity 2s ease-in`,
                }}
              >
                {formatTime(timer)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="my-6 h-7"></div>

      <div className="flex flex-row items-center justify-center gap-4">
        <button
          onClick={resetExercise}
          className="bg-transparent hover:bg-gray-900 transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5"
        >
          <span className="text-m font-semibold text-white block text-center">
            Reset
          </span>
        </button>
        {phase === "holdBreath" && (
          <button
            onClick={stopHoldBreath}
            className="bg-indigo-700 hover:bg-indigo-600 hover:scale-97 transition duration-200 ease-in-out rounded-xl px-5 py-3 w-40 text-m font-semibold text-white block text-center"
          >
            Release Breath
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ roundResults, maxHoldTime, resetExercise }) {
  const formatHoldTime = (timeInSeconds) => {
    const totalSeconds = Math.floor(timeInSeconds);
    if (totalSeconds < 0) return "0:00";

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${minutes}:${formattedSeconds}`;
  };

  return (
    <div className="w-full max-w-md bg-transparent rounded-2xl p-18 text-center ring-0 ring-gray-900 backdrop-blur-4xl">
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white">Maximum Hold Time</h2>
        <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-indigo-500 mt-2 tracking-tighter">
          {formatHoldTime(maxHoldTime)} min
        </div>
      </div>

      <div className="mb-8">
        <ul className="space-y-2">
          {roundResults.map((time, index) => (
            <li key={index}>
              <span className="font-semibold text-slate-100">
                Round {index + 1}:
              </span>{" "}
              <span className="font-ligh text-gray-300">
                {formatHoldTime(time)} min
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center">
        <button
          onClick={resetExercise}
          className=" bg-transparent hover:bg-gray-900 transition duration-200 ease-in-out rounded-xl px-3 mt-5 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5"
        >
          <span className="text-center text-white font-semibold">Go back</span>
        </button>
      </div>
    </div>
  );
}

export { ExerciseScreen, ResultsScreen };

export default WimHofApp;
