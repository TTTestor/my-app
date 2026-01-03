// types/question.ts
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