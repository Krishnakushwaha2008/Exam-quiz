import { create } from "zustand";
import type { AppView, SessionUser } from "@/types";

type AppState = {
  user: SessionUser | null;
  view: AppView;
  activeQuizId: string | null;
  activeResultId: string | null;

  setUser: (user: SessionUser | null) => void;
  navigate: (view: AppView) => void;
  startQuiz: (quizId: string) => void;
  showInstructions: (quizId: string) => void;
  showResult: (resultId: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  view: "dashboard",
  activeQuizId: null,
  activeResultId: null,

  setUser: (user) =>
    set({
      user,
      // Land admins on the admin overview, students on their dashboard.
      view: user?.role === "ADMIN" ? "admin-dashboard" : "dashboard",
      activeQuizId: null,
      activeResultId: null,
    }),
  navigate: (view) => set({ view }),
  startQuiz: (quizId) =>
    set({ activeQuizId: quizId, view: "quiz-attempt" }),
  showInstructions: (quizId) =>
    set({ activeQuizId: quizId, view: "quiz-instructions" }),
  showResult: (resultId) =>
    set({ activeResultId: resultId, view: "quiz-result" }),
}));
