# Phase 2 — Persona Expansion
**Target ship date:** ___________
**Page count:** 25 (15 persona pages + 8 tier-2 location pages + 2 comparison pages)

---

## Setup (same as Phase 1)

Run in a fresh Claude Code session inside `~/client-redesign-kit/sites/the-mma-district/`.

**First, load context** by reading:
- `content-profile.json`, `brand-kit.json`, `design-direction.md`, `styles.css`
- `seo-roadmap/keywords.json`, `seo-roadmap/roadmap.md`
- The completed Phase 1 pages (`locations/`, `learn/`, `best/` folders) to match patterns
- `.agent/skills/programmatic-seo/SKILL.md` and `.agent/skills/seo-audit/SKILL.md`

---

## Pages to build

### Section A — 15 PERSONA PAGES (`/programs/{service}-for-{persona}/`)

Create directory `programs/`. Each page is the same service viewed through a specific audience lens.

| # | URL | Primary Keyword | H1 |
|---|---|---|---|
| 1 | `/programs/mma-for-beginners/` | MMA for beginners LA | MMA for Beginners |
| 2 | `/programs/muay-thai-for-beginners/` | Muay Thai for beginners LA | Muay Thai for Beginners |
| 3 | `/programs/jiu-jitsu-for-beginners/` | BJJ for beginners LA | No-Gi Jiu-Jitsu for Beginners |
| 4 | `/programs/jiu-jitsu-for-women/` | BJJ for women LA | Jiu-Jitsu for Women |
| 5 | `/programs/muay-thai-for-women/` | Muay Thai for women LA | Muay Thai for Women |
| 6 | `/programs/self-defense-for-women/` | Self-defense for women LA | Self-Defense for Women |
| 7 | `/programs/jiu-jitsu-for-adults-over-40/` | BJJ over 40 LA | Jiu-Jitsu for Adults Over 40 |
| 8 | `/programs/mma-for-adults-over-40/` | MMA over 40 LA | MMA for Adults Over 40 |
| 9 | `/programs/kids-martial-arts-10-15/` | Kids martial arts LA | Kids Martial Arts — Ages 10–15 |
| 10 | `/programs/kids-jiu-jitsu-10-15/` | Kids BJJ LA | Kids Jiu-Jitsu — Ages 10–15 |
| 11 | `/programs/mma-for-tech-workers-dtla/` | MMA tech workers DTLA | MMA for DTLA Tech Workers |
| 12 | `/programs/jiu-jitsu-for-competitors/` | BJJ competition prep LA | Jiu-Jitsu for Competitors |
| 13 | `/programs/mma-for-active-duty/` | MMA for active duty LA | MMA for Active Duty Members |
| 14 | `/programs/fight-fit-for-weight-loss/` | Fight training weight loss LA | Fight Fit for Weight Loss |
| 15 | `/programs/mma-for-creatives-arts-district/` | MMA Arts District creatives | MMA for DTLA Creatives |

**Content outline per persona page (~700 words unique each):**
1. Hero — page-header with mono eyebrow `// Programs · For {persona}`, H1, Fraunces lead one-liner explicit to the persona's intent
2. **Why this persona matters / common concerns** — answer the audience's actual hesitation (e.g., "Will I get hurt training MMA over 40?")
3. **How we structure training for {persona}** — class flow + safety standards specific to that persona
4. **Coaches who specialize for this audience** — Dawn for women + self-defense, Jamie for adults/over-40 BJJ, Edward for fighters, Hanny for female founders, etc.
5. **Real outcomes** (testimonial slot — flag to user if not available)
6. **Membership fit** — which membership tier or program fits best (link)
7. **Cross-links** — 3 related personas + 1 link to the service hub
8. **CTA** + footer

**Schema:** `BreadcrumbList` + `Service` with `audience` field set to the persona type.

### Section B — 8 TIER-2 LOCATION PAGES

Same pattern as Phase 1 Section A. Top 2 services × 4 new neighborhoods.

| # | URL | H1 |
|---|---|---|
| 16 | `/locations/mma-in-silver-lake/` | MMA in Silver Lake |
| 17 | `/locations/muay-thai-in-silver-lake/` | Muay Thai in Silver Lake |
| 18 | `/locations/mma-in-highland-park/` | MMA in Highland Park |
| 19 | `/locations/jiu-jitsu-in-highland-park/` | No-Gi Jiu-Jitsu in Highland Park |
| 20 | `/locations/mma-in-atwater-village/` | MMA in Atwater Village |
| 21 | `/locations/muay-thai-in-atwater-village/` | Muay Thai in Atwater Village |
| 22 | `/locations/mma-in-los-feliz/` | MMA in Los Feliz |
| 23 | `/locations/jiu-jitsu-in-los-feliz/` | No-Gi Jiu-Jitsu in Los Feliz |

Use the same template as Phase 1 location pages. Reference a real landmark in each neighborhood. Include commute time from that neighborhood to 1205 N Main St.

### Section C — 2 COMPARISON PAGES (`/compare/{a}-vs-{b}/`)

Create directory `compare/`.

| # | URL | Title | H1 |
|---|---|---|---|
| 24 | `/compare/bjj-vs-wrestling/` | BJJ vs Wrestling — Which Builds a Better Grappler? \| MMA District | BJJ vs Wrestling |
| 25 | `/compare/muay-thai-vs-kickboxing/` | Muay Thai vs Kickboxing — The Real Difference \| MMA District | Muay Thai vs Kickboxing |

**Content outline (~1,200 words each):**
1. Setup question + TL;DR
2. **History / origin** of each
3. **Technique differences** (with a comparison table)
4. **Which is better for {goal}** sections — fitness, self-defense, competition
5. **At MMA District** — how we integrate both into MMA training
6. **FAQ** with FAQPage schema
7. CTA + cross-links

---

## Updates to existing pages
- Add a "Programs" mega-menu entry (or dropdown) showing top 4 persona pages
- Update each service hub (`/classes/{service}.html`) with a "Programs for specific audiences" section linking to relevant persona pages
- Update sitemap.xml

---

## Quality + attribution rules
Same as Phase 1:
- Every page has unique intro + content (no template swaps)
- "Powered by MMA Marketing Pro" attribution on every page (linked, target=_blank, rel=noopener)
- Run `/seo-audit` after build
- Mobile-test before commit

---

## Post-build checklist
- [ ] 25 new HTML files
- [ ] Sitemap + nav + service hubs updated
- [ ] `/seo-audit` clean
- [ ] Mobile pass at 375 / 390 / 768
- [ ] Commit + push + verify deploy
- [ ] Submit refreshed sitemap to Google Search Console

When complete, open `phase-3-prompt.md`.
