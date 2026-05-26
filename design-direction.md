# Design Direction — The MMA District

Bespoke hybrid synthesis. Not a template. Built from four design skills, each contributing a specific role.

## What each skill contributes

| Skill | Contribution |
|---|---|
| **cinematic-fight** | Bone structure. Letterboxed hero. Tall portrait grid. Oxblood/burnt-orange as the single accent. Slow 1000–1400ms motion. Film grain overlay. Photo treatment (rim-light, chiaroscuro). |
| **training-lab** | Data layer. Monospace eyebrow flags (`// 01 — THE CURRICULUM`). Hairline grid between cards. Credential pills as spec sheets. Active Duty offer rendered as price card with oversized numeral. |
| **taste-skill** | Discipline layer. 8-point grid (multiples of 4 or 8 only). No 3-equal-card grids. Container max 1280px. Section padding `clamp(64px, 10vw, 128px)`. Cards minimum p-8 (32px). Off-black not pure #000. |
| **championship-heritage** | Dignity layer (founder section only). Framed-portrait treatment for Hanny Tjan (1px burnt-orange border + 12px inset). Institutional copy tone. No startup-bro language anywhere on the site. |

## Anti-patterns (banned for this build)

- Inter as DISPLAY font (Inter is body-only — cinematic-fight forbids it for display)
- Pure `#000000` backgrounds
- 3-column equal feature card grids
- Bouncy spring micro-interactions
- Backdrop-blur glassmorphism (except modal overlays)
- Gradient text fills
- Rounded-full pills (radius 0 on photos, 2-4px on buttons max)
- Soft drop shadows on dark substrate (use hairline borders + glow)
- Centered hero text (combat-sport rule from photo-backed-hero quality bar)
- Hype copy ("unleash", "elevate", "level up", "crush it")
- Emoji
- Generic stock photos with smiling models

## Type stack (final, locked)

| Role | Family | Use |
|---|---|---|
| Cinematic display | **Anton** (Google Fonts) | Hero headlines, section bills, marquee, fight-poster moments. UPPERCASE only. Tight tracking. |
| Editorial display | **Fraunces** (variable, opsz + wght + SOFT + WONK) | Founder section pull quote, about hero, philosophy callouts. Italic for pull quotes only. |
| Body sans | **Inter** (Google Fonts) | Body, nav, buttons, captions, labels. Letter-spacing -0.01em on small text. All-caps eyebrows get tracking +0.12em. |
| Spec mono | **JetBrains Mono** (Google Fonts) | `// FLAG` eyebrows, fight records (8-5), credential pills, schedule times, marquee, address. |

## Palette (from brand-kit.json, refined to bone)

Single chromatic accent: **burnt-orange `#BC6025`** (THE color).
Substrate: **`#0A0A0A`** obsidian.
Foreground: **`#E8E2D5`** bone (warmed from F4F4F4 to feel cinematic-warm and harmonize with the orange).

```css
:root {
  --bg: #0A0A0A;
  --bg-card: #141414;
  --bg-elevated: #1C1C1C;
  --bg-deep: #050505;       /* footer */
  --border: #2D2D2D;
  --border-strong: #3A3A3A;
  --border-accent: rgba(188, 96, 37, 0.28);
  --text-primary: #E8E2D5;   /* bone — cinematic warmth */
  --text-bright: #FFFFFF;    /* top headline & logo only */
  --text-muted: #9CA0A8;
  --text-subtle: #6B6E76;
  --accent: #BC6025;
  --accent-hover: #D17434;
  --accent-pressed: #9F4F1C;
  --accent-subtle: rgba(188, 96, 37, 0.12);
  --accent-glow: rgba(188, 96, 37, 0.32);
  --success-pill: #6A8161;   /* Active Duty pill only */
}
```

## Layout choreography (Home page)

The home page is the showpiece. Each section has a specific job and pulls from a specific skill.

1. **Sticky Active Duty banner** (thin top strip) — selling the strongest offer above the fold from the moment the page loads. Mono caps. Hairline bottom border. Dismissable.
2. **Letterboxed hero** [cinematic-fight] — 65vh, full-bleed rim-lit fighter portrait, multi-layer directional scrim, content bottom-left. Anton "WHERE FIGHTERS / ARE MADE." Fraunces italic subhead. Two CTAs.
3. **Kinetic marquee** [training-lab] — JetBrains Mono. Slow scroll. `MMA · MUAY THAI · JIU-JITSU · S&C · WRESTLING · KIDS · ACTIVE DUTY ·` Hairline rules above and below.
4. **Founder section** [championship-heritage] — asymmetric 5/7 split. Warm-tinted portrait of Hanny Tjan with double-frame inset. Fraunces display headline ("Built by a fighter. For fighters."). Founder story. Two stat pills.
5. **Curriculum bento** [training-lab + cinematic-fight] — 2x2 grid (NOT 4-equal-col). Hairline grid between tiles. Each tile: dark training image, mono eyebrow `// PROGRAM 01`, Anton name, brief, arrow link.
6. **Coaches preview** [cinematic-fight] — section flag `// 02 — REAL COACHES · REAL CREDENTIALS`. 3-up tall portrait grid (2:3). Cinematic filter on portraits. Anton name overlay + credential pill in mono. Mobile: horizontal scroll snap.
7. **Active Duty offer band** [training-lab spec card] — full-bleed darker band. Big oversized `$180/mo` numeral. Spec list with sage `#6A8161` pill (ONLY use of sage on the entire site). CTA `Claim the Active Duty Rate →`.
8. **Fight Fit Transformation** — breaks rhythm, right-aligned content with 4-tile spec bento on left. Anton "6 WEEKS. REAL FIGHT FIT." Tiles: unlimited classes / free t-shirt / nutrition guide / weekly check-ins.
9. **Pull quote** [cinematic-fight] — full-section centered Fraunces italic. "Train like a fighter. Even if you're not one." Attribution in micro mono caps.
10. **Final CTA / location card** — address + phone + parking note + CTA `Book Your First Class →`. Map cue (Chinatown / N Main St) in mono caption.
11. **Footer** — deep dark `#050505`, logo, 4-column nav (Programs / Memberships / Studio / Contact), social, attribution.

## Mobile rules (mandatory, applied everywhere)

- Hero on mobile: `align-items: flex-start`, `min-height: auto`, padding-top = nav-h + 24
- `.nav.open { backdrop-filter: none; background: var(--bg) }` — escape containing-block trap
- `.nav-mobile { z-index: 200 }` (above the nav)
- All tap targets ≥ 44×44px
- Section padding: `clamp(64px, 10vw, 128px)` everywhere — never hard-coded 128px
- Hero h1: `clamp(2.5rem, 7vw, 6.5rem)` (Anton's wide condensed letterforms can take a slightly bigger ceiling than the photo-backed-hero default 5.25rem because Anton is condensed, not wide)
- Multi-col grids collapse to 1 col by ≤768px
- 3-up coaches grid → horizontal scroll-snap on ≤768px (cinematic-fight portrait flow)
- CTA buttons full-width on ≤480px

## Motion choreography

- Page load: hero fades from black 1400ms with `cubic-bezier(0.16, 1, 0.3, 1)`. Hero headline rises with 300ms stagger after image.
- Section reveals: `translateY(24px) + opacity 0→1` over 800ms via GSAP ScrollTrigger.
- Marquee: 40s linear infinite. Pause on hover.
- Portrait hover: `scale(1.03)` + `filter: brightness(1.05)` over 600ms.
- Magnetic CTA: hover `scale(1.02) translateY(-1px)` 300ms cubic-bezier(0.16, 1, 0.3, 1). Active: `scale(0.98)`.
- Grain overlay: SVG turbulence noise, fixed inset-0, z-50, pointer-events:none, opacity 0.04. Static — no animation (perf).
- NO bouncy springs anywhere.

## Photography (with placeholder strategy)

- Hero: `picsum.photos/seed/themmadistrict-fight-hero/2400/1300?grayscale` → swap with rim-lit fighter portrait from facility shoot
- Founder: portrait of Hanny Tjan (existing asset on their site: `assets/hanny-beach.jpg`) — placeholder uses `seed/themmadistrict-founder/900/1200?grayscale`
- Coaches: 5 portraits, 2:3 aspect, dark backgrounds, rim-lit (placeholders by seed: `themmadistrict-coach-{name}`)
- Class images: dark moody training shots per discipline (placeholders by `themmadistrict-mma`, `themmadistrict-muay-thai`, etc.)
- Universal filter on photo-backed sections: `filter: contrast(1.12) brightness(0.92) grayscale(0.2) sepia(0.06)` to hold cinematic warmth

All images get `data-local="images/..."` swap path per the kit standard.

## What this site has to prove

This is a $40k bar. The site has to:

1. Make a serious DTLA fighter say "where do I sign" within 5 seconds of landing
2. Make Hanny Tjan recognize her gym the way she imagined it
3. Convert the Active Duty offer better than the existing site (it's a strong, specific offer)
4. Position the female-founded, multi-discipline, boutique angle as the gym's identity — not buried as a footnote
5. Make the existing coach credentials (IKF champ, brown belt, 25-year vet) work as primary trust signals
6. Be flawless on mobile (most leads will come from phones)
7. Feel like a film — not a website
