# The MMA District — Website

A boutique combat sports academy in Downtown LA.

- **Address:** 1205 N Main St, Los Angeles, CA 90012
- **Phone:** (323) 990-4494
- **Founder:** Hanny Tjan
- **Instagram:** [@mmadistrict_la](https://www.instagram.com/mmadistrict_la/)

This is a static HTML/CSS/JS site — no build step, no framework. Deployed to Cloudflare Pages.

## Structure

- `index.html` — Home
- `about.html` — Founder story + philosophy
- `classes.html` — Curriculum overview (links to 4 detail pages)
- `classes-mma.html`, `classes-muay-thai.html`, `classes-jiu-jitsu.html`, `classes-strength-conditioning.html` — Discipline detail pages
- `classes-calendar.html` — Live schedule
- `instructors.html` — Full coaching team
- `memberships.html` — All tiers + special programs
- `memberships-fight-fit-transformation.html` — 6-week program
- `memberships-active-duty.html` — Active Duty offer
- `memberships-sign-up.html` — Member sign-up form
- `contact.html` — Contact info + form
- `booking.html` — Step 2 of 2 lead-capture funnel (not in nav)
- `privacy-policy.html` · `terms-conditions.html` — Legal stubs
- `styles.css` — Shared design system
- `scripts.js` — Shared JS (lead modal, nav, marquee, booking router)
- `sitemap.xml` · `robots.txt` — SEO
- `images/{logo,team,hero,gallery}/` — Assets

## Local preview

Run a local server from the parent `sites/` directory:

```bash
cd ..
python3 -m http.server 8080 --bind 127.0.0.1
```

Then open: <http://localhost:8080/the-mma-district/>

## Editing copy or content

All content is hand-written in the HTML files. There's no CMS — edit the HTML directly.

For schema/SEO/structural updates, see the `seo-roadmap/` folder for the planned 6-month expansion (172 future pages across 6 phases).

## Design system

- **Palette:** burnt-orange `#BC6025` accent on obsidian `#0A0A0A` substrate, bone `#E8E2D5` foreground
- **Type:** Anton (display) · Fraunces (editorial) · Inter (body) · JetBrains Mono (spec)
- **Style:** cinematic-fight hybrid — prestige documentary aesthetic, training-lab data structure, taste-skill typographic discipline

## Open items before final launch

- [ ] Real coach portraits in `/images/team/` (currently using discipline action shots in coach cards — labelled honestly via alt text)
- [ ] Zen Planner / MindBody / GHL calendar embeds in `booking.html` (8 program placeholders ready to receive embed codes)
- [ ] Open Graph image at `/images/og.jpg` (referenced in schema)
- [ ] Real member testimonials for the home + memberships pages

---

Site built by [MMA Marketing Pro](https://www.mmamarketingpro.com).
