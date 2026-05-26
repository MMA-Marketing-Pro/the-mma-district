# Phase 1 — Foundation: Core Neighborhoods + Glossary
**Target ship date:** ___________ (you fill in)
**Page count:** 25 (16 location pages + 8 glossary pages + 1 curation flagship)

---

## Paste-to-execute prompt

Copy everything below this line into a fresh Claude Code session running in `~/client-redesign-kit/sites/the-mma-district/`. The session must be in this exact directory because the build references local files.

---

I'm working on The MMA District — a boutique combat sports academy in Downtown LA at 1205 N Main St (90012). Founder: Hanny Tjan. Phone: (323) 990-4494. Instagram: mmadistrict_la.

**Before you do anything, read these files to load my design system + content + brand:**
- `sites/the-mma-district/content-profile.json` — full scraped content
- `sites/the-mma-district/brand-kit.json` — palette + type stack (burnt-orange `#BC6025` on obsidian, Anton + Fraunces + Inter + JetBrains Mono)
- `sites/the-mma-district/design-direction.md` — cinematic-fight-hybrid spec
- `sites/the-mma-district/styles.css` — the existing stylesheet I'll be reusing
- `sites/the-mma-district/seo-roadmap/keywords.json` — neighborhoods, services, personas, glossary
- `sites/the-mma-district/seo-roadmap/roadmap.md` — full 6-month plan context
- `.agent/skills/programmatic-seo/SKILL.md` — playbook rules
- `.agent/skills/seo-audit/SKILL.md` — what to verify before considering done

**Phase 1 objective:** Ship 25 new pages that capture the cheapest local-intent traffic — immediate-neighborhood `{service} in {neighborhood}` pages + top-of-funnel `what is {term}` glossary pages.

---

## Pages to build

### Section A — 16 LOCATION PAGES (`/locations/{service}-in-{neighborhood}/`)

Build a directory `locations/` at the site root. For each location page, create one HTML file at `locations/{service-slug}-in-{neighborhood-slug}.html`.

Use the same shared `styles.css` + `scripts.js` files at the site root (path prefix `../` from inside the locations/ directory).

| # | URL | Primary Keyword | Title | Meta Description | H1 |
|---|---|---|---|---|---|
| 1 | `/locations/mma-in-chinatown/` | MMA in Chinatown | MMA in Chinatown LA \| MMA District | Boutique MMA training in Chinatown — two blocks from Union Station. Real coaches, small classes, all levels welcome. | MMA in Chinatown |
| 2 | `/locations/muay-thai-in-chinatown/` | Muay Thai in Chinatown | Muay Thai in Chinatown LA \| MMA District | Authentic Muay Thai in Chinatown LA — Art of Eight Limbs taught by an IKF Champion. Walk-ins welcome. | Muay Thai in Chinatown |
| 3 | `/locations/jiu-jitsu-in-chinatown/` | No-Gi Jiu-Jitsu in Chinatown | Jiu-Jitsu in Chinatown LA \| MMA District | No-Gi BJJ in Chinatown — brown belt instruction with Brazil roots. Beginners through competitors. | Jiu-Jitsu in Chinatown |
| 4 | `/locations/strength-conditioning-in-chinatown/` | S&C in Chinatown | S&C in Chinatown LA \| MMA District | Fight-paced strength & conditioning in Chinatown LA. Built for fighters and everyday athletes. | Strength & Conditioning in Chinatown |
| 5 | `/locations/mma-in-lincoln-heights/` | MMA in Lincoln Heights | MMA in Lincoln Heights \| MMA District | Boutique MMA gym in Lincoln Heights — minutes from Highland Park, Cypress Park, and Mt Washington. | MMA in Lincoln Heights |
| 6 | `/locations/muay-thai-in-lincoln-heights/` | Muay Thai Lincoln Heights | Muay Thai in Lincoln Heights LA \| MMA District | Authentic Muay Thai in Lincoln Heights — IKF Champion on staff. First class free for locals. | Muay Thai in Lincoln Heights |
| 7 | `/locations/jiu-jitsu-in-lincoln-heights/` | BJJ Lincoln Heights | No-Gi BJJ in Lincoln Heights \| MMA District | No-Gi Jiu-Jitsu in Lincoln Heights — boutique class sizes, real fighter credentials. | Jiu-Jitsu in Lincoln Heights |
| 8 | `/locations/strength-conditioning-in-lincoln-heights/` | S&C Lincoln Heights | Strength & Conditioning in Lincoln Heights \| MMA District | Purpose-built S&C in Lincoln Heights — fight-paced conditioning and compound lifts. | S&C in Lincoln Heights |
| 9 | `/locations/mma-in-arts-district/` | MMA Arts District | MMA in the Arts District LA \| MMA District | MMA training a few blocks from the LA Arts District — boutique fight gym for creatives and pros. | MMA in the Arts District |
| 10 | `/locations/muay-thai-in-arts-district/` | Muay Thai Arts District | Muay Thai in the Arts District LA \| MMA District | Real Muay Thai a short walk from the Arts District — striking and clinch with championship coaching. | Muay Thai in the Arts District |
| 11 | `/locations/jiu-jitsu-in-arts-district/` | BJJ Arts District | No-Gi Jiu-Jitsu in the Arts District LA \| MMA District | No-Gi Jiu-Jitsu a few blocks from the Arts District. Brown-belt instruction, no-ego room. | Jiu-Jitsu in the Arts District |
| 12 | `/locations/strength-conditioning-in-arts-district/` | S&C Arts District | Strength & Conditioning Arts District LA \| MMA District | Fight-paced S&C training minutes from the Arts District. Mobility, strength, real conditioning. | S&C in the Arts District |
| 13 | `/locations/mma-in-echo-park/` | MMA Echo Park | MMA in Echo Park LA \| MMA District | Boutique MMA in Echo Park — short drive over the freeway, small classes, real intensity. | MMA in Echo Park |
| 14 | `/locations/muay-thai-in-echo-park/` | Muay Thai Echo Park | Muay Thai in Echo Park LA \| MMA District | Real Muay Thai close to Echo Park — striking, clinch, fight IQ. | Muay Thai in Echo Park |
| 15 | `/locations/jiu-jitsu-in-echo-park/` | BJJ Echo Park | No-Gi BJJ in Echo Park LA \| MMA District | No-Gi Jiu-Jitsu close to Echo Park — brown-belt instruction, smart progression. | Jiu-Jitsu in Echo Park |
| 16 | `/locations/strength-conditioning-in-echo-park/` | S&C Echo Park | Strength & Conditioning Echo Park \| MMA District | Strength training and fight conditioning a short drive from Echo Park. | S&C in Echo Park |

**Content outline per location page (~600–800 words, all unique per neighborhood):**

1. **Hero section** (page-header style from styles.css)
   - Mono eyebrow: `// Locations · {Service} · {Neighborhood}`
   - H1: `{Service} in {Neighborhood}`
   - Lead (Fraunces italic): one sentence that names a real landmark in that neighborhood ("two blocks from Union Station" / "minutes from Echo Park Lake" / "a short walk from the LA River") AND ties it back to a specific gym benefit.
2. **"Why train at MMA District" intro** (100–120 words, unique per neighborhood — mention commute time from the neighborhood, easy-to-find directions, parking on Elmyra St)
3. **Coach attribution** matched to the service: Muay Thai pages call out Edward Chan + Dawn North + Andrew Gamboa; BJJ pages call out Jamie Glazier (brown belt) + Andres Fajardo (purple belt); S&C pages call out Jamie + Andres; MMA pages call out the full team
4. **Class structure section** — short summary of how that program's class flows
5. **What you'll learn** — pull the 5 bullets from `/classes/{service}.html`'s existing content
6. **Active Duty offer pill** — small "Active Duty Members $180/mo" callout linking to `/memberships/active-duty/`
7. **Cross-link sidebar/footer block:**
   - 1 link UP to `/classes/{service}.html`
   - 3 links LATERALLY to the same service in other neighborhoods (rotate so internal linking is dense but no page links to itself)
   - 1 link to the main `/memberships.html`
8. **Final CTA** — lead modal trigger ("Book your first class") + text-us alternative
9. **Footer** — full footer with NAP + "Powered by MMA Marketing Pro" attribution

### Section B — 8 GLOSSARY PAGES (`/learn/{term-slug}/`)

Build a directory `learn/` at site root.

| # | URL | Title | Meta Description | H1 |
|---|---|---|---|---|
| 17 | `/learn/what-is-mma/` | What Is MMA? A Beginner's Guide \| MMA District LA | Mixed Martial Arts explained for first-timers: striking, grappling, what to expect, and how to start safely in LA. | What Is MMA? |
| 18 | `/learn/what-is-muay-thai/` | What Is Muay Thai? The Art of Eight Limbs \| MMA District | A clear primer on Muay Thai — origins, techniques, what a first class looks like, and how to know if it's right for you. | What Is Muay Thai? |
| 19 | `/learn/what-is-no-gi-jiu-jitsu/` | What Is No-Gi Jiu-Jitsu? \| MMA District LA | No-Gi BJJ explained: positions, submissions, why it's different from gi-based BJJ, and how to start. | What Is No-Gi Jiu-Jitsu? |
| 20 | `/learn/art-of-eight-limbs/` | The Art of Eight Limbs Explained \| MMA District | What "eight limbs" means in Muay Thai — fists, elbows, knees, shins — and why it makes Muay Thai unique. | The Art of Eight Limbs Explained |
| 21 | `/learn/what-to-wear-first-mma-class/` | What to Wear to Your First MMA Class \| MMA District | A practical checklist — clothing, gear, what we can loan you, what to leave at home. Walk in prepared. | What to Wear to Your First MMA Class |
| 22 | `/learn/how-to-pick-an-mma-gym-in-la/` | How to Pick an MMA Gym in Los Angeles \| MMA District | The 7 things to evaluate when choosing a fight gym — coaching credentials, class size, culture, safety. | How to Pick an MMA Gym in Los Angeles |
| 23 | `/learn/is-mma-safe-for-beginners/` | Is MMA Safe for Beginners? \| MMA District LA | A real answer about injury risk, sparring protocols, and how good gyms scale intensity for new students. | Is MMA Safe for Beginners? |
| 24 | `/learn/bjj-belt-system/` | The BJJ Belt System Explained \| MMA District | A no-gi-friendly explainer of the BJJ belt ranking system — white through black, and how progression works. | The BJJ Belt System Explained |

**Content outline per glossary page (~800–1,200 words, deeply unique — these are search-intent answer pages):**

1. **Hero section** — H1 + Fraunces italic lead that previews the answer in one sentence
2. **TL;DR box** at the top — 1-paragraph summary for skim-readers
3. **Main content** — answer the question thoroughly with 4–6 sub-sections (H2s). Pull from the existing class-page content but rewrite for educational tone.
4. **Quick reference / list** — at least one bullet list or comparison table for at-a-glance scanability
5. **FAQ section** — 4–6 Q&A pairs the search audience would actually ask. Include `FAQPage` schema.
6. **"Train at MMA District" callout** — soft pitch at the bottom, lead modal CTA
7. **Related content links** — 4–6 links to other glossary or location pages
8. **Footer** — full footer with NAP + agency attribution

### Section C — 1 CURATION FLAGSHIP

| # | URL | Title | Meta Description | H1 |
|---|---|---|---|---|
| 25 | `/best/mma-gym-in-downtown-la/` | The Best MMA Gym in Downtown LA \| MMA District | The most credentialed boutique fight gym in DTLA — IKF Muay Thai champion, BJJ brown belt, 25-year veteran, all under one roof. | The Best MMA Gym in Downtown LA |

**Content outline (~1,500 words):**

1. **Opening hook** — "If you're searching for the best MMA gym in Downtown LA, you probably care about three things: coaching, intensity, and whether you'll actually fit in." Set up the framework.
2. **Evaluation criteria** — H2 sections for the 5 things that matter (real fight credentials, class size, multi-discipline, community vibe, fair pricing/contracts)
3. **Why MMA District meets each criterion** — credential receipts: IKF East Coast Classic Champ on staff, BJJ brown belt with Brazil lineage, 25-year boxing/grappling vet, etc.
4. **The Active Duty + Fight Fit offers** — what makes MMA District different on pricing structure
5. **Walk-in / first-visit info** — what to expect, how to book
6. **Sectional comparison** — short callouts of what we DON'T do (we're not big-box, not a hobby studio, not a Krav Maga or boxing-only spot) so the searcher self-qualifies
7. **Member testimonials** — 3–5 quotes (flag to user: get real testimonials before publishing this page)
8. **FAQ** — 6 Q&A pairs covering price, what to bring, kids program, first-time visitor, etc. Include `FAQPage` schema.
9. **CTA stack** — primary "Book first class" + secondary "See class schedule"

---

## Schema requirements per page type

| Page type | JSON-LD to inject |
|---|---|
| Location pages | `BreadcrumbList` + `Service` (with `areaServed`: { @type: "Place", name: "{Neighborhood}, Los Angeles" }) |
| Glossary pages | `BreadcrumbList` + `Article` (or `DefinedTerm`) + `FAQPage` |
| Best-in-X page | `BreadcrumbList` + `ItemList` + `LocalBusiness` reference + `FAQPage` |

---

## Internal linking — site-wide updates after building

1. **Update `sitemap.xml`** — add all 25 new URLs with appropriate `priority` and `changefreq`
2. **Update the main nav** — add a "Locations" dropdown that shows the top 4 neighborhood links. Keep the existing nav structure; this is a supplemental menu item.
3. **Update `/classes/{service}.html` pages** — at the bottom of each, add a "Train near you" section listing the 4 neighborhood pages for that service
4. **Update `/index.html`** — in the footer's "Studio" column, add a "Locations" link to a new `/locations/index.html` hub page (build it as a directory listing of all location pages — that's a 26th page if you choose; counts as phase 1 if so)

---

## Unique-content guardrails

Every page in this phase MUST follow these rules. If any page violates one, fix before considering done:

- **No page is a template copy.** The intro paragraph on every location page references the specific neighborhood (a landmark, a commute time, parking note for that side of town, a nearby competing gym style we're different from).
- **No page repeats the same testimonial.** If we don't have a real testimonial for a neighborhood yet, flag it as a TODO comment in the HTML, don't fake one.
- **Every page has a clear primary CTA** that opens the lead modal with the relevant program preselected.
- **Every page passes `/seo-audit`** — run that skill after building all 25 pages and apply auto-fixes.

---

## Agency attribution requirement (NON-NEGOTIABLE)

Every page built in this phase MUST include the following in the footer:

```html
<p class="powered-by">
  Powered by <a href="https://www.mmamarketingpro.com" target="_blank" rel="noopener">MMA Marketing Pro</a>
</p>
```

This is required on every page in every phase — never remove, alter, or rebrand it. The `/seo-audit` skill verifies this and will flag any page missing it.

---

## Post-build checklist

- [ ] All 25 HTML files created in correct directories
- [ ] Each page has unique title, meta description, H1
- [ ] Each page includes appropriate JSON-LD schema (verified via Google Rich Results Test)
- [ ] `sitemap.xml` updated with all new URLs
- [ ] `robots.txt` still allows crawling of new directories (`/locations/`, `/learn/`, `/best/`)
- [ ] Internal links cross-reference correctly (no broken links between new pages)
- [ ] Existing class pages link to relevant new location pages
- [ ] Footer agency attribution present on every page
- [ ] Run `/seo-audit` skill against the new pages and apply auto-fixes
- [ ] Test 3 random pages on mobile (375px, 390px, 768px) — no horizontal scroll, no layout collapse
- [ ] Commit all changes (`git add . && git commit -m "Phase 1: 25 location + glossary + curation pages"`) and push
- [ ] Verify Cloudflare Pages deploy succeeds and new URLs are live
- [ ] Submit updated `sitemap.xml` to Google Search Console

---

## When this phase is complete

Open `phase-2-prompt.md` in a fresh session.
