"use client";

import { useState } from "react";
import { Question } from "@/types/question";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// 👇 引入美颜插件
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface Props {
  question: Question;
  // 👇👇👇 1. 这里就是我们要加的汇报接口 👇👇👇
  onResult?: (isCorrect: boolean) => void;
}

export default function QuestionCard({ question, onResult }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);

  const handleConfirm = async () => {
    if (selectedOption === null) return;

    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // 👇👇👇 2. 这里就是汇报逻辑：立刻告诉主页面 👇👇👇
    if (onResult) {
      onResult(correct);
    }
    // 👆👆👆 新增结束

    // 如果做错了，呼叫 AI 老师
    if (!correct) {
      setIsThinking(true);
      setAiExplanation("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            userMessage: `
              我是一名日本高中生，正在备考共通测试。
              
              【题目】：
              ${question.questionText}
              
              【所有选项】：
              ${question.options.map((opt, i) => `${i+1}. ${opt}`).join('; ')}
              
              【我的情况】：
              正确答案是第 ${question.correctAnswer + 1} 个。
              但我错选了第 ${selectedOption + 1} 个（也就是：${question.options[selectedOption]}）。
              
              请用老师的语气：
              1. 指出我选的这个公式（${question.options[selectedOption]}）错在哪里（比如是不是符号反了？）。
              2. 解释为什么正确答案是 ${question.options[question.correctAnswer]}。
              
              (请用中文回答。⚠️重要：所有公式必须严格使用单个 $ 符号包裹（例如 $E=mc^2$），严禁使用 \[ 或 \] 或 \( \) 等其他格式！)
            `,
          }),
        });

        const data = await response.json();
        if (data.reply) {
          // 🔧 强制修复：如果 AI 还是用了 \[ \]，我们把它手动变成 $$
          let cleanReply = data.reply
            .replace(/\\\[/g, '$$$') 
            .replace(/\\\]/g, '$$$') 
            .replace(/\\\(/g, '$')   
            .replace(/\\\)/g, '$');  
          setAiExplanation(cleanReply);
        }
      } catch (error) {
        console.error("AI 没反应:", error);
        setAiExplanation("AI 老师好像睡着了，请稍后再试。");
      } finally {
        setIsThinking(false);
      }
    }
  };

  const reset = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowResult(false);
    setAiExplanation("");
    setIsThinking(false);
  };

  return (
    <Card className="w-full bg-white shadow-lg border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>{question.year}年 {question.subject}</span>
          <span>ID: {question.id}</span>
        </div>
        <CardTitle className="text-xl text-slate-900 leading-relaxed">
          {question.questionText.split("$").map((part, index) => 
            index % 2 === 1 ? <InlineMath key={index} math={part} /> : part
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              onClick={() => !showResult && setSelectedOption(index)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center
                ${showResult && index === question.correctAnswer 
                  ? "border-green-500 bg-green-50 text-green-700" 
                  : showResult && selectedOption === index && index !== question.correctAnswer
                  ? "border-red-500 bg-red-50 text-red-700" 
                  : selectedOption === index 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-slate-100 hover:border-slate-200 hover:bg-slate-50" 
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-sm
                ${showResult && index === question.correctAnswer 
                  ? "bg-green-500 text-white" 
                  : showResult && selectedOption === index && !isCorrect
                  ? "bg-red-500 text-white"
                  : "bg-slate-200 text-slate-600"
                }
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <div className="text-lg">
                <InlineMath math={option.replace(/\$/g, '')} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {!showResult ? (
            <Button 
              className="w-full text-lg py-6 bg-slate-900 hover:bg-slate-800"
              onClick={handleConfirm}
              disabled={selectedOption === null}
            >
              确认答案
            </Button>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {!isCorrect && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-slate-700">
                  <h3 className="font-bold flex items-center gap-2 mb-4 text-yellow-800 border-b border-yellow-200 pb-2">
                    🤖 AI 老师的分析
                    {isThinking && <span className="animate-pulse"> (正在思考中...)</span>}
                  </h3>
                  
                  {isThinking ? (
                    <div className="space-y-2">
                      <div className="h-4 bg-yellow-200/50 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-yellow-200/50 rounded w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-yellow-200/50 rounded w-full animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none text-sm leading-7">
                      <ReactMarkdown 
                        remarkPlugins={[remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                      >
                        {aiExplanation}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              )}

              {isCorrect && (
                 <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                   <p className="font-bold">🎉 回答正确！太棒了！</p>
                 </div>
              )}

              <Button 
                className="w-full text-lg py-6" 
                variant="outline" 
                onClick={reset}
              >
                重做本题
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}