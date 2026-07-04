# PRD — Simplify AI Engineering

### An AI-native learning & interview-prep platform for AI engineering — "Hello Interview, for AI"

> **Status:** Draft v1.0 · **Owner:** rajmahato111 · **Last updated:** 2026-07-03
> **This document is the single source of truth.** All product, content, and
> engineering decisions defer to it. Change it by PR; don't fork intent into side docs.
> Companion: [`source-analysis.md`](./source-analysis.md) (end-to-end analysis of aidaddy.tech).

---

## 0. TL;DR

We are building a **modern web application that turns the best open AI-engineering
knowledge into an interactive, AI-native learning and interview-prep platform** — the
way [Hello Interview](https://www.hellointerview.com) did for classic system-design
interviews, but purpose-built for **AI / LLM / AI-systems-design interviews and skills**.

- **Content foundation:** the open, MIT-licensed corpus behind
  [aidaddy.tech](https://www.aidaddy.tech) (`ombharatiya/ai-system-design-guide`) —
  116 interview questions, 20 case studies, 9 whiteboard exercises, ~120 technical
  chapters, frameworks, glossary — ingested with attribution and augmented with our own.
- **The product wedge (what aidaddy.tech and books don't do):** accounts + progress,
  **guided practice** with checkpoint feedback, an **AI mock interviewer** that runs a
  real AI-system-design loop and scores you against a rubric, an **AI tutor** grounded
  in the corpus, a **system-design whiteboard canvas** with AI critique, spaced-
  repetition, personalized study plans, and company-tagged question lists.
- **Business model:** freemium. Keep the *reading* free and attributed (on-brand with
  the open source); charge for the *interactive/AI/assessment* layer.
- **Stack:** Next.js (App Router) + TypeScript + Tailwind/shadcn, Postgres + pgvector,
  MDX content pipeline, Anthropic Claude (Opus 4.8 / Sonnet 5 / Haiku 4.5) for all AI
  features, Excalidraw canvas, Stripe. Deployed on Vercel + managed Postgres.

---

## 1. Problem & opportunity

**The AI-engineering job market is booming and its interviews are unlike classic SWE
interviews** — yet prep resources are fragmented, static, and quickly stale.

From the [June-2026 job-market analysis](./source-analysis.md#3-the-interview-prep-section-the-core-of-the-hello-interview-overlap):
AI roles grew +8.9% QoQ with ~275,000 unfilled roles even amid broad tech layoffs;
interview loops now expect **LLM infra, RAG, agents, evals, GPU scheduling, cost/latency
tradeoffs, and AI-assisted coding** — a surface area no existing interview-prep product
covers well. Senior AI specialists are in a sellers' market; comp ranges from ~$170K
mid-level to $600K+ at frontier labs.

**The gaps today:**
1. **Static references** (aidaddy.tech, books, blog posts) teach but don't *assess* or
   *rehearse*. Books are outdated on arrival; the field moves monthly.
2. **Classic interview-prep platforms** (Hello Interview, DesignGurus, etc.) barely
   cover AI-system design and don't cover RAG/agents/evals interview patterns at depth.
3. **Generic AI mock-interview tools** aren't grounded in real AI-system-design rubrics
   or current model/tooling reality.

**The opportunity:** be the **category-defining destination for AI-engineering interview
prep and applied learning** — combining an authoritative, continuously-updated knowledge
base with AI-native practice and assessment. This is a "Hello Interview moment" for a
brand-new interview category that is expanding fast and has no incumbent.

---

## 2. Vision, goals, non-goals

### Vision
> Every engineer preparing for an AI role — or leveling up into one — comes here to
> **learn the concepts, rehearse the interview, and get objective feedback**, in one
> place that is always current.

### Product goals (first 12 months)
| # | Goal | Why it matters |
|---|------|----------------|
| G1 | Ship the **best free AI-engineering reference reader** (search, navigation, diagrams, mobile) | Top-of-funnel; SEO; parity-plus with aidaddy.tech |
| G2 | Ship **guided practice + AI mock interviewer** for AI-system-design | The differentiated, monetizable core |
| G3 | Ship an **AI tutor** grounded in the corpus with citations | Retention + "ask anything" stickiness |
| G4 | Convert readers → practitioners → subscribers via a **clear freemium ladder** | Revenue |
| G5 | Keep content **fresh** via an automated ingestion + review pipeline | The category's true moat |

### Non-goals (v1)
- Not a coding-interview (LeetCode) platform. We focus on **AI-system design, applied
  AI concepts, and AI-role behavioral** — not DS&A.
- Not a live human-interviewer marketplace at launch (a Phase 5 option, not MVP).
- Not a model-training/research curriculum from scratch — we assume production-engineer
  baseline (as the source does) and point to courses for fundamentals.
- Not a general LLM chatbot — the AI tutor is scoped and grounded to our corpus.

---

## 3. Competitive analysis & differentiation

| Capability | aidaddy.tech | Hello Interview | **Us (target)** |
|---|:--:|:--:|:--:|
| Authoritative AI-systems content | ✅ (excellent) | ⚠️ minimal | ✅ (ingest + extend) |
| Instant search / clean reader | ✅ | ✅ | ✅ |
| Accounts, progress, bookmarks | ❌ | ✅ | ✅ |
| Guided practice w/ checkpoint feedback | ❌ | ✅ (44 problems) | ✅ (AI-specific) |
| AI tutor (grounded, cited) | ❌ | ✅ | ✅ |
| **AI mock interviewer (AI-system design)** | ❌ | ⚠️ (deprecated their AI mock) | ✅ **core differentiator** |
| System-design whiteboard canvas | ❌ | ✅ (Excalidraw) | ✅ + AI critique |
| Rubric-based scoring | ❌ | partial | ✅ (from question "signals") |
| Company-tagged question lists | ❌ | ✅ | ✅ (Anthropic/OpenAI/etc.) |
| Spaced repetition / study plans | ❌ | ⚠️ | ✅ |
| **Purpose-built for AI roles** | ✅ | ❌ | ✅ |
| Freshness (living, model-current) | ✅ | ⚠️ | ✅ (pipeline) |
| Live human mock marketplace | ❌ | ✅ | ⏳ Phase 5 |

**Our two-sentence differentiation:** *Hello Interview owns classic system design;
aidaddy.tech owns the AI knowledge but is read-only. We own the intersection —
**AI-native, interactive, assessed prep for AI-engineering interviews** — on top of a
continuously-updated knowledge base.* The AI mock interviewer, grounded tutor, and
AI-specific guided practice are the moat; the free reader is the funnel.

**Reference pricing:** Hello Interview ≈ $36/mo or ~$59/yr, freemium with one free
guided problem. We anchor near this (see §11).

---

## 4. Target users & personas

Derived from the source's role taxonomy and career-level skill maps.

| Persona | Who | Primary jobs-to-be-done | Key surfaces |
|---|---|---|---|
| **Aspiring AI Engineer (IC, transitioning)** | Backend/frontend/data eng moving into AI | "Close my gaps, learn RAG/agents/evals, pass the loop" | Learn tracks, Transition guide, Guided practice, AI tutor |
| **Senior/Staff AI Engineer** | Already in AI, targeting senior/staff/frontier-lab | "Rehearse staff-level system design + behavioral, sharpen tradeoffs" | AI mock interviewer, advanced questions, case studies, STAR-L |
| **New-grad / early-career** | CS grads entering a bifurcated market | "Build a portfolio-grade mental model + baseline" | Foundations, FAQ, courses, flashcards |
| **Specialists** | Eval / agent / RAG / MCP / FDE tracks | "Depth in my lane + the interview signals for it" | Role-specific tracks, company lists |
| **Hiring managers / interviewers** | Building AI rubrics | "Calibrate questions and rubrics" | Question bank, rubric view (later: team tooling) |
| **Career-switchers/PMs/TPMs** | Into AI PM/TPM | "Fluency + market context" | Job-market, pitfalls, frameworks |

**Primary persona for MVP:** the **Aspiring/mid-level AI Engineer** (largest TAM, highest
intent), with **Senior/Staff** as the primary *monetization* persona (AI mock interviewer).

---

## 5. Experience pillars

The product is organized around five pillars. Everything in §6 maps to one of these.

1. **Learn** — read the knowledge base: tracks, chapters, diagrams, glossary, search.
2. **Practice** — guided practice, whiteboard exercises, case studies, flashcards.
3. **Interview** — AI mock interviewer, rubric scoring, session review.
4. **Coach (AI Tutor)** — grounded Q&A, hints, explanations, personalized study plans.
5. **Progress** — accounts, tracking, spaced repetition, streaks, readiness score.

```
Learn ──▶ Practice ──▶ Interview ──▶ (feedback) ──▶ Coach ──▶ Progress ──▶ (loop)
  ▲                                                                          │
  └──────────────────── personalized next-best-action ──────────────────────┘
```

---

## 6. Feature epics

Each epic lists MVP scope vs later. Priority: **P0 = MVP**, **P1 = fast-follow**, **P2 = later**.

### E1 — Content Reader (Learn) · P0
- Browse the **20 sections / ~120 chapters** as tracks; per-chapter reader with TOC,
  prev/next, reading time, "last updated," and cross-links (the internal link graph).
- **Mermaid + ASCII diagram rendering**, code blocks with copy, comparison tables.
- **Instant search** (keyword) + **semantic search** (pgvector) across all content.
- **Glossary** (term pages, inline definition popovers), **Pattern catalog**, **FAQ**.
- **Curated tracks/paths** (from README nav matrix + Transition guide): "Prepare for
  interviews," "Build production RAG," "Build agents," "Pick a model," role-based paths.
- Bookmarks, highlights, "mark complete," per-chapter notes (requires auth).
- *P1:* dark/light theme, print/export, "what changed since I last read" diff feed.

### E2 — Question Bank (Practice/Interview) · P0
- All **116 questions** as first-class records with structured fields (see §8).
- Filter/sort by **topic, difficulty, role, company tag, recency**.
- Per-question views: **Practice mode** (question + "what interviewers look for," answer
  hidden behind "reveal"), **Study mode** (full model answer, follow-ups, key insight),
  **related chapters/case studies**.
- **Follow-up drilling:** the source's "Follow-up to expect" becomes interactive prompts.
- *P1:* company-tagged lists (Anthropic/OpenAI/Google/scale-ups) with "most-likely" ranking.

### E3 — Guided Practice · P0 (core differentiator)
- Interactive, **step-by-step walkthrough** of whiteboard exercises & case studies
  (SPIDER phases: Scope → Prioritize → Initial arch → Deep dive → Eval → Reliability).
- At each checkpoint the user answers (text and/or diagram); **AI gives structured
  feedback** against the exercise's embedded rubric ("you missed permission-at-query-time,"
  "you didn't define an eval strategy," "good hybrid-search call — now justify the reranker").
- Progress bar through phases; reveal reference solution + diagram at the end.
- Rubric derived from each item's "What interviewers look for" + "Strong answer covers."

### E4 — AI Mock Interviewer · P1 (flagship, monetized)
- Conducts a **timed, adaptive AI-system-design interview**: picks a scenario, plays the
  interviewer, asks clarifying-question openings, **probes with follow-ups**, pushes on
  tradeoffs, and adapts difficulty to the candidate's answers.
- Uses the **SPIDER framework** as the interviewer's mental model and the question/case
  "signals" as the scoring rubric.
- Ends with a **scorecard**: per-dimension scores (scoping, architecture, depth, evals,
  reliability, communication), strengths, gaps, and "study these chapters next."
- **Text-first (P1)**, **voice mode (P2)** using the voice-agent patterns in the corpus
  (VAD, turn-taking, cascade STT→LLM→TTS).
- Full **session transcript + replay**; sessions saved to Progress.

### E5 — Whiteboard / Diagramming Canvas · P1
- Embedded **Excalidraw** canvas for drawing architectures during guided practice & mocks.
- **AI critique of the diagram** (multimodal): compare the user's diagram to the reference
  architecture and flag missing components (permission service, reranker, audit log, etc.).
- Component palette pre-seeded with AI-system primitives (LLM, vector DB, reranker,
  gateway, guardrail, eval harness). Export/share as image.

### E6 — AI Tutor (Coach) · P0 (thin) → P1 (full)
- **Grounded, cited Q&A** over the whole corpus (RAG with pgvector). "Ask anything";
  answers link to source chapters. Refuses/deflects out-of-scope.
- **Contextual mode:** "explain this paragraph," "quiz me on this chapter," "give me a
  harder version of this question."
- **Hints on demand** during practice (progressive disclosure, not the full answer).
- *P1:* **personalized study plan** — given target role + timeline, generate a reading +
  practice schedule from the tracks (uses role taxonomy + skill-by-level maps).

### E7 — Spaced Repetition & Flashcards · P1
- Auto-generated flashcards from the **glossary** and question "key insights."
- SM-2-style scheduling; daily review queue; feeds the readiness score.

### E8 — Progress & Readiness · P0 (basic) → P1 (rich)
- Accounts, per-item completion, streaks, time-on-task.
- **Readiness score** per track/role (coverage × recency × mock performance).
- Dashboard: "continue where you left off," next-best-action, weak areas.

### E9 — Behavioral & Career · P1
- **STAR-L behavioral trainer** (AI plays interviewer for behavioral rounds; 6 worked
  examples as references).
- **Job-market hub** (role taxonomy, comp ranges, interview-process patterns) as a living,
  filterable page. Company interview-process cards.

### E10 — Community / Teams · P2
- Discuss questions, share diagrams, upvote answers.
- **Teams/cohorts:** bootcamps & employers assign tracks, see cohort progress (B2B revenue).
- *P2+:* live human mock-interview marketplace (ex-FAANG/AI-lab interviewers).

### E11 — Admin / Content Ops · P0 (internal)
- Content ingestion pipeline (repo → structured MDX + DB), review/publish workflow,
  freshness dashboard ("chapters not verified in N days"), attribution management.

---

## 7. Information architecture & navigation

**Top-level nav:** `Learn` · `Questions` · `Practice` · `Mock Interview` · `Tutor` ·
`Dashboard` · (`Pricing` · `Sign in`).

```
/                         Landing (value prop, free reader CTA)
/learn                    Track/section index (the 20 sections)
/learn/[section]          Section overview
/learn/[section]/[slug]   Chapter reader
/tracks/[track]           Curated path (interview prep, build RAG, role-based…)
/questions                Question bank (filter/sort)
/questions/[id]           Single question (practice/study modes)
/case-studies/[slug]      Case study (worked architecture)
/practice                 Guided-practice index (exercises + case studies)
/practice/[slug]          Guided-practice session (SPIDER walkthrough + canvas)
/mock                     AI mock interviewer setup
/mock/[sessionId]         Live mock + scorecard/replay
/tutor                    AI tutor chat (grounded)
/glossary, /glossary/[t]  Glossary
/patterns                 Pattern & anti-pattern catalog
/jobs                     Job-market hub (roles, comp, process)
/dashboard                Progress, readiness, review queue, study plan
/companies/[slug]         Company question lists + process (P1)
/pricing, /account        Billing & settings
```

**Search** is global (kbd `/`), returns chapters, questions, case studies, glossary,
and offers "Ask the tutor" as a result.

---

## 8. Content model / data schema

Content is **typed records**, not just pages — this is what unlocks practice, scoring,
and personalization. Core entities (Postgres; Prisma/Drizzle):

```
User(id, email, auth, role_target, level_target, plan, created_at)
Subscription(id, user_id, stripe_customer, tier, status, renews_at)

Section(id, number, slug, title, summary, lifecycle_stage)   # 20 sections
Chapter(id, section_id, slug, title, mdx_ref, reading_time, updated_at,
        source_url, contributors, tags[])                    # ~120 chapters
ChapterLink(from_chapter_id, to_chapter_id)                  # internal link graph

Question(id, number, slug, title, body_md, topic, difficulty, role_tags[],
         company_tags[], interviewer_looks_for[], strong_answer_covers[],
         sample_answer_md, followups[], key_insight, related_chapter_ids[],
         cohort/date_added, version)                         # 116+ questions
Framework(id, slug, name, phases[{name, time_budget, purpose, example, anti_pattern}])
WhiteboardExercise(id, slug, title, problem_md, requirements[], time_allocation[],
                   phases[], reference_solution_md, reference_diagram, rubric[])   # 9
CaseStudy(id, slug, title, problem_md, interview_question, architecture_diagram,
          design_decisions[], tradeoffs[], failure_modes[], related_question_ids[]) # 20
Pattern(id, slug, name, category, use_case, key_tradeoff, chapter_ref)             # patterns/anti-patterns
GlossaryTerm(id, term, definition_md, related_chapter_ids[])
Company(id, slug, name, tier, process_md, question_ids[])                          # P1
Course(id, ...), RoleTrack(id, role, level, reading_path[], skills[])             # transition/courses

# User activity & AI
Progress(user_id, entity_type, entity_id, status, last_seen_at, score)
Bookmark / Highlight / Note(user_id, chapter_id, ...)
MockSession(id, user_id, exercise_id, transcript, scorecard, diagram_ref, created_at)
PracticeAttempt(id, user_id, exercise_id, checkpoint, user_input, ai_feedback, score)
Flashcard(id, source_type, source_id, front, back) + Review(user_id, card_id, sm2_state)
StudyPlan(id, user_id, role_target, timeline, items[])
Embedding(chunk_id, entity_type, entity_id, vector, text)   # pgvector, for search + tutor RAG
TutorThread / TutorMessage(...)                             # grounded chat w/ citations
```

**Rubrics are data.** A question's `interviewer_looks_for[]` + `strong_answer_covers[]`
and an exercise's `rubric[]` are the ground truth that the AI mock interviewer and
guided-practice grader score against — no hand-written per-item prompts.

---

## 9. AI architecture

All AI features run on **Anthropic Claude** (default to latest, most capable models).

| Feature | Model (default) | Pattern |
|---|---|---|
| AI Tutor (grounded Q&A) | Claude Sonnet 5 (Haiku 4.5 for cheap/short) | **RAG** over pgvector chunks → cited answer; strict "answer only from context, else say so" |
| Guided-practice grader | Claude Sonnet 5 | Structured output scored vs `rubric[]`; returns per-criterion pass/fail + coaching |
| AI Mock Interviewer | Claude Opus 4.8 (long-horizon, tool-use, adaptivity) | Stateful interviewer persona + SPIDER phase controller + rubric scorer; tool-calls to fetch related content |
| Whiteboard critique | Claude Sonnet 5 (multimodal) | Diagram image + reference architecture → gap analysis |
| Flashcard/plan generation | Haiku 4.5 | Batch generation from glossary/questions/tracks |
| Semantic search | Embeddings + reranking | pgvector ANN → optional Claude rerank for top-k |

**Design principles:**
- **Grounding first.** Tutor and graders cite corpus chunks; hallucination is the top
  risk for a *trusted study tool*. Show sources; allow "I'm not sure."
- **Rubric-driven, not vibes.** Scoring maps to explicit, data-defined criteria so results
  are consistent and explainable to the user.
- **Prompt-injection defense** (the corpus literally has a chapter on it): treat user
  diagrams/answers/pasted content as untrusted; never let it change system instructions.
- **Cost control** (there's a FinOps chapter — practice what we preach): model tiering,
  **prompt caching** of the system prompt + retrieved context, semantic caching of common
  tutor questions, token budgets per session, streaming.
- **Eval-gated AI features.** Build a golden set of graded answers; LLM-as-judge + human
  spot-checks; regression-test prompts before shipping changes (mirror the corpus's
  eval-gated CI/CD case study).

---

## 10. Tech stack & system architecture

**Recommended stack (modern, Hello-Interview-class):**

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js (App Router) + React + TypeScript** | SSR/SEO for the free reader, RSC, one codebase |
| UI | **Tailwind CSS + shadcn/ui + Radix** | Fast, accessible, themeable |
| Content | **MDX** + content pipeline (ingest repo markdown → MDX + typed records) | Source is markdown; MDX keeps diagrams/tables + adds interactivity |
| Diagrams | **Mermaid** (render) + **Excalidraw** (canvas) | Matches source formats + Hello-Interview-style whiteboard |
| DB | **Postgres + pgvector** (Neon or Supabase) | Relational content model + vectors in one place |
| ORM | **Prisma** or **Drizzle** | Typed schema/migrations |
| Auth | **Auth.js (NextAuth)** or **Clerk** (OAuth: Google/GitHub) | Standard, fast |
| AI | **Anthropic API** (Claude Opus 4.8 / Sonnet 5 / Haiku 4.5) + streaming | All AI features; latest models |
| Search | pgvector (semantic) + **Meilisearch/Typesense** or Postgres FTS (keyword) | Instant + semantic |
| Payments | **Stripe** (Billing/Checkout) | Subscriptions |
| Realtime (voice, P2) | WebRTC / streaming STT-TTS | Voice mock |
| Hosting | **Vercel** + managed Postgres; object storage for diagrams | Low-ops, scales |
| Analytics/obs | PostHog + Sentry; **Langfuse/LangSmith** for AI traces | Product + AI observability |
| CI/CD | GitHub Actions; **eval-gated** checks on AI prompt changes | Quality gate |

```
                     ┌───────────────────────────────────────────┐
   Browser ─────────▶│  Next.js (RSC + API routes / server acts)  │
   (reader, canvas,  │   Reader · Questions · Practice · Mock     │
    tutor chat)      └───────────────┬───────────────────────────┘
                                     │
        ┌────────────────────────────┼───────────────────────────────┐
        ▼                            ▼                                ▼
  Postgres + pgvector        Anthropic Claude API              Stripe / Auth
  (content records,          (tutor, grader, mock,             (billing, sessions)
   progress, embeddings)      whiteboard critique)                    │
        ▲                            ▲                                │
        └──── Content pipeline ──────┘                                │
   (upstream repo → parse MDX → typed records → embed → publish)      │
                     ▲                                                │
              Freshness/attribution dashboard ◀──────────────────────┘
```

**Content pipeline (E11):** scheduled job pulls the upstream open repo → parses markdown
into MDX + typed records (questions/exercises/case studies/glossary) → generates
embeddings → runs freshness/attribution checks → stages for human review → publishes.
Our *original* content is authored in the same schema.

---

## 11. Monetization

**Freemium, on-brand with the open-source ethos: keep knowledge free, charge for practice.**

| Tier | Price (anchor) | What's included |
|---|---|---|
| **Free** | $0 | Full **reading** (all chapters, glossary, patterns, FAQ, job-market), search, **1 guided-practice sample**, limited AI tutor (daily cap), progress/bookmarks |
| **Pro** | ~$29–39/mo · ~$199/yr | **Unlimited** guided practice, **AI mock interviewer**, whiteboard AI critique, unlimited AI tutor, spaced repetition, study plans, company question lists, readiness analytics |
| **Teams / Bootcamp** | per-seat (custom) | Cohorts, assignments, progress dashboards, seat management |
| **Enterprise / Interviewer** | custom | Rubric tooling, private question sets, SSO (later) |

- **Why keep reading free:** it's the SEO funnel, it honors the MIT/open ethos and
  attribution, and the *assessment/AI* layer is where willingness-to-pay actually is
  (mirrors Hello Interview, which gives content but charges for guided practice + AI).
- **Conversion loop:** reader hits a paywalled *mock*/*guided-practice* moment right when
  intent is highest ("I've read it, now test me").
- Founder note: revisit exact price after the first cohort; Hello Interview sits ~$36/mo.

---

## 12. Content strategy & licensing (must-read)

The corpus is **MIT-licensed** — reuse and commercial use are allowed, but the license &
copyright notice must be **preserved and attributed to Om Bharatiya**.

**Recommended posture (default): Ingest-with-attribution + Partner/contribute-back.**
1. **Ingest** the upstream repo into our typed schema; render with **visible per-page
   attribution** and a repo link; ship the MIT `LICENSE` and a `CREDITS` page.
2. **Contribute back** improvements/corrections as PRs (the repo says "PRs welcome") — this
   builds goodwill and keeps us close to the freshness source.
3. **Reach out to the author** early re: an explicit partnership/endorsement or content
   license. Lowest-risk, most durable, and potentially a distribution advantage.
4. **Add our own moat content** that isn't derivative: interactive rubrics, company lists,
   AI-generated practice variants, our own case studies and mock scenarios.

**Freshness is the real moat** (the source updates monthly with new models/pricing/roles).
Our pipeline (E11) + an editorial cadence must keep pace, or the derivative goes stale
faster than the original. Budget for a part-time editor/curator from day one.

> ⚠️ Open decision (see §17): fork-and-attribute vs. formally license/partner. The PRD
> recommends pursuing the partnership conversation **before** heavy content investment.

---

## 13. Roadmap

Phased to get a **free reader live fast** (funnel + SEO), then layer the monetized AI core.

| Phase | Theme | Scope | Exit criteria |
|---|---|---|---|
| **P0 — Foundation** (wks 1–3) | Pipeline + design system | Repo ingest → MDX/records, schema, auth, IA, design system, deploy skeleton | Content renders from DB; auth works; CI/CD + eval harness stubbed |
| **P1 — Free Reader (MVP-A)** (wks 3–7) | Learn | E1 reader, E2 question bank (study mode), search, glossary, patterns, bookmarks/progress, landing | Public beta: all content browsable + searchable, mobile-clean, attributed |
| **P2 — Interactive Core (MVP-B)** (wks 7–12) | Practice + Tutor | E3 guided practice, E5 whiteboard canvas, E6 AI tutor (grounded), E8 basic progress, Stripe paywall | A user can complete a guided SPIDER walkthrough with AI feedback; tutor cites sources; can subscribe |
| **P3 — AI Mock Interviewer** (wks 12–18) | Interview | E4 mock (text), rubric scorecards, session replay, E7 flashcards | A Pro user runs a full scored mock end-to-end; eval-gated quality bar met |
| **P4 — Personalization & Career** (wks 18–24) | Coach + Career | E6 study plans, E8 readiness score, E2 company lists, E9 behavioral trainer + job hub | Personalized plan per role; company lists live; readiness dashboard |
| **P5 — Community, Teams, Voice** (24+) | Scale | E10 teams/cohorts, community, E4 voice mode, (optional) live-mock marketplace | B2B pilot; voice mock beta |

**MVP definition (what we ship to first real users):** end of **P2** — free reader +
guided practice + AI tutor + subscription. **Flagship moment:** end of **P3** — the AI
mock interviewer.

---

## 14. Success metrics

| Category | Metric | Target signal |
|---|---|---|
| Acquisition | Organic sessions, signups | SEO on "AI engineer interview / RAG system design interview" |
| Activation | % new users who read ≥3 chapters **and** do 1 practice in wk 1 | North-star leading indicator |
| Engagement | WAU/MAU, chapters/user, **mock sessions/user** | Habit formation |
| Learning outcome | Readiness-score lift; self-reported "passed an AI interview" | Product truth |
| Monetization | Free→Pro conversion, MRR, churn | Business viability |
| AI quality | Grader agreement w/ human rubric, tutor citation-groundedness, hallucination rate | Trust |
| Content | Freshness (% chapters verified < 60d), coverage | The moat |

**North-star metric:** **weekly completed practice/mock sessions** (the behavior that both
predicts a paid conversion and represents real value delivered).

---

## 15. Risks & mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Content goes stale** vs. the living original | High | Automated ingestion + editorial cadence + freshness dashboard; contribute upstream |
| **AI hallucination** erodes trust in a *study* tool | High | Grounded RAG w/ citations, rubric-driven scoring, eval-gated prompts, "not sure" behavior |
| **Licensing/attribution** dispute or bad optics | Med-High | MIT compliance, visible attribution, pursue partnership early (§12) |
| **AI cost** per mock/tutor session | Med | Model tiering, prompt/semantic caching, token budgets, streaming; monitor unit economics |
| **Differentiation** — "why not just read aidaddy.tech free?" | Med | Lead with assessment/AI/practice; keep reading free so the wedge is clearly the interactive layer |
| **Scope creep** (voice, live marketplace early) | Med | Strict phase gates; MVP = end of P2 |
| **Prompt injection** via user answers/diagrams | Med | Treat user content as untrusted; isolate system prompt; the corpus's own defense patterns |
| **Small initial content team** can't sustain cadence | Med | Fund a part-time curator from day 1; automate ingestion |

---

## 16. Open questions / decisions needed

These are the decisions where **your input changes the build** — flagged rather than assumed:

1. **Content relationship:** silent MIT fork-and-attribute vs. actively pursue a
   partnership/license with the author? *(PRD recommends: pursue partnership first.)*
2. **Brand/name:** keep working name "Simplify AI Engineering," or pick a product brand?
3. **Monetization exact price** and whether behavioral/career content is free or Pro.
4. **Voice mock priority:** is voice a P2 must-have or a later nice-to-have?
5. **Live human mock marketplace:** in scope at all, or stay fully AI-driven?
6. **Auth/host preferences:** Clerk vs Auth.js; Neon vs Supabase; any existing accounts.
7. **Team/B2B focus:** how early do we chase bootcamp/employer revenue vs. B2C only?

---

## 17. Appendix

### A. Content inventory (summary)
20 sections · ~120 technical chapters · **116 interview questions** · **9 whiteboard
exercises** · **20 case studies** · 5 answer frameworks · glossary · pattern catalog ·
job-market hub · transition guide · courses · 2 long-form eval deep-dives. Full breakdown
in [`source-analysis.md`](./source-analysis.md).

### B. Answer frameworks (to model as first-class)
SPIDER (system design) · ETA (concept) · Tradeoff · Debugging · STAR-L (behavioral).

### C. Key references
- aidaddy.tech source corpus: `ombharatiya/ai-system-design-guide` (MIT).
- [Hello Interview](https://www.hellointerview.com) — product model reference (Guided
  Practice, AI tutor, whiteboard, freemium pricing).
- June-2026 AI job-market analysis (in the corpus) — persona & positioning basis.

### D. Glossary of our platform terms
- **Track** — a curated ordered path of chapters/questions for a goal or role.
- **Guided Practice** — an interactive, checkpoint-graded walkthrough of an exercise.
- **Mock** — a full AI-run interview session producing a scorecard.
- **Rubric** — the data-defined criteria (from question "signals") used to score answers.
- **Readiness Score** — coverage × recency × mock performance, per track/role.
