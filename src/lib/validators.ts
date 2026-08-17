import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const AnswerOptionSchema = z.enum(["A", "B", "C", "D"]);

export const QuizSubmissionSchema = z.object({
  quizId: z.string().min(1),
  answers: z.record(z.string(), AnswerOptionSchema),
  timeSpent: z.number().int().min(0).max(60 * 60 * 8).default(0),
});

export const QuestionInputSchema = z.object({
  questionText: z.string().trim().min(3, "Question text is required"),
  optionA: z.string().trim().min(1, "Option A is required"),
  optionB: z.string().trim().min(1, "Option B is required"),
  optionC: z.string().trim().min(1, "Option C is required"),
  optionD: z.string().trim().min(1, "Option D is required"),
  correctAnswer: AnswerOptionSchema,
  marks: z.number().int().min(1).max(20).default(1),
});

export const QuizInputSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(2000),
  category: z.string().trim().min(2, "Category is required").max(60),
  duration: z.number().int().min(1, "Duration must be at least 1 minute").max(240),
  passingMarks: z.number().int().min(0),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
  questions: z.array(QuestionInputSchema).min(1, "At least one question is required"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type QuizSubmissionInput = z.infer<typeof QuizSubmissionSchema>;
export type QuizInput = z.infer<typeof QuizInputSchema>;
export type QuestionInput = z.infer<typeof QuestionInputSchema>;
