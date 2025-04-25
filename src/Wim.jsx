import React, { useState, useEffect, useRef } from "react";

function WimHofApp() {
  const [numberOfRounds, setNumberOfRounds] = useState(3);
  const [numberOfBreaths, setNumberOfBreaths] = useState(30);
  const [breathingSpeed, setBreathingSpeed] = useState(5.5);

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
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Wim Hof Breathing Exercise
      </h1>

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

  useEffect(() => {
    if (phase === "breathing") {
      if (breathPhase === "inhale") {
        setScaleValue(1);
      } else if (breathPhase === "exhale") {
        setScaleValue(0.25);
      }
    } else if (phase === "holdBreath") {
      // Keep scale at 0.25 from previous exhale
    } else if (phase === "recoveryBreath") {
      if (breathPhase === "deepInhale") {
        setScaleValue(1);
      } else if (breathPhase === "holdInhale") {
        setScaleValue(1);
      } else if (breathPhase === "exhale") {
        setScaleValue(0.25);
      }
    } else {
      setScaleValue(0.25);
    }
  }, [phase, breathPhase]);

  const getTransitionDuration = () => {
    if (phase === "breathing") {
      return `${breathingSpeed / 2}s`;
    } else if (phase === "holdBreath") {
      return "2s"; // Transition duration for potential future animations during hold
    } else if (phase === "recoveryBreath") {
      if (breathPhase === "deepInhale") return "3s";
      if (breathPhase === "exhale") return "5s";
      if (breathPhase === "holdInhale") return "0.3s";
    }
    return "0.3s";
  };

  const circleStyle = {
    transform: `scale(${scaleValue})`,
    transition: `transform ${getTransitionDuration()} ease-in-out, background-color 0.5s, border-color 0.5s`,
  };

  const circleClasses = () => {
    const baseClasses =
      "flex items-center justify-center w-64 h-64 rounded-full";

    if (breathPhase === "inhale" || breathPhase === "deepInhale") {
      return `${baseClasses} bg-blue-100 border-4 border-blue-500`;
    } else if (breathPhase === "exhale") {
      return `${baseClasses} bg-blue-50 border-4 border-blue-300`;
    } else if (breathPhase === "holdInhale") {
      return `${baseClasses} bg-blue-100 border-4 border-blue-500`;
    } else if (breathPhase === "hold") {
      return `${baseClasses} bg-red-100 border-4 border-red-500`;
    }

    return baseClasses;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg text-center">
      <div className="text-lg font-medium text-gray-700 mb-2">
        Round {currentRound} of {totalRounds}
      </div>

      {phase === "breathing" && (
        <div className="text-lg font-medium text-gray-700 mb-6">
          Breath {currentBreath + 1} of {totalBreaths}
        </div>
      )}

      <div className={circleClasses()} style={circleStyle}>
        {phase === "holdBreath" && (
          <div className="text-4xl font-bold text-gray-800">
            {timer.toFixed(1)}s
          </div>
        )}

        {phase === "recoveryBreath" && (
          <div className="text-4xl font-bold text-gray-800">
            {timer.toFixed(1)}s
          </div>
        )}
      </div>

      <div className="text-xl font-semibold text-gray-800 my-6 h-7">
        {phase === "holdBreath" && "Hold your breath"}
        {phase === "recoveryBreath" &&
          breathPhase === "deepInhale" &&
          "Deep inhale"}
        {phase === "recoveryBreath" &&
          breathPhase === "holdInhale" &&
          "Hold the inhale"}
        {phase === "recoveryBreath" &&
          breathPhase === "exhale" &&
          "Slow exhale"}
      </div>

      {phase === "holdBreath" && (
        <button
          onClick={stopHoldBreath}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-md mb-4 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Release Breath
        </button>
      )}

      <button
        onClick={resetExercise}
        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Reset Exercise
      </button>
    </div>
  );
}

function ResultsScreen({ roundResults, maxHoldTime, resetExercise }) {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Exercise Complete!
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700">
          Maximum Breath Hold Time
        </h2>
        <div className="text-4xl font-bold text-blue-600 my-3">
          {maxHoldTime.toFixed(1)} seconds
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Round Results
        </h2>
        <ul className="space-y-2">
          {roundResults.map((time, index) => (
            <li key={index} className="text-gray-700">
              Round {index + 1}:{" "}
              <span className="font-medium">{time.toFixed(1)} seconds</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={resetExercise}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Start New Session
      </button>
    </div>
  );
}

export { ExerciseScreen, ResultsScreen };

export default WimHofApp;
