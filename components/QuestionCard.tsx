// components/QuestionCard.tsx
"use client";

import { useState } from "react";
import { Question } from "@/types/question";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  question: Question;
}

export default function QuestionCard({ question }: Props) {
  // 记录用户选了哪个 (null 代表还没选)
  const [selected, setSelected] = useState<number | null>(null);
  // 是否已经提交查看结果
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (!showResult) {
      setSelected(index);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-8 shadow-lg">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>{question.year}年 {question.subject}</span>
          <span>ID: {question.id}</span>
        </div>
        <CardTitle className="text-xl leading-relaxed">
           {/* 这里简单处理，实际可以将文本按$分割来渲染，目前先假设题目是纯文本+公式 */}
           {question.questionText.split('$').map((part, index) => {
              // 简单的逻辑：偶数索引是普通文字，奇数索引是公式
              // 注意：这只是简易处理，复杂文本建议用专门的Markdown渲染库
              if (index % 2 === 1) return <InlineMath key={index} math={part} />;
              return <span key={index}>{part}</span>;
           })}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-all flex items-center
                ${selected === index ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "hover:bg-slate-50"}
                ${showResult && index === question.correctAnswer ? "bg-green-100 border-green-500" : ""}
                ${showResult && selected === index && index !== question.correctAnswer ? "bg-red-100 border-red-500" : ""}
              `}
            >
              {/* 选项标号 A, B, C, D */}
              <span className="font-bold mr-4 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              {/* 选项内容 (支持公式) */}
              <div className="text-lg">
                 <InlineMath math={option.replace(/\$/g, "")} />
              </div>
            </div>
          ))}
        </div>

        {/* 提交按钮 */}
        {!showResult && (
          <Button 
            className="w-full mt-6 text-lg py-6" 
            disabled={selected === null}
            onClick={() => setShowResult(true)}
          >
            确认答案
          </Button>
        )}

        {/* 解析区域 (点击提交后显示) */}
        {showResult && (
          <div className="mt-8 p-6 bg-slate-50 rounded-lg border animate-in fade-in slide-in-from-bottom-4">
            <h3 className="font-bold text-lg mb-3 flex items-center">
              {selected === question.correctAnswer ? (
                <span className="text-green-600">✅ 回答正确</span>
              ) : (
                <span className="text-red-600">❌ 回答错误</span>
              )}
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p className="font-bold text-slate-900">【解析】</p>
              {/* 渲染解析中的公式 (这里用BlockMath简单演示) */}
              <div className="whitespace-pre-wrap">
                  {question.explanation.split('$$').map((part, idx) => {
                      if (idx % 2 === 1) return <BlockMath key={idx} math={part} />;
                      return part.split('$').map((subPart, subIdx) => {
                          if (subIdx % 2 === 1) return <InlineMath key={`${idx}-${subIdx}`} math={subPart} />;
                          return <span key={`${idx}-${subIdx}`}>{subPart}</span>;
                      });
                  })}
              </div>
            </div>
            <Button className="mt-4" variant="outline" onClick={() => {setShowResult(false); setSelected(null);}}>
              重做本题
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}