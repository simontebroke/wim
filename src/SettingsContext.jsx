import { createContext, useState, useContext } from "react";

// Default settings
const defaultSettings = {
  rounds: 3,
  breaths: 30,
  breathingSpeed: 1.5, // seconds per breath cycle
};

// Create the context
const SettingsContext = createContext();

// Provider component
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the settings
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
