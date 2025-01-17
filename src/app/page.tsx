"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [positions, setPositions] = useState([0, 0, 0, 0]);
  const [winner, setWinner] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Track the interval
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for race container

  const startRace = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear any existing interval
    }

    setPositions([0, 0, 0, 0]); // Reset positions
    setWinner(null); // Reset winner

    const containerWidth = containerRef.current?.offsetWidth || 800; // Get the container width

    intervalRef.current = setInterval(() => {
      setPositions((prevPositions) => {
        const newPositions = prevPositions.map(
          (pos) => pos + Math.random() * 10 // Random speed
        );

        // Check for a winner
        const winnerIndex = newPositions.findIndex(
          (pos) => pos >= containerWidth - 20 // Finish line inside the container
        );
        if (winnerIndex !== -1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current); // Clear the interval
          }
          setWinner(`Pixel ${winnerIndex + 1}`);
        }

        return newPositions;
      });
    }, 50);
  };

  useEffect(() => {
    // Cleanup the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 min-h-screen p-8">
      <h1 className="text-2xl font-bold">Pixel Race</h1>
      <div
        ref={containerRef} // Attach ref to the container
        className="relative w-full h-40 border border-gray-300 bg-gray-100 overflow-hidden"
        style={{ maxWidth: "800px" }} // Restrict the race container width
      >
        {positions.map((pos, index) => (
          <div
            key={index}
            className="absolute w-4 h-4"
            style={{
              top: `${index * 40 + 10}px`, // Spacing between pixels
              left: `${pos}px`,
              backgroundColor: ["blue", "green", "yellow", "purple"][index],
            }}
          ></div>
        ))}
      </div>
      <button
        onClick={startRace}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start Race
      </button>
      {winner && <p className="text-xl font-semibold">{winner} wins!</p>}
    </div>
  );
}
