"use client";

import { Drawer } from "vaul";
import SettingsComponent from "./SettingsComponent";
import { useState } from "react";

export default function Modal() {
  let [count, setCount] = useState(0);
  return (
    <Drawer.Root>
      <Drawer.Trigger>
        <button className="bg-transparent hover:bg-gray-900 transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5">
          <a
            href="#"
            className="text-m font-semibold text-white block text-center"
          >
            Settings
          </a>
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[50vh] mt-24 fixed bottom-0 left-0 right-0 max-w-6xl sm:max-w-lg mx-auto">
          <div className="p-4 rounded-t-[20px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            <div className="max-w-md mx-auto">
              <div className="p-4">
                {/* Ersetze die drei separaten Komponenten durch die kombinierte Komponente */}
                <SettingsComponent initialRounds={3} initialBreaths={30} />
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
