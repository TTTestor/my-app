// lib/data.ts
import { Question } from "@/types/question";

export const sampleQuestions: Question[] = [
  {
    id: "demo-001",
    subject: "物理",
    year: 2024,
    questionText: "一个质量为 $m$ 的物体在光滑水平面上以速度 $v$ 运动。当它受到一个与运动方向相同的恒力 $F$ 作用时间 $t$ 后，其动量大小变为多少？",
    options: [
      "$mv - Ft$",
      "$mv$",
      "$mv + Ft$",
      "$\\frac{1}{2}mv^2 + Ft$"
    ],
    correctAnswer: 2, // 对应第三个选项 (mv + Ft)
    explanation: "根据**动量定理** (Impulse-Momentum Theorem)：物体动量的变化量等于它所受合外力的冲量。\n\n公式为：$$ \\Delta p = F \\cdot t $$\n\n初动量为 $p_0 = mv$，末动量 $p = p_0 + \\Delta p = mv + Ft$。\n\n因此正确答案是 $mv + Ft$。"
  }
];