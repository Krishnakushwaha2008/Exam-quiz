// Shared application types — mirror the API response shapes.

export type Role = "STUDENT" | "ADMIN";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type AnswerOption = "A" | "B" | "C" | "D";
export type ExamStatus = "PASS" | "FAIL";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
};

export type QuizListItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  difficulty: Difficulty;
  questionCount: number;
  createdAt: string;
  bestAttempt: {
    percentage: number;
    status: ExamStatus;
    attemptedAt: string;
  } | null;
};

export type AttemptQuestion = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
};

export type QuizDetail = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  difficulty: Difficulty;
  questions: AttemptQuestion[];
};

export type ResultListItem = {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: ExamStatus;
  timeSpent: number;
  attemptedAt: string;
};

export type ResultAnswer = {
  id: string;
  questionId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AnswerOption;
  selectedAnswer: AnswerOption | null;
  isCorrect: boolean;
  marks: number;
};

export type ResultDetail = {
  id: string;
  quizId: string;
  quizTitle: string;
  category: string;
  duration: number;
  score: number;
  totalMarks: number;
  percentage: number;
  status: ExamStatus;
  timeSpent: number;
  attemptedAt: string;
  passingMarks: number;
  answers: ResultAnswer[];
};

export type AdminStats = {
  totalStudents: number;
  totalQuizzes: number;
  totalAttempts: number;
  avgScore: number;
  passRate: number;
  quizPerformance: {
    id: string;
    title: string;
    category: string;
    attempts: number;
    avgScore: number;
  }[];
  recentResults: {
    id: string;
    studentName: string;
    quizTitle: string;
    category: string;
    score: number;
    totalMarks: number;
    percentage: number;
    status: ExamStatus;
    attemptedAt: string;
  }[];
};

export type StudentRow = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  attemptCount: number;
  avgScore: number;
  passed: number;
  lastAttempt: string | null;
};

/** App views surfaced through client-side routing (single-route SPA). */
export type AppView =
  | "dashboard"
  | "quizzes"
  | "quiz-instructions"
  | "quiz-attempt"
  | "quiz-result"
  | "profile"
  | "admin-dashboard"
  | "admin-quizzes"
  | "admin-add-quiz"
  | "admin-students";
