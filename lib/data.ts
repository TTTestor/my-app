import { Question } from "@/types/question";

export const questions: Question[] = [
  // 第一题：物理 (保留之前的经典动量题)
  {
    id: "phys-2024-001",
    subject: "物理",
    year: 2024,
    questionText: "一个质量为 $m$ 的物体在光滑水平面上以速度 $v$ 运动。当它受到一个与运动方向相同的恒力 $F$ 作用时间 $t$ 后，其动量大小变为多少？",
    options: ["$mv - Ft$", "$mv$", "$mv + Ft$", "$\\frac{1}{2}mv^2 + Ft$"],
    correctAnswer: 2,
    explanation: "根据动量定理，$Ft = \\Delta p = p_{末} - p_{初}$，由于力与速度同向，所以 $p_{末} = p_{初} + Ft = mv + Ft$。",
  },

  // 第二题：数学 (二次函数与顶点坐标)
  {
    id: "math-2024-001",
    subject: "数学",
    year: 2024,
    questionText: "已知二次函数 $f(x) = x^2 - 6x + 5$。求该函数在实数范围内的最小值是多少？",
    options: [
      "$-3$", 
      "$-4$", 
      "$0$", 
      "$5$"
    ],
    correctAnswer: 1,
    explanation: "我们要进行配方 (Completing the square)。\n$f(x) = (x^2 - 6x) + 5$\n$f(x) = (x^2 - 6x + 9) - 9 + 5$\n$f(x) = (x - 3)^2 - 4$\n因为 $(x-3)^2 \\ge 0$，所以当 $x=3$ 时，函数取得最小值 $-4$。",
  },

  // 第三题：化学 (热化学方程式)
  {
    id: "chem-2023-001",
    subject: "化学",
    year: 2023,
    questionText: "已知石墨 (Graphite) 的燃烧热为 $394 \\text{ kJ/mol}$。下列热化学方程式书写正确的是？",
    options: [
      "$C(s) + O_2(g) = CO_2(g) + 394 \\text{ kJ}$",
      "$C(s) + O_2(g) = CO_2(g) \\quad \\Delta H = +394 \\text{ kJ/mol}$",
      "$C(s) + \\frac{1}{2}O_2(g) = CO(g) \\quad \\Delta H = -394 \\text{ kJ/mol}$",
      "$C(s) + O_2(g) = CO_2(g) \\quad \\Delta H = -394 \\text{ kJ/mol}$"
    ],
    correctAnswer: 3,
    explanation: "燃烧热是指 1mol 物质完全燃烧生成稳定氧化物时放出的热量。\n选项 A 格式虽然也是一种写法，但现代化学更常用 $\\Delta H$ 表示。\n选项 B：放热反应 $\\Delta H$ 应为负值。\n选项 C：生成物应该是 $CO_2$ 而不是 $CO$。\n选项 D：完全正确，放热用负号表示。",
  }
];