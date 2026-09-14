# PRAGATI — Engineering Instructions

## 1. Product Identity

PRAGATI is a predictive infrastructure intelligence and decision-support platform.

Core product flow:

Predict → Explain → Prioritize → Intervene

PRAGATI is not a generic AI chatbot and not merely an administrative dashboard.

PAIMANA records what is happening.
PRAGATI estimates what is likely to happen next, explains the evidence, benchmarks projects against peers, and helps officials decide where attention is needed first.

The complete project specification is in:

PAIMANA_SIH_2026_COMPLETE_WORK_LOG_AND_LLM_ARCHITECTURE.md

Read that document before making major product or architectural decisions.

---

## 2. Frontend Goal

Build a polished, production-quality frontend suitable for an SIH 2026 demonstration.

The frontend must feel like a serious Indian government infrastructure intelligence platform.

Primary demo flow:

Landing
→ Command Center
→ High-risk project
→ Project Details
→ Why is this project flagged?
→ Evidence
→ Intervention Priority

Prioritize this flow over building many low-quality pages.

---

## 3. Visual Direction

The visual language should be a modern evolution of PAIMANA.

Use:

- predominantly white/light backgrounds
- sky blue and cyan as primary visual colors
- selective royal/dark blue
- golden/orange accents for important CTAs and attention states
- spacious layouts
- large visual cards
- subtle shadows
- rounded but professional components
- infrastructure photography
- charts and maps
- strong visual hierarchy
- restrained animations

The interface should feel:

- modern
- institutional
- trustworthy
- premium
- Indian
- visual
- easy to understand

### Avoid

Do NOT create:

- dark navy-heavy interfaces
- purple AI gradients
- neon/cyberpunk aesthetics
- excessive glassmorphism
- generic SaaS dashboards
- cartoon AI/robot graphics
- generic ChatGPT clones
- overly dense admin tables
- excessive text blocks
- unnecessary decorative effects

Charts, maps, visual indicators and meaningful cards should communicate information wherever possible.

---

## 4. Technology

Use:

- Next.js
- TypeScript
- React
- Tailwind CSS
- reusable components
- responsive design

Prefer clean, maintainable component architecture.

Keep data, UI components and business logic separated.

Do not hardcode large datasets directly inside page components.

---

## 5. Data Architecture

Initially use realistic typed mock data.

Create a clear mock-data/API abstraction so the frontend can later connect to FastAPI without requiring a major UI rewrite.

Mock data should represent:

- projects
- project history
- risk scores
- dominant risk
- confidence
- predictive signals
- evidence
- alerts
- peer benchmarks
- intervention priorities

Never scatter fake values throughout components.

---

## 6. Risk Presentation

PRAGATI separates:

1. Risk
2. Confidence / evidence sufficiency
3. Dominant risk type
4. Predictive signals
5. Evidence
6. Official interpretation/action

Risk should not be presented as guaranteed future failure.

Risk scores are decision-support signals.

Do not present SHAP/model attribution as causality.

Correct:

"Progress-vs-time gap contributed strongly to predicted risk."

Incorrect:

"Progress-vs-time gap caused the delay."

---

## 7. PRAGATI Intelligence

The AI interface must NOT look like a generic ChatGPT clone.

It should feel like an evidence-grounded infrastructure analyst.

Suggested contextual questions:

- Why is this project high risk?
- What changed since last month?
- Which projects need attention first?
- What evidence supports this warning?

Responses should visually distinguish:

- risk
- signals
- evidence
- peer context
- reporting month
- confidence
- recommended review category

Architecture:

ML predicts.
Deterministic business logic calculates.
Evidence grounds.
LLM explains and orchestrates.
Officials decide.

The LLM must never invent project facts, probabilities, causal explanations or monetary impacts.

---

## 8. Main Application Screens

Build toward these screens:

1. Landing / Product Introduction
2. Command Center
3. Projects
4. Project Details
5. Risk Monitor
6. Early Warnings
7. Peer Benchmarking
8. Intervention Priority
9. Analytics
10. PRAGATI Intelligence

However, do not sacrifice quality simply to complete all ten screens.

The Command Center, Project Details and Intervention Priority screens are the highest priority.

---

## 9. Command Center

The Command Center should communicate portfolio-level intelligence.

Include appropriate visualizations for:

- monitored projects
- high/critical risk
- new warnings
- intervention queue
- risk distribution
- high-risk projects
- early warnings

Useful filters include:

- ministry
- sector
- agency
- state
- risk type
- priority
- project size
- progress band

Avoid making the Command Center a wall of tables.

---

## 10. Project Details

This is one of the most important screens.

Show:

- project identity
- current cost
- progress
- schedule status
- risk score
- dominant risk
- confidence
- progress trend
- cost trend
- schedule changes
- risk trend
- predictive signals
- peer benchmark
- alert history
- evidence
- PRAGATI Intelligence

The page should make it possible for an official to understand:

"What is happening?"
"What is likely to happen?"
"Why does the system think that?"
"What evidence supports it?"
"What deserves review?"

---

## 11. Intervention Priority

Do not simply sort projects by risk.

The product concept considers:

Risk × Impact × Persistence × Evidence

The interface should communicate why a project has been prioritized.

Show meaningful factors such as:

- risk
- consequence/impact
- persistence
- evidence sufficiency
- priority level
- recommended review category

This is an intervention-support system, not an autonomous decision-maker.

---

## 12. Human-in-the-Loop

Always preserve this principle:

Model flag
→ Official reviews evidence
→ Official validates context
→ Intervention/escalation decision
→ Outcome recorded

PRAGATI recommends.
Officials decide.

Never design UI language implying that PRAGATI automatically makes government decisions.

---

## 13. Engineering Rules

Before making significant changes:

1. Inspect the existing code.
2. Understand the current architecture.
3. Reuse existing components where appropriate.
4. Do not unnecessarily rewrite working code.
5. Keep components modular.
6. Keep TypeScript types explicit.
7. Avoid duplicated logic.
8. Test the application after significant changes.
9. Check responsive behavior.
10. Check the browser visually before declaring a UI task complete.

Never claim something works without actually testing it.

---

## 14. Design Quality Rule

Do not settle for the first acceptable implementation.

After implementing a major page:

- inspect visual hierarchy
- check spacing
- check typography
- check alignment
- check responsive behavior
- check information density
- remove unnecessary elements
- ensure the page feels like one coherent product

The goal is not "technically complete".

The goal is:

A polished, credible, demo-ready PRAGATI product.

---

## 15. Important Research Constraints

Do not invent research claims.

The project has specific limitations and experimental results documented in the project work log.

Do not:

- claim 94% accuracy
- claim DART is universally the best model
- claim HGB is universally the best model
- claim SHAP proves causality
- claim 75% of all projects are caught early
- merge metrics from different experimental protocols
- claim production deployment
- claim government adoption
- claim savings unless actually demonstrated
- claim zero leakage
- claim 100% accuracy

When presenting research metrics in the UI, clearly distinguish historical benchmark/demo information from live inference.

---

## 16. Product Mantra

Everything in the product should reinforce:

# Predict → Explain → Prioritize → Intervene

The interface should make this concept obvious without requiring the user to read a long explanation.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
