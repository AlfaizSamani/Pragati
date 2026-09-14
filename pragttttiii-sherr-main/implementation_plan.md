# PRAGATI Landing Page — Premium UI Redesign

Transform the current static landing page into a premium, interactive infrastructure-intelligence experience with 3D visuals, scroll animations, and PRAGATI-authentic content.

## Current State

The landing page at [page.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/app/page.tsx) uses [Navbar.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/layout/Navbar.tsx) + 5 section components (Hero, Opportunity, Mission, ImpactAreas, DarkIntelligence, FeaturedProjects). Many existing landing components in `components/landing/` (WorkflowSection, PaimanaComparison, EarlyWarningSection, IntelligenceCapabilities, InterventionPriority, CallToAction, Footer) are **not used** in page.tsx but contain good content. The hero has a broken external image URL for its right side. Nav links are all `href="#"` and don't work.

## Proposed Changes

### Phase 1 — Dependencies & Infrastructure

#### [MODIFY] [package.json](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/package.json)
Add required packages:
- `@react-three/fiber` + `@react-three/drei` — for the 3D infrastructure hero visual
- `three` + `@types/three` — Three.js core
- `gsap` — for GSAP ScrollTrigger-powered scroll animations

> [!NOTE]
> React Three Fiber is well-supported with React 19. GSAP free version includes ScrollTrigger for non-commercial/educational use (SIH demo).

---

### Phase 2 — Navbar Redesign

#### [MODIFY] [Navbar.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/layout/Navbar.tsx)
Complete overhaul:
- **Brand**: Show "प्रगति" as primary Hindi brand mark (large, styled) + "PRAGATI" as complementary English text beside it
- **Navigation**: `Why PRAGATI (#why-pragati)` | `How It Works (#how-it-works)` | `Projects (/projects)` | `Impact (#impact)` | `About (#about)`
- **All links must work** — anchor links scroll smoothly, Projects navigates to `/projects`
- **CTA button**: "Explore Projects →" links to `/projects`
- **Mobile hamburger menu** with same working links
- **Scroll-aware**: transparent at top → frosted white on scroll
- No Command Center references
- Remove the Search/Settings icons (unnecessary on landing)

---

### Phase 3 — Hero Section Redesign

#### [MODIFY] [HeroSection.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/landing/HeroSection.tsx)
**Left column:**
- "प्रगति" branding (large, premium)
- "Predictive Infrastructure Intelligence" headline
- Supporting copy from architecture doc: "From data to foresight — identifying risks, enabling timely interventions, and accelerating India's progress."
- "Explore PRAGATI" CTA → `/projects`
- "See How It Works" secondary → `#how-it-works`
- Portfolio metrics row (1,200+ projects, 28 States, 12 Sectors, ₹24L Cr)

**Right column — 3D Infrastructure Scene:**

#### [NEW] [InfrastructureScene.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/landing/InfrastructureScene.tsx)
Interactive React Three Fiber canvas showing:
- **India-shaped terrain/grid plane** made with a subtle grid pattern
- **Infrastructure project nodes** — glowing spheres/cubes at different positions representing project types (highways, railways, power, metro) with different colors matching risk levels
- **Data flow lines** — animated particle/line effects connecting nodes, representing data/risk signals flowing through the network
- **Risk pulse indicators** — nodes gently pulse at different rates based on risk level
- **Cursor-based parallax** — subtle camera movement following mouse position
- **Ambient motion** — slow continuous rotation/float, data particles flowing

This is NOT a generic AI sphere. It represents an infrastructure network map with project nodes and data intelligence flows.

---

### Phase 4 — Scroll Experience & Section Restructure

#### [NEW] [ScrollAnimationProvider.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/landing/ScrollAnimationProvider.tsx)
GSAP ScrollTrigger initialization wrapper that provides scroll-triggered animations across all sections.

#### [MODIFY] [page.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/app/page.tsx)
Restructure the landing page sections in this order:

1. **Navbar** (fixed, scroll-aware)
2. **Hero** (redesigned with 3D visual)
3. **Why PRAGATI / PAIMANA→PRAGATI** (`#why-pragati`) — Evolved from OpportunitySection + PaimanaComparison
4. **How It Works / Workflow** (`#how-it-works`) — Predict → Explain → Prioritize → Intervene pipeline with scroll-triggered animations
5. **Intelligence Capabilities** (`#intelligence`) — Cost Risk, Schedule Risk, Progress, Peer Benchmarking 
6. **Early Warning** — Timeline visualization showing prediction lead time
7. **Intervention Priority** (`#impact`) — Risk × Impact × Persistence × Evidence formula
8. **Featured Projects** (`#projects`) — Project cards linking to `/projects`
9. **About / CTA** (`#about`) — Final CTA section  
10. **Footer** — Restored with proper links

#### [MODIFY] [OpportunitySection.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/landing/OpportunitySection.tsx)
Redesign as the "Why PRAGATI" section with:
- The PAIMANA → PRAGATI evolution story (monitoring → prediction)
- Scroll-triggered reveal of "Today: We See Progress" → "Tomorrow: We Prevent Delays"
- Use GSAP scroll-triggered animations instead of basic framer-motion fade-ins
- Add `id="why-pragati"`

#### [MODIFY] [WorkflowSection.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/landing/WorkflowSection.tsx)
Elevate the "How It Works" section:
- Scroll-animated pipeline: **Monitor → Predict → Explain → Prioritize → Intervene**
- Each step reveals with a GSAP scroll trigger, not just basic viewport fade-in
- Animated connecting line progresses as user scrolls
- Premium styling with icons, brief descriptions, and visual weight
- Ensure `id="how-it-works"` is present

#### [MODIFY] [ImpactAreasSection.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/landing/ImpactAreasSection.tsx)
Improved with scroll animations and premium card styling.

#### Existing sections reused with enhancements:
- **EarlyWarningSection** — add GSAP scroll-triggered timeline reveal
- **InterventionPriority** — add `id="impact"`, polish styling
- **FeaturedProjects** — ensure "View All" links to `/projects`, add scroll animations
- **Footer** — restore in page.tsx, add `id="about"` to CTA section above it

#### [MODIFY] [MissionSection.tsx](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/components/landing/MissionSection.tsx)
Convert this into the "About" section with `id="about"`. Keep the mission content but restyle for a premium CTA section.

#### Remove from page.tsx:
- **DarkIntelligenceSection** — dark navy theme contradicts the light/white visual direction. Its map concept is replaced by the 3D hero, and its stats are already in the hero metrics.

---

### Phase 5 — Visual Polish

#### [MODIFY] [globals.css](file:///D:/Safwan/SIH%202026/pragttttiii-sherr-main/app/globals.css)
Add:
- Smooth scroll behavior (already exists)
- GSAP-related utility classes
- Premium animation keyframes (subtle pulse, glow, float)
- Canvas/3D container styling

---

## Open Questions

> [!IMPORTANT]
> **Hindi PRAGATI Logo**: You mentioned an "uploaded official Hindi PRAGATI logo". I don't see a logo image file in the `public/images/` directory — there's only `hero.png`. Should I:
> - Use styled text "प्रगति" in a premium typeface (the current approach)?
> - Or do you have a specific logo file to upload to `public/images/`?

> [!NOTE]
> **About section**: The nav includes "About" but the existing content doesn't have a dedicated About section. I plan to convert the MissionSection into the About/CTA section. The content will remain PRAGATI-authentic ("Empowering officials with predictive intelligence...").

## Verification Plan

### Automated Tests
```bash
npm run build
npm run dev
```

### Manual Verification (Browser Inspection)
- [ ] **3D hero visual renders** — infrastructure nodes visible, no blank canvas
- [ ] **Cursor interaction** — move mouse over hero, camera parallax responds
- [ ] **Scroll animations fire** — workflow steps, timeline nodes, cards animate on scroll
- [ ] **Navbar links work** — each anchor scrolls to correct section
- [ ] **Projects link** — navigates to `/projects` 
- [ ] **CTA buttons** — "Explore PRAGATI" → `/projects`, "See How It Works" → scrolls
- [ ] **Mobile responsive** — hamburger menu, stacked layout, 3D canvas scales
- [ ] **No Command Center** references anywhere
- [ ] **Visual quality** — light/white theme, sky blue/cyan accents, no purple/neon
- [ ] **No broken images** — remove external URLs that 404
- [ ] **Footer visible** with proper links
- [ ] **Content accuracy** — all text sourced from architecture doc, no invented features
