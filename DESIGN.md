# Estate Atelier Design System Specification

## 1. Interaction & State Hierarchy

All interactive primitives throughout the application adhere to a standardized 3-tier tactile model:

### State Matrix

| State Tier | Base Styling | Hover State | Active / Pressed State | Focus State |
|---|---|---|---|---|
| **Primary Action** (Selected / Active) | `bg-[#0a1317] text-white shadow-xs` | `hover:bg-[#202529]` | `active:scale-[0.98] active:bg-[#15191c]` | `focus-visible:ring-2 focus-visible:ring-[#0a1317] focus-visible:ring-offset-2` |
| **Secondary Action** (Segmented Inactive) | `bg-transparent text-[#5d6c7b]` | `hover:bg-[#f8f9fa] hover:text-[#0a1317]` | `active:scale-[0.98] active:bg-[#f1f4f7]` | `focus-visible:ring-2 focus-visible:ring-[#0a1317]` |
| **Outline Action** (Hairline Buttons) | `bg-white border-[#e5e7eb] text-[#0a1317]` | `hover:bg-[#f8f9fa] hover:border-[#d1d5db]` | `active:scale-[0.98] active:bg-[#f3f4f6]` | `focus-visible:ring-2 focus-visible:ring-[#0a1317]` |
| **Interactive Selection Cards** | `border-[#e5e7eb] bg-white` | `hover:border-[#0a1317]/40 hover:shadow-xs` | `active:scale-[0.99]` | `focus-visible:ring-2 focus-visible:ring-[#0a1317]` |
| **Card Selected State** | `border-[#0a1317] ring-1 ring-[#0a1317] bg-[#f8f9fa]` | — | — | — |
| **Icon Utility Buttons** | `text-[#5d6c7b]` | `hover:text-[#0a1317] hover:bg-[#f8f9fa]` | `active:scale-95` | `focus-visible:ring-2 focus-visible:ring-[#0a1317]` |

---

## 2. Animation & Timing Rules
- **Duration**: `duration-150` for micro-interactions (buttons, hovers, chips); `duration-200` to `duration-300` for structural layout shifts (docks, sheets, dialogs).
- **Easing**: Native `ease-out` with tactile micro-scaling (`active:scale-[0.98]`).

---

## 3. Floor Radar Architectural Standards
- **Footprint**: 2D SVG blueprint diagram with hairline wall strokes and radial grid dots.
- **Orientation**: Real-time compass orientation marker (North indicator).
- **Radar Beacon**: Dual-ring pulse dot with radiating radar ripple animation on active room coordinate.
- **Direct Teleportation**: Interactive room zones with hover tinting (`fill-[#0a1317]/10`) and click-to-teleport support.

---

## 4. Typography Matrix
- **Headings / Hero Pricing**: Playfair Display (`font-serif`, `tracking-tight`)
- **Body & Controls**: Manrope / Plus Jakarta Sans (`font-sans`, `font-medium`, `font-semibold`)
- **Technical Specs & Metrics**: JetBrains Mono (`font-mono`, `text-[10px]` / `text-[11px]`, `tabular-nums`)
