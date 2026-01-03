import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// 1. 初始化连接器
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com", 
});

export async function POST(req: Request) {
  try {
    // 2. 接收消息
    const body = await req.json();
    const { userMessage } = body;

    // 👇 侦探日志开始 👇
    console.log("----------------------------------------");
    const key = process.env.DEEPSEEK_API_KEY;
    console.log("🔑 钥匙状态:", key ? `✅ 读到了 (前两位: ${key.substring(0, 2)}...)` : "❌ 没读到，是空的！");
    console.log("📨 用户消息:", userMessage);
    console.log("----------------------------------------");
    // 👆 侦探日志结束 👆

    // 3. 发送给 DeepSeek
    const completion = await client.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "deepseek-chat",
    });

    // 4. 返回结果
    const aiReply = completion.choices[0].message.content;
    return NextResponse.json({ reply: aiReply });

  } catch (error) {
    console.error("❌ AI 出错详情:", error);
    return NextResponse.json({ error: "服务器出错了" }, { status: 500 });
  }
}