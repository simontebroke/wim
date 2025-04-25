import React, { useState, useEffect, useRef } from "react";

function WimHofApp() {
  // Settings states
  const [numberOfRounds, setNumberOfRounds] = useState(3);
  const [numberOfBreaths, setNumberOfBreaths] = useState(30);
  const [breathingSpeed, setBreathingSpeed] = useState(5.5); // seconds per breath cycle

  // App state management
  const [appPhase, setAppPhase] = useState("setup"); // setup, breathing, holdBreath, recoveryBreath, results
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBreath, setCurrentBreath] = useState(0); // Start breath count at 0
  const [breathPhase, setBreathPhase] = useState("inhale"); // inhale, exhale
  const [timer, setTimer] = useState(0);
  const [maxHoldTime, setMaxHoldTime] = useState(0);
  const [roundResults, setRoundResults] = useState([]);

  // Timer references
  const timerRef = useRef(null);
  const breathingTimerRef = useRef(null);

  // Controls the breathing animation
  useEffect(() => {
    // Only run if in breathing phase
    if (appPhase !== "breathing") {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
      return;
    }

    // Check if the number of breaths for the round is complete *before* setting timers
    if (currentBreath >= numberOfBreaths) {
      // Move to breath hold phase
      setAppPhase("holdBreath");
      setBreathPhase("hold");
      // Don't reset currentBreath here; completeRound will reset it for the *next* round.
      startHoldTimer();
      return; // Exit effect early
    }

    // Clear any previous timer for this effect before setting a new one
    if (breathingTimerRef.current) {
      clearTimeout(breathingTimerRef.current);
      breathingTimerRef.current = null;
    }

    const breathDuration = breathingSpeed / 2;

    if (breathPhase === "inhale") {
      breathingTimerRef.current = setTimeout(() => {
        if (appPhase === "breathing") {
          // Check phase before setting state
          setBreathPhase("exhale");
        }
      }, breathDuration * 1000);
    } else {
      // breathPhase === "exhale"
      breathingTimerRef.current = setTimeout(() => {
        if (appPhase === "breathing") {
          // Check phase before setting state
          // Increment breath count first
          setCurrentBreath((prev) => prev + 1);
          // Then set inhale phase for the next breath (or trigger hold check on next effect run)
          setBreathPhase("inhale");
        }
      }, breathDuration * 1000);
    }

    // Cleanup
    return () => {
      if (breathingTimerRef.current) {
        clearTimeout(breathingTimerRef.current);
        breathingTimerRef.current = null;
      }
    };
  }, [appPhase, breathPhase, currentBreath, numberOfBreaths, breathingSpeed]);

  // Start the hold breath timer
  const startHoldTimer = () => {
    // Safety clear before setting new interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
    timerRef.current = setInterval(() => {
      // Use functional update for timer to ensure accuracy
      setTimer((prevTime) => prevTime + 0.1);
    }, 100);
  };

  // User stopped holding breath
  const stopHoldBreath = () => {
    // Clear the timer *first*
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Nullify
    }

    // Use a local variable for the time to avoid race conditions with state updates
    const holdTime = timer;

    // Record the result using the local variable
    setRoundResults((prev) => [...prev, holdTime]);
    // Use functional update for maxHoldTime based on the recorded time
    setMaxHoldTime((prevMax) => Math.max(prevMax, holdTime));

    // Move to recovery breath *after* state updates related to results
    setAppPhase("recoveryBreath");
    // startRecoveryBreath will set the initial breathPhase
    startRecoveryBreath();
  };

  // Handle the recovery breath (15 seconds)
  const startRecoveryBreath = () => {
    // Safety clear before setting new interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(15);
    setBreathPhase("deepInhale"); // Start with deep inhale

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        const nextTime = prev - 0.1;
        if (nextTime <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null; // Nullify after clearing
          startExhale(); // Call startExhale *after* clearing
          return 0;
        }
        return nextTime;
      });
    }, 100);

    // After 3 seconds, change the breath phase to hold
    setTimeout(() => {
      // Check phase before setting state
      if (appPhase === "recoveryBreath") {
        setBreathPhase("holdInhale");
      }
    }, 3000);
  };

  // Handle the final exhale
  const startExhale = () => {
    // Safety clear before setting new interval
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
          timerRef.current = null; // Nullify after clearing
          completeRound(); // Call completeRound *after* clearing
          return 0;
        }
        return nextTime;
      });
    }, 100);
  };

  // Complete the current round
  const completeRound = () => {
    if (currentRound < numberOfRounds) {
      // Start next round
      setCurrentRound((prev) => prev + 1);
      setAppPhase("breathing");
      setBreathPhase("inhale");
      setCurrentBreath(0); // Reset breath count FOR THE NEW ROUND
      setTimer(0); // Reset timer value for the next hold phase
    } else {
      // All rounds complete, show results
      setAppPhase("results");
    }
  };

  // Start the whole exercise
  const startExercise = () => {
    // Clear any lingering timers from previous runs
    if (timerRef.current) clearInterval(timerRef.current);
    if (breathingTimerRef.current) clearTimeout(breathingTimerRef.current);
    timerRef.current = null;
    breathingTimerRef.current = null;

    setCurrentRound(1);
    setCurrentBreath(0); // Ensure breath count starts at 0
    setBreathPhase("inhale");
    setAppPhase("breathing");
    setRoundResults([]);
    setMaxHoldTime(0); // Reset max hold time
    setTimer(0); // Reset timer display
  };

  // Reset everything
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
    setCurrentBreath(0); // Reset breath count to 0
    setTimer(0);
    setRoundResults([]); // Clear results
    setMaxHoldTime(0); // Clear max hold time
  };

  // Cleanup on unmount
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
          currentBreath={currentBreath} // Pass 0-indexed breath count
          totalBreaths={numberOfBreaths}
          timer={timer}
          stopHoldBreath={stopHoldBreath}
          resetExercise={resetExercise}
          breathingSpeed={breathingSpeed} // Pass breathingSpeed
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
  currentBreath, // Receives 0-indexed breath count
  totalBreaths,
  timer,
  stopHoldBreath,
  resetExercise,
  breathingSpeed,
}) {
  const [scaleValue, setScaleValue] = useState(0.75); // Start at exhale scale

  // Remove the useEffect that reads data-breathing-speed and breathingSpeedRef
  // const breathingSpeedRef = useRef(null);
  // useEffect(() => { ... remove this ... }, []);

  // Update the scale value based on breath phase using CSS transitions
  useEffect(() => {
    if (phase === "breathing") {
      if (breathPhase === "inhale") {
        setScaleValue(1); // Target scale for inhale
      } else if (breathPhase === "exhale") {
        setScaleValue(0.75); // Target scale for exhale
      }
    } else if (phase === "holdBreath") {
      setScaleValue(0.9); // Fixed scale for hold breath
    } else if (phase === "recoveryBreath") {
      if (breathPhase === "deepInhale") {
        setScaleValue(1); // Target scale for deep inhale (will transition over 3s)
      } else if (breathPhase === "holdInhale") {
        setScaleValue(1); // Maintain full scale
      } else if (breathPhase === "exhale") {
        setScaleValue(0.75); // Target scale for final exhale (will transition over 5s)
      }
    } else {
      // Default scale if needed
      setScaleValue(0.75);
    }
  }, [phase, breathPhase]); // Depend on phase and breathPhase

  // Calculate transition duration based on the phase and breathingSpeed
  const getTransitionDuration = () => {
    if (phase === "breathing") {
      // Use half the breathing cycle speed for inhale/exhale transitions
      return `${breathingSpeed / 2}s`;
    } else if (phase === "holdBreath") {
      // Always use 2 seconds for the hold breath transition
      return "2s";
    } else if (phase === "recoveryBreath") {
      // Specific durations for recovery phases
      if (breathPhase === "deepInhale") return "3s";
      if (breathPhase === "exhale") return "5s";
      // Add a default for holdInhale within recovery if needed, otherwise it uses the final default
      if (breathPhase === "holdInhale") return "0.3s"; // Or another desired duration
    }
    // Default transition for any other states or instant changes
    return "0.3s";
  };

  // Dynamic style for the breathing circle using CSS transitions
  const circleStyle = {
    transform: `scale(${scaleValue})`,
    transition: `transform ${getTransitionDuration()} ease-in-out, background-color 0.5s, border-color 0.5s`, // Apply transition to transform
  };

  // Remove the requestAnimationFrame useEffect
  // useEffect(() => { ... remove this whole effect ... }, [phase, breathPhase]);

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
          {/* Add 1 here for display */}
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

      <div className="text-xl font-semibold text-gray-800 my-6">
        {phase === "breathing" && breathPhase === "inhale" && "Inhale"}
        {phase === "breathing" && breathPhase === "exhale" && "Exhale"}
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

// Stelle sicher, dass diese Komponenten exportiert werden
export { ExerciseScreen, ResultsScreen };

export default WimHofApp; // Der Default-Export kann bleiben oder entfernt werden, wenn nicht mehr benötigt
