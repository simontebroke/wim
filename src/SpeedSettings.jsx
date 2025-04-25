function SpeedButtons() {
  return (
    <>
      <p className="text-gray-950 text-xl font-semibold">Speed</p>

      <div className="grid grid-cols-3 gap-2">
        <button className="bg-transparent hover:bg-gray-900 transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5">
          <a
            href="#"
            className="text-sm font-semibold text-black block text-center"
          >
            Slow
          </a>
        </button>
        <button className="bg-transparent hover:bg-apple transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5">
          <a
            href="#"
            className="text-sm font-semibold text-black block text-center"
          >
            Normal
          </a>
        </button>
        <button className="bg-transparent hover:bg-gray-900 transition duration-200 ease-in-out rounded-xl px-3 py-3 w-30 ring-1 ring-gray-800 hover:ring-gray-700 focus:outline-none hover:scale-97 drop-shadow-lg drop-shadow-indigo-500/30 hover:drop-shadow-indigo-500/5">
          <a
            href="#"
            className="text-sm font-semibold text-black block text-center"
          >
            Fast
          </a>
        </button>
      </div>
    </>
  );
}

export default SpeedButtons;
