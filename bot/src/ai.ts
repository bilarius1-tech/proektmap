import { CONFIG } from "./config";

/**
 * Единый клиент к DeepSeek (deepseek-chat).
 * Используется для еженедельной выжимки (Фаза 1) и AI-консультанта (Фаза 2).
 * При отсутствии ключа или ошибке возвращает "".
 */
export async function askDeepSeek(
  system: string,
  user: string,
  maxTokens = 800,
  temperature = 0.5,
): Promise<string> {
  if (!CONFIG.deepseekKey) return "";

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + CONFIG.deepseekKey,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error(`DeepSeek HTTP ${res.status}`);
      return "";
    }

    const j = (await res.json()) as any;
    return j.choices?.[0]?.message?.content?.trim() || "";
  } catch (e) {
    console.error("DeepSeek error:", (e as Error).message);
    return "";
  }
}
