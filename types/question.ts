// types/question.ts

// ⚠️ 注意：这行 export 非常重要，没有它就会报你刚才那个错！
export interface Question {
  id: string;
  subject: string;
  year: number;
  questionText: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}