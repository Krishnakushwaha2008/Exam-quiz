import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

type Q = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  marks: number;
};

type SeedQuiz = {
  title: string;
  description: string;
  category: string;
  duration: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questions: Q[];
};

const seedQuizzes: SeedQuiz[] = [
  {
    title: "General Knowledge Essentials",
    description:
      "A foundational general knowledge quiz covering world geography, history, and culture. Ideal for warming up your reasoning skills before tackling tougher subjects.",
    category: "General Knowledge",
    duration: 10,
    difficulty: "EASY",
    questions: [
      {
        questionText: "What is the capital city of Australia?",
        optionA: "Sydney",
        optionB: "Melbourne",
        optionC: "Canberra",
        optionD: "Perth",
        correctAnswer: "C",
        marks: 1,
      },
      {
        questionText: "Which ocean is the largest by surface area?",
        optionA: "Atlantic Ocean",
        optionB: "Indian Ocean",
        optionC: "Arctic Ocean",
        optionD: "Pacific Ocean",
        correctAnswer: "D",
        marks: 1,
      },
      {
        questionText: "Who painted the Mona Lisa?",
        optionA: "Vincent van Gogh",
        optionB: "Leonardo da Vinci",
        optionC: "Pablo Picasso",
        optionD: "Michelangelo",
        correctAnswer: "B",
        marks: 1,
      },
      {
        questionText: "In which year did World War II end?",
        optionA: "1943",
        optionB: "1945",
        optionC: "1947",
        optionD: "1950",
        correctAnswer: "B",
        marks: 1,
      },
      {
        questionText: "Which country is known as the Land of the Rising Sun?",
        optionA: "China",
        optionB: "Thailand",
        optionC: "Japan",
        optionD: "South Korea",
        correctAnswer: "C",
        marks: 1,
      },
      {
        questionText: "The Great Pyramid of Giza is located in which country?",
        optionA: "Egypt",
        optionB: "Mexico",
        optionC: "Sudan",
        optionD: "Iraq",
        correctAnswer: "A",
        marks: 1,
      },
    ],
  },
  {
    title: "Foundations of General Science",
    description:
      "Test your understanding of core scientific concepts across physics, chemistry, and biology. This quiz is calibrated for high-school to early-college level.",
    category: "Science",
    duration: 15,
    difficulty: "MEDIUM",
    questions: [
      {
        questionText: "What is the chemical symbol for gold?",
        optionA: "Go",
        optionB: "Gd",
        optionC: "Au",
        optionD: "Ag",
        correctAnswer: "C",
        marks: 1,
      },
      {
        questionText: "Which gas do plants primarily absorb during photosynthesis?",
        optionA: "Oxygen",
        optionB: "Nitrogen",
        optionC: "Carbon dioxide",
        optionD: "Hydrogen",
        correctAnswer: "C",
        marks: 1,
      },
      {
        questionText: "What is the SI unit of electric current?",
        optionA: "Volt",
        optionB: "Ampere",
        optionC: "Watt",
        optionD: "Ohm",
        correctAnswer: "B",
        marks: 2,
      },
      {
        questionText: "How many chromosomes does a typical human cell contain?",
        optionA: "23",
        optionB: "44",
        optionC: "46",
        optionD: "48",
        correctAnswer: "C",
        marks: 2,
      },
      {
        questionText: "Which planet is known as the 'Red Planet'?",
        optionA: "Venus",
        optionB: "Mars",
        optionC: "Jupiter",
        optionD: "Saturn",
        correctAnswer: "B",
        marks: 1,
      },
      {
        questionText: "The speed of light in a vacuum is approximately:",
        optionA: "3 × 10⁵ km/s",
        optionB: "3 × 10⁸ m/s",
        optionC: "3 × 10⁶ m/s",
        optionD: "3 × 10⁴ m/s",
        correctAnswer: "B",
        marks: 2,
      },
      {
        questionText: "Which part of the cell contains genetic material?",
        optionA: "Mitochondria",
        optionB: "Cytoplasm",
        optionC: "Nucleus",
        optionD: "Ribosome",
        correctAnswer: "C",
        marks: 1,
      },
    ],
  },
  {
    title: "Programming Fundamentals",
    description:
      "A practical quiz on programming concepts — variables, control flow, data structures, and algorithms. Suitable for bootcamp students and self-taught developers revisiting the basics.",
    category: "Programming",
    duration: 20,
    difficulty: "HARD",
    questions: [
      {
        questionText:
          "What is the time complexity of binary search on a sorted array?",
        optionA: "O(1)",
        optionB: "O(log n)",
        optionC: "O(n)",
        optionD: "O(n²)",
        correctAnswer: "B",
        marks: 2,
      },
      {
        questionText: "Which data structure uses LIFO (Last In, First Out) order?",
        optionA: "Queue",
        optionB: "Stack",
        optionC: "Linked List",
        optionD: "Binary Tree",
        correctAnswer: "B",
        marks: 1,
      },
      {
        questionText: "In object-oriented programming, what does 'encapsulation' describe?",
        optionA: "Inheritance between classes",
        optionB: "Bundling data and the methods that act on it",
        optionC: "Runtime method resolution",
        optionD: "Converting one type to another",
        correctAnswer: "B",
        marks: 2,
      },
      {
        questionText: "Which of these is NOT a primitive data type in JavaScript?",
        optionA: "string",
        optionB: "number",
        optionC: "object",
        optionD: "boolean",
        correctAnswer: "C",
        marks: 1,
      },
      {
        questionText:
          "What does the acronym 'API' stand for in software development?",
        optionA: "Application Programming Interface",
        optionB: "Advanced Protocol Integration",
        optionC: "Automated Procedure Interface",
        optionD: "Application Process Identifier",
        correctAnswer: "A",
        marks: 1,
      },
      {
        questionText:
          "In a relational database, which clause is used to combine rows from two tables?",
        optionA: "GROUP BY",
        optionB: "WHERE",
        optionC: "JOIN",
        optionD: "ORDER BY",
        correctAnswer: "C",
        marks: 2,
      },
      {
        questionText: "What is the output of `typeof null` in JavaScript?",
        optionA: "'null'",
        optionB: "'undefined'",
        optionC: "'object'",
        optionD: "'number'",
        correctAnswer: "C",
        marks: 3,
      },
      {
        questionText: "Which sorting algorithm has an average time complexity of O(n log n)?",
        optionA: "Bubble Sort",
        optionB: "Insertion Sort",
        optionC: "Merge Sort",
        optionD: "Selection Sort",
        correctAnswer: "C",
        marks: 2,
      },
    ],
  },
  {
    title: "Mathematics: Algebra & Logic",
    description:
      "Sharpen your algebra and logical reasoning. This quiz rewards careful reading — several questions combine multiple concepts. Calculators are not required.",
    category: "Mathematics",
    duration: 15,
    difficulty: "MEDIUM",
    questions: [
      {
        questionText: "Solve for x: 2x + 6 = 20",
        optionA: "6",
        optionB: "7",
        optionC: "8",
        optionD: "9",
        correctAnswer: "B",
        marks: 1,
      },
      {
        questionText: "What is the value of 5! (5 factorial)?",
        optionA: "20",
        optionB: "60",
        optionC: "120",
        optionD: "720",
        correctAnswer: "C",
        marks: 2,
      },
      {
        questionText: "If a triangle has angles 90° and 35°, what is the third angle?",
        optionA: "45°",
        optionB: "55°",
        optionC: "65°",
        optionD: "75°",
        correctAnswer: "B",
        marks: 2,
      },
      {
        questionText: "What is the derivative of f(x) = x³?",
        optionA: "x²",
        optionB: "2x²",
        optionC: "3x²",
        optionD: "3x",
        correctAnswer: "C",
        marks: 3,
      },
      {
        questionText: "Simplify: (2³) × (2²)",
        optionA: "2⁵",
        optionB: "2⁶",
        optionC: "4⁵",
        optionD: "8",
        correctAnswer: "A",
        marks: 2,
      },
      {
        questionText: "What is the next number in the sequence 2, 6, 12, 20, 30, ?",
        optionA: "40",
        optionB: "42",
        optionC: "44",
        optionD: "46",
        correctAnswer: "B",
        marks: 3,
      },
    ],
  },
  {
    title: "World History Highlights",
    description:
      "Travel through pivotal moments in human history — from ancient civilisations to the modern era. A broad quiz for history enthusiasts and curious learners.",
    category: "History",
    duration: 12,
    difficulty: "MEDIUM",
    questions: [
      {
        questionText: "The ancient city of Rome was built on how many hills?",
        optionA: "Five",
        optionB: "Six",
        optionC: "Seven",
        optionD: "Eight",
        correctAnswer: "C",
        marks: 1,
      },
      {
        questionText: "Who was the first President of the United States?",
        optionA: "Thomas Jefferson",
        optionB: "Abraham Lincoln",
        optionC: "George Washington",
        optionD: "John Adams",
        correctAnswer: "C",
        marks: 1,
      },
      {
        questionText: "The Berlin Wall fell in which year?",
        optionA: "1987",
        optionB: "1989",
        optionC: "1991",
        optionD: "1993",
        correctAnswer: "B",
        marks: 2,
      },
      {
        questionText: "Which empire was ruled by Genghis Khan?",
        optionA: "Ottoman Empire",
        optionB: "Mongol Empire",
        optionC: "Roman Empire",
        optionD: "Byzantine Empire",
        correctAnswer: "B",
        marks: 2,
      },
      {
        questionText: "The Renaissance is generally said to have begun in which country?",
        optionA: "France",
        optionB: "England",
        optionC: "Italy",
        optionD: "Germany",
        correctAnswer: "C",
        marks: 2,
      },
      {
        questionText: "The French Revolution began in which year?",
        optionA: "1776",
        optionB: "1789",
        optionC: "1799",
        optionD: "1804",
        correctAnswer: "B",
        marks: 2,
      },
    ],
  },
];

async function main() {
  // 1. Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await db.user.upsert({
    where: { email: "admin@oqs.dev" },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@oqs.dev",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // 2. Demo student
  const studentPassword = await bcrypt.hash("student123", 10);
  const student = await db.user.upsert({
    where: { email: "student@oqs.dev" },
    update: {},
    create: {
      name: "Jamie Student",
      email: "student@oqs.dev",
      password: studentPassword,
      role: "STUDENT",
    },
  });

  // 3. Quizzes — wipe & recreate to keep seed idempotent
  await db.quiz.deleteMany({});
  for (const seed of seedQuizzes) {
    const totalMarks = seed.questions.reduce((acc, q) => acc + q.marks, 0);
    const passingMarks = Math.ceil(totalMarks * 0.6);
    await db.quiz.create({
      data: {
        title: seed.title,
        description: seed.description,
        category: seed.category,
        duration: seed.duration,
        difficulty: seed.difficulty,
        totalMarks,
        passingMarks,
        questions: {
          create: seed.questions,
        },
      },
    });
  }

  console.log("✅ Seed complete");
  console.log(`   Admin:    ${admin.email}  (password: admin123)`);
  console.log(`   Student:  ${student.email}  (password: student123)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
