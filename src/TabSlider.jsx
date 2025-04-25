import { motion } from "framer-motion";
import { useState } from "react";

let tabs = [
  { id: "1", label: "Wim" },
  { id: "2", label: "Sleep" },
  { id: "3", label: "Balance" },
  { id: "4", label: "Activity" },
];

export default function TabSlider() {
  let [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex justify-center space-x-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className="relative rounded-full px-3 py-1.5 text-semibold text-m font-medium text-gray-300 outline-sky-400 transition focus-visible:outline-2` sm:text-m"
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-10 bg-white mix-blend-difference rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
