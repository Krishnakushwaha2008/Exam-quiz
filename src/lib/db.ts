import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Types matching Prisma entities
export type Role = "STUDENT" | "ADMIN";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Status = "PASS" | "FAIL";
export type AnswerOption = "A" | "B" | "C" | "D";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type QuestionRecord = {
  id: string;
  quizId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AnswerOption;
  marks: number;
};

export type QuizRecord = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  difficulty: Difficulty;
  createdAt: Date;
  updatedAt: Date;
};

export type AnswerRecord = {
  id: string;
  resultId: string;
  questionId: string;
  selectedAnswer: AnswerOption | null;
  isCorrect: boolean;
};

export type ResultRecord = {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: Status;
  timeSpent: number;
  attemptedAt: Date;
};

// In-Memory Database Store
class InMemoryStore {
  users: Map<string, UserRecord> = new Map();
  quizzes: Map<string, QuizRecord> = new Map();
  questions: Map<string, QuestionRecord> = new Map();
  results: Map<string, ResultRecord> = new Map();
  answers: Map<string, AnswerRecord> = new Map();

  constructor() {
    this.initSeedData();
  }

  private initSeedData() {
    const adminPass = bcrypt.hashSync("admin123", 10);
    const studentPass = bcrypt.hashSync("student123", 10);

    const adminUser: UserRecord = {
      id: "usr_admin_001",
      name: "System Administrator",
      email: "admin@oqs.dev",
      password: adminPass,
      role: "ADMIN",
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-01T00:00:00Z"),
    };

    const studentUser: UserRecord = {
      id: "usr_student_001",
      name: "Jamie Student",
      email: "student@oqs.dev",
      password: studentPass,
      role: "STUDENT",
      createdAt: new Date("2026-01-02T00:00:00Z"),
      updatedAt: new Date("2026-01-02T00:00:00Z"),
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(studentUser.id, studentUser);

    const seedQuizzesData = [
      {
        id: "quiz_gk_001",
        title: "General Knowledge Essentials",
        description:
          "A foundational general knowledge quiz covering world geography, history, and culture. Ideal for warming up your reasoning skills before tackling tougher subjects.",
        category: "General Knowledge",
        duration: 10,
        difficulty: "EASY" as Difficulty,
        questions: [
          {
            questionText: "What is the capital city of Australia?",
            optionA: "Sydney",
            optionB: "Melbourne",
            optionC: "Canberra",
            optionD: "Perth",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "Which ocean is the largest by surface area?",
            optionA: "Atlantic Ocean",
            optionB: "Indian Ocean",
            optionC: "Arctic Ocean",
            optionD: "Pacific Ocean",
            correctAnswer: "D" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "Who painted the Mona Lisa?",
            optionA: "Vincent van Gogh",
            optionB: "Leonardo da Vinci",
            optionC: "Pablo Picasso",
            optionD: "Michelangelo",
            correctAnswer: "B" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "In which year did World War II end?",
            optionA: "1943",
            optionB: "1945",
            optionC: "1947",
            optionD: "1950",
            correctAnswer: "B" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "Which country is known as the Land of the Rising Sun?",
            optionA: "China",
            optionB: "Thailand",
            optionC: "Japan",
            optionD: "South Korea",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "The Great Pyramid of Giza is located in which country?",
            optionA: "Egypt",
            optionB: "Mexico",
            optionC: "Sudan",
            optionD: "Iraq",
            correctAnswer: "A" as AnswerOption,
            marks: 1,
          },
        ],
      },
      {
        id: "quiz_science_002",
        title: "Foundations of General Science",
        description:
          "Test your understanding of core scientific concepts across physics, chemistry, and biology. This quiz is calibrated for high-school to early-college level.",
        category: "Science",
        duration: 15,
        difficulty: "MEDIUM" as Difficulty,
        questions: [
          {
            questionText: "What is the chemical symbol for gold?",
            optionA: "Go",
            optionB: "Gd",
            optionC: "Au",
            optionD: "Ag",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "Which gas do plants primarily absorb during photosynthesis?",
            optionA: "Oxygen",
            optionB: "Nitrogen",
            optionC: "Carbon dioxide",
            optionD: "Hydrogen",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "What is the SI unit of electric current?",
            optionA: "Volt",
            optionB: "Ampere",
            optionC: "Watt",
            optionD: "Ohm",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "How many chromosomes does a typical human cell contain?",
            optionA: "23",
            optionB: "44",
            optionC: "46",
            optionD: "48",
            correctAnswer: "C" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "Which planet is known as the 'Red Planet'?",
            optionA: "Venus",
            optionB: "Mars",
            optionC: "Jupiter",
            optionD: "Saturn",
            correctAnswer: "B" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "The speed of light in a vacuum is approximately:",
            optionA: "3 × 10⁵ km/s",
            optionB: "3 × 10⁸ m/s",
            optionC: "3 × 10⁶ m/s",
            optionD: "3 × 10⁴ m/s",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "Which part of the cell contains genetic material?",
            optionA: "Mitochondria",
            optionB: "Cytoplasm",
            optionC: "Nucleus",
            optionD: "Ribosome",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
        ],
      },
      {
        id: "quiz_prog_003",
        title: "Programming Fundamentals",
        description:
          "A practical quiz on programming concepts — variables, control flow, data structures, and algorithms. Suitable for bootcamp students and self-taught developers revisiting the basics.",
        category: "Programming",
        duration: 20,
        difficulty: "HARD" as Difficulty,
        questions: [
          {
            questionText:
              "What is the time complexity of binary search on a sorted array?",
            optionA: "O(1)",
            optionB: "O(log n)",
            optionC: "O(n)",
            optionD: "O(n²)",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "Which data structure uses LIFO (Last In, First Out) order?",
            optionA: "Queue",
            optionB: "Stack",
            optionC: "Linked List",
            optionD: "Binary Tree",
            correctAnswer: "B" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "In object-oriented programming, what does 'encapsulation' describe?",
            optionA: "Inheritance between classes",
            optionB: "Bundling data and the methods that act on it",
            optionC: "Runtime method resolution",
            optionD: "Converting one type to another",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "Which of these is NOT a primitive data type in JavaScript?",
            optionA: "string",
            optionB: "number",
            optionC: "object",
            optionD: "boolean",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
          {
            questionText:
              "What does the acronym 'API' stand for in software development?",
            optionA: "Application Programming Interface",
            optionB: "Advanced Protocol Integration",
            optionC: "Automated Procedure Interface",
            optionD: "Application Process Identifier",
            correctAnswer: "A" as AnswerOption,
            marks: 1,
          },
          {
            questionText:
              "In a relational database, which clause is used to combine rows from two tables?",
            optionA: "GROUP BY",
            optionB: "WHERE",
            optionC: "JOIN",
            optionD: "ORDER BY",
            correctAnswer: "C" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "What is the output of `typeof null` in JavaScript?",
            optionA: "'null'",
            optionB: "'undefined'",
            optionC: "'object'",
            optionD: "'number'",
            correctAnswer: "C" as AnswerOption,
            marks: 3,
          },
          {
            questionText: "Which sorting algorithm has an average time complexity of O(n log n)?",
            optionA: "Bubble Sort",
            optionB: "Insertion Sort",
            optionC: "Merge Sort",
            optionD: "Selection Sort",
            correctAnswer: "C" as AnswerOption,
            marks: 2,
          },
        ],
      },
      {
        id: "quiz_math_004",
        title: "Mathematics: Algebra & Logic",
        description:
          "Sharpen your algebra and logical reasoning. This quiz rewards careful reading — several questions combine multiple concepts. Calculators are not required.",
        category: "Mathematics",
        duration: 15,
        difficulty: "MEDIUM" as Difficulty,
        questions: [
          {
            questionText: "Solve for x: 2x + 6 = 20",
            optionA: "6",
            optionB: "7",
            optionC: "8",
            optionD: "9",
            correctAnswer: "B" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "What is the value of 5! (5 factorial)?",
            optionA: "20",
            optionB: "60",
            optionC: "120",
            optionD: "720",
            correctAnswer: "C" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "If a triangle has angles 90° and 35°, what is the third angle?",
            optionA: "45°",
            optionB: "55°",
            optionC: "65°",
            optionD: "75°",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "What is the derivative of f(x) = x³?",
            optionA: "x²",
            optionB: "2x²",
            optionC: "3x²",
            optionD: "3x",
            correctAnswer: "C" as AnswerOption,
            marks: 3,
          },
          {
            questionText: "Simplify: (2³) × (2²)",
            optionA: "2⁵",
            optionB: "2⁶",
            optionC: "4⁵",
            optionD: "8",
            correctAnswer: "A" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "What is the next number in the sequence 2, 6, 12, 20, 30, ?",
            optionA: "40",
            optionB: "42",
            optionC: "44",
            optionD: "46",
            correctAnswer: "B" as AnswerOption,
            marks: 3,
          },
        ],
      },
      {
        id: "quiz_history_005",
        title: "World History Highlights",
        description:
          "Travel through pivotal moments in human history — from ancient civilisations to the modern era. A broad quiz for history enthusiasts and curious learners.",
        category: "History",
        duration: 12,
        difficulty: "MEDIUM" as Difficulty,
        questions: [
          {
            questionText: "The ancient city of Rome was built on how many hills?",
            optionA: "Five",
            optionB: "Six",
            optionC: "Seven",
            optionD: "Eight",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "Who was the first President of the United States?",
            optionA: "Thomas Jefferson",
            optionB: "Abraham Lincoln",
            optionC: "George Washington",
            optionD: "John Adams",
            correctAnswer: "C" as AnswerOption,
            marks: 1,
          },
          {
            questionText: "The Berlin Wall fell in which year?",
            optionA: "1987",
            optionB: "1989",
            optionC: "1991",
            optionD: "1993",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "Which empire was ruled by Genghis Khan?",
            optionA: "Ottoman Empire",
            optionB: "Mongol Empire",
            optionC: "Roman Empire",
            optionD: "Byzantine Empire",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "The Renaissance is generally said to have begun in which country?",
            optionA: "France",
            optionB: "England",
            optionC: "Italy",
            optionD: "Germany",
            correctAnswer: "C" as AnswerOption,
            marks: 2,
          },
          {
            questionText: "The French Revolution began in which year?",
            optionA: "1776",
            optionB: "1789",
            optionC: "1799",
            optionD: "1804",
            correctAnswer: "B" as AnswerOption,
            marks: 2,
          },
        ],
      },
    ];

    for (const qData of seedQuizzesData) {
      const totalMarks = qData.questions.reduce((sum, q) => sum + q.marks, 0);
      const passingMarks = Math.ceil(totalMarks * 0.6);

      const quiz: QuizRecord = {
        id: qData.id,
        title: qData.title,
        description: qData.description,
        category: qData.category,
        duration: qData.duration,
        totalMarks,
        passingMarks,
        difficulty: qData.difficulty,
        createdAt: new Date("2026-01-03T00:00:00Z"),
        updatedAt: new Date("2026-01-03T00:00:00Z"),
      };
      this.quizzes.set(quiz.id, quiz);

      qData.questions.forEach((q, idx) => {
        const question: QuestionRecord = {
          id: `${qData.id}_q_${idx + 1}`,
          quizId: quiz.id,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
        };
        this.questions.set(question.id, question);
      });
    }
  }
}

// Global persistent instance in dev
const globalStore = globalThis as unknown as { __appStoreInstance?: InMemoryStore };
const store = globalStore.__appStoreInstance ?? new InMemoryStore();
if (process.env.NODE_ENV !== "production") {
  globalStore.__appStoreInstance = store;
}

// Prisma-compatible interface wrapper
export const db = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string }; select?: any }) => {
      let found: UserRecord | undefined;
      if (where.email) {
        found = Array.from(store.users.values()).find(
          (u) => u.email.toLowerCase() === where.email?.toLowerCase(),
        );
      } else if (where.id) {
        found = store.users.get(where.id);
      }
      if (!found) return null;
      return { ...found };
    },
    findMany: async ({
      where,
      orderBy,
      include,
    }: {
      where?: { role?: Role };
      orderBy?: { createdAt?: "asc" | "desc" };
      include?: { results?: { orderBy?: any; select?: any } };
    } = {}) => {
      let list = Array.from(store.users.values());
      if (where?.role) {
        list = list.filter((u) => u.role === where.role);
      }
      if (orderBy?.createdAt) {
        list.sort((a, b) =>
          orderBy.createdAt === "desc"
            ? b.createdAt.getTime() - a.createdAt.getTime()
            : a.createdAt.getTime() - b.createdAt.getTime(),
        );
      }
      return list.map((user) => {
        let resultsList: any[] = [];
        if (include?.results) {
          resultsList = Array.from(store.results.values())
            .filter((r) => r.userId === user.id)
            .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime())
            .map((r) => ({
              id: r.id,
              percentage: r.percentage,
              status: r.status,
              attemptedAt: r.attemptedAt,
            }));
        }
        return {
          ...user,
          ...(include?.results ? { results: resultsList } : {}),
        };
      });
    },
    create: async ({
      data,
    }: {
      data: { name: string; email: string; password: string; role?: Role };
    }) => {
      const user: UserRecord = {
        id: `usr_${uuidv4().slice(0, 8)}`,
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        role: data.role || "STUDENT",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.users.set(user.id, user);
      return { ...user };
    },
    upsert: async ({
      where,
      create,
    }: {
      where: { email: string };
      update: any;
      create: { name: string; email: string; password: string; role: Role };
    }) => {
      const existing = Array.from(store.users.values()).find(
        (u) => u.email.toLowerCase() === where.email.toLowerCase(),
      );
      if (existing) return { ...existing };
      const user: UserRecord = {
        id: `usr_${uuidv4().slice(0, 8)}`,
        name: create.name,
        email: create.email.toLowerCase(),
        password: create.password,
        role: create.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.users.set(user.id, user);
      return { ...user };
    },
    count: async (opts?: { where?: { role?: Role } }) => {
      let list = Array.from(store.users.values());
      if (opts?.where?.role) {
        list = list.filter((u) => u.role === opts.where.role);
      }
      return list.length;
    },
  },

  quiz: {
    findMany: async ({
      where,
      orderBy,
      include,
    }: {
      where?: { category?: string; title?: { contains?: string } };
      orderBy?: { createdAt?: "asc" | "desc" };
      include?: {
        _count?: { select?: { questions?: boolean } };
        results?: {
          where?: { userId?: string };
          orderBy?: { percentage?: "desc" };
          take?: number;
          select?: any;
        };
      };
    } = {}) => {
      let list = Array.from(store.quizzes.values());
      if (where?.category) {
        list = list.filter(
          (q) => q.category.toLowerCase() === where.category?.toLowerCase(),
        );
      }
      if (where?.title?.contains) {
        const q = where.title.contains.toLowerCase();
        list = list.filter((quiz) => quiz.title.toLowerCase().includes(q));
      }
      if (orderBy?.createdAt) {
        list.sort((a, b) =>
          orderBy.createdAt === "desc"
            ? b.createdAt.getTime() - a.createdAt.getTime()
            : a.createdAt.getTime() - b.createdAt.getTime(),
        );
      }
      return list.map((quiz) => {
        const questionsCount = Array.from(store.questions.values()).filter(
          (q) => q.quizId === quiz.id,
        ).length;

        let results: any[] = [];
        if (include?.results) {
          const userId = include.results.where?.userId;
          results = Array.from(store.results.values())
            .filter((r) => r.quizId === quiz.id && (!userId || r.userId === userId))
            .sort((a, b) => b.percentage - a.percentage);
          if (include.results.take) {
            results = results.slice(0, include.results.take);
          }
        }

        return {
          ...quiz,
          _count: { questions: questionsCount },
          results,
        };
      });
    },

    findUnique: async ({
      where,
      include,
    }: {
      where: { id: string };
      include?: { questions?: { orderBy?: any; select?: any } | boolean };
    }) => {
      const quiz = store.quizzes.get(where.id);
      if (!quiz) return null;

      let questions: QuestionRecord[] = [];
      if (include?.questions) {
        questions = Array.from(store.questions.values()).filter(
          (q) => q.quizId === quiz.id,
        );
      }

      return {
        ...quiz,
        questions,
      };
    },

    create: async ({
      data,
      include,
    }: {
      data: {
        title: string;
        description: string;
        category: string;
        duration: number;
        passingMarks: number;
        difficulty: Difficulty;
        totalMarks: number;
        questions?: {
          create: Array<{
            questionText: string;
            optionA: string;
            optionB: string;
            optionC: string;
            optionD: string;
            correctAnswer: AnswerOption;
            marks: number;
          }>;
        };
      };
      include?: { _count?: { select?: { questions?: boolean } } };
    }) => {
      const quizId = `quiz_${uuidv4().slice(0, 8)}`;
      const quiz: QuizRecord = {
        id: quizId,
        title: data.title,
        description: data.description,
        category: data.category,
        duration: data.duration,
        totalMarks: data.totalMarks,
        passingMarks: data.passingMarks,
        difficulty: data.difficulty,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.quizzes.set(quizId, quiz);

      let questionCount = 0;
      if (data.questions?.create) {
        data.questions.create.forEach((q, idx) => {
          const qId = `${quizId}_q_${idx + 1}`;
          const question: QuestionRecord = {
            id: qId,
            quizId,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctAnswer: q.correctAnswer,
            marks: q.marks,
          };
          store.questions.set(qId, question);
          questionCount++;
        });
      }

      return {
        ...quiz,
        _count: { questions: questionCount },
      };
    },

    delete: async ({ where }: { where: { id: string } }) => {
      const quiz = store.quizzes.get(where.id);
      store.quizzes.delete(where.id);
      // Cascade delete questions and results
      Array.from(store.questions.entries()).forEach(([id, q]) => {
        if (q.quizId === where.id) store.questions.delete(id);
      });
      Array.from(store.results.entries()).forEach(([id, r]) => {
        if (r.quizId === where.id) {
          store.results.delete(id);
          Array.from(store.answers.entries()).forEach(([ansId, a]) => {
            if (a.resultId === id) store.answers.delete(ansId);
          });
        }
      });
      return quiz;
    },

    deleteMany: async (_?: any) => {
      store.quizzes.clear();
      store.questions.clear();
      return { count: 0 };
    },

    count: async () => {
      return store.quizzes.size;
    },
  },

  result: {
    findMany: async ({
      where,
      orderBy,
      take,
      include,
    }: {
      where?: { userId?: string };
      orderBy?: { attemptedAt?: "asc" | "desc" };
      take?: number;
      include?: {
        user?: { select?: { name?: boolean; email?: boolean } };
        quiz?: { select?: { title?: boolean; category?: boolean; totalMarks?: boolean } };
      };
    } = {}) => {
      let list = Array.from(store.results.values());
      if (where?.userId) {
        list = list.filter((r) => r.userId === where.userId);
      }
      if (orderBy?.attemptedAt) {
        list.sort((a, b) =>
          orderBy.attemptedAt === "desc"
            ? b.attemptedAt.getTime() - a.attemptedAt.getTime()
            : a.attemptedAt.getTime() - b.attemptedAt.getTime(),
        );
      }
      if (take) {
        list = list.slice(0, take);
      }

      return list.map((res) => {
        const user = store.users.get(res.userId);
        const quiz = store.quizzes.get(res.quizId);
        return {
          ...res,
          user: user ? { name: user.name, email: user.email } : { name: "Unknown", email: "" },
          quiz: quiz
            ? { id: quiz.id, title: quiz.title, category: quiz.category, totalMarks: quiz.totalMarks }
            : { id: res.quizId, title: "Quiz", category: "General", totalMarks: res.totalMarks },
        };
      });
    },

    findFirst: async ({
      where,
      orderBy,
      select,
    }: {
      where: { quizId: string; userId: string };
      orderBy?: { percentage?: "desc" };
      select?: any;
    }) => {
      let list = Array.from(store.results.values()).filter(
        (r) => r.quizId === where.quizId && r.userId === where.userId,
      );
      if (orderBy?.percentage === "desc") {
        list.sort((a, b) => b.percentage - a.percentage);
      }
      const first = list[0];
      if (!first) return null;
      return {
        id: first.id,
        percentage: first.percentage,
        status: first.status,
        attemptedAt: first.attemptedAt,
      };
    },

    findUnique: async ({
      where,
      include,
    }: {
      where: { id: string };
      include?: {
        quiz?: boolean;
        answers?: {
          include?: {
            question?: {
              select?: any;
            };
          };
        };
      };
    }) => {
      const res = store.results.get(where.id);
      if (!res) return null;

      const quiz = store.quizzes.get(res.quizId);
      const answers = Array.from(store.answers.values())
        .filter((a) => a.resultId === res.id)
        .map((a) => {
          const q = store.questions.get(a.questionId);
          return {
            ...a,
            question: q
              ? {
                  id: q.id,
                  questionText: q.questionText,
                  optionA: q.optionA,
                  optionB: q.optionB,
                  optionC: q.optionC,
                  optionD: q.optionD,
                  correctAnswer: q.correctAnswer,
                  marks: q.marks,
                }
              : {
                  id: a.questionId,
                  questionText: "",
                  optionA: "",
                  optionB: "",
                  optionC: "",
                  optionD: "",
                  correctAnswer: "A" as AnswerOption,
                  marks: 1,
                },
          };
        });

      return {
        ...res,
        quiz: quiz ?? {
          id: res.quizId,
          title: "Exam",
          category: "General",
          duration: 15,
          passingMarks: Math.ceil(res.totalMarks * 0.6),
        },
        answers,
      };
    },

    create: async ({
      data,
      select,
    }: {
      data: {
        userId: string;
        quizId: string;
        score: number;
        totalMarks: number;
        percentage: number;
        status: Status;
        timeSpent: number;
        answers?: {
          create: Array<{
            questionId: string;
            selectedAnswer: AnswerOption | null;
            isCorrect: boolean;
          }>;
        };
      };
      select?: { id?: boolean };
    }) => {
      const resultId = `res_${uuidv4().slice(0, 8)}`;
      const resultRecord: ResultRecord = {
        id: resultId,
        userId: data.userId,
        quizId: data.quizId,
        score: data.score,
        totalMarks: data.totalMarks,
        percentage: data.percentage,
        status: data.status,
        timeSpent: data.timeSpent,
        attemptedAt: new Date(),
      };
      store.results.set(resultId, resultRecord);

      if (data.answers?.create) {
        data.answers.create.forEach((ans, idx) => {
          const ansId = `ans_${uuidv4().slice(0, 8)}_${idx}`;
          const answerRecord: AnswerRecord = {
            id: ansId,
            resultId,
            questionId: ans.questionId,
            selectedAnswer: ans.selectedAnswer,
            isCorrect: ans.isCorrect,
          };
          store.answers.set(ansId, answerRecord);
        });
      }

      return { id: resultId };
    },
  },

  $disconnect: async () => {},
};

export default db;
