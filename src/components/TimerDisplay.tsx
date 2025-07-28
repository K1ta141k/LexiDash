import React from 'react';

interface TimerDisplayProps {
  timeElapsed: number;
  calculateWpm: () => number;
  isReading: boolean;
  showSummaryInput: boolean;
  startReading: () => void;
  stopReading: () => void;
  resetTest: () => void;
}

const TimerDisplay = ({ 
  timeElapsed, 
  calculateWpm,
  isReading, 
  showSummaryInput, 
  startReading, 
  stopReading, 
  resetTest 
}: TimerDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between mb-4 bg-indigo-50 p-4 rounded-lg">
      <div className="text-left">
        <div className="text-3xl font-bold text-indigo-700">{formatTime(timeElapsed)}</div>
        <div className="text-sm text-gray-600">Time</div>
      </div>

      <div>
        {isReading ? (
          <button
            onClick={stopReading}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200"
          >
            Stop Reading (Enter)
          </button>
        ) : showSummaryInput ? (
          <button
            onClick={resetTest}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition duration-200"
          >
            Reset Test
          </button>
        ) : (
          <button
            onClick={startReading}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-200"
          >
            Start Reading (Enter)
          </button>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay; 