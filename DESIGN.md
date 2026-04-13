# Design System: UPAGE — Architecture Agency Landing Page
**Project ID:** 13738025068617379829 (Stitch)
**Stitch Design System Name:** Atelier Minimalist

---

## 1. Visual Theme & Atmosphere

The design embodies **"Architectural Precision meets Digital Elegance"** — a digital manifestation of a high-end architectural monograph. The aesthetic is absolutely minimalist, sophisticated, and cultured, much like the physical studio of a world-class architecture firm.

We embrace **Organic Minimalism**: every pixel is intentional, negative space serves as a structural element, and the screen is treated like a physical site where elements breathe. The overall vibe is: *Airy. Precise. Editorial. Premium.*

Inspiration draws from high-end coffee table books: intentional asymmetry, content that bleeds to edges, tonal layering over harsh borders.

---

## 2. Color Palette & Roles

| Descriptive Name | Hex Code | Role |
|---|---|---|
| **Alabaster White** | `#F5F0EB` (surface: `#FEF8F3`) | Primary canvas / page background. Warm, not clinical. |
| **Graphite Gray** | `#2C2C2C` (primary: `#171818`) | Primary text. Deep, authoritative. Dark sections. |
| **Dusty Terracotta** | `#C17754` (secondary: `#8E4D2E`) | Accents, problem icons, eyebrow labels, decorative elements. |
| **Muted Sage Green** | `#7C9A7E` (tertiary-fixed: `#CBEBCB`) | Solution section accents, secondary labels, checkmarks. |
| **Aged Gold** | `#C9A84C` | **Exclusive to primary CTAs and main action buttons.** |
| **Surface Container** | `#F2EDE8` | Secondary section backgrounds, card containers. |
| **Surface Lowest** | `#FFFFFF` | Floating elevated cards (whisper-soft lift effect). |

### The "No-Line" Rule
Borders between sections are **strictly prohibited**. Section transitions are defined purely through background color shifts (from `#FEF8F3` to `#F8F3EE`, etc.).

---

## 3. Typography Rules

**Single font family:** Montserrat (Google Fonts) — used as a bold architectural statement, not merely as readable text.

- **H1 / Display:** Montserrat ExtraBold (800), `2.4rem` mobile, letter-spacing `-0.02em` (tight, locked-in)
- **H2 / Section Headlines:** Montserrat Bold (700), `1.8rem` mobile
- **Eyebrow Labels:** Montserrat Bold (700), `0.7rem`, ALL CAPS, letter-spacing `+0.15em` — archival aesthetic
- **Body Text:** Montserrat Regular (400), `1rem`, line-height `1.8`
- **CTA Button Text:** Montserrat SemiBold (600), `0.9rem`, letter-spacing `+0.06em` uppercase

---

## 4. Component Stylings

### Buttons
- **Primary (Aged Gold CTA):** Pill-shaped (`border-radius: 50px`). Background: `#C9A84C`. Text: white. Minimum height: `52px` for mobile touch. Hover: darkens to `#A8893E`, subtle `scale(1.02)` transform.
- **Secondary (Outline):** Pill-shaped outline. `1.5px solid #2C2C2C`. Background: transparent. Hover: background fills to `#2C2C2C`, text shifts to white.
- **Sticky CTA:** Fixed to viewport bottom on mobile. Gold pill with calendar emoji. `box-shadow` with warm amber glow.

### Cards / Containers
- `border-radius: 16px`. No borders.
- Background: `surface-container-lowest` (`#FFFFFF`) on `surface-container` (`#F2EDE8`) backgrounds.
- Shadow: Ambient warm shadow — `0px 24px 48px rgba(142, 77, 46, 0.08)`
- Hover: Lifts slightly, shadow deepens.

### Icons
- Minimalist, thin-line style (1–1.5px stroke weight)
- Problem icons: Dusty Terracotta (`#C17754`)
- Solution/feature icons: Muted Sage Green or Aged Gold

### Input Fields (for future contact form)
- No 4-sided box. Only a 1px bottom stroke (`outline_variant`)
- Active state: stroke transitions to Dusty Terracotta, thickens to 2px.

---

## 5. Layout Principles

- **Mobile-First:** All layouts designed for 390px viewport width first
- **Negative Space as Structure:** Sections have `80px–120px` vertical padding on mobile
- **Horizontal Padding:** `24px–32px` gutters on mobile
- **Typography Hierarchy:** Eyebrow label → H2 → Body follows archival editorial pattern
- **No Dividers:** Vertical rhythm achieved through spacing, not lines
- **Sticky Floating CTA:** Fixed bottom element for maximum conversion on mobile scroll
- **Scroll Animations:** Fade-in + slide-up (30px) for all section content

---

## 6. Animation Principles

- **Preloader:** Elegant fade-in of UPAGE logo, then dissolve to reveal page
- **IntersectionObserver:** `.animate-on-scroll` class triggers `opacity: 0 → 1` + `translateY(30px → 0)` on scroll
- **Transitions:** All interactive elements use `transition: all 0.3s ease`
- **Hover Microinteractions:** Scale, color shift, shadow deepening on all cards and buttons
- **Staggered Delays:** Cards animate with 0.1s–0.3s delays for visual flow
