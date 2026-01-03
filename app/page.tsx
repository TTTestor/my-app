"use client";

import { useState } from "react";
import QuestionCard from "@/components/QuestionCard";
import { questions } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Atom, Calculator, FlaskConical, Trophy, RotateCcw, AlertCircle, BookOpenCheck } from "lucide-react";

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  
  // ✨ 新增开关：是否处于“错题复习模式”
  const [isReviewMode, setIsReviewMode] = useState(false);

  // 🧠 核心过滤逻辑：如果是复习模式，只筛选出错题；否则筛选科目
  const filteredQuestions = isReviewMode
    ? questions.filter((q) => mistakeIds.includes(q.id))
    : questions.filter((q) => selectedSubject === null || q.subject === selectedSubject);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleQuestionResult = (isCorrect: boolean) => {
    // 注意：复习模式下做错了，我们就不重复记录了（或者你可以选择继续记录）
    if (!isCorrect && !isReviewMode) {
      console.log("记录错题:", currentQuestion.id);
      setMistakeIds(prev => Array.from(new Set([...prev, currentQuestion.id])));
    }
  };

  const handleNext = () => {
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

  // 开始复习错题
  const startReview = () => {
    setIsReviewMode(true);  // 打开复习模式开关
    setCurrentIndex(0);     // 重置到第一题
    setIsCompleted(false);  // 退出结算画面
  };

  const goBackToLobby = () => {
    setSelectedSubject(null);
    setCurrentIndex(0);
    setIsCompleted(false);
    setMistakeIds([]); 
    setIsReviewMode(false); // 记得关掉复习模式
  };

  // 🟢 场景一：科目大厅
  if (!selectedSubject) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">AI 共通测试助手</h1>
          <div className="grid grid-cols-1 gap-4">
            <Button className="h-20 text-xl flex items-center justify-start px-6 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSelectedSubject("物理")}>
              <Atom className="w-8 h-8 mr-4" /> 物理
            </Button>
            <Button className="h-20 text-xl flex items-center justify-start px-6 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setSelectedSubject("数学")}>
              <Calculator className="w-8 h-8 mr-4" /> 数学
            </Button>
            <Button className="h-20 text-xl flex items-center justify-start px-6 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setSelectedSubject("化学")}>
              <FlaskConical className="w-8 h-8 mr-4" /> 化学
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 🟢 场景二：结算画面
  if (isCompleted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
          {/* 如果是复习模式通关了，显示特殊的庆祝 */}
          {isReviewMode ? (
             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
               <BookOpenCheck className="w-10 h-10" />
             </div>
          ) : mistakeIds.length === 0 ? (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <Trophy className="w-10 h-10" />
            </div>
          ) : (
             <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
              <AlertCircle className="w-10 h-10" />
            </div>
          )}
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              {isReviewMode ? "复习完成！" : (mistakeIds.length === 0 ? "全对！太强了！" : "练习完成")}
            </h2>
            <p className="text-slate-500">
              {isReviewMode 
                ? "你已经把错题都重做了一遍，是不是感觉清晰多了？"
                : (mistakeIds.length === 0 
                    ? "你完美的击败了所有题目！" 
                    : <span className="text-red-500 font-bold">本次共发现 {mistakeIds.length} 个知识盲区。</span>
                  )
              }
            </p>
          </div>

          <div className="pt-4 space-y-3">
            {/* ✨ 核心功能：如果有错题，且不是在复习模式，显示“攻克错题”按钮 */}
            {!isReviewMode && mistakeIds.length > 0 && (
              <Button 
                className="w-full py-6 text-lg bg-orange-600 hover:bg-orange-700" 
                onClick={startReview}
              >
                <BookOpenCheck className="w-5 h-5 mr-2" />
                立即攻克错题 ({mistakeIds.length})
              </Button>
            )}

            <Button variant="outline" className="w-full py-6 text-lg" onClick={goBackToLobby}>
              返回科目大厅
            </Button>
            
            <Button variant="ghost" className="w-full text-slate-400" onClick={() => { setIsCompleted(false); setCurrentIndex(0); setMistakeIds([]); setIsReviewMode(false); }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重置所有进度
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 🟢 场景三：刷题界面
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={goBackToLobby} className="text-slate-500">← 放弃</Button>
          <span className="font-bold text-slate-900 text-lg">
            {isReviewMode ? "🎯 错题特训" : `${selectedSubject}专场`}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-500 px-2">
          {/* 显示当前的进度 */}
          <span>进度: {currentIndex + 1} / {filteredQuestions.length}</span>
          
          <div className="flex gap-4">
             {mistakeIds.length > 0 && (
               <span className="text-red-500 font-bold flex items-center">
                 <AlertCircle className="w-4 h-4 mr-1"/> 
                 {isReviewMode ? "剩余错题" : "累计错题"}: {mistakeIds.length}
               </span>
             )}
          </div>
        </div>

        {currentQuestion ? (
          <QuestionCard 
            key={currentQuestion.id} 
            question={currentQuestion}
            onResult={handleQuestionResult}
          />
        ) : (
          <div className="text-center py-20 text-slate-400">
            {isReviewMode ? "恭喜！错题已全部清空！" : "加载中..."}
          </div>
        )}

        <div className="flex justify-between gap-4 pb-12">
          <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0} className="w-1/3">
            <ChevronLeft className="w-4 h-4 mr-2" /> 上一题
          </Button>

          <Button onClick={handleNext} className="w-1/3">
            {currentIndex === filteredQuestions.length - 1 ? "查看结果" : "下一题"} 
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </main>
  );
}