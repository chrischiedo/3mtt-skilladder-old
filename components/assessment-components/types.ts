export interface Question {
  question_text: string;
  week?: string;
  score?: number;
}

export interface MCQQuestion extends Question {
  options: string[];
  correct_answer: string;
}

export interface OpenEndedQuestion extends Question {
  answer?: string;
}

export interface AssessmentSession {
  questions: {
    mcqQuestions: MCQQuestion[];
    openEndedQuestions: OpenEndedQuestion[];
  };
  answers: {
    userAnswers: Record<number, string>;
    openEndedAnswers: Record<number, string>;
  };
  timestamp: number;
  timeRemaining: number;
}

export interface WeeklyScore {
  week: string;
  totalScore: number;
  maxPossibleScore: number;
  percentage: string;
  mcqScore: number;
  openEndedScore: number;
  mcqPercentage: string;
  openEndedPercentage: string;
}

export interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
}

export interface AssessmentTestProps {
  mcqQuestions: MCQQuestion[];
  openEndedQuestions: OpenEndedQuestion[];
  cohort: string;
}

export interface TechnicalAssessmentCardProps {
  selected_career: string;
  cohort: string;
  self_ratings: Record<string, number>;
}
