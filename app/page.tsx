"use client";

import { useState, useEffect } from "react"; // 👈 1. 引入 useEffect
import QuestionCard from "@/components/QuestionCard";
import { questions } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Atom, Calculator, FlaskConical, Trophy, RotateCcw, AlertCircle, BookOpenCheck } from "lucide-react";

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakeIds, setMistakeIds] = useState<string[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  
  // ✨✨✨ 2. 新增：页面加载时，从硬盘“读档” ✨✨✨
  useEffect(() => {
    // 只有在浏览器端才执行
    const savedMistakes = localStorage.getItem("my-mistakes");
    if (savedMistakes) {
      try {
        setMistakeIds(JSON.parse(savedMistakes));
        console.log("📂 成功读取存档，错题数:", JSON.parse(savedMistakes).length);
      } catch (e) {
        console.error("存档读取失败", e);
      }
    }
  }, []); // 空数组 [] 代表只在网页刚打开时执行一次

  // ✨✨✨ 3. 新增：每当错题变化时，自动“存档” ✨✨✨
  useEffect(() => {
    // 把数组转换成字符串存进去
    localStorage.setItem("my-mistakes", JSON.stringify(mistakeIds));
    console.log("💾 自动存档完成");
  }, [mistakeIds]); // 监听 mistakeIds，一变就存

  const filteredQuestions = isReviewMode
    ? questions.filter((q) => mistakeIds.includes(q.id))
    : questions.filter((q) => selectedSubject === null || q.subject === selectedSubject);

  const currentQuestion = filteredQuestions[currentIndex];

  const handleQuestionResult = (isCorrect: boolean) => {
    if (!isCorrect && !isReviewMode) {
      console.log("记录错题:", currentQuestion.id);
      setMistakeIds(prev => {
        //以此确保最新的状态会被存入
        const newMistakes = Array.from(new Set([...prev, currentQuestion.id]));
        return newMistakes;
      });
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

  const startReview = () => {
    setIsReviewMode(true);
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const goBackToLobby = () => {
    setSelectedSubject(null);
    setCurrentIndex(0);
    setIsCompleted(false);
    setIsReviewMode(false);
    // ⚠️ 注意：回到大厅时，我们不再清空错题本了！
    // setMistakeIds([]);  <-- 这行删掉了，为了保留记忆
  };

  // ✨ 强力重置：连硬盘里的数据一起删掉
  const fullReset = () => {
    setIsCompleted(false);
    setCurrentIndex(0);
    setMistakeIds([]);
    setIsReviewMode(false);
    localStorage.removeItem("my-mistakes"); // 🗑️ 彻底清空硬盘
  };

  // 场景一：科目大厅
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
          
          {/* 在大厅也能看到有多少错题待复习 */}
          {mistakeIds.length > 0 && (
             <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200 text-orange-800 animate-in fade-in slide-in-from-bottom-4">
               <p className="font-bold flex items-center justify-center gap-2">
                 <AlertCircle className="w-5 h-5"/>
                 你还有 {mistakeIds.length} 道错题未攻克
               </p>
               <Button variant="link" className="text-orange-600 underline mt-1" onClick={() => {setSelectedSubject("物理"); startReview();}}>
                 直接开始复习 &rarr;
               </Button>
             </div>
          )}
        </div>
      </main>
    );
  }

  // 场景二：结算画面
  if (isCompleted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
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
                ? "保持这个节奏，继续加油！"
                : (mistakeIds.length === 0 
                    ? "完美的表现！" 
                    : <span className="text-red-500 font-bold">本次发现 {mistakeIds.length} 个盲区</span>
                  )
              }
            </p>
          </div>

          <div className="pt-4 space-y-3">
            {!isReviewMode && mistakeIds.length > 0 && (
              <Button className="w-full py-6 text-lg bg-orange-600 hover:bg-orange-700" onClick={startReview}>
                <BookOpenCheck className="w-5 h-5 mr-2" />
                立即攻克错题 ({mistakeIds.length})
              </Button>
            )}

            <Button variant="outline" className="w-full py-6 text-lg" onClick={goBackToLobby}>
              返回科目大厅
            </Button>
            
            {/* 这个按钮现在会清空硬盘数据 */}
            <Button variant="ghost" className="w-full text-slate-400" onClick={fullReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              清空所有记录
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 场景三：刷题界面
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={goBackToLobby} className="text-slate-500">← 返回大厅</Button>
          <span className="font-bold text-slate-900 text-lg">
            {isReviewMode ? "🎯 错题特训" : `${selectedSubject}专场`}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-slate-500 px-2">
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
            {isReviewMode ? "恭喜！本轮复习完毕！" : "加载中..."}
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