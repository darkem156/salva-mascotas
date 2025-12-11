import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Compara dos URLs de fotos de mascotas y devuelve un score entre 0 y 1.
 */
export async function getVisionMatchScore(lostUrl, foundUrl) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ Falta OPENAI_API_KEY, devolviendo score 0");
    return 0;
  }

  try {
    const prompt = `
Eres un modelo que compara si dos fotos muestran a la MISMA mascota.
Analiza: color del pelaje, forma de la cabeza, orejas, ojos, manchas y proporciones.
Devuelve SOLO un número entre 0 y 1 con máximo dos decimales.
0 = no se parecen nada.
1 = es prácticamente la misma mascota.
Responde solo el número, sin texto adicional.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: lostUrl },
            },
            {
              type: "image_url",
              image_url: { url: foundUrl },
            },
          ],
        },
      ],
      max_tokens: 10,
    });

    const raw = completion.choices[0]?.message?.content || "0";
    const text = Array.isArray(raw)
      ? raw.map((p) => p.text || "").join(" ")
      : raw;

    const match = text.match(/([01](?:\.\d+)?)/);
    const score = match ? parseFloat(match[1]) : 0;

    if (!Number.isFinite(score)) return 0;
    return Math.max(0, Math.min(1, score));
  } catch (err) {
    console.error("Error en getVisionMatchScore:", err);
    return 0;
  }
}
