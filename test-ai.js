// test-ai.js
async function test() {
  console.log("正在呼叫 DeepSeek...");
  
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    body: JSON.stringify({ userMessage: "你好，请用日语说一句：物理很有趣！" }),
  });

  const data = await response.json();
 console.log("🤖 完整返回:", data);
}

test();