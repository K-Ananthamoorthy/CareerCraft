# CareerCraft

An AI-powered career development platform for engineering students. CareerCraft helps students figure out where they stand, where they should go, and how to get there, using LLM-driven assessments, recommendations, and study tools in one place.

## What it does

- **Skill assessments**: Interactive assessments that evaluate a student's current technical and soft skills.
- **AI career recommendations**: Personalized career path suggestions generated with Google Gemini, based on assessment results and profile data.
- **Learning paths**: Structured, personalized learning tracks students can follow toward a target role.
- **PDF Chat (RAG)**: Upload study material or notes as PDFs and chat with them. Documents are parsed, embedded, and retrieved so answers stay grounded in the uploaded content.
- **Study tools**: A set of AI utilities for day-to-day studying, including an image analyzer for notes and diagrams (with OCR support).
- **Insights dashboard**: Progress tracking and analytics with charts.
- **Community**: A social space where students can share updates and interact.
- **Certificates and admin panel**: Certificate generation for completed paths, plus an admin area for managing the platform.

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| UI | Tailwind CSS, Radix UI, Framer Motion, Recharts / Chart.js |
| Auth & Database | Supabase (Auth + Postgres) |
| LLMs | Groq (LLaMA models via groq-sdk and LangChain), Google Gemini |
| RAG & Embeddings | Transformers.js (@xenova/transformers) for embeddings, ChromaDB as vector store |
| Document processing | pdf-parse, pdfjs-dist, react-pdf, tesseract.js (OCR) |

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project
- API keys for Groq and Google Gemini

### Setup

1. Clone and install:

```bash
git clone https://github.com/K-Ananthamoorthy/CareerCraft.git
cd CareerCraft
npm install
```

2. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/                    # App Router pages
│   ├── assessment/          # Skill assessments
│   ├── career-recommendations/
│   ├── learning-paths/
│   ├── pdf-chat/            # RAG chat over uploaded PDFs
│   ├── study-tools/
│   ├── ai-image-analyzer/
│   ├── insights/            # Analytics dashboard
│   ├── social/              # Community feed
│   ├── admin/
│   └── api/                 # API routes (predict, analyze-resume, pdf-chat, recommendations)
├── components/             # UI, dashboard, learning path, and study tool components
├── lib/                    # Supabase clients and helpers
└── utils/
```

## License

MIT
