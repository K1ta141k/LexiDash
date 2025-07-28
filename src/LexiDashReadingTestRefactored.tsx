import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Header from './components/Header';
import ReadingTestSection from './components/ReadingTestSection';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { HistoryItem, AIFeedbackData, PointerPosition } from './types';

const LexiDashReadingTestRefactored = () => {
  // Reading text state
  const [text] = useState<string>(
    'The rise of renewable energy has transformed global power systems. Solar and wind energy are now the fastest-growing energy sources, helping reduce carbon emissions. Governments worldwide are investing heavily in sustainable solutions to combat climate change. The future of energy depends on innovation, policy changes, and public support for clean power technologies.'
  );

  // Reading settings
  const [wpm, setWpm] = useState<number>(250);
  const [readingMode, setReadingMode] = useState<'basic' | 'pointer'>('pointer');

  // Timer states
  const [isReading, setIsReading] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  // Pointer state - track geometric position (0 to 1 across entire text)
  const [pointerProgress, setPointerProgress] = useState<number>(0);

  // Summary and feedback
  const [summary, setSummary] = useState<string>('');
  const [showSummaryInput, setShowSummaryInput] = useState<boolean>(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedbackData | null>(null);

  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Split text into words for processing
  const words = text.split(' ');

  // Calculate total reading time in seconds
  const totalReadingTimeSeconds = (words.length / wpm) * 60;

  // Hybrid approach: setInterval for accurate time tracking + rAF for smooth visuals
  useEffect(() => {
    if (!isReading) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      startTimeRef.current = null;
      return;
    }

    // Start time tracking with setInterval (continues when tab is hidden)
    const startTime = Date.now();
    startTimeRef.current = startTime;
    
    timerRef.current = setInterval(() => {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsedTime / totalReadingTimeSeconds, 1);
      
      setTimeElapsed(elapsedTime);
      setPointerProgress(progress);
      
      if (progress >= 1) {
        stopReading();
      }
    }, 16); // Update every 16ms for smooth progress

    // Start smooth visual updates with rAF
    const animate = (currentTime: number) => {
      if (!isReading) return;
      
      // Trigger a re-render for smooth visual updates
      // The actual position calculation happens in the component
      if (animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isReading, totalReadingTimeSeconds]);

  // Start reading timer
  const startReading = () => {
    setIsReading(true);
    setTimeElapsed(0);
    setPointerProgress(0);
    startTimeRef.current = null;
    setShowSummaryInput(false);
    setAiFeedback(null);
    setSummary('');
  };

  // Stop reading timer
  const stopReading = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    startTimeRef.current = null;
    setIsReading(false);
    setShowSummaryInput(true);
  };

  // Submit summary
  const submitSummary = () => {
    // Mock AI feedback
    const mockFeedback: AIFeedbackData = {
      accuracy_score: Math.floor(Math.random() * 20) + 75,
      correct_points: [
        'Solar and wind are fast-growing energy sources.',
        'Renewable energy helps reduce carbon emissions.'
      ],
      missed_points: [
        'Governments are investing heavily in sustainable solutions.',
        'The future of energy depends on innovation and policy changes.'
      ],
      wrong_points: ['Renewable energy is currently the cheapest energy source.']
    };

    setAiFeedback(mockFeedback);

    // Calculate WPM
    const minutes = timeElapsed / 60;
    const calculatedWpm = minutes > 0 ? Math.round(words.length / minutes) : 0;

    // Save to history
    const newHistoryItem: HistoryItem = {
      firstFiveWords: words.slice(0, 3).join(' ') + '...',
      wpm: calculatedWpm,
      accuracy: mockFeedback.accuracy_score
    };

    const updatedHistory = [...history, newHistoryItem];
    setHistory(updatedHistory);
    localStorage.setItem('lexidash-history', JSON.stringify(updatedHistory));

    // Reset for next test
    setSummary('');
  };

  // Reset everything
  const resetTest = () => {
    setIsReading(false);
    setTimeElapsed(0);
    setShowSummaryInput(false);
    setAiFeedback(null);
    setSummary('');
    setPointerProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    startTimeRef.current = null;
  };

  // Load history from local storage once
  useEffect(() => {
    const savedHistory = localStorage.getItem('lexidash-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // Sample history data
      const sampleData: HistoryItem[] = [
        { firstFiveWords: 'The rise of...', wpm: 280, accuracy: 78 },
        { firstFiveWords: 'Solar and wind...', wpm: 320, accuracy: 85 },
        { firstFiveWords: 'Governments worldwide...', wpm: 250, accuracy: 92 },
        { firstFiveWords: 'The future of...', wpm: 290, accuracy: 88 }
      ];
      setHistory(sampleData);
      localStorage.setItem('lexidash-history', JSON.stringify(sampleData));
    }
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isReading && !showSummaryInput) {
          startReading();
        } else if (isReading) {
          stopReading();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReading, showSummaryInput]);

  // Current WPM calculation in real-time
  const calculateWpm = () => {
    if (timeElapsed === 0) return 0;
    const minutes = timeElapsed / 60;
    return Math.round(words.length / minutes);
  };

  // Convert geometric progress to pointer position for compatibility
  const pointerPos: PointerPosition = {
    line: 0, // We'll calculate this in the component
    charIndex: 0,
    charIndexInWord: 0
  };

  // Empty lines array - we'll calculate this in the component
  const [lines, setLines] = useState<number[][]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ReadingTestSection
            text={text}
            wpm={wpm}
            setWpm={setWpm}
            readingMode={readingMode}
            setReadingMode={setReadingMode}
            isReading={isReading}
            timeElapsed={timeElapsed}
            calculateWpm={calculateWpm}
            startReading={startReading}
            stopReading={stopReading}
            resetTest={resetTest}
            pointerPos={pointerPos}
            lines={lines}
            wordRefs={wordRefs}
            setLines={setLines}
            showSummaryInput={showSummaryInput}
            summary={summary}
            setSummary={setSummary}
            submitSummary={submitSummary}
            aiFeedback={aiFeedback}
            pointerProgress={pointerProgress}
          />

          <Dashboard history={history} />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default LexiDashReadingTestRefactored; 