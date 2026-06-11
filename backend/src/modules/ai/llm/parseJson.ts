/**
 * Faz parse de JSON vindo do LLM de forma tolerante:
 * remove cercas de código (```json ... ```) e tenta recortar o objeto.
 */
export function parseJsonLoose(text: string): unknown {
  if (!text) return {};

  let cleaned = text.trim();

  // Remove cercas markdown ```json ... ```
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Tenta recortar do primeiro "{" ao último "}".
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return {};
      }
    }
    return {};
  }
}
