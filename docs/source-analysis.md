# Source Analysis — aidaddy.tech (end-to-end)

> Companion to [`PRD.md`](./PRD.md). This document is the record of the end-to-end
> analysis of **aidaddy.tech** that the PRD is built on. It captures what the site
> is, how its content is organized, the exact content inventory, the content
> formats, and the licensing reality that shapes our product strategy.

---

## 1. What aidaddy.tech actually is

**aidaddy.tech** is a reader front-end (instant search, linked chapters, clean
mobile-friendly navigation) for an **open-source, MIT-licensed** body of content:
the GitHub repository **[`ombharatiya/ai-system-design-guide`](https://github.com/ombharatiya/ai-system-design-guide)**,
authored and maintained by **Om Bharatiya** (`@ombharatiya`).

- The website is a presentation layer; the **canonical content is the Git repo**.
- It brands itself as *"The living reference for production AI systems — continuously
  updated, interview-ready depth."*
- It positions explicitly against printed books ("outdated before they ship") and
  markets itself as a *living document* refreshed as new models/patterns ship.
- Content is **free and MIT-licensed**; PRs are welcome.

### How we analyzed it
The live site blocks direct crawling from this environment (egress policy returns
`403` on `www.aidaddy.tech`, and the site is a JS-rendered SPA). Because the content
is open source, we cloned the upstream repository that powers the site and read the
source directly — the most complete possible "crawl" of every page, question, and
answer. All inventory numbers below are counted from that clone.

**Corpus size:** 143 markdown files · ~55,800 lines · ~329,000 words · 20 numbered
sections + 8 root meta-documents.

---

## 2. Content taxonomy (the 20 sections)

The guide is organized along an **AI system lifecycle**: *Foundations → Build →
Operate → Govern → Apply*, plus a dedicated interview-prep section.

| # | Section | Chapters | What it covers |
|---|---------|:---:|----------------|
| 00 | **Interview Prep** | 8 | Question bank (116), answer frameworks, pitfalls, whiteboard exercises, behavioral, job-market trends, FAQ |
| 01 | Foundations | 6 | LLM internals, tokenization, attention, transformer architecture, embeddings, inference pipeline |
| 02 | Model Landscape | 4 | Model taxonomy, capability assessment, pricing/costs, model selection (June-2026 models) |
| 03 | Training & Adaptation | 8 | Pretraining, fine-tuning, LoRA/QLoRA/PEFT, RLHF/DPO, distillation, synthetic data, quantization, RLVR/GRPO |
| 04 | Inference Optimization | 9 | Inference fundamentals, KV cache, speculative decoding, batching, PagedAttention, serving, cost, diffusion LLMs, on-device/edge |
| 05 | Prompting & Context | 8 | Prompt engineering, few-shot/ICL, CoT, ToT, context engineering, structured generation, DSPy, prompt-injection defense |
| 06 | Retrieval Systems (RAG) | 15 | RAG fundamentals, chunking, embedding models, vector DBs, hybrid search, reranking, GraphRAG, agentic RAG, contextual retrieval, ColBERT, multimodal RAG, RAG eval, production RAG at scale, data engineering |
| 07 | Agentic Systems | 13 | Agent fundamentals, ReAct, tool use & MCP, multi-agent orchestration, memory/state, planning, error handling, human-in-loop, security/sandboxing, evaluating agents, durable execution, loop engineering |
| 08 | Memory & State | 6 | Memory architectures, short-term context, long-term memory, Mem0, semantic caching, state-management patterns |
| 09 | Frameworks & Tools | 12 | LangChain, LangGraph, LangSmith, LlamaIndex, DSPy, Semantic Kernel, AutoGen/CrewAI, framework selection, Claude Code, OpenCoder, Pydantic AI/Mastra, navigating framework churn |
| 10 | Document Processing | 1 | OCR & layout (vision-LLM parsing) |
| 11 | Infrastructure & MLOps | 4 | LLM infrastructure, CI/CD, AI gateways & model routing, FinOps & token economics |
| 12 | Security & Access | 2 | LLM security, access control (RBAC/ABAC/multi-tenant) |
| 13 | Reliability & Safety | 4 | Guardrails, ensemble methods, reliability patterns, AI governance & compliance |
| 14 | Evaluation & Observability | 3 | LLM evaluation, observability, benchmarks & leaderboards |
| 15 | AI Design Patterns | 2 | Pattern catalog, anti-patterns |
| 16 | **Case Studies** | 20 | Real-world production architectures with diagrams |
| 17 | Tool Use & Computer Agents | 7 | Tool-use landscape, architecture patterns, OpenClaw deep-dive, computer-use agents, building tool agents, use cases, safety & governance |
| 18 | Voice & Audio Agents | 1 | Real-time voice agents (VAD, turn-taking, cascade vs speech-to-speech) |
| 19 | Multimodal Generation | 1 | Image/video/audio generation pipelines, provenance, evaluation |

**Root meta-documents:** `README.md` (nav hub), `GLOSSARY.md` (every term defined),
`PATTERNS.md` (pattern quick-reference), `COURSES.md` (curated learning paths),
`TRANSITION_GUIDE.md` (role → AI-role mapping), `RESEARCH-RADAR.md` (trending papers),
`CONTRIBUTING.md`, and two long-form deep-dives on AI evals (~3,400–3,900 lines each,
Phoenix/Langfuse and LangWatch/Langfuse).

---

## 3. The interview-prep section (the core of the Hello-Interview overlap)

This is the single most important section for our product. It contains eight files:

| File | Content | Format we must model |
|------|---------|----------------------|
| `01-question-bank.md` | **116 questions** (Q1–Q116, continuously numbered) + 5 unnumbered deep-dive scenarios | Per-question: title, topic group, "What interviewers look for", "Strong answer covers" (bullets), "Sample Answer" (long prose), tradeoff tables, "Follow-up to expect", "Key insight". Versioned by date-added (Dec 2025, Mar/May/Jun 2026 batches). |
| `02-answer-frameworks.md` | **5 frameworks** — SPIDER (system design), ETA (concept), Tradeoff, Debugging, STAR-L (behavioral) + a worked 45-minute SPIDER mock transcript | Framework = named phases with time budgets, purpose, example dialogue, anti-patterns. |
| `03-common-pitfalls.md` | Patterns that kill staff-level offers | Pitfall → why it fails → fix. |
| `04-whiteboard-exercises.md` | **9 exercises** with full worked solutions | Per-exercise: problem statement + requirements, time-allocation table, clarification questions, architecture diagrams (ASCII/mermaid), deep-dive sections, reliability/scale, evaluation, discussion points. |
| `05-behavioral-for-ai-roles.md` | AI-specific behavioral prep, **6 worked STAR-L examples**, compensation/leveling, out-loud practice | Theme → questions to expect → STAR-L sample answers → red flags. |
| `06-job-market-trends-2026.md` | Role taxonomy, comp ranges, interview-process patterns, emerging titles | Reference tables + narrative; heavily sourced (100+ job listings). |
| `07-faq.md` | Short, direct answers grouped by topic | Q → short A → link to deep chapter. |

### Question-bank topic groups (116 questions)
- RAG Architecture (Q1–Q10)
- Agentic Systems (Q11–Q17)
- Model Selection (Q18–Q21)
- Optimization (Q22–Q26)
- Evaluation (Q27–Q29)
- Production & MLOps (Q30–Q33)
- Tooling & Lifecycle (Q34–Q39)
- Ensemble Methods (Q40–Q49)
- System Design Scenarios (5 deep-dive walkthroughs)
- Advanced sets by cohort: Dec 2025 (Q50–Q65), Mar 2026 (Q66–Q80), May 2026 (Q81–Q110), Jun 2026 (Q111–Q116)

### Answer frameworks (the "meta-skill")
- **SPIDER** — Scope → Prioritize → Initial architecture → Deep dive → Evaluation → Reliability, with per-phase time budgets (5/3/10/15/5/5 min).
- **ETA** — concept explanation.
- **Tradeoff** analysis.
- **Debugging / troubleshooting.**
- **STAR-L** — behavioral (STAR + Learnings).

### Whiteboard exercises (9)
Enterprise RAG · Customer Support Chatbot · Code Review Assistant · Document
Processing Pipeline · Real-Time Content Moderation · Multi-Tenant AI Platform ·
Semantic Search at Scale · Evaluation Pipeline · Agent Memory & State. Each is a
35–45 min mock with a rubric embedded in its structure.

---

## 4. Case studies (20 production architectures)

Each case study is an interview-grade worked problem: **the problem → constraints →
the interview question (verbatim) → solution architecture (mermaid diagram) → key
design decisions with tradeoff tables → data pipelines → failure modes**. Examples:

Enterprise RAG · Conversational Agent · Financial Analysis · Code Assistant ·
Content Moderation · Real-Time Search · Autonomous Coding Agent · Multi-Tenant SaaS
(Coca-Cola/Pepsi isolation) · Customer Support Automation · Document Intelligence ·
Recommendation Engine · Compliance Automation · Voice AI Healthcare · Fraud
Detection · Knowledge Management · Computer-Use Agent · Multi-Tenant Fine-Tuning ·
Eval-Gated CI/CD · Customer Distillation Pipeline · MCP Knowledge Agent.

These map **one-to-one onto whiteboard/mock-interview prompts** and are the highest-
value content for a guided-practice experience.

---

## 5. Content formats we must support (implications for the data model)

Across the corpus, content uses:
- **Markdown / MDX** prose with headings and callouts (`>` blockquotes for "what's new").
- **Mermaid diagrams** (`flowchart`, `mindmap`, `sequenceDiagram`) — heavily used for
  architectures and decision trees.
- **ASCII architecture diagrams** (box-and-arrow) inside code fences.
- **Comparison / tradeoff tables** (the dominant teaching device).
- **Code blocks** (Python, JSON schemas, config).
- **Structured question objects** (the interview-prep pattern above).
- **Cross-links** between chapters (a dense internal link graph — the "living reference"
  navigation model).
- **Date/version stamps** (content is continuously versioned; "Last verified" dates,
  "⭐ NEW" markers, dated question batches).

The takeaway: the ideal ingestion target is **structured MDX + a typed content schema**
(questions, exercises, case studies, glossary terms, patterns as first-class records —
not just prose pages), with **Mermaid rendering** and a **link graph** as core features.

---

## 6. Positioning & freshness signals (June 2026)

The guide leans hard on being current: it references June-2026 models (Claude Fable 5,
Claude Opus 4.8, GPT-5.5/5.6, Gemini 3.1 Pro, DeepSeek V4, Llama 4, Kimi K2.x,
Qwen 3.x), current pricing with verification dates, and a June-2026 job-market chapter
sourced from 100+ live listings. **Freshness is its core moat** — and therefore the
single hardest thing for any competing/derivative platform to sustain.

---

## 7. Licensing & attribution reality (must-read for product strategy)

- The content is **MIT-licensed**. Reuse, adaptation, and commercial use are permitted.
- MIT **requires preserving the copyright notice and license text** in copies/substantial
  portions. Attribution to **Om Bharatiya** must be maintained.
- Building a platform on top of this content is legitimate. The open, "PRs welcome"
  ethos suggests **a partner/contribute-back posture is both lower-risk and on-brand**
  rather than a silent hard fork.
- Strategic options (evaluated in the PRD, §12): (a) ingest upstream with attribution +
  contribute back, (b) partner/license with the author, (c) author original content.
  The PRD recommends **(a) + (b)** as the default: keep the knowledge free and attributed,
  and build our differentiated value in the *interactive/AI/assessment layer* on top.

---

## 8. What aidaddy.tech does **not** do (our opportunity)

It is a **read-only reference site**. It has **no**:
- accounts, progress tracking, or personalization;
- interactive practice, guided walkthroughs, or scoring;
- AI tutor / AI mock interviewer;
- whiteboard/diagramming canvas;
- spaced repetition or study plans;
- company-tagged question lists;
- community, cohorts, or teams.

Every one of those is present (in some form) in Hello Interview and absent here. That
gap — **turning an excellent static reference into an interactive, AI-native, assessed
learning-and-interview platform** — is the product thesis, detailed in the PRD.
