"use client";

import { useState, useEffect, useRef } from "react";
import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import Modal from "./Modal";
import BreathingExercise from "./BreathingExercise";

export default function Header2alt() {
  const textRef = useRef(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);

  useEffect(() => {
    if (!isExerciseActive) {
      document.fonts.ready.then(() => {
        if (!textRef.current) return;

        textRef.current.style.visibility = "visible";

        const { words } = splitText(textRef.current);

        animate(
          words,
          { opacity: [0, 1], y: [10, 0] },
          {
            type: "spring",
            duration: 1,
            bounce: 0,
            delay: stagger(0.05),
          }
        );
      });
    } else {
      if (textRef.current) textRef.current.style.visibility = "hidden";
    }
  }, [isExerciseActive]);

  const handleStartExercise = () => {
    setIsExerciseActive(true);
  };

  const handleExerciseComplete = () => {
    setIsExerciseActive(false);
  };

  return (
    <div className="overflow-hidden bg-gray-950 min-h-screen flex flex-col items-center justify-center relative isolate">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-60 sm:opacity-30"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] opacity-50 sm:opacity-"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>

      {!isExerciseActive ? (
        <div className="relative isolate px-6 pt-5 lg:px-8 w-full max-w-4xl text-center z-10">
          <div className="mx-auto max-w-lg py-16 sm:py-24 lg:py-32">
            <div className="mb-4 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-xs md:text-base text-gray-500 transition duration-100 ease-in-out ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-98 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-900/50">
                <a
                  href="https://www.wimhofmethod.com/breathing-exercises"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  For guidance and health instructions{" "}
                  <span className=" text-indigo-500">
                    <span
                      className="absolute inset-0"
                      aria-hidden="true"
                    ></span>
                    click here <span aria-hidden="true">&rarr;</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="text-center mt-5">
              <h1
                ref={textRef}
                className="invisible px-2 text-5xl tracking-tighter text-balance max-lg:font-medium max-sm:px-4 sm:text-6xl text-white"
                style={{ willChange: "transform, opacity" }}
              >
                Free, costumizable Wim breathing.
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-300 ">
                Enjoy unlimited guided Wim style breathing sessions and discover
                the benefits.
              </p>

              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={handleStartExercise}
                  className="bg-indigo-700 hover:bg-indigo-600 hover:scale-97 transition duration-200 ease-in-out rounded-xl px-5 py-3 w-60 text-m font-semibold text-white block text-center"
                >
                  Start exercise
                </button>
                <Modal />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <BreathingExercise onComplete={handleExerciseComplete} />
      )}
    </div>
  );
}
