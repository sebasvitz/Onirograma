# 🌙 Onirograma — Cartografía Onírica

> **Traduce tus sueños en lenguaje espacial.**  
> Onirograma analiza la experiencia onírica —texto, imagen o ambos— y la convierte en variables estructuradas de diseño: luz, materialidad, escala, recorrido y atmósfera.

---

## ✨ ¿Qué es Onirograma?

Onirograma es una aplicación web que actúa como **herramienta de traducción perceptiva → espacial**. No interpreta tus sueños psicológicamente; los **cartografía**: extrae sus cualidades espaciales y sensoriales para convertirlas en insumos concretos para el diseño arquitectónico o escenográfico.

La interfaz presenta un flujo de scroll vertical inmersivo con fondo 3D animado, pensado para acompañar la experiencia de registrar un sueño.

---

## 🚀 Funcionalidades

| Función | Descripción |
|---|---|
| 📝 **Registro de sueños** | Ingresa texto libre, sube una imagen de referencia, o combina ambos |
| 🔍 **Análisis estructurado** | Motor de reglas que extrae estructura espacial, luz, materialidad, corporalidad, recorrido y emoción |
| 🖼️ **Referencias visuales** | Sube imágenes a Supabase Storage y vincúlalas al sueño |
| 📚 **Biblioteca onírica** | Navega y consulta todos los sueños guardados |
| 🗑️ **Eliminar sueños** | Borra registros incorrectos o que ya no sean útiles |
| 🌌 **Fondo 3D interactivo** | Escena Three.js animada que acompaña la experiencia visual |

---

## 🛠️ Stack tecnológico

- **Framework** — [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- **Estilos** — Tailwind CSS + SCSS (sistema de diseño propio con paleta índigo-violeta)
- **Base de datos** — [Supabase](https://supabase.com/) (PostgreSQL)
- **Almacenamiento de imágenes** — Supabase Storage (`dream-images`)
- **3D** — [Three.js](https://threejs.org/) (cargado dinámicamente con `next/dynamic`)
- **Análisis** — Motor de reglas local (`lib/analyzer-rules.ts`), sin dependencias de IA externa
- **Despliegue** — [Vercel](https://vercel.com/)

---

## ⚙️ Instalación y uso local

### 1. Clonar el repositorio

```bash
git clone https://github.com/sebasvitz/Onirograma.git
cd Onirograma
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` y completa los valores de Supabase (ver sección siguiente).

### 4. Iniciar en modo desarrollo

```bash
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📁 Estructura del proyecto

```
Onirograma/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts        # POST: analiza el input onírico
│   │   └── cases/
│   │       ├── route.ts            # GET: lista todos los casos
│   │       └── [id]/route.ts       # GET / DELETE: caso individual
│   ├── cases/
│   │   ├── page.tsx                # Biblioteca onírica (lista)
│   │   └── [id]/page.tsx           # Detalle de un sueño
│   ├── globals.scss                # Sistema de diseño SCSS
│   ├── layout.tsx
│   └── page.tsx                    # Página principal (scroll flow)
├── components/
│   ├── DeleteCaseButton.tsx        # Botón para eliminar un sueño
│   └── ThreeBackground.tsx         # Fondo 3D animado (Three.js)
├── lib/
│   ├── analyzer-rules.ts           # Motor de análisis (basado en reglas)
│   ├── db.ts                       # CRUD con Supabase
│   └── supabase.ts                 # Cliente Supabase (singleton)
├── supabase/
│   └── schema.sql                  # Esquema de base de datos
├── types/
│   └── index.ts                    # Tipos TypeScript
└── .env.example                    # Plantilla de variables de entorno
```

---


<div align="center">

*Onirograma — donde los sueños encuentran su forma.*

</div>

