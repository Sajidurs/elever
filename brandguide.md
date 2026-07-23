# Elever Notes — Brand Book

> Context document for AI collaborators. Feed this to any AI working on the Elever Notes brand, website, ads, or product so it understands who we are, how we sound, and how we look.

---

## 1. Brand at a glance

**Elever Notes** is a premium productivity-planner brand. Our first and flagship product is the **Elever G1**, a structured planner notebook designed to help people set intentions, build habits, and protect their focus.

- **Category:** Productivity / stationery / intentional-living tools
- **Positioning:** Premium, minimalist, research-informed. Not a cheap notebook and not a hype productivity gadget — a considered tool for people serious about how they spend their time.
- **Business model:** Direct-to-consumer, conversion-driven. The website is built to run paid ad campaigns and to scale as more products ship.
- **Brand architecture:** "Elever Notes" is the master brand; products are named with short model codes (e.g. **G1**). Everything is designed so future products slot into the same system without a redesign.

### Mission
Help people live more deliberately — one page, one day, one habit at a time.

### What we are NOT
- Not a productivity-hustle brand (no "grind," no "10x," no hustle-culture clichés).
- Not a cutesy or playful stationery brand.
- Not a maximalist, feature-stuffed tool. Restraint is the point.

---

## 2. Voice & tone

**Personality:** Calm, confident, precise. Like a thoughtful friend who happens to be an expert — never a salesperson, never a guru.

**Principles:**
- **Say less.** One thousand no's for every yes. Cut every word that isn't earning its place.
- **Show respect for the reader's intelligence.** No hype, no manufactured urgency beyond honest offer deadlines, no fake scarcity.
- **Be concrete.** Prefer specific claims ("66 days to a habit") over vague ones ("build habits fast").
- **Cite honestly.** When we reference research, we name the source and add plain disclaimers. We never overstate what a study proves.

**Do:** clear, warm, declarative sentences. Confident but never boastful.
**Don't:** emoji (not part of the brand), exclamation-point spam, buzzwords ("synergy," "game-changer," "revolutionary"), aggressive urgency.

### Research we cite (with honest framing)
Use these only with clear disclaimers — they support the philosophy, they don't "prove" the product works.
- **Written goals:** Dr. Gail Matthews (Dominican University) — participants who wrote goals down were ~42% more likely to achieve them.
- **Implementation intentions:** Gollwitzer & Sheeran (2006) meta-analysis across 8,000+ participants — planning *when/where/how* meaningfully increases follow-through.
- **Cost of distraction:** Gloria Mark (UC Irvine) — it takes ~23 minutes to fully refocus after an interruption.
- **Habit formation:** Lally et al. (UCL) — an average of ~66 days for a behavior to become automatic.

---

## 3. Visual identity

### Theme
**Premium dark, minimalist.** Deep near-black backgrounds, generous negative space, restrained accenting. Editorial, not corporate. Every screen should feel considered and quiet.

### Color

| Role | Value | Notes |
|---|---|---|
| **Brand accent** | `#C1A078` | Warm bronze/champagne-gold. This is the hero brand color — used sparingly for CTAs, key highlights, the logo lockup. |
| Accent source | `#b19372` | The literal logo color. `#C1A078` is the same hue lifted for legibility on dark backgrounds — use `#C1A078` on dark UI, `#b19372` where it sits on light. |
| Background (base) | near-black | Deep charcoal / near-black canvas. |
| Text | off-white / warm grays | High-contrast body on dark; muted grays for secondary text. |

**Rules:**
- Max 1–2 background colors across any single surface (deck, page, doc).
- Accent is precious — use it on the things that matter (primary CTA, logo, one highlight per section), not everywhere.
- Never introduce new hues ad hoc. If a new tone is needed, derive it harmoniously (OKLCH) from the accent, don't invent.

### Logo
- Wordmark **"ELEVER"** set beside the logo mark, used together in header and footer for recognition.
- The mark + wordmark lockup is the standard brand signature across surfaces.

### Typography
- Dark-premium editorial pairing (1–2 families max, applied consistently).
- Avoid overused defaults (Inter, Roboto, Arial).
- Minimum sizes: 24px+ for slide text, 12pt+ for print, 44px+ mobile hit targets.

### Imagery
- Real product photography in labeled, swappable slots (never SVG-drawn imagery).
- Clean, quiet, premium — product on considered surfaces, in-use lifestyle shots that feel calm and intentional.

---

## 4. The website

One cohesive brand site, dark-premium end to end, fully responsive. Shared **sticky header** (logo lockup + nav) and a deep **footer** (with support links).

### Core pages
1. **Home** — brand story + product intro; hero, showcase.
2. **Product details** — the Elever G1: features, gallery, specs.
3. **About** — brand philosophy and story.
4. **Reviews** — customer proof.

### Support pages (linked from footer)
5. **Activate your planner**
6. **FAQ**
7. **Shipping & returns**
8. **Contact**

### Landing page (the conversion funnel)
A dedicated **high-conversion landing page** is the destination for all ad traffic and **all "Buy" CTAs across the site route here** — not to the product page. It's the page that actually drives sales.

Landing-page interactive elements built:
- Sticky countdown/offer timer
- Live count-up stats
- Tab-based "a day with Elever" story
- Video-testimonial lightbox
- Chat-screenshot carousel (social proof)
- Comparison table
- Objection-handling FAQ

---

## 5. Interaction & craft standards

- Interactivity should feel smooth and purposeful, never gimmicky.
- All icons/marks render via **text glyphs** (the build framework drops innerHTML-injected SVG).
- Every image is in a **labeled, swappable slot** so real assets drop in cleanly.
- Layout uses flex/grid with `gap` (survives editing), not inline spacing.
- Responsive at every breakpoint; mobile is a first-class citizen.

---

## 6. Copy & claims guardrails

- Any statistic tied to the business (customer counts, countries shipped to, retention %) must be **real before it goes live in ads.** Current placeholders in the build: ~12k planners, 38 countries, 92% retention — **replace with verified numbers.**
- Research citations always carry a plain-language disclaimer; never imply a study proves our product works.
- Honest urgency only (real offer deadlines), never fabricated scarcity.

---

## 7. Open items / to replace before launch

- Real product photography → labeled slots (home-hero, home-showcase, prod-hero, gallery, LP hero).
- Real business metrics → placeholder stats.
- Real video testimonials → lightbox slots.
- Real customer chat screenshots → carousel.
- Verified review names, roles, quotes → placeholder reviews.
- Confirm live form/email integrations (Contact, Activate).

---

## 8. Quick reference for AI collaborators

When creating anything for Elever Notes:
- **Tone:** calm, precise, respectful. Cut words. No hype, no emoji, no buzzwords.
- **Color:** dark base + `#C1A078` accent, used sparingly. Don't invent colors.
- **Type:** premium editorial pairing, consistent, not Inter/Roboto/Arial.
- **CTAs:** every "Buy" goes to the landing page.
- **Claims:** cite honestly with disclaimers; use only real business numbers.
- **Imagery:** real photos in labeled slots, never drawn SVG.
- **Brand architecture:** master brand "Elever Notes," products as short model codes (G1, then G2…). Design to scale.