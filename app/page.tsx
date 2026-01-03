"use client"; // 这一行告诉 Next.js 这是在客户端渲染（显示公式必须）

// 1. 引入 KaTeX 的样式表 (必须有这一行，否则公式就是乱码)
import 'katex/dist/katex.min.css';

// 2. 引入公式组件
import { BlockMath, InlineMath } from 'react-katex';

export default function Home() {
  return (
    <div className="p-10 max-w-2xl mx-auto font-sans">
      
      {/* 标题 */}
      <h1 className="text-3xl font-bold mb-6">
        日本共通测试：物理公式测试
      </h1>

      {/* 测试卡片 */}
      <div className="border rounded-lg p-6 shadow-md bg-white">
        <p className="mb-4 text-gray-700">
          这是一个行内公式的例子：
          我们知道能量方程是 <InlineMath math="E = mc^2" /> 。
          接下来是一个复杂的积分公式：
        </p>

        {/* 这是一个独立显示的块级公式 (BlockMath) */}
        <div className="text-blue-600 my-6">
          <BlockMath math="\int_{a}^{b} f(x)dx = F(b) - F(a)" />
        </div>

        <p className="mb-4 text-gray-700">
          下面是高中物理常见的加速度公式：
        </p>

        <div className="text-red-600">
          <BlockMath math="x = v_0t + \frac{1}{2}at^2" />
        </div>
      </div>

      <button className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
        测试成功
      </button>

    </div>
  );
}