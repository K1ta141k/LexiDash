export interface HistoryItem {
  firstFiveWords: string;
  wpm: number;
  accuracy: number;
}

export interface AIFeedbackData {
  accuracy_score: number;
  correct_points: string[];
  missed_points: string[];
  wrong_points: string[];
}

export interface PointerPosition {
  line: number;
  charIndex: number; // Kept for compatibility but no longer used
  charIndexInWord: number; // Now used as continuous progress (0-100) through the current line
} 