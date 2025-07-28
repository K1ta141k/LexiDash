import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { PointerPosition } from '../types';

interface ReadingTextAreaProps {
  text: string;
  isReading: boolean;
  readingMode: 'basic' | 'pointer';
  pointerPos: PointerPosition;
  lines: number[][];
  wordRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  setLines: (lines: number[][]) => void;
  pointerProgress: number;
}

const ReadingTextArea = ({ 
  text, 
  isReading, 
  readingMode, 
  pointerPos, 
  lines, 
  wordRefs, 
  setLines,
  pointerProgress
}: ReadingTextAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const words = text.split(' ');

  // Simple line calculation based on word positions
  const computeLines = useCallback(() => {
    if (!wordRefs.current.length) return;
    
    const wordPositions = wordRefs.current.map((el, idx) => {
      if (!el) return null;
      return { idx, offsetTop: el.offsetTop };
    });
    
    const filteredPositions = wordPositions.filter((item): item is { idx: number; offsetTop: number } => item !== null);
    
    // Group words by offsetTop (rounded to nearest 3px to avoid subpixel differences)
    const groups: { [key: number]: number[] } = {};
    filteredPositions.forEach(({ idx, offsetTop }) => {
      const key = Math.round(offsetTop / 3) * 3;
      if (!groups[key]) groups[key] = [];
      groups[key].push(idx);
    });
    
    // Sort lines by offsetTop ascending
    const sortedKeys = Object.keys(groups)
      .map(k => parseInt(k))
      .sort((a, b) => a - b);
    const newLines = sortedKeys.map(k => groups[k]);
    setLines(newLines);
  }, [wordRefs, setLines]);

  // Effect to recompute lines after first render and on window resize
  useEffect(() => {
    computeLines();
    window.addEventListener('resize', computeLines);
    return () => window.removeEventListener('resize', computeLines);
  }, [text, computeLines]);

  // GPU-accelerated pointer movement using transforms and requestAnimationFrame
  const updatePointerPosition = useCallback(() => {
    if (!isReading || readingMode !== 'pointer' || !containerRef.current || !pointerRef.current) {
      return;
    }

    const container = containerRef.current;
    const pointer = pointerRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Calculate current line and progress within that line
    const totalLines = Math.max(1, lines.length);
    const currentLine = Math.min(Math.floor(pointerProgress * totalLines), totalLines - 1);
    const progressWithinLine = (pointerProgress * totalLines) % 1;
    
    // Calculate position using transforms for GPU acceleration
    const translateX = progressWithinLine * containerWidth - 2; // Offset by 2px for visual positioning
    const lineHeight = containerHeight / totalLines;
    const translateY = Math.min((currentLine-5) * lineHeight, containerHeight - 22);
    
    // Use transform instead of top/left for better performance
    pointer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    pointer.style.opacity = '1';

    // Calculate which words have been passed by the pointer and apply opacity effects
    const totalWords = words.length;
    const currentWordIndex = Math.floor(pointerProgress * totalWords);
    
    // Apply opacity to words that have been passed
    wordRefs.current.forEach((wordRef, index) => {
      if (wordRef) {
        if (index < currentWordIndex) {
          // Words that have been passed - completely disappear
          wordRef.style.opacity = '0';
          wordRef.style.transition = 'opacity 0s'; // Instant transition
        } else {
          // Words ahead of pointer - keep fully visible
          wordRef.style.opacity = '1';
        }
      }
    });
  }, [pointerProgress, isReading, readingMode, lines.length, words.length]);

  // Reset word opacity when reading stops or mode changes
  const resetWordOpacity = useCallback(() => {
    wordRefs.current.forEach((wordRef) => {
      if (wordRef) {
        wordRef.style.opacity = '1';
        wordRef.style.transition = '';
      }
    });
  }, [wordRefs]);

  // Use requestAnimationFrame for smooth pointer updates
  useEffect(() => {
    if (isReading && readingMode === 'pointer') {
      const animate = () => {
        updatePointerPosition();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      // Hide pointer when not reading and reset word opacity
      if (pointerRef.current) {
        pointerRef.current.style.opacity = '0';
      }
      resetWordOpacity();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isReading, readingMode, updatePointerPosition, resetWordOpacity]);

  return (
    <div className="relative bg-gray-50 rounded-lg p-6 min-h-[300px] mb-6">
      <div className="text-sm text-gray-600 mb-4">
        {readingMode === 'pointer' ? 'Pointer Mode' : 'Basic Mode'}
      </div>
      
      <div 
        ref={containerRef}
        className="relative text-lg leading-relaxed text-gray-800 font-medium"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el)}
            className="inline-block mr-2"
          >
            {word}
          </span>
        ))}
        
        {/* GPU-accelerated pointer indicator using transforms */}
        {readingMode === 'pointer' && (
          <div
            ref={pointerRef}
            className="absolute w-1 bg-indigo-700 rounded-full pointer-events-none"
            style={{
              height: '24px',
              opacity: 0,
              transform: 'translate3d(0, 0, 0)',
              willChange: 'transform',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ReadingTextArea; 