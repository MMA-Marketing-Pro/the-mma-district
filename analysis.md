# MMA District — Site Analysis

## What this business actually is

**The MMA District** is a *boutique* fight gym in Downtown Los Angeles (1205 N Main St, on the Chinatown/Lincoln Heights border). It's small, deliberately, and offers a full combat curriculum: MMA, Muay Thai, no-gi Jiu-Jitsu, and Strength & Conditioning. It opened recently (their footer says © 2026, founder describes building it as her "dream"), so it's a young business but a serious one.

The single most important fact: **the founder, Hanny Tjan, is a 15-year female martial artist.** She trained in Sanda, Muay Thai, Jiu-Jitsu, and MMA before opening the gym. Her stated vision is "the intensity of Thai camps with the personal connection of a community gym." That positioning — a female-built boutique fight room — is the unique angle and it's almost entirely hidden in the current design.

## The roster is real

Five credentialed coaches. This is unusual for a young gym and it's the biggest design asset they have:

- **Jamie Glazier** — BJJ brown belt, 20+ years martial arts, Brazil roots
- **Andres Fajardo** — BJJ purple belt, active MMA/Muay Thai/BJJ competitor, S&C coach
- **Edward Chan** — IKF East Coast Classic Champion, 8-5 Muay Thai record, 8 MMA fights
- **Dawn North** — 25+ years experience, Director of Girls Empowerment & Self-Defense in LA schools
- **Andrew Gamboa** — active amateur Muay Thai/MMA fighter

This is the receipts. A real championship belt holder, a brown belt with Brazil lineage, a 25-year veteran with a public-service track record. The current site buries all of this on a single "Instructors" page reached via the nav. **The redesign needs to lead with these humans.**

## What the current site gets right

- Strong logo (burnt-orange copper medallion on black — a real mark, not Canva)
- Real content (the class pages are well-written)
- Clean information architecture (4 disciplines, memberships, instructors, contact)
- Active Duty offer is a legitimate trust signal — and it's specific ($180 vs $200, $0 enrollment, partner free 30 days)

## What the current site gets wrong

1. **The female-founder boutique angle is invisible.** The current site reads as "generic dark MMA gym #847." There's no editorial weight, no portrait of Hanny, no story above the fold.
2. **The fighter credentials are buried.** Edward Chan's IKF championship and Jamie's brown belt should be on the homepage as proof, not hidden one click deep.
3. **The burnt-orange brand color is severely underused.** It's the one chromatic note in their identity and the site treats it like an afterthought.
4. **The hero is a stock-fighter silhouette.** It could be anyone, anywhere. No specificity, no place, no person.
5. **No motion, no kinetic energy.** A fight gym site should *feel* like a fight gym — controlled tension, restrained power. Current site feels like a brochure.
6. **The Active Duty / Fight Fit programs are weak conversion vectors** — they're listed but not designed as offers.
7. **Typography is generic sans on sans.** Nothing editorial. No display weight. No craft.
8. **No fight footage, no testimonials, no proof anchors** behind the "where fighters are made" promise.

## Design direction

**Cinematic-Fight hybrid.** Not a stock template — a custom blend, biased toward prestige-TV documentary energy with training-lab structure for the credential-heavy sections.

The pull from each skill:

- **cinematic-fight-skill** is the bone structure. Obsidian background, oversized fighter portraits, film-grain texture, prestige-doc typography (display serif headlines, technical sans body). The whole site should feel like the opening titles of a fight documentary.
- **training-lab-skill** handles the data: instructor credential bento (belt rank, fight record, years, specialties), class-flow tables on each discipline page, S&C metric layout, Active Duty offer card structured like a spec sheet.
- **taste-skill** governs typography, spacing, and color discipline — pairing an editorial display serif (something like Fraunces, Tiempos, or Newsreader) with a utilitarian sans (Inter or Söhne-style). Strict 8-point grid. Burnt-orange used SPARINGLY as the only chromatic accent.
- **championship-heritage-skill** lends its sense of *craft* to the founder section only. Quiet portrait of Hanny, sepia or warm-tinted, with the founding story rendered with the dignity of an artist statement, not a gym ad.
- **performance-athletic-skill** is mostly suppressed — this is the opposite of loud sportswear energy. But a single element borrows from it: a thin "MMA · MUAY THAI · JIU-JITSU · S&C" kinetic marquee that runs once near the top, then never again.

What we're explicitly NOT doing:
- Not brutalist. That would feel meathead, and this gym isn't that.
- Not soft/luxury. They're a fight gym, not a spa.
- Not bright/loud sportswear energy. This is a serious dojo, not a Lululemon collab.
- Not generic dark-MMA template (which is what they have now).

## Site structure

16 pages to build (cap is 20, we're well under):

1. `index.html` — Home
2. `about.html` — About + founder story
3. `classes.html` — Curriculum overview
4. `classes-mma.html` — MMA program detail
5. `classes-muay-thai.html` — Muay Thai program detail
6. `classes-jiu-jitsu.html` — No-Gi BJJ program detail
7. `classes-strength-conditioning.html` — S&C program detail
8. `classes-calendar.html` — Live class schedule
9. `instructors.html` — Full coaching team
10. `memberships.html` — Pricing + plans
11. `memberships-fight-fit-transformation.html` — 6-week program
12. `memberships-active-duty.html` — Active Duty offer
13. `memberships-sign-up.html` — Sign-up form
14. `contact.html` — Contact + location
15. `booking.html` — Two-step lead capture booking page (REQUIRED by pipeline)
16. `privacy-policy.html` + `terms-conditions.html` — Legal stubs (required, minimal design)

## Conversion path

Every CTA → lead modal → `booking.html` (Step 2 of 2). Programs in the modal dropdown: MMA, Muay Thai, Jiu-Jitsu, Strength & Conditioning, Fight Fit Transformation, Kids (10-15), Active Duty.

Active Duty trust strip should appear on every page (one line, footer-area, with the price + savings).

## The bar

This site should make a serious DTLA fighter say "where do I sign." It should make Hanny Tjan see her own gym the way she imagined it. It shouldn't look like a website — it should look like a film.
