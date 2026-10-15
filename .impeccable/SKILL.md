# Impeccable Design Skill System
pbakaus/impeccable — The Frontend Design Skill & Anti-AI-Slop Constitution

## Purpose
An automated design language and deterministic quality standard that eradicates generic "AI slop" and enforces world-class, domain-native craft.

## 61 Deterministic Anti-Slop Rules

### 1. Typography & Hierarchy
- [ANTI-SLOP-01] Never default to Inter, Roboto, or generic sans-serif fallbacks. Pair an expressive, domain-native display face with a legible body face.
- [ANTI-SLOP-02] Maximum of two font families per application (1 display + 1 body) + 1 monospace outlier strictly for tabular data/code.
- [ANTI-SLOP-03] Always balance headlines with `text-wrap: balance` to prevent awkward trailing orphan words.
- [ANTI-SLOP-04] No ghost typography, giant low-opacity watermark words, or decorative background letterforms.
- [ANTI-SLOP-05] Tabular data, financial metrics, and counters must use `font-variant-numeric: tabular-nums` or `font-mono`.
- [ANTI-SLOP-06] No all-caps shouting in body or multi-line headings. Reserve uppercase strictly for tracked micro-kickers (`tracking-[0.2em]`).

### 2. Zero-Pill & Metadata Discipline
- [ANTI-SLOP-07] Never wrap static metadata (categories, tags, dates, statuses, neighborhood names) in rounded pill boxes, bordered chips, or colored candy capsules.
- [ANTI-SLOP-08] Render static metadata as clean, unboxed text with subtle typographic separators (`·`, `—`, `/`).
- [ANTI-SLOP-09] No "badge sandwiches" on top of cards. Cards lead directly with photography or the primary title.
- [ANTI-SLOP-10] No compound pill islands or secondary pill tags attached to navigation headers.
- [ANTI-SLOP-11] Filter tabs and state selectors must be functional segmented controls with click handlers, not decorative candy badges.

### 3. Color, Saturation & Contrast
- [ANTI-SLOP-12] 60-30-10 Color Budget: 60% dominant neutral canvas, 30% structural surfaces/hairlines, 10% high-intent accent.
- [ANTI-SLOP-13] Prohibit random purple-to-blue or cyan gradients on dark backgrounds.
- [ANTI-SLOP-14] Prohibit neon glow blur balls (`blur-3xl`, radial gradient blobs) behind cards or headers.
- [ANTI-SLOP-15] Maintain strict WCAG AA contrast (minimum 4.5:1 for body copy, 3:1 for large display titles).
- [ANTI-SLOP-16] In dark mode or dark chassis, apply subtle optical compensation (`tracking-wide` / `text-white/90`) to prevent low-contrast spindly text.

### 4. Component Architecture & Spatial Geometry
- [ANTI-SLOP-17] Whitespace over "cards within cards". Prohibit nesting rounded bordered containers inside larger bordered containers.
- [ANTI-SLOP-18] Prohibit thick left accent borders (`border-l-4`, colored left stripes) on cards or callouts.
- [ANTI-SLOP-19] Nested radius math: inner corner radius must equal outer corner radius minus padding ($r_{\text{inner}} = r_{\text{outer}} - p$).
- [ANTI-SLOP-20] Single-elevation depth: maximum 1 level of card elevation per screen.
- [ANTI-SLOP-21] Container outer padding must be greater than or equal to inner padding between children (minimum 16px).
- [ANTI-SLOP-22] Button padding math: horizontal padding approximately 2× vertical padding (`px-4 py-2` or `px-5 py-2.5`).

### 5. Eradicating Pseudo-Technical & Cockpit Clutter
- [ANTI-SLOP-23] No code-comment prefixes (`// 01 ARCHITECTURE`, `/* SPEC */`, `>_ DISCOVER`). Use clean editorial prose.
- [ANTI-SLOP-24] No hallucinated cockpit scoreboards (e.g. fake "96/100 HOOK SCORE" or arbitrary percentage bars) unless explicitly requested.
- [ANTI-SLOP-25] No decorative pulsing status dots (`animate-pulse bg-emerald-500`) on static labels or headings. Status dots are strictly for live real-time streams.
- [ANTI-SLOP-26] No sparkle icon (`Sparkle`) spam on every button, heading, and input field.
- [ANTI-SLOP-27] Interactive controls must use plain, clear human verbs (`"Download Video"`, `"Schedule Showing"`, `"Copy Script"`), never roleplay jargon.
