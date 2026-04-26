# Design System Reference

This document describes the current frontend design language and extension rules.

## 1. Core Theme Direction

The application uses a dark, high-contrast visual style.

- Main text: white (`ink-primary`)
- Secondary/supporting text: white shades (`ink-secondary`, `ink-muted`)
- Surfaces: deep navy/violet glass layers
- Accent: luminous violet

## 2. Design Tokens

Global tokens are defined in `frontend/src/index.css` under `:root`.

### Color Tokens
- `--bg-base`
- `--bg-surface`
- `--bg-elevated`
- `--ink-primary`
- `--ink-secondary`
- `--ink-muted`
- `--accent`
- `--accent-soft`
- `--lost-color`
- `--found-color`
- `--border`

### Shape and Elevation
- Radii: `--radius-sm` to `--radius-xl`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

## 3. Typography Rules

- Headings use `Syne`
- Body/UI text uses `DM Sans`
- Code/technical text can use `JetBrains Mono`

Text hierarchy guidance:
- Use `text-ink-primary` for all key headings and primary labels
- Use `text-ink-secondary` for body copy
- Use `text-ink-muted` for metadata (timestamps, helper text)

## 4. Global Utility Enforcement

`index.css` includes utility-level overrides for:
- `.text-ink-primary`
- `.text-ink-secondary`
- `.text-ink-muted`

This keeps color consistency across pages, including auth, profile, listings, messages, and admin.

## 5. Surface Patterns

Use shared classes before creating custom surface styles:
- `.glass`
- `.glass-strong`
- `.glass-subtle`
- `.card`
- `.card-glass`

These classes provide consistent blur, border, and depth behavior.

## 6. Landing Hero Pattern

Landing page uses an interactive DotGrid background.

Implementation:
- Component: `src/components/DotGrid.jsx`
- Styles: `src/components/DotGrid.css`
- Usage page: `src/pages/Landing.jsx`

Recommended DotGrid usage:
- Keep it as a background layer (`absolute inset-0`)
- Add an overlay gradient for readability
- Ensure content is rendered in a higher `z-index`

## 7. Navbar Behavior

- Floating style on landing page
- Docked style on internal pages
- Smooth dock animation when navigating from landing to login/register
- Same core color language across desktop and mobile nav

## 8. Motion System

Motion sources:
- Framer Motion for route/component transitions
- CSS keyframes for lightweight effects (`shimmer`, `shake`, `pageEnter`, etc.)

Guidelines:
- Keep transitions subtle and short (roughly 150ms-400ms)
- Avoid heavy continuous animations on large content panels
- Prefer transform/opacity over expensive paint operations

## 9. Form and Feedback Patterns

Forms:
- Use `FloatingLabelInput` where possible
- Use `.input`, `.input-label`, and `.input-wrapper`

Status feedback:
- Use Toastify for async success/error messages
- Use badges for type/status states (`lost`, `found`, `resolved`)

## 10. Accessibility & Legibility Checklist

When introducing new UI:
1. Validate contrast against dark backgrounds
2. Keep headings in `ink-primary`
3. Keep body copy in `ink-secondary`
4. Reserve `ink-muted` for helper/meta text
5. Test on mobile and desktop breakpoints

## 11. Extension Rules

- Reuse tokens/utilities first; avoid ad-hoc hardcoded colors
- Keep nav and panel styling consistent across pages
- If you add a global token or utility, update this file and `VERSION.md`
