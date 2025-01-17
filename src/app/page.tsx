"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [positions, setPositions] = useState([0, 0, 0, 0]);
  const [winner, setWinner] = useState<string | null>(null);
  const [coins, setCoins] = useState(10000); // Starting coins
  const [betAmount, setBetAmount] = useState<string>(""); // Bet amount as a string
  const [selectedPixel, setSelectedPixel] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Track the interval
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for race container

  const startRace = () => {
    const numericBetAmount = parseInt(betAmount, 10);

    if (!selectedPixel || numericBetAmount <= 0 || numericBetAmount > coins || isNaN(numericBetAmount)) {
      alert("Please select a pixel and place a valid bet.");
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Clear any existing interval
    }

    // Deduct the bet amount at the start of the race
    setCoins((prevCoins) => prevCoins - numericBetAmount);

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

          // Handle betting result
          if (winnerIndex + 1 === selectedPixel) {
            // Add 4x the bet amount as the total win
            setCoins((prevCoins) => prevCoins + numericBetAmount * 4);
            alert(`You won! Pixel ${winnerIndex + 1} won. Your new balance is ${coins + numericBetAmount * 3}!`);
          } else {
            alert(`You lost! Pixel ${winnerIndex + 1} won. You lost ${numericBetAmount} coins.`);
          }
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
      <p className="text-lg">Coins: {coins}</p>
      <div className="flex gap-4">
        <input
          type="text"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value.replace(/\D/, ""))} // Allow only digits
          placeholder="Bet Amount"
          className="px-4 py-2 border rounded"
        />
        <select
          value={selectedPixel || ""}
          onChange={(e) => setSelectedPixel(Number(e.target.value))}
          className="px-4 py-2 border rounded"
        >
          <option value="" disabled>
            Select Pixel
          </option>
          <option value={1}>Pixel 1 (Blue)</option>
          <option value={2}>Pixel 2 (Green)</option>
          <option value={3}>Pixel 3 (Yellow)</option>
          <option value={4}>Pixel 4 (Purple)</option>
        </select>
      </div>
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
