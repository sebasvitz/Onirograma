# Onirograma — Cartografía Onírica

Sistema de análisis onírico: traduce experiencias de sueños (texto, audio, imagen) en variables espaciales, sensoriales y perceptivas para diseño espacial y escenográfico.

## Descripción

Onirograma **no realiza interpretación psicológica**. Su función es la **traducción perceptiva → espacial**: transforma el relato de un sueño en un análisis estructurado listo para aplicar en decisiones de diseño.

## Funcionalidades

- **Ingesta multi-modal**: texto libre, audio (grabación en vivo o archivo), imagen (upload o URL)
- **Transcripción automática**: convierte narración oral a texto vía OpenAI Whisper
- **Análisis estructurado por GPT-4o**:
  - Estructura espacial (tipo, naturaleza, límites, escala, organización)
  - Dinámicas espaciales (expansión, compresión, fragmentación, etc.)
  - Luz (intensidad, tipo, temperatura, comportamiento, origen)
  - Materialidad (niebla, agua, vidrio, textil, etc.)
  - Corporalidad (estado, gravedad, sensación, control, presencia)
  - Emoción dominante y clima afectivo
  - Recorrido (tipo, continuidad, dirección, lógica)
  - Elementos espaciales relevantes
- **Traducción a diseño**: potencial espacial + estrategias por categoría
- **Archivo onírico**: almacenamiento y navegación de todos los casos
- **Output JSON**: exportable, filtrable, escalable a Airtable/DB

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **IA**: OpenAI API (GPT-4o para análisis, Whisper para transcripción)
- **Almacenamiento**: JSON local (`data/cases.json`) — migrable a Airtable/PostgreSQL

## Instalación

```bash
# Clonar y entrar al directorio
git clone <repo>
cd Onirograma

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local y agregar tu OPENAI_API_KEY

# Iniciar en desarrollo
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

## Variables de entorno

```env
OPENAI_API_KEY=sk-...   # Requerido
```

## Estructura del proyecto

```
/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts     # POST: analiza input onírico
│   │   └── cases/
│   │       ├── route.ts         # GET: lista todos los casos
│   │       └── [id]/route.ts    # GET/DELETE: caso individual
│   ├── cases/
│   │   ├── page.tsx             # Archivo onírico (lista)
│   │   └── [id]/page.tsx        # Detalle de caso
│   ├── layout.tsx
│   └── page.tsx                 # Formulario de ingesta
├── lib/
│   ├── analyzer.ts              # Análisis GPT-4o
│   ├── transcriber.ts           # Transcripción Whisper
│   └── db.ts                    # Almacenamiento JSON
├── types/
│   └── index.ts                 # Tipos TypeScript
└── data/
    └── cases.json               # Base de datos local (auto-creado)
```

## Output JSON por caso

```json
{
  "id": "uuid",
  "created_at": "ISO timestamp",
  "input": { "tipo": "texto|audio|imagen|mixto", "texto_original": "...", "transcripcion": "..." },
  "resumen": "síntesis del sueño",
  "estructura_espacial": { "tipo": "...", "naturaleza": "...", "limites": "...", "escala": "...", "organizacion": "..." },
  "dinamicas": ["expansión", "fragmentación"],
  "luz": { "intensidad": "...", "tipo": "...", "temperatura": "...", "comportamiento": "...", "origen": "..." },
  "materialidad": ["niebla", "vidrio"],
  "corporalidad": { "estado": "...", "gravedad": "...", "sensacion": "...", "control": "...", "presencia": "..." },
  "emocion": { "principal": "...", "clima_afectivo": "..." },
  "recorrido": { "tipo": "...", "continuidad": "...", "direccion": "...", "logica": "..." },
  "elementos_espaciales": ["..."],
  "traduccion_espacial": {
    "potencial": "descripción de traducción espacial",
    "estrategias": { "luz": "...", "materialidad": "...", "recorrido": "...", "escala": "...", "atmosfera": "..." }
  },
  "keywords": ["máximo 8 tags"]
}
```

## Escalabilidad

El sistema está diseñado para escalar hacia:
- Comparación entre múltiples sueños
- Detección de patrones globales
- Clustering de atmósferas
- Dashboard de visualización
- Migración a Airtable, Supabase o PostgreSQL

