// app/page.tsx
import { sampleQuestions } from "@/lib/data";
import QuestionCard from "@/components/QuestionCard";

export default function Home() {
  // 我们从假数据里取第一道题来测试
  const currentQuestion = sampleQuestions[0];

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          日本共通测试 AI 助手
        </h1>
        <p className="text-slate-600">
          物理 · 化学 · 生物深度学习系统
        </p>
      </div>

      {/* 这里就是刚才做好的那个组件！ */}
      <QuestionCard question={currentQuestion} />
      
    </main>
  );
}