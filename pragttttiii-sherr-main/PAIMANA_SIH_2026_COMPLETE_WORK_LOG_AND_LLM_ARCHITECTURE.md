# **PAIMANA Sentinel — Complete Research, Engineering & Product Work Log** 

_SIH 2026 · SIH26103 · MoSPI / IPMD · Stages 0–11 + Stage 12 LLM Integration Plan_ 

**Purpose: preserve the full project journey, evidence, decisions, limitations, and next implementation steps in one technical record.** 

## **1. Executive Summary** 

PAIMANA Sentinel is the predictive decision-support layer we designed on top of PAIMANA/IPMD monthly infrastructure-project monitoring. The central product idea is simple: PAIMANA records what is happening; Sentinel estimates what is likely to happen next, explains the evidence, benchmarks the project against peers, and helps officials decide which projects deserve attention first. 

The research deliberately went beyond a single model experiment. We built a longitudinal project-month panel, resolved project identities across changing identifiers, engineered point-in-time features, defined multiple futurerisk targets, tested statistical/survival/boosting/longitudinal approaches, audited leakage and provenance, built risk scoring and early-warning logic, added peer benchmarking, and built an intervention-prioritization layer. 

A major part of the work was forensic reconciliation of competing pipelines, including a friend's reported 0.94 result. The 0.94 was not accepted as a benchmark because its original target/protocol/provenance could not be aligned with the controlled evaluation. Later controlled experiments showed the leading feature sets were statistically tied. The final system direction was therefore frozen around the already-audited LightGBM-DART pipeline rather than reopening the whole downstream system for a statistically unproven alternative. 

This document is a project record, not a presentation prompt. It intentionally preserves historical results, because different experiments answered different questions. 

## **2. SIH Problem and Product Definition** 

Problem statement: build a web-based integrated project-monitoring platform for MoSPI/IPMD that adds AIpowered predictive analytics and an early-warning system for cost escalation, schedule delays and implementation risk. 

- Monitoring scope: Central Sector infrastructure projects costing ₹150 crore and above. 

- PAIMANA contains approved/original cost, revised cost, expenditure, timelines, physical progress, milestones, implementing agency, project status and monthly updates. 

- The intended system must identify likely deterioration before it becomes an established overrun, provide evidence for the warning, and support intervention prioritization. 

- The SIH dimensions addressed were: predictive/statistical modeling; AI/ML versus conventional statistical methods; and predictive value of existing CUF fields versus additional derived/context variables. 

Product identity: PAIMANA Sentinel — Predictive Infrastructure Risk Intelligence & Early Warning System. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

Product positioning: not an AI chatbot and not merely another dashboard. It is a predictive decision-support layer that sits above PAIMANA data. 

## **3. Official Portfolio Context Used in the Research Story** 

|Metric|Verifed context|
|---|---|
|Ongoing projects|1,981 (April 2026 context)|
|Ministries/Departments|17|
|Infrastructure sectors|22|
|Original cost|~₹37.13 lakh crore|
|Revised cost|~₹42.78 lakh crore|
|Cumulative expenditure|~₹20.36 lakh crore|
|Physical progress context|801 projects >80% physical progress|
|Financial completion context|277 projects >80% fnancial completion|



These portfolio figures are context for the problem and product. They are not model-training metrics. 

## **4. Research Data We Actuall Built** **<u>y</u>** 

|Item|Value|
|---|---|
|Monthly snapshots|13|
|Period|June 2025 through June 2026|
|Project-month rows|18,033|
|Unique canonical projects|2,650|
|Complete 13-month trajectories|378|
|Projects appearing in only one month|495|
|Feature table columns|79|



The panel is longitudinal and irregular. This matters because ordinary random row splitting would allow the same project to appear on both sides of the split and would ignore temporal dependence. 

## **5. Stage 0 — Data Discovery, Reconciliation and Entity Resolution** 

The first major engineering problem was not ML. It was identifying the same project across monthly reports and across OCMS/PAIMANA identifier changes. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

- June 2025 used older OCMS-style identifiers; PAIMANA-era records used a different project-code regime. 

- Legacy OCMS Code appeared later and provided a direct crosswalk. 

- 1,152 clean/unambiguous mappings were built; 1,150 of 1,595 June 2025 projects resolved directly, about 72.1%. 

- The remaining unmatched cases were not automatically treated as failed matches because portfolio churn can mean a project left the reporting universe before the later crosswalk existed. 

- Fuzzy matching was therefore treated as a fallback, not the backbone of identity resolution. 

A second important issue was structural missingness: MoRTH was absent from November 2025 and reappeared in December 2025, creating roughly 522 additional rows. The system must not interpret a ministry/reporting gap as project deterioration. 

## **6. Stage 1 — Point-in-Time Panel Construction** 

We converted monthly reports into a project-month panel. Each row represents the information available for a canonical project at a particular reporting month. 

The core rule became the most important scientific rule in the project: 

At month t, every model feature must be computable from information available at or before t. 

- Future physical progress cannot be a feature. 

- Future completion dates cannot be a feature. 

- Future target values cannot be a feature. 

- Future revisions cannot be used unless the revision was genuinely known at the prediction snapshot. 

- Historical/peer features must also be constructed without using future rows or same-period outcomes. 

## **7. Stage 2 — Feature Engineering** 

The feature table combined raw/current-state variables, normalized project-state variables, longitudinal dynamics, data-quality signals, and selected peer/history context. 

|Feature family|Examples|
|---|---|
|Current/CUF|original cost, revised/current cost, expenditure,<br>physical progress, dates, ministry, sector, agency,<br>state|
|Project state|elapsed months, planned duration, time-elapsed ratio,<br>months to deadline, overdue fags|
|Cost|cost escalation %, utilization ratio, cost-progress<br>divergence|



PAIMANA Sentinel — SIH26103 — Complete Work Log 

|Schedule|schedule slip to date, revised-date fags|
|---|---|
|Trajectory|1-month/3-month progress velocity, acceleration,<br>expenditure velocity|
|Change/history|cost changed, document changed, revision counts,<br>months since last revision|
|Cross-project context|sector peer percentile, peer divergence, agency<br>historical overdue rate|
|Data quality|bad duration, implausible utilization,<br>missingness/structural-reporting fags|



We discovered that irregular reporting makes naive row-position differences unsafe. A six-month gap can look like a one-row difference if calendar distance is not explicitly normalized. That bug was found and corrected during the Friend pipeline audit. 

## **8. Stage 3 — Target Design** 

Several targets were deliberately tested because the SIH problem contains multiple notions of risk. 

|Target|Purpose / defnition|
|---|---|
|target_at_risk_6m|Composite future risk over six calendar months;<br>schedule deterioration or defned cost escalation<br>condition|
|target_at_risk_3m|Shorter-horizon composite used in the corrected DART<br>model-of-record benchmark|
|Schedule deterioration|Standalone future schedule deterioration event|
|Cost escalation|Standalone future cost escalation event|
|Progress stall|Standalone future progress-stall event|
|Friend original composite|Diferent thresholds including >10% cost growth, >2<br>months time slip and progress stall|



This target variation is one of the main reasons apparently different PR-AUC scores must not be placed on one leaderboard. 

## **9. Stage 4 — Baselines and Model Race** 

The research tested several modeling philosophies instead of assuming one algorithm would win. 

|Lane|Approaches|Lesson|
|---|---|---|
|Main / Claude|LightGBM-DART, boosted trees,|Strong general-purpose tabular|
||SHAP, calibration|approach|



PAIMANA Sentinel — SIH26103 — Complete Work Log 

|Antigravity|Logistic regression, discrete-time<br>hazard, Cox survival|Useful statistical/time-to-event<br>baselines; not primary predictive<br>leader|
|---|---|---|
|Copilot|trajectory, persistence, explicit<br>sequence modeling|No stable evidence for replacing<br>tabular model with sequence<br>architecture|
|Friend|HistGradientBoosting + alternative<br>feature engineering|Strong alternative; original 0.94 was<br>not certifable/comparable|



The project therefore answers the SIH AI-vs-statistics question honestly: we did test conventional statistical methods and survival models. The boosting family was more useful for the primary fixed-horizon classification task in the tested environment. 

## **10. Stage 4/5 — Tuning, Validation and Calibration** 

- Temporal rather than random evaluation was used for the main forecasting story. 

- Project-level aggregation was used because the decision unit is a project, not an isolated monthly row. 

- Project-level PR-AUC became the primary metric because the event is imbalanced and the operational question is ranking risky projects. 

- Supporting metrics included ROC-AUC, row-level metrics, Brier/calibration, top-k precision and early-warning utility. 

- Train-only preprocessing and grouped/project-aware logic were used where appropriate. 

- Calibration was explored with Platt scaling and isotonic calibration. Platt was retained in the original DART pipeline, but calibration is still a monitoring item rather than a permanently solved problem. 

## **11. Stage 6 — Explainability** 

Tree-model explanations were built with SHAP/feature importance. We made an explicit distinction between predictive attribution and causality. 

Correct: 'High time-elapsed ratio and progress-vs-time gap contributed strongly to predicted risk.' 

Incorrect: 'Time elapsed caused the delay.' 

The dashboard therefore needs three separate concepts: model signal, evidence from the project record, and official interpretation/action. 

## **12. Stage 7 — Risk Scoring** 

The risk-scoring engine separates model probability from operational priority. The research benchmark used a transparent dominant-risk formulation based on cost/time probabilities, with confidence treated separately from risk. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

- Risk score: a ranking/prioritization signal on a 0–100 scale, not automatically a calibrated probability. 

- Confidence/evidence sufficiency: separate from risk magnitude. 

- Risk tiers explored: Low, Medium, High, Critical. 

- The system should expose the dominant risk type rather than hiding cost and schedule risk inside one opaque number. 

## **13. Stage 8 — Early Warning** 

The key operational question changed from 'Is this project risky?' to 'Was there enough warning time for an official to act?' 

In the historical early-warning analysis, among projects that had sufficient history to be scoreable, approximately 75% of scoreable first schedule-revision events were preceded by a High-risk warning, with median lead time of about 2 months. This is conditional, not 75% of all projects. 

This is one of the strongest product stories because the value of prediction is intervention lead time, not a large AUC number alone. 

Risk momentum was tested but did not produce a clean additional validated predictive signal. It may remain a UI aid, not a headline model feature. 

## **14. Stage 9 — Peer Benchmarking** 

Benchmarking asks: 'Is this project unusually risky relative to comparable projects?' 

- Sector peer progress percentiles. 

- Sector/cost-band cohorts. 

- Agency and ministry summaries. 

- Historical agency risk rates where enough mature history exists. 

- Fallback rules for small cohorts. 

The initial cohort design was too fine-grained. Adaptive sector × cost-band cohorts were used, with fallback to sector-only when peer counts were too small. Benchmarking is a decision-support layer unless separately validated as a predictive feature. 

## **15. Stage 10 — Intervention Prioritization** 

Stage 10 converted a risk list into an intervention queue. The government does not only need the riskiest projects; it needs the projects where risk, consequence and evidence justify attention. 

|Stage 10 output|Result|
|---|---|
|Unique projects in queue|1,547|



PAIMANA Sentinel — SIH26103 — Complete Work Log 

|Duplicate project rows|0|
|---|---|
|Rerun behavior|Deterministic|
|February top-10% priority exposure|15.98% vs 10.15% raw-risk exposure|
|March top-10% priority exposure|9.96% vs 5.03% raw-risk exposure|
|Risk-frst policy overlap|87.7%|
|Impact-frst policy overlap|83.2%|
|Persistence-frst policy overlap|89.7%|



The priority queue can concentrate attention on a more consequential subset than raw-risk sorting alone. This is operational prioritization, not causal evidence. 

## **16. Stage 11 — Forensic Model and Feature Reconciliation** 

This was the most important governance stage. We had multiple agents and a friend's model producing apparently different numbers. Instead of selecting the biggest score, we traced targets, features, preprocessing, splits, provenance and implementation. 

Historical canonical benchmark: Friend/HGB 0.8824 vs Claude/DART 0.8671 on target_at_risk_6m, six-month horizon, train through October 2025, test November–December 2025, project-level PR-AUC. This was a valid apples-to-apples benchmark, but it still contained possible model-vs-feature confounding. 

A later strict feature comparison held the HGB model, target, temporal split and project metric fixed while varying feature sets. Stored final confirmation values were approximately: CUF-only 0.945, Claude Enhanced 0.942, FriendFIXED 0.942, Friend-ORIGINAL 0.939. The bootstrap interval for CUF-only minus Friend-FIXED was [-0.007, +0.0128], which includes zero. 

Interpretation: no feature set was proven superior in that final controlled feature comparison. 

Friend pipeline audit found two concrete implementation bugs: row-position velocity differences across reporting gaps, and historical-rate construction that could risk same-month cross-project leakage. Both were patched in the fixed builder. 

The original Friend 0.94 remains reported/unverified/not comparable. We do not accuse the friend of cheating. The correct scientific statement is that the original protocol and provenance could not be certified as apples-to-apples. 

## **17. Final Model Decision — What We Chose and Why** 

Frozen primary predictive direction: LightGBM-DART using the validated Claude/main point-in-time feature philosophy, with target_at_risk_6m as the primary operational target and a six-calendar-month horizon. 

Why DART was frozen even though HGB sometimes had a higher isolated score: 

- The final controlled feature comparison did not prove a statistically meaningful feature advantage. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

- The existing DART pipeline had the most complete audited end-to-end trail. 

- Stages 5–11 downstream logic had already been built, checked and integrated around it. 

- Switching to another pipeline would reopen validation, calibration, explainability, risk scoring, early warning, benchmarking and intervention work without demonstrated predictive gain. 

- This is a governance/system decision, not a claim that DART has the highest raw PR-AUC in every experiment. 

Important: the 0.945 HGB/CUF result and the 0.8671 DART canonical result belong to different experimental contexts. They must not be combined into a single 'winner' claim. 

## **18. What We Learned From the Model Race** 

- Data engineering mattered as much as algorithm choice. 

- Entity resolution is foundational. 

- Structural missingness can create false signals. 

- Point-in-time discipline is more important than exotic modeling. 

- Project-level evaluation is more relevant than row-level accuracy. 

- PR-AUC is more useful than accuracy for an imbalanced risk event. 

- Gradient boosting is a strong fit for the current structured dataset. 

- Explicit sequence models did not demonstrate stable advantage. 

- Survival analysis is useful as a complementary 'when?' lens. 

- CUF fields already contain substantial predictive signal. 

- Peer/history context is useful but must be constructed fold-by-fold if used predictively. 

- Cost-overrun events can be sparse, so cost metrics require event counts and confidence. 

- Calibration and drift remain live monitoring problems. 

- Intervention ranking should consider exposure and evidence, not probability alone. 

## **19. Com lete Product Architecture** **<u>p</u>** 

|Layer|Responsibility|
|---|---|
|1. Ingestion|PAIMANA/API/monthly structured feeds; optional|
||PDF/document adapter|
|2. Entity resolution|Canonical project identity, crosswalk, match<br>|
||confdence, audit trail|
|3. Point-in-timepanel|Project-month state at month t|



PAIMANA Sentinel — SIH26103 — Complete Work Log 

|4. Feature engine|Current state, cost/time/progress dynamics, validated<br>history/peer context|
|---|---|
|5. ML layer|LightGBM-DART predictive models|
|6. Calibration|Validated probability calibration where supported|
|7. Risk engine|Risk probability, dominant risk, severity, confdence|
|8. Early-warning engine|Threshold crossing, persistence, lead time, alert state|
|9. Benchmarking|Peer context and portfolio comparisons|
|10. Intervention engine|Risk × impact × persistence × evidence priority|
|11. Explainability|SHAP + structured evidence|
|12. LLM copilot|Grounded natural-language explanation, search,<br>summaries and tool orchestration|
|13. Human decision|Oficial review, validation, intervention and outcome<br>capture|



## **20. LLM Integration — The Correct Role** 

The LLM must NOT become the prediction engine. The ML model predicts. Deterministic business logic calculates monetary/time impacts. The evidence store provides verified facts. The LLM explains, summarizes, searches and orchestrates tools. 

Recommended flow: 

User question → LLM decides which tool/data is required → backend executes deterministic tool → structured result returned → LLM writes an answer constrained to that evidence. 

- The LLM never reads a raw model JSON and 'figures out' the risk. 

- The LLM never invents probabilities. 

- The LLM never calculates a monetary impact from a percentage when an authoritative business-rule calculation is available. 

- The LLM never states a causal explanation from SHAP. 

- Every material claim should be backed by a project field, model output, benchmark result or evidence citation. 

## **21. Recommended LLM Model** 

Recommended primary LLM for the SIH prototype and a privacy-conscious deployment concept: **Mistral Small 4 (mistral-small-2603)**. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

Why this choice fits Sentinel: 

- Open-weight model with Apache 2.0 licensing. 

- 256k-token context window. 

- Native function calling/tool use. 

- Structured outputs. 

- Agent/conversation support. 

- Document Q&A capability. 

- Hybrid instruct/reasoning/coding design, useful for evidence synthesis and tool orchestration. 

- Small active parameter footprint relative to total model size, making it more practical than a dense frontier model when infrastructure is available. 

Mistral's current documentation lists Mistral Small 4 as a 119B-parameter model with 6.5B active parameters, 256k context, function calling and structured outputs. This makes it a strong fit for an evidence-grounded government copilot rather than a free-form chatbot. citeturn1search0turn1search1 

Practical fallback: **Ministral 3 14B** if the prototype must run on substantially smaller local infrastructure. Mistral's current model documentation lists Ministral 3 14B as an Apache 2.0 open model with a 256k context window. citeturn1search2turn1search3 

Alternative if the team already has Qwen infrastructure: Qwen3 is also a credible agentic option; the Qwen team explicitly documents tool-calling capability and Qwen-Agent for tool-using applications. citeturn1search12turn1search13 

Decision: use Mistral Small 4 as the documented first choice; keep Ministral 14B as the resource-constrained fallback; do not spend project time on a large multi-model LLM bake-off unless the first prototype fails a defined evaluation suite. 

## **22. LLM Architecture in Detail** 

|Component|Recommended design|
|---|---|
|LLM|Mistral Small 4|
|Serving|Self-hosted inference for sensitive deployment; API<br>option for prototype if policy permits|
|Retrieval|Structured database frst; vector retrieval only for long-<br>form documents|
|Tool calling|Strict JSON schemas for<br>project/risk/benchmark/intervention tools|
|Prompting|System policy + project context + tool outputs +<br>evidence citations|



PAIMANA Sentinel — SIH26103 — Complete Work Log 

|Output|Structured answer object + human-readable<br>explanation|
|---|---|
|Guardrail|Reject unsupported claims and require evidence IDs<br>for material assertions|
|Audit|Store question, tool calls, tool results, model version,<br>response and timestamp|
|Human-in-loop|Oficial can inspect evidence and override/reject<br>recommendation|



## **23. LLM Tools We Should Im lement** **<u>p</u>** 

|Tool|Purpose|
|---|---|
|get_project(project_id)|Current verifed project record|
|get_project_history(project_id, months)|Monthly trajectory and changes|
|get_risk(project_id)|Latest model probabilities, risk type, score, confdence|
|get_risk_explanation(project_id)|Top SHAP/model signals plus actual feature values|
|get_peer_context(project_id)|Sector/cost-band peer position|
|get_intervention_priority(project_id)|Priority score and review category|
|list_priority_projects(flters)|Top projects by risk/priority with flters|
|compare_projects(project_ids)|Side-by-side evidence comparison|
|get_alert_history(project_id)|Warnings, persistence and lead-time history|
|get_evidence(project_id, claim_id)|Source felds/report month supporting a claim|
|calculate_cost_impact(project_id, scenario)|Deterministic monetary calculation|
|calculate_schedule_impact(project_id, scenario)|Deterministic time calculation|



## **24. Example LLM Interaction** 

User: 'Why is Project P high risk?' 

Tool sequence: get_project → get_risk → get_risk_explanation → get_peer_context → get_alert_history. 

LLM answer should contain: 

- Current predicted risk and risk type. 

- Top 3–5 predictive signals with actual current values. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

- Whether the warning persisted across reporting cycles. 

- Peer position if available. 

- Evidence/report months. 

- A cautious review recommendation such as 'schedule/implementation review recommended'. 

User: 'How much additional cost does 9% risk mean?' 

The LLM must refuse to equate probability with monetary loss. It should call the deterministic cost-impact tool if a scenario amount is defined. The answer must distinguish probability, scenario magnitude and exposure. 

## **25. LLM Guardrails** 

- No unsupported causal language. 

- No hallucinated project facts. 

- No probability modification. 

- No hidden recalculation of risk. 

- No administrative decision-making authority. 

- No disclosure of restricted project information outside the user's authorization scope. 

- Every material factual answer must be traceable to structured evidence. 

- If evidence is missing, the assistant says so. 

- If a number is from a historical benchmark rather than live inference, label it as historical. 

- If the model is not mature enough for a six-month forecast for a recent project, expose that confidence limitation. 

## **26. LLM Evaluation Plan** 

The LLM should be evaluated separately from the ML model. A good LLM is not one that predicts risk better; it is one that explains verified risk correctly and refuses to invent unsupported claims. 

|Test category|Example metric|
|---|---|
|Groundedness|% answers whose material claims are supported by<br>returned evidence|
|Tool accuracy|Correct tool selected for the question|
|Numerical fdelity|No changes to model probabilities / deterministic<br>calculations|
|Citation/evidence fdelity|Correct project/report/evidence references|



PAIMANA Sentinel — SIH26103 — Complete Work Log 

|Refusal quality|Unsupported questions are explicitly marked|
|---|---|
||unsupported|
|Action usefulness|Oficials can identify the relevant review category|
|Latency|End-to-end response time|
|Security|Authorization and data-scope tests|



## **27. Deployment and Technology Stack** 

- Backend: Python, pandas/scikit-learn/LightGBM, FastAPI or equivalent. 

- Database: relational project-month store with versioned snapshots. 

- Model registry: versioned model + feature-builder + preprocessing artifacts. 

- Frontend: React/Next.js or equivalent government/enterprise dashboard. 

- Inference API: deterministic feature builder + versioned DART artifact. 

- LLM service: Mistral Small 4 behind a policy/tool gateway. 

- Audit store: prediction logs, evidence references, LLM tool traces and human review outcomes. 

- Monitoring: data drift, missingness, prediction distribution, calibration, rolling-origin performance, alert volume. 

## **28. Monthly Inference and Retraining Strategy** 

Do not retrain from scratch every month. 

1. Ingest the new monthly PAIMANA snapshot. 

2. Resolve identities and validate schema/data quality. 

3. Build point-in-time features using the frozen feature contract. 

4. Run the frozen model for inference. 

5. Generate risk, alerts, benchmarks and intervention priorities. 

6. Collect future outcomes as they mature. 

7. Run scheduled rolling-origin validation. 

8. Trigger retraining only when predeclared criteria are met. 

9. Approve and version a new champion model. 

10. Keep rollback to the previous approved model. 

This distinction is important: monthly data is primarily an inference stream; retraining is a governed periodic activity after sufficient labels mature. 

## **29. Dashboard / Command Center** 

● Portfolio KPIs: monitored projects, high/critical risk, new warnings, intervention queue. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

- Risk heatmap/table: project, ministry, sector, risk, type, severity, persistence, confidence, intervention priority. 

- Filters: ministry, sector, agency, state, risk type, priority, project size, progress band. 

- Project page: summary, timeline, progress trend, cost trend, schedule changes, peer benchmark, risk trend, model drivers, alert history. 

- LLM panel: 'Why is this project high risk?', 'What changed since last month?', 'Which projects need review first?', 'What evidence supports this warning?' 

- Government-grade visual style: restrained, readable, evidence-dense, no cartoon AI graphics. 

## **30. Human-in-the-Loop Governance** 

The system recommends; officials decide. 

Model flag → official reviews evidence → official validates context → intervention/escalation decision → outcome recorded → future learning. 

This prevents the system from becoming an autonomous administrative decision-maker and makes the product much more credible for government use. 

## **31. Limitations We Must Preserve** 

- Only 13 monthly snapshots were available in the research panel. 

- Recent projects have right-censored/maturing six-month outcomes. 

- Prospective performance varies by origin period, indicating dataset/portfolio shift. 

- Detailed milestone/component-level data may be incomplete. 

- Revised cost/date semantics must be confirmed at the actual prediction timestamp. 

- Rare agencies/states may have limited training support. 

- Calibration is not perfect and must be monitored. 

- No feature set has a statistically proven universal advantage. 

- Benchmark scores from different targets/horizons/splits are not interchangeable. 

## **32. Recommended SIH Demo Flow** 

11. Open portfolio command center. 

12. Show current verified project count or a clearly labeled demo snapshot. 

13. Filter to high-risk/intervention-priority projects. 

14. Open one verified demo project. 

15. Show current state, risk, trend, signals, peer context and alert history. 

16. Ask the LLM: 'Why is this project flagged?' 

17. Show the evidence-grounded answer. 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

18. Ask: 'Which projects should officials review first?' 

19. Open the intervention queue. 

20. Explain that the system provides an evidence package; officials retain decision authority. 

## **33. What Should NOT Be Claimed in the PPT or Demo** 

- Do not say the AI achieved 94% accuracy. 

- Do not present the friend's 0.94 as the final benchmark. 

- Do not claim DART is universally the best algorithm. 

- Do not claim HGB is universally the best algorithm. 

- Do not claim SHAP proves causes. 

- Do not claim 75% of all projects are caught early. 

- Do not merge 0.930, 0.8824, 0.8671, 0.945 and other protocol-specific values into one leaderboard. 

- Do not claim production deployment, government adoption, savings or live users unless actually implemented. 

- Do not claim zero leakage or 100% accuracy. 

- Do not make the LLM the prediction engine. 

## **34. Final System Blueprint** 

PAIMANA/API → data validation → entity resolution → point-in-time project-month panel → feature engine → LightGBM-DART → calibrated/validated risk probabilities → risk score + confidence → early-warning engine → peer benchmarking → intervention priority → SHAP + evidence store → Mistral Small 4 grounded copilot → human official decision → audited outcome. 

The core value proposition is: Predict → Explain → Prioritize → Intervene. 

## **35. Final Research Status** 

|Area|Status|
|---|---|
|Data engineering|Completed research pipeline|
|Entity resolution|Completed with crosswalk-frst strategy|
|Point-in-time feature framework|Completed; governance requirement retained|
|Target design|Multiple experimental targets documented|
|Statistical/survival comparison|Completed exploratory comparison|
|Longitudinal/sequence comparison|Completed; no stable sequence advantage|
|Friendpipeline forensic audit|Completed;original 0.94 unverifed|



PAIMANA Sentinel — SIH26103 — Complete Work Log 

|Feature reconciliation|Completed; no statistically proven feature winner|
|---|---|
|Risk scoring|Completed|
|Early warning|Completed with conditional lead-time evidence|
|Peer benchmarking|Completed, pass with conditions|
|Intervention prioritization|Completed, deterministic rerun|
|Model freeze|LightGBM-DART system direction retained|
|Dashboard|Next implementation phase|
|LLM copilot|Next implementation phase; Mistral Small 4<br>recommended|
|Production deployment|Not claimed; deployment-ready architecture only|



## **36. Source and Evidence Notes** 

This record consolidates the project's existing research handoffs and controlled artifacts. The main research handoff explicitly documents the 18,033-row/2,650-project panel, the competing model lanes, target differences, historical benchmark results, leakage lessons and the DART freeze rationale. The presentation handoff documents the Stage 7–10 product logic, final feature comparison, dashboard architecture and LLM separation principle. 

Current LLM recommendation was additionally checked against official Mistral and Qwen documentation. Mistral Small 4 is documented as an Apache 2.0, 256k-context model with function calling and structured outputs. Qwen3 documentation also confirms tool-calling support and Qwen-Agent for agentic applications. citeturn1search0turn1search12turn1search13 

## **37. Bottom Line** 

We are no longer at the 'try another model' stage. The research has already covered data engineering, target design, statistical baselines, survival analysis, boosting, longitudinal modeling, feature ablation, leakage checks, forensic reconciliation, early warning, benchmarking and intervention prioritization. The next work should be productization: build the command center, implement the grounded LLM copilot, connect the prediction engine to deterministic tools, add governance/audit logging, and harden the demo. 

For the LLM, choose Mistral Small 4 first. Keep the LLM subordinate to verified ML and deterministic business logic. The strongest architecture is not 'LLM predicts infrastructure risk'; it is 'ML predicts, rules calculate, evidence grounds, LLM explains and orchestrates, humans decide.' 

PAIMANA Sentinel — SIH26103 — Complete Work Log 

