import React, { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onTimeout: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeout]);

  // Calculate percentage for progress bar
  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">Time remaining:&nbsp;</span>
        <span className={`text-lg font-bold ${
          timeLeft <= 5 ? "text-red-500" : "text-blue-500"
        }`}>
          {timeLeft}s
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            timeLeft <= 5 ? "bg-red-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;