---
name: AgriPulse
description: Community-powered agricultural intelligence for Cordillera farmers and LGU officers.
colors:
  primary-green: "#2D5016"
  turquoise: "#5d9e87"
  turquoise-dark: "#3f7d68"
  turquoise-strong: "#356b59"
  turquoise-light: "#8fbfa9"
  turquoise-50: "#eef6f2"
  accent-gold: "#F4A300"
  harvest-lime: "#D6E85C"
  earth-very-dark: "#10190B"
  cream: "#F8F7F2"
  soil: "#2C2C2C"
  ink-muted: "#6b7360"
  warning-red: "#D32F2F"
  warning-orange: "#FF6F00"
  success-green: "#2E7D32"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Baloo 2, sans-serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Nunito, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.01em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  full: "999px"
spacing:
  xs: "0.5rem"
  sm: "0.9rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.accent-gold}"
    textColor: "#3a2600"
    rounded: "{rounded.full}"
    height: "46px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "#ffb01f"
    textColor: "#3a2600"
  button-hero:
    backgroundColor: "{colors.primary-green}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    height: "46px"
    padding: "0 24px"
  button-secondary:
    backgroundColor: "{colors.turquoise-50}"
    textColor: "{colors.turquoise-strong}"
    rounded: "{rounded.full}"
    height: "46px"
    padding: "0 24px"
  card:
    backgroundColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "1.75rem"
  field-input:
    backgroundColor: "#ffffff"
    textColor: "{colors.soil}"
    rounded: "{rounded.md}"
    height: "46px"
    padding: "0 0.9rem"
  badge-accent:
    backgroundColor: "{colors.turquoise-50}"
    textColor: "{colors.turquoise-strong}"
    rounded: "{rounded.full}"
    padding: "0.3rem 0.75rem"
---

# Design System: AgriPulse

## 1. Overview

**Creative North Star: "Ground Truth"**

AgriPulse looks the way its promise reads: it takes what is literally in the soil and turns it into foresight. The whole system is built on deep highland earth-greens — the color of a Cordillera field at dusk — lit by two signals of life and harvest: a grey-turquoise (#5d9e87) that carries data, state, and trust, and a harvest-lime (#D6E85C) reserved for the moments that mean growth. It is grounded before it is anything else: the marketing surfaces drench the viewer in near-black forest green, while the working tools (dashboard, wizard, portal) sit on a warm cream field so numbers stay legible for hours.

The register is dual and the design refuses to pick a favorite. For the LGU officer it is dense, calm, and report-grade — cards on cream, tabular figures, semantic status dots. For the farmer it is Facebook-simple — big taps, plain labels, one decision at a time, and the earthy palette carried down to a phone. The connective tissue between them is the turquoise accent and one consistent component vocabulary (`.btn`, `.card`, `.field-input`), so a farmer's submission and an officer's alert feel like the same product.

This system explicitly rejects four things. It is **not a sterile government portal** (no gray bureaucratic form-walls), **not a cold corporate agritech SaaS** (no navy chart-soup without human context), **not childish or cartoonish** (the income stakes are real), and **not flashy crypto/fintech** (no neon, no hype-glow). Warmth comes from the earthy palette, the rounded geometry, and the copy — never from decoration bolted on top.

**Key Characteristics:**
- Earthy, drenched deep-greens on brand surfaces; warm cream on working tools.
- One rare harvest-lime for growth moments; grey-turquoise for data, state, and trust.
- Confident display type (Archivo Black) over friendly, highly-legible body type (Nunito / DM Sans).
- Soft, generous rounding (14–24px) and tinted, earth-toned shadows — never hard-cornered or neutral-black.
- Two audiences, one component vocabulary.

## 2. Colors

An earthy highland palette: deep forest and soil greens as the ground, grey-turquoise and harvest-lime as the two accents that carry meaning.

### Primary
- **Forest Green** (`#2D5016`): The brand's core green. Headings on cream, primary marks, chart bars, the hero CTA gradient's dark end. The color of the product's identity.
- **Deep Earth** (`#10190B`): Near-black forest green. The base of every drenched marketing surface and every dark nav bar; the text color that sits on turquoise fills.

### Secondary
- **Grey Turquoise** (`#5d9e87`): The signal accent. Data, active states, focus rings, links, selection, badges, the "live" pulse. Its four contrast-tuned variants (`-dark #3f7d68`, `-strong #356b59` for AA text on light, `-light #8fbfa9` for accents on dark, `-50 #eef6f2` for tinted fills) let it work as text or fill on any surface. This is the color that ties the farmer app and the LGU dashboard together.

### Tertiary
- **Harvest Lime** (`#D6E85C`): Rarely used, and that is the point. Reserved for growth-and-reward moments — the farmer's "Submit" CTA, the number that means income, the win. Never a background, never decoration.
- **Accent Gold** (`#F4A300`): The established primary-CTA color on light surfaces (`.btn-primary`), and the "highlight" KPI accent.

### Neutral
- **Cream** (`#F8F7F2`): The working-tool background. Every dashboard, form, and portfolio page sits on this warm field so dense data stays readable.
- **Soil** (`#2C2C2C`): Default body text on cream.
- **Muted Ink** (`#6b7360`): Secondary labels, table cells, chart captions — a green-tinted gray, never a neutral one.

### Status
- **Warning Red** (`#D32F2F`) high-risk / oversupply · **Warning Orange** (`#FF6F00`) monitor · **Success Green** (`#2E7D32`) opportunity. Always paired with a text label and a dot — never color alone.

### Named Rules
**The Harvest-Lime Rule.** Harvest-lime (#D6E85C) marks growth and reward only — the submit action, the income figure, the win. If it appears as a background or a decorative fill, it is wrong.

**The Green-Tinted Neutral Rule.** Grays are forbidden. Muted text is `#6b7360` (green-tinted); shadows are tinted toward `rgba(16,25,11,…)`, never neutral black. The whole surface belongs to one earth.

## 3. Typography

**Display Font:** Archivo Black (heading) — with Baloo 2 for softer sub-headings
**Body Font:** Nunito (with system-ui, sans-serif fallback)
**Label/UI Font:** DM Sans

**Character:** A confident, heavy, uppercase display face (Archivo Black) does the shouting — hero lines, section titles, KPI numbers — while a warm, round, highly-legible humanist sans (Nunito) and a clean UI sans (DM Sans) carry everything a user actually reads. The pairing is high-contrast on purpose: authority up top, approachability in the body. Baloo 2 bridges them for friendly card headings.

### Hierarchy
- **Display** (Archivo Black, `clamp(2rem, 4vw, 3rem)`, line-height 1.08, tracking -0.02em, often UPPERCASE): Hero and section headlines on marketing surfaces.
- **Headline** (Baloo 2, 700, 1.15–1.3rem, tracking -0.01em): Card titles and sub-section heads inside tools.
- **Title** (Archivo Black, 1.8rem): Dashboard KPI values and page-level marks; pair with tabular figures.
- **Body** (Nunito, 400, 1rem, line-height 1.6): Prose and descriptions. Cap prose at 65–75ch.
- **Label** (DM Sans, 700, 0.8rem, tracking 0.01em): Field labels, table headers, small UI. The `.eyebrow` (uppercase, tracking 0.14em) is the one exception where wide tracking is intended.

### Named Rules
**The Numbers-Are-Tabular Rule.** Any figure that updates or aligns in a column carries `font-variant-numeric: tabular-nums` (`[data-nums]`). Money and hectares never dance.

## 4. Elevation

A soft, layered system built on **earth-tinted** shadows, not neutral black. Depth is ambient and gentle — surfaces lift on interaction, they don't float by default. Every shadow is tinted toward `rgba(16,25,11,…)` (deep forest) so elevation belongs to the same world as the color.

### Shadow Vocabulary
- **Resting card** (`--shadow-sm`: `0 1px 2px rgba(16,25,11,0.06), 0 2px 6px rgba(16,25,11,0.05)`): Default card elevation on cream.
- **Hover lift** (`--shadow-lg` + `translateY(-4px)`): Interactive cards rise on hover.
- **Overlay / panel** (`--shadow-xl`): Drawers, the hero stats card, modal-grade surfaces.
- **Accent glow** (`--shadow-accent`: `0 6px 20px -6px rgba(93,158,135,0.5)`): Turquoise focus/active moments only.

### Named Rules
**The Lift-On-Intent Rule.** Cards rest flat-ish and lift (`translateY(-2 to -4px)` + a larger shadow) only in response to hover or focus. Resting elevation stays subtle; motion conveys the state.

## 5. Components

### Buttons
- **Shape:** Fully pill-rounded (`--radius-full`, 999px); consistent 46px height (`.btn`), 36px for `.btn-sm`.
- **Primary:** Accent-gold fill (#F4A300) with dark-brown text (#3a2600); lifts 2px + deepens shadow on hover. The established CTA on light surfaces.
- **Hero:** Green→turquoise gradient (`#2D5016 → #356b59`), white text; for the biggest moments only.
- **Secondary:** Turquoise-50 tint (#eef6f2) with turquoise-strong text and a turquoise-200 border — the quiet accent action.
- **Ghost / On-dark:** Ghost = transparent with a primary-green outline; On-dark = translucent white with backdrop-blur for green surfaces.
- **Focus:** Every button inherits the global turquoise focus ring (`--ring`, `0 0 0 3px rgba(93,158,135,0.45)`).

### Cards / Containers
- **Corner Style:** Generous rounding (`--radius-xl`, 24px).
- **Background:** White (#ffffff) on the cream field.
- **Border:** Hairline `rgba(16,25,11,0.08)`.
- **Shadow Strategy:** `--shadow-sm` at rest; `.card-interactive` lifts to `--shadow-lg` on hover. See Elevation.
- **Internal Padding:** 1.5–1.75rem typical.
- **Nesting is forbidden.** A card inside a card is always wrong.

### Inputs / Fields
- **Style:** White fill, hairline `rgba(16,25,11,0.14)` border, 14px radius (`--radius-md`), 46px height. Labels are DM Sans 700 in primary-green above the field.
- **Focus:** Border shifts to turquoise + the turquoise ring. Placeholder `#9aa290` (meets contrast, not a pale gray).

### Navigation
- **Marketing top nav & farmer bottom tabs:** deep-green translucent bars with backdrop-blur; turquoise-light for active, `rgba(255,255,255,0.86)` for rest. Active = color + weight + underline (never color alone).
- **Admin sidebar:** deep-green gradient panel, fixed left on desktop, off-canvas drawer on mobile; active item = turquoise-tint background + bold weight + white text.
- **Mobile treatment:** `display` for show/hide lives in the Tailwind className (`md:hidden flex`), never inline — an inline `display` overrides the media class and leaks the element onto desktop.

### Status Pill (signature)
A colored dot (`box-shadow: 0 0 0 4px <tint>`) + text label on a tinted background: red/oversupply, orange/monitor, green/opportunity. The pattern that carries market state across both audiences.

## 6. Do's and Don'ts

### Do:
- **Do** keep the established theme: deep earth-greens as ground, grey-turquoise (#5d9e87) for data/state/trust, harvest-lime for growth moments only.
- **Do** put working tools on cream (#F8F7F2) and drench marketing surfaces in deep green (#10190B).
- **Do** pair every status color with a text label and a dot — never rely on color alone.
- **Do** use tinted, earth-toned shadows (`rgba(16,25,11,…)`) and green-tinted muted text (#6b7360).
- **Do** reuse the shared vocabulary (`.btn`, `.card`, `.field-input`, `.badge`) so the farmer app and LGU dashboard stay one product.
- **Do** keep the global turquoise focus ring on every interactive element.

### Don't:
- **Don't** make it look like a **sterile government portal** — no gray, dense, bureaucratic form-walls.
- **Don't** make it look like a **cold corporate agritech SaaS** — no navy-and-gray chart-soup without human context.
- **Don't** make it **childish or cartoonish** — the income stakes are real; no toy illustration.
- **Don't** make it **flashy crypto/fintech** — no neon gradients, no hype-glow, no dark-mode-for-cool.
- **Don't** use neutral grays or neutral-black shadows anywhere; the surface belongs to one earth.
- **Don't** use `border-left` (or any side) greater than 1px as a colored accent stripe on cards or list items — signal active state with a background tint + weight instead.
- **Don't** use harvest-lime as a background or decoration; it marks growth/reward only.
- **Don't** set `display` inline on an element that relies on a `*:hidden` Tailwind class to hide at a breakpoint.
