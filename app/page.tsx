"use client";

import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import { questions } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, BookOpen, Atom, Calculator, FlaskConical, Trophy, RotateCcw } from "lucide-react"; // 新增 Trophy 图标

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // ✨ 新增状态：是否完成了所有题目？
  const [isCompleted, setIsCompleted] = useState(false);

  // 过滤出当前科目的题目
  const filteredQuestions = questions.filter(
    (q) => selectedSubject === null || q.subject === selectedSubject
  );

  const currentQuestion = filteredQuestions[currentIndex];

  // 👇 修改后的翻页逻辑
  const handleNext = () => {
    // 如果是最后一题，就判定为“通关”
    if (currentIndex === filteredQuestions.length - 1) {
      setIsCompleted(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goBackToLobby = () => {
    setSelectedSubject(null);
    setCurrentIndex(0);
    setIsCompleted(false); // 记得重置通关状态
  };

  // 🟢 场景一：科目大厅 (Lobby)
  if (!selectedSubject) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              AI 共通测试助手
            </h1>
            <p className="text-slate-500">请选择你要攻克的科目</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button className="h-20 text-xl flex items-center justify-start px-6 bg-blue-600 hover:bg-blue-700 transition-all" onClick={() => setSelectedSubject("物理")}>
              <Atom className="w-8 h-8 mr-4" /> 物理 (Physics)
            </Button>
            <Button className="h-20 text-xl flex items-center justify-start px-6 bg-indigo-600 hover:bg-indigo-700 transition-all" onClick={() => setSelectedSubject("数学")}>
              <Calculator className="w-8 h-8 mr-4" /> 数学 (Math)
            </Button>
            <Button className="h-20 text-xl flex items-center justify-start px-6 bg-emerald-600 hover:bg-emerald-700 transition-all" onClick={() => setSelectedSubject("化学")}>
              <FlaskConical className="w-8 h-8 mr-4" /> 化学 (Chemistry)
            </Button>
          </div>
          <p className="text-xs text-slate-400 pt-8">Powered by DeepSeek V3 AI</p>
        </div>
      </main>
    );
  }

  // 🟢 场景二：通关结算画面 (Result Screen)
  if (isCompleted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600">
            <Trophy className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">恭喜完成！</h2>
            <p className="text-slate-500">
              你已经做完了本组所有 <span className="font-bold text-slate-900">{selectedSubject}</span> 题目。
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Button className="w-full py-6 text-lg" onClick={goBackToLobby}>
              返回科目大厅
            </Button>
            <Button variant="ghost" className="w-full text-slate-400" onClick={() => { setIsCompleted(false); setCurrentIndex(0); }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新再刷一遍
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 🟢 场景三：刷题界面 (Quiz Mode)
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={goBackToLobby} className="text-slate-500">← 返回大厅</Button>
          <span className="font-bold text-slate-900 text-lg">{selectedSubject}专场</span>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-500 px-2">
          <span>进度: {currentIndex + 1} / {filteredQuestions.length}</span>
          <span className="bg-slate-200 px-2 py-1 rounded text-xs">{currentQuestion?.year}年真题</span>
        </div>

        {currentQuestion ? (
          <QuestionCard key={currentQuestion.id} question={currentQuestion} />
        ) : (
          <div className="text-center py-20 text-slate-400">该科目暂时没有题目哦</div>
        )}

        <div className="flex justify-between gap-4 pb-12">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="w-1/3">
            <ChevronLeft className="w-4 h-4 mr-2" /> 上一题
          </Button>

          {/* 👇 按钮逻辑变了：如果是最后一题，显示“完成打卡” */}
          <Button onClick={handleNext} className="w-1/3">
            {currentIndex === filteredQuestions.length - 1 ? (
              <>完成打卡 <Trophy className="w-4 h-4 ml-2" /></>
            ) : (
              <>下一题 <ChevronRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}