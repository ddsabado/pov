---
name: DDWUMP
description: A quietly tactile documentary photography archive.
colors:
  black: "#000000"
  white: "#ffffff"
  gray-300: "#d1d5db"
  gray-400: "#9ca3af"
  gray-500: "#6b7280"
  gray-600: "#4b5563"
  gray-800: "#1f2937"
  paper: "#F2E7D7"
  surface: "#E8D8C3"
  ink: "#1D1A17"
  muted: "#7F6B53"
  rust: "#BF5A36"
  sage: "#A1B5A1"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "tight"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 300
  meta:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontWeight: 400
    fontSize: "11px"
    letterSpacing: "0.14em"
rounded:
  compact: "6px"
  pill: "9999px"
spacing:
  micro: "4px"
  compact: "16px"
  section: "96px"
components:
  button-landing:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    padding: "12px 40px"
  nav-active:
    backgroundColor: "rgba(255, 255, 255, 0.1)"
    textColor: "{colors.white}"
    rounded: "{rounded.compact}"
    padding: "6px 12px"
---

# Design System: DDWUMP

## Overview

**Creative North Star: "The Midnight Field Notebook"**

DDWUMP is a raw, documentary-minded photography archive experienced in low light. The interface is intentionally recessive: near-black planes let photographs establish the changing color world, while compact text, navigation, and controls feel like the quiet annotations of a personal notebook.

The system is minimal without becoming sterile. Inter carries direct, unornamented reading; IBM Plex Mono marks metadata, labels, specifications, and archive context. Interaction has a quietly tactile quality through restrained opacity shifts, translucent active surfaces, and spring movement—never ornamental spectacle competing with an image.

**Key Characteristics:**

- Image-first, full-bleed and asymmetric photographic composition.
- Raw/documentary voice with brief, factual interface language.
- Black ground and translucent layers rather than opaque card-heavy UI.
- Small monospaced metadata as a consistent archival signature.
- Soft spring motion that makes navigation and image sequences feel handled, not animated for its own sake.

## Colors

The incumbent interface uses neutral darkness as a stable viewing condition, allowing the images to supply the dominant color; the defined paper, rust, and sage tokens are available for a future intentional palette expansion but are not currently the interface’s active accent system.

### Primary

- **Midnight Ground:** Used as the uninterrupted page, navigation, modal, and gallery field.
- **Notebook White:** Used for active text, core labels, and the landing action.

### Secondary

- **Field Paper:** A warm light surface token reserved in the theme for future color-led surfaces.
- **Weathered Rust:** A warm accent token reserved for a deliberate future accent role.
- **Faded Sage:** A subdued supporting tone reserved for future color expansion.

### Neutral

- **Silver Annotation:** Used for inactive navigation, social controls, and supporting text.
- **Distant Caption:** Used for subtitles and subdued specifications.
- **Receding Detail:** Used for copyright, labels, dividers, and less prominent metadata.
- **Ghost Boundary:** Used for hairline navigation and dropdown borders.

**The Photograph Leads Rule.** Interface color must stay subordinate to the work. Introduce a non-neutral theme color only through a deliberately defined role; do not scatter accents across controls or captions.

## Typography

**Display Font:** Inter (with system sans-serif fallback)

**Body Font:** Inter (with system sans-serif fallback)

**Label/Mono Font:** IBM Plex Mono (with ui-monospace fallback)

**Character:** The pairing is direct and contemporary: Inter keeps names and descriptions clear, while IBM Plex Mono turns small labels, technical details, and archive context into quiet field notes.

### Hierarchy

- **Display** (700, 42px desktop / 18px compact, 1.05 line-height): Gear names and high-emphasis titles.
- **Headline** (600, 28–34px, 1.2 line-height): Simple page headings such as About.
- **Body** (300, 11–16px, 1.5–1.75 line-height): Gear descriptions and longer supporting copy.
- **Label** (400, 10–13px, 0.14–0.2em tracking, uppercase where used): Navigation-adjacent metadata, album names, subtitles, and copyright.

**The Annotation Rule.** Mono type is for context, not emphasis: keep it small, tracked, and quiet; use Inter for titles and language a visitor must read first.

## Layout

The layout alternates between immersive edge-to-edge image moments and centered reading containers. The navigation uses a max-width desktop container with a fixed 56px height. Gallery content sits within a wide container and deliberately avoids a uniform card grid: photo groups form staggered columns, cascades, rows, and triangular arrangements with 16px internal gaps and 96px separation between groups.

The Gear view becomes a side-by-side dial and reading panel from the medium breakpoint upward; portrait mobile stacks them. Album pages reduce images to a compact three-column contact-sheet grid. Page content generally clears the fixed navigation with a 56–80px top spacer. Preserve the breathing room around photographs; responsive changes may simplify arrangements but should not force every group into identical geometry.

## Elevation & Depth

Depth is subtle and translucent, not shadow-driven. The black base stays flat; active tabs use a low-opacity white overlay, image modals use a blurred backdrop, and dropdowns are separated with a muted border. Motion and layering establish hierarchy more often than box shadows.

**The Translucent Layer Rule.** When a control needs separation, prefer a low-opacity light layer, soft blur, or restrained border over a filled card or pronounced shadow.

## Shapes

The system is mostly square and image-led. Photographs have no decorative rounding; controls use only small 6px corners where a soft tactile edge helps, while the navigation’s compact tabs use a full pill silhouette. Borders are thin and low-contrast. Circular geometry is reserved for the Gear dial and small metadata bullets, where it communicates function rather than decoration.

## Components

### Buttons

Quietly tactile controls are light in visual weight and decisive in feedback.

- **Shape:** Square-to-gently-curved; landing action uses a plain 2px translucent white border, navigation actions use compact 6px active surfaces.
- **Primary:** The landing action is transparent with white, tracked uppercase text and generous horizontal padding.
- **Hover / Focus:** Increase contrast or add a restrained translucent white fill; keep scale changes small and fast. Keyboard focus must remain visibly distinguishable.

### Navigation

Navigation is a fixed black bar with a low-contrast bottom rule, bold DDWUMP wordmark, and lightweight tabs. The active state is a shared translucent pill that slides between destinations. The bar disappears on downward scroll and returns on upward scroll; album navigation opens a compact bordered dropdown rather than a persistent panel.

### Image Groups

Gallery groups are the signature component. They are not cards: images are cropped to their containers and composed in varied editorial arrangements. Each group enters as a staggered, low-rise spring sequence and yields to a fullscreen photo viewer on selection.

### Image Modal

The fullscreen viewer keeps attention on the photograph with a dark blurred backdrop, fade-and-scale entrance, and deliberately restrained navigation affordances that appear only when useful.

### Gear Dial

The Gear page pairs a partially off-canvas circular dial with a textual field-note panel. Equipment moves around concentric, low-opacity rings; the chosen item enlarges subtly while its image counter-rotates to remain readable.

### Inputs / Fields

The private album gate uses a centered, transparent password field with a single bottom border. Error feedback shifts both border and text to red; no extra container is needed.

## Do's and Don'ts

### Do:

- **Do** make the photograph the primary color, texture, and subject of every image-led surface.
- **Do** use black planes, low-contrast gray annotation, and translucent layers to keep controls receded.
- **Do** reserve IBM Plex Mono for small archival context, specifications, labels, and timestamps.
- **Do** retain varied gallery geometry and generous separation between photo groups.
- **Do** use spring motion for spatial movement and short opacity transitions for quiet feedback.

### Don't:

- **Don't** turn the gallery into a uniform card grid or add decorative frames around photographs.
- **Don't** use heavy shadows, bright persistent UI fills, or dense panel stacks to create hierarchy.
- **Don't** introduce accent colors casually; any future palette expansion needs a named, constrained role.
- **Don't** make controls louder than the images they operate on.
