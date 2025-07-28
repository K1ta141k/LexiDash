
interface ReadingControlsProps {
  readingMode: 'basic' | 'pointer';
  setReadingMode: (mode: 'basic' | 'pointer') => void;
  wpm: number;
  setWpm: (wpm: number) => void;
  isReading: boolean;
}

const ReadingControls = ({ readingMode, setReadingMode, wpm, setWpm, isReading }: ReadingControlsProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
          Reading Mode
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => setReadingMode('basic')}
            className={`px-4 py-2 rounded-lg ${
              readingMode === 'basic' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setReadingMode('pointer')}
            className={`px-4 py-2 rounded-lg ${
              readingMode === 'pointer' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pointer-Guided
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 text-left">WPM</label>
        <input
          type="number"
          min={50}
          max={1000}
          value={wpm}
          onChange={e => setWpm(parseInt(e.target.value) || 250)}
          className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
          disabled={isReading}
        />
      </div>


    </div>
  );
};

export default ReadingControls; 