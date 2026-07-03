---
name: Vibrant Health Protocol
colors:
  surface: '#fafbe6'
  surface-dim: '#dadcc7'
  surface-bright: '#fafbe6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f5e0'
  surface-container: '#eeefdb'
  surface-container-high: '#e8ead5'
  surface-container-highest: '#e3e4d0'
  on-surface: '#1a1d10'
  on-surface-variant: '#454933'
  inverse-surface: '#2f3224'
  inverse-on-surface: '#f1f2de'
  outline: '#757961'
  outline-variant: '#c5c9ad'
  surface-tint: '#546500'
  primary: '#546500'
  on-primary: '#ffffff'
  primary-container: '#d8ff2e'
  on-primary-container: '#607400'
  inverse-primary: '#b2d400'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#5e5e5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#f0efef'
  on-tertiary-container: '#6c6c6c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ccf21b'
  primary-fixed-dim: '#b2d400'
  on-primary-fixed: '#171e00'
  on-primary-fixed-variant: '#3e4c00'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#fafbe6'
  on-background: '#1a1d10'
  surface-variant: '#e3e4d0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The brand identity centers on the intersection of high-performance fintech aesthetics and premium wellness. It targets a modern, health-conscious demographic that values efficiency, data transparency, and a motivating visual environment. The emotional response is intended to be energetic yet focused—leveraging the high-visibility of "electric lime" to signal action, while grounding the experience in a sophisticated, minimalist framework.

The design style is a hybrid of **Modern Minimalism** and **Fintech-inspired Neo-utility**. It borrows the bold, high-contrast ethos of apps like Lemon Cash and Cash App—utilizing stark blacks and vibrant accents—but softens the execution with expansive white space, subtle depth, and organic "squircle" geometries to remain approachable within the health category. The overall mood is "Premium Vitality."

## Colors

The palette is engineered for high impact and clarity. 
- **Primary (Electric Lime):** Used for primary actions, progress indicators, and key brand moments. It represents energy and "go" status.
- **Secondary (Obsidian):** Provides the structural weight. Used for primary text, iconography, and high-contrast button states to ensure readability and a "premium" tech feel.
- **Surface & Background:** A subtle off-white background (#F5F5F5) differentiates the UI from the pure white (#FFFFFF) cards, creating a natural layered effect without heavy shadows.
- **Semantic Colors:** Success (Green), Warning (Amber), and Error (Red) should be desaturated slightly to avoid clashing with the vibrant primary lime.

## Typography

This design system utilizes **Inter** for its neutral, systematic clarity that scales perfectly from dense data visualizations to bold display headlines. 

- **Headlines:** Use tight letter-spacing (-0.01em to -0.02em) to mimic the "editorial" feel of premium fitness apps.
- **Data Points:** Large metrics (e.g., calorie counts) should use the `display-lg` style to create a clear information hierarchy.
- **Hierarchy:** Use font weight (SemiBold/Bold) rather than color shifts to denote importance, maintaining the high-contrast aesthetic.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with generous internal safe areas. 

- **Mobile:** A 4-column grid with 20px side margins.
- **Desktop:** A 12-column grid centered with a max-width of 1200px.
- **Rhythm:** An 8px linear scale is used for all spatial relationships. 
- **Density:** High whitespace is prioritized to prevent the health data from feeling overwhelming. Elements are grouped in "islands" (cards) with 16px of vertical breathing room between stacks.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** supplemented by ultra-soft ambient shadows.

- **The Ground:** The #F5F5F5 background acts as the lowest layer.
- **The Surface:** Content cards use pure #FFFFFF. They are elevated by a very subtle shadow: `0px 4px 20px rgba(0, 0, 0, 0.04)`.
- **The Interaction Layer:** Primary buttons and floating action buttons (FABs) use the Primary Lime color to "pop" off the screen, requiring no shadow, as the color contrast provides sufficient elevation.
- **Overlays:** Modals and bottom sheets use a 40% opacity black backdrop with a 12px background blur (glassmorphism) to maintain context.

## Shapes

The shape language is defined by **Pill-shaped (Level 3)** roundedness. 

- **Main Cards:** Use `rounded-xl` (24px) to create a friendly, modern container.
- **Buttons & Chips:** Use fully rounded (Pill) corners to echo the "active" and "athletic" nature of the product.
- **Inputs:** Follow a 12px minimum radius to maintain consistency with the card corners.
- **Icons:** Use a consistent 2pt stroke weight with rounded terminals and joins.

## Components

- **Buttons:**
  - *Primary:* #D8FF2E background with #1C1C1C text. Pill-shaped.
  - *Secondary:* #1C1C1C background with #FFFFFF text.
  - *Ghost:* No background, #1C1C1C bold text, 1px border.
- **Cards:** White surfaces with 24px radius. Content inside cards should have 16px or 20px padding.
- **Chips (Filters):** Pill-shaped. Unselected: #FFFFFF with light border; Selected: #D8FF2E with #1C1C1C text.
- **Progress Bars:** Thick tracks (8px+) with rounded caps. The track is a light #E5E5E5 and the fill is Primary Lime.
- **Inputs:** Light grey background (#EDEDED) with no border, 12px radius. When focused, add a 2px #1C1C1C border.
- **Lists:** Clean rows with 16px vertical padding, separated by subtle hairline dividers (#EEEEEE) that do not touch the screen edges.
- **Navigation:** A floating tab bar style or a pinned bottom nav with #FFFFFF background and #1C1C1C active states.