# Design System Reference

This document explains the visual language used by the frontend and how to extend it safely.

## 1. Core Design Tokens

Defined in frontend/src/index.css under :root.

### Color Tokens
- --bg-base: page background
- --bg-surface: card/input base
- --bg-elevated: translucent elevated surfaces
- --ink-primary: main text
- --ink-secondary: secondary text
- --ink-muted: supporting labels/timestamps
- --accent: primary interactive color
- --accent-soft: subtle accent background
- --lost-color: lost-state alert color
- --found-color: found-state success color
- --border: default border color

### Shadow Tokens
- --shadow-sm
- --shadow-md
- --shadow-lg

### Radius Tokens
- --radius-sm
- --radius-md
- --radius-lg
- --radius-xl

## 2. Typography

Font families currently loaded:
- Syne: headings, strong labels
- DM Sans: body and controls
- JetBrains Mono: optional technical text

Guidelines:
- Use Syne for H1-H3 and key identity labels.
- Use DM Sans for body copy and forms.
- Keep body text readable with clear contrast against background tokens.

## 3. Surface Patterns

### Glass Surfaces
Use utility classes from index.css:
- .glass
- .glass-strong
- .glass-subtle

These classes combine blur, translucency, and soft borders. Prefer these over writing ad-hoc translucent backgrounds.

### Cards
- Use `card` base class with tokenized spacing and radius.
- Avoid mixed corner radii unless interaction context requires asymmetry (chat bubbles).

## 4. Motion Principles

The UI uses Framer Motion for major transitions and CSS keyframes for lightweight effects.

Available CSS keyframes include:
- shimmer
- shake
- pulse-badge
- fade-in-up
- page-enter
- page-exit

Motion guidelines:
- Keep durations short (typically 0.2s to 0.4s).
- Prefer subtle movement over dramatic displacement.
- Maintain consistent easing across similar interactions.

## 5. Form Patterns

### Floating Label Inputs
- Use .input-wrapper + .input + .input-label pattern.
- Keep labels inside a relative wrapper with the input to preserve selector behavior.
- Placeholder text should be focus-aware where required by UX.

### Validation
- Errors appear below fields using muted red text tokens.
- Avoid shifting layout aggressively on error; reserve space when practical.

## 6. Status and Feedback

### Badges
- Lost items use lost-color and optional pulse animation.
- Found/resolved states use found-color.
- Category badges should remain neutral unless state-specific emphasis is required.

### Toasts
- Toasts are used for async outcomes (success, warning, error).
- Message text should be direct and action-oriented.

## 7. Messaging UI Guidelines

For chat views:
- Keep conversation list compact with clear unread indicators.
- Maintain left/right bubble distinction for incoming/outgoing messages.
- Use date separators for long threads.
- Keep reply composer anchored with clear send affordance.

## 8. Responsiveness

Layout expectations:
- Mobile: single-column navigation with focused content area.
- Tablet: adaptive spacing with moderate density.
- Desktop: multi-panel layouts where context switching is frequent (for example, messages).

## 9. Extension Rules

When adding new UI:
- Reuse token variables first.
- Reuse existing utility classes before introducing new classes.
- Keep animations consistent with current timing/easing language.
- Update this document whenever introducing new global tokens or interaction patterns.
