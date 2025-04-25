import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const phases = [
  { name: "Inhale", scale: 1.5, duration: 1.5 },
  { name: "Exhale", scale: 1, duration: 1.5 },
];

export default function BreathingBubble() {
  const controls = useAnimation();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    if (cycleCount >= 10) return;

    const phase = phases[phaseIndex];
    controls.start({
      scale: phase.scale,
      transition: { duration: phase.duration, ease: "easeInOut" },
    });

    const timeout = setTimeout(() => {
      setPhaseIndex((prev) => {
        const nextIndex = (prev + 1) % phases.length;
        if (nextIndex === 0) {
          setCycleCount((count) => count + 1);
        }
        return nextIndex;
      });
    }, phase.duration * 1000);

    return () => clearTimeout(timeout);
  }, [phaseIndex, controls, cycleCount]);

  return (
    <div className="mt-20 flex flex-col items-center justify-cesnter h-screen">
      <motion.div
        animate={controls}
        className="w-40 h-40 bg-indigo-600 rounded-full shadow-lg"
      />
      <div className="mt-15 text-lg font-semibold text-gray-700">
        {phases[phaseIndex].name}
      </div>
    </div>
  );
}
