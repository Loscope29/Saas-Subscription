---
name: Precision Subscription Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#47464f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#787680'
  outline-variant: '#c8c5d0'
  surface-tint: '#5b598c'
  primary: '#070235'
  on-primary: '#ffffff'
  primary-container: '#1e1b4b'
  on-primary-container: '#8683ba'
  inverse-primary: '#c4c1fb'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#0c0034'
  on-tertiary: '#ffffff'
  tertiary-container: '#241554'
  on-tertiary-container: '#8d7fc3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c1fb'
  on-primary-fixed: '#181445'
  on-primary-fixed-variant: '#444173'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#e7deff'
  tertiary-fixed-dim: '#ccbeff'
  on-tertiary-fixed: '#1e0e4e'
  on-tertiary-fixed-variant: '#4a3d7c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  section-padding-desktop: 120px
  section-padding-mobile: 64px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 64px
---

## Brand & Style

The visual identity of this design system is rooted in the intersection of high-end financial utility and modern technological accessibility. It targets decision-makers who value clarity and efficiency in managing complex subscription ecosystems. The brand personality is authoritative yet welcoming, using a **Corporate / Modern** aesthetic that avoids the sterility of traditional enterprise software through vibrant accents and airy layouts.

We lean into a "Humanist High-Tech" feel. This is achieved by balancing a rigorous, mathematical grid with soft, approachable geometry (16px radii) and a breathable white-space strategy. The emotional response should be one of "effortless control"—transforming the anxiety of recurring costs into the calm of organized data.

## Colors

The palette is anchored by **Deep Indigo**, providing a sense of depth and institutional trust. This is contrasted with **Vibrant Violet**, which serves as the primary action color and brand signature, drawing the eye to conversion points and critical data visualizations.

We utilize a tiered background approach: pure white for primary surfaces and a very soft, cool gray (Slate-50) for section differentiation and container backgrounds. Tertiary violets are used sparingly for soft highlights and "glow" effects in high-tech illustrations. Success states use a crisp emerald to denote positive financial health.

## Typography

This design system utilizes **Inter** exclusively to maintain a clean, systematic appearance that scales perfectly from dense data tables to bold marketing headlines.

- **Headlines:** Use tighter letter-spacing and heavier weights (600-700) to create a strong visual hierarchy.
- **Body Text:** Set with generous line-height (1.5x-1.6x) to ensure maximum readability against the high-contrast background.
- **Labels:** Small caps or all-caps are used for utility labels and navigation items to provide a distinct stylistic break from narrative copy.
- **Scale:** For mobile devices, display sizes are reduced significantly to prevent awkward word wrapping while maintaining the bold weight.

## Layout & Spacing

The system follows a **Fixed Grid** model for desktop, centered within a 1280px max-width container using a 12-column structure. 

- **Grid:** 24px gutters provide ample breathing room between cards and content blocks.
- **Vertical Rhythm:** Sections are defined by significant vertical padding (120px) to maintain the "clean and professional" feel requested.
- **Modular Spacing:** All internal component spacing is a multiple of 8px. Use `stack-md` (32px) for spacing between related groups and `stack-lg` (64px) for spacing between distinct content modules within a section.
- **Responsibility:** On mobile, the grid collapses to 1 column with 20px side margins, while section padding is halved to keep the user engaged.

## Elevation & Depth

To maintain a high-tech yet accessible aesthetic, we use **Ambient Shadows** and **Tonal Layers** rather than heavy borders.

1.  **Low Elevation (Cards):** Use a very soft, diffused shadow: `0 4px 20px rgba(30, 27, 75, 0.04)`. This creates a subtle lift from the `background_subtle` layer.
2.  **High Elevation (Overlays/Dropdowns):** Use a more pronounced shadow with a hint of the brand indigo: `0 12px 40px rgba(30, 27, 75, 0.08)`.
3.  **Depth via Color:** Functional areas like sidebars or specific dashboard widgets use `background_subtle` to create a recessed effect without needing shadows, keeping the UI flat and modern.

## Shapes

The design system uses a consistent **Rounded (16px)** shape language. This specific radius is applied to all primary containers, pricing cards, and feature blocks to evoke friendliness and modern SaaS sensibilities.

- **Primary Radius:** 1rem (16px) for cards and main UI containers.
- **Secondary Radius:** 0.5rem (8px) for smaller elements like input fields and tags.
- **Interactive Elements:** Buttons utilize a slightly more aggressive rounding (often pill-shaped or 12px) to differentiate them from static containers.
- **Consistency:** Avoid mixing sharp corners with rounded ones; even media assets and screenshots should be clipped to the 16px standard when placed in cards.

## Components

### Buttons
- **Primary:** Solid Vibrant Violet background with White text. Subtle inner glow on hover.
- **Secondary:** Deep Indigo outline with Transparent background. High-contrast and professional.
- **Ghost:** Text-only in Neutral Slate, moving to Deep Indigo on hover.

### Cards
- **Marketing Cards:** White background, 16px radius, subtle ambient shadow. Used for features and pricing.
- **Data Cards:** 1px border in a very light gray (#E2E8F0) with no shadow, used for secondary dashboard information.

### Form Inputs
- Background: `background_subtle` (F8FAFC).
- Border: 1px solid #E2E8F0, changing to Vibrant Violet on focus.
- Radius: 8px.

### Badges/Chips
- Small, uppercase labels with a soft violet background (10% opacity) and Vibrant Violet text. Used for status indicators and category tags.

### Navigation
- A clean, sticky header with a backdrop-blur (Glassmorphism) effect. Navigation links use `label-sm` typography with a subtle underline transition on hover.