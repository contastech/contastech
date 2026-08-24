// netlify/functions/chat.js
export async function handler(event) {
  // Permitir apenas requisições POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { message, systemPrompt } = JSON.parse(event.body);
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.error("Chave da API DeepSeek não configurada");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Configuração do assistente incompleta." })
      };
    }

    // Chamada para a API da DeepSeek
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt || "Você é um assistente útil." },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erro na API DeepSeek:", response.status, errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Erro ao processar sua pergunta." })
      };
    }

    const data = await response.json();
    const reply = data.choices && data.choices[0]?.message?.content 
      || "Desculpe, não consegui processar sua pergunta.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    console.error("Erro no assistente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ocorreu um erro interno. Tente novamente." })
    };
  }
}