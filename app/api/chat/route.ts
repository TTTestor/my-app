import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// ❌ 以前我们在这里创建 client，这会导致构建时报错
// const client = new OpenAI(...) 

export async function POST(req: Request) {
  try {
    // 1. ✅ 现在我们把连接器放在这里
    // 只有当有人真的在做题求助时，才会创建连接，打包时不会运行这一行！
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });

    // 2. 接收消息
    const body = await req.json();
    const { userMessage } = body;

    console.log("----------------------------------------");
    console.log("📨 用户消息:", userMessage);
    
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