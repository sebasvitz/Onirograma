import OpenAI from "openai";
import type { OniricCase } from "@/types";

const ANALYSIS_SYSTEM_PROMPT = `Eres un sistema de análisis onírico especializado en traducción perceptiva-espacial.
Tu función es analizar relatos de sueños y extraer variables espaciales, sensoriales y perceptivas.
NO realizas interpretación psicológica ni asignas significados simbólicos.
Tu respuesta es SIEMPRE un JSON válido con la estructura exacta solicitada.
Mantén fidelidad al input: no inventes información que no esté implícita en el relato.
Si un campo no puede determinarse con certeza, elige la opción más neutra disponible.`;

const ANALYSIS_USER_PROMPT = (relato: string) => `Analiza el siguiente relato onírico y devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:

{
  "resumen": "síntesis fiel del sueño en 2-3 oraciones",
  "estructura_espacial": {
    "tipo": "interior|exterior|híbrido|indefinido",
    "naturaleza": "real|transformado|abstracto|imposible",
    "limites": "definidos|difusos",
    "escala": "normal|alterada|infinita|comprimida",
    "organizacion": "abierta|cerrada|fragmentada"
  },
  "dinamicas": ["lista de dinámicas espaciales identificadas: expansión, compresión, fragmentación, disolución, superposición, repetición, transición, deformación, elevación, descenso, inestabilidad"],
  "luz": {
    "intensidad": "baja|media|alta",
    "tipo": "difusa|puntual|envolvente|inexistente",
    "temperatura": "cálida|fría|neutra",
    "comportamiento": "estable|cambiante",
    "origen": "definido|indefinido"
  },
  "materialidad": ["lista de cualidades materiales percibidas: niebla, agua, vidrio, textil, sólido, vacío, reflectividad, rugosidad, etc."],
  "corporalidad": {
    "estado": "activo|pasivo|suspendido",
    "gravedad": "normal|alterada",
    "sensacion": "peso|ligereza",
    "control": "libre|restringido",
    "presencia": "definida|difusa"
  },
  "emocion": {
    "principal": "emoción dominante identificada",
    "clima_afectivo": "descripción del clima emocional general"
  },
  "recorrido": {
    "tipo": "lineal|circular|espiral|errático|fragmentado",
    "continuidad": "continuo|interrumpido",
    "direccion": "ascendente|descendente|sin dirección",
    "logica": "guiado|perdido|repetitivo"
  },
  "elementos_espaciales": ["objetos o situaciones espacialmente relevantes, sin interpretación simbólica"],
  "traduccion_espacial": {
    "potencial": "descripción del potencial de traducción espacial (ej: compresión + oscuridad → pasillo estrecho con baja iluminación)",
    "estrategias": {
      "luz": "decisión de diseño sobre luz",
      "materialidad": "decisión de diseño sobre materialidad",
      "recorrido": "decisión de diseño sobre recorrido",
      "escala": "decisión de diseño sobre escala",
      "atmosfera": "decisión de diseño sobre atmósfera"
    }
  },
  "keywords": ["máximo 8 palabras clave para filtrado y agrupación"]
}

RELATO ONÍRICO:
${relato}`;

export async function analyzeOniricInput(
  relato: string,
  apiKey: string
): Promise<Omit<OniricCase, "id" | "created_at" | "input">> {
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: ANALYSIS_USER_PROMPT(relato) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No se recibió respuesta del modelo de análisis.");
  }

  const analysis = JSON.parse(content);

  if (Array.isArray(analysis.keywords) && analysis.keywords.length > 8) {
    analysis.keywords = analysis.keywords.slice(0, 8);
  }

  return analysis;
}
