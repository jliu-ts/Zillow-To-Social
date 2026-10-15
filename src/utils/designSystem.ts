/**
 * Trending Society / Estate Atelier Standardized Design System Tokens
 * 
 * Defines unified tactile states across all interactive elements:
 * - Hover: Subtle contrast ramp with 150ms transition
 * - Active / Pressed: Tactile scale feedback (active:scale-[0.98])
 * - Selected: Obsidian dark (#0a1317) with white contrast
 * - Focus: 2px ring offset
 */

export const INTERACTION_STYLES = {
  // Primary dark button or active selected pill/tab
  primary:
    'bg-[#0a1317] hover:bg-[#202529] active:bg-[#15191c] text-white shadow-xs font-semibold active:scale-[0.98] transition-all duration-150 cursor-pointer',

  // Secondary subtle button or inactive segmented item
  secondary:
    'bg-transparent hover:bg-[#f8f9fa] active:bg-[#f1f4f7] text-[#5d6c7b] hover:text-[#0a1317] active:scale-[0.98] transition-all duration-150 cursor-pointer',

  // Hairline bordered action button (e.g. secondary actions, dialog triggers)
  outline:
    'bg-white hover:bg-[#f8f9fa] active:bg-[#f3f4f6] text-[#0a1317] border border-[#e5e7eb] hover:border-[#d1d5db] shadow-2xs active:scale-[0.98] transition-all duration-150 cursor-pointer',

  // Segmented control active item
  segmentedActive:
    'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-medium active:scale-[0.98] transition-all duration-150 cursor-pointer',

  // Segmented control inactive item
  segmentedInactive:
    'bg-transparent hover:bg-white text-[#5d6c7b] hover:text-[#0a1317] active:scale-[0.98] transition-all duration-150 cursor-pointer',

  // Interactive selection card (e.g., brokerage preset, theme card, hook preset)
  cardInteractive:
    'border border-[#e5e7eb] bg-white hover:border-[#0a1317]/40 hover:shadow-xs active:scale-[0.99] transition-all duration-150 cursor-pointer',

  // Interactive card when currently active / selected
  cardSelected:
    'border-[#0a1317] ring-1 ring-[#0a1317] bg-[#f8f9fa] shadow-xs cursor-pointer',

  // Icon utility buttons (close, minimap toggle, mute, reload)
  iconUtility:
    'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa] active:bg-[#f1f4f7] active:scale-95 transition-all duration-150 cursor-pointer rounded-lg',
} as const;
