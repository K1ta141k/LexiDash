import React from 'react';
import ReadingControls from './ReadingControls';
import TimerDisplay from './TimerDisplay';
import ReadingTextArea from './ReadingTextArea';
import SummaryInput from './SummaryInput';
import AIFeedback from './AIFeedback';
import { AIFeedbackData, PointerPosition } from '../types';

interface ReadingTestSectionProps {
  text: string;
  wpm: number;
  setWpm: (wpm: number) => void;
  readingMode: 'basic' | 'pointer';
  setReadingMode: (mode: 'basic' | 'pointer') => void;
  isReading: boolean;
  timeElapsed: number;
  calculateWpm: () => number;
  startReading: () => void;
  stopReading: () => void;
  resetTest: () => void;
  pointerPos: PointerPosition;
  lines: number[][];
  wordRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  setLines: (lines: number[][]) => void;
  showSummaryInput: boolean;
  summary: string;
  setSummary: (summary: string) => void;
  submitSummary: () => void;
  aiFeedback: AIFeedbackData | null;
  pointerProgress: number;
}

const ReadingTestSection = ({
  text,
  wpm,
  setWpm,
  readingMode,
  setReadingMode,
  isReading,
  timeElapsed,
  calculateWpm,
  startReading,
  stopReading,
  resetTest,
  pointerPos,
  lines,
  wordRefs,
  setLines,
  showSummaryInput,
  summary,
  setSummary,
  submitSummary,
  aiFeedback,
  pointerProgress
}: ReadingTestSectionProps) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-left">Reading Speed Test</h2>

        <ReadingControls
          readingMode={readingMode}
          setReadingMode={setReadingMode}
          wpm={wpm}
          setWpm={setWpm}
          isReading={isReading}
        />

        <TimerDisplay
          timeElapsed={timeElapsed}
          calculateWpm={calculateWpm}
          isReading={isReading}
          showSummaryInput={showSummaryInput}
          startReading={startReading}
          stopReading={stopReading}
          resetTest={resetTest}
        />

        <ReadingTextArea
          text={text}
          isReading={isReading}
          readingMode={readingMode}
          pointerPos={pointerPos}
          lines={lines}
          wordRefs={wordRefs}
          setLines={setLines}
          pointerProgress={pointerProgress}
        />

        {showSummaryInput && !aiFeedback && (
          <SummaryInput
            summary={summary}
            setSummary={setSummary}
            submitSummary={submitSummary}
          />
        )}

        {aiFeedback && <AIFeedback aiFeedback={aiFeedback} />}
      </div>
    </div>
  );
};

export default ReadingTestSection; 