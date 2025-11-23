# Frontend Design Skill - Cyber Recon Tool

This skill provides specialized frontend design guidance for cybersecurity interfaces, following Claude Code best practices for design system consistency.

**Reference:** Based on [Claude's frontend design best practices](https://www.claude.com/blog/improving-frontend-design-through-skills)

---

## 🎨 Design Philosophy

### Avoid Generic Design Patterns

**Never use:**
- Inter, Roboto, Open Sans, Lato fonts (too generic)
- Purple gradients on white backgrounds (overused)
- Minimal animations (lacks polish)
- Safe, universal design choices (undermines brand)

**Instead, use:**
- Distinctive typography (Poppins for headings, DM Sans for body, JetBrains Mono for code)
- Cyber-themed color palette (matrix green, neon cyan, dark backgrounds)
- Purposeful animations (scanning effects, data updates)
- Brand-appropriate design (SOC-style, professional, security-focused)

---

## 🎯 Typography Strategy

### Font Selection

**Headings (Poppins):**
- Distinctive, professional, modern
- Excellent for cybersecurity interfaces
- Use for: Page titles, section headers, card titles

**Body (DM Sans):**
- Clean, readable, professional
- Optimized for long-form content
- Use for: Paragraphs, descriptions, labels

**Code/Data (JetBrains Mono):**
- Technical, monospace, developer-friendly
- Perfect for: IP addresses, MAC addresses, hashes, code snippets

### Typography Principles

**High Contrast Pairing:**
- Display font (Poppins) + Monospace (JetBrains Mono) = High contrast
- Creates visual hierarchy and interest

**Size Extremes:**
- Use 3x+ size differences (h1: 32px vs caption: 12px)
- Not subtle 1.5x differences
- Creates clear hierarchy

**Weight Extremes:**
- Use 100/200 vs 800/900 weights
- Not 400 vs 600 (too subtle)
- Creates visual interest

**Example:**
```css
/* ✅ GOOD - High contrast */
h1 { font-size: 32px; font-weight: 700; } /* Poppins Bold */
code { font-size: 12px; font-weight: 400; } /* JetBrains Mono Regular */

/* ❌ BAD - Low contrast */
h1 { font-size: 20px; font-weight: 600; }
code { font-size: 16px; font-weight: 500; }
```

---

## 🎨 Color Strategy

### Cyber Security Theme

**Primary Palette:**
- Teal/Cyan: `#0B85B0` (primary) - Professional, technical
- Matrix Green: `#00FF41` (cyber-matrix) - Active, scanning, alerts
- Neon Cyan: `#0FF0FC` (cyber-neon) - Highlights, accents

**Background:**
- Deep Dark: `#0A0B0A` (gray-950) - True dark mode
- Surface: `#191E1C` (gray-900) - Cards, panels
- Elevated: `#484F4C` (gray-800) - Hover states

**Threat Colors:**
- Critical: `#B61400` (threat-critical) - Immediate danger
- High: `#E11900` (threat-high) - Serious threat
- Medium: `#FF9043` (threat-medium) - Warning
- Low: `#F6BB3D` (threat-low) - Caution
- Success: `#258750` (threat-success) - Safe, approved

### Color Usage Rules

**NEVER:**
- Hardcode hex colors
- Use colors not in design-tokens.ts
- Create new colors without updating design system

**ALWAYS:**
- Use Tailwind classes mapped to design tokens
- Reference design-tokens.ts for all color decisions
- Use semantic color names (threat-critical, not red-500)

---

## 🎭 Background & Depth

### Dark Theme Optimization

**Background Treatment:**
- Use subtle gradients for depth (not flat colors)
- Layer surfaces: gray-950 → gray-900 → gray-800
- Add subtle borders for separation

**Example:**
```css
/* ✅ GOOD - Layered depth */
.card {
  background: linear-gradient(135deg, #191E1C 0%, #0A0B0A 100%);
  border: 1px solid #484F4C;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* ❌ BAD - Flat, no depth */
.card {
  background: #191E1C;
}
```

### Cyber-Specific Effects

**Glow Effects:**
- Matrix green glow for active states
- Cyan glow for highlights
- Red glow for threats

**Example:**
```css
.active-scan {
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3); /* Matrix green glow */
}

.threat-indicator {
  box-shadow: 0 0 20px rgba(225, 25, 0, 0.3); /* Red glow */
}
```

---

## ✨ Animation & Motion

### Purposeful Animations

**Use animations for:**
- Data updates (smooth transitions)
- Loading states (scanning effects)
- State changes (hover, active, focus)
- Real-time updates (pulse for active connections)

**Avoid:**
- Decorative animations (distracting)
- Slow animations (feels sluggish)
- No animations (feels static, unresponsive)

### Animation Principles

**Duration:**
- Fast: 150ms (micro-interactions)
- Normal: 300ms (state changes)
- Slow: 500ms (page transitions)

**Easing:**
- Use `ease-out` for entrances
- Use `ease-in` for exits
- Use `ease-in-out` for state changes

**Example:**
```css
/* ✅ GOOD - Purposeful animation */
.button {
  transition: all 300ms ease-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 65, 0.2);
}

/* ❌ BAD - No animation */
.button {
  /* Static, feels unresponsive */
}
```

---

## 📐 Spacing & Layout

### 8px Grid System

**All spacing must be multiples of 8px:**
- 4px (0.5x)
- 8px (1x)
- 12px (1.5x)
- 16px (2x)
- 24px (3x)
- 32px (4x)

**Never use:**
- 5px, 7px, 13px, 17px (not on grid)

**Example:**
```css
/* ✅ GOOD - On 8px grid */
.container {
  padding: 24px; /* 3x8px */
  gap: 16px; /* 2x8px */
  margin-bottom: 32px; /* 4x8px */
}

/* ❌ BAD - Off grid */
.container {
  padding: 23px; /* Not on grid */
  gap: 17px; /* Not on grid */
}
```

### Component Spacing

**Section Padding:** 24px (p-6)
**Card Padding:** 16px (p-4) or 24px (p-6)
**Element Gap:** 16px (gap-4)
**Table Cell Padding:** 12px (p-3)

---

## 🧩 Component Design

### Reusable Components

**Always check for existing components:**
- `src/components/ui/Badge.tsx` - ThreatBadge, StatusBadge
- `src/components/ui/Button.tsx` - Primary, secondary, danger variants
- `src/components/ui/Card.tsx` - Standard card component
- `src/components/ui/Input.tsx` - Form inputs
- `src/components/ui/Table.tsx` - Data tables

**Don't create duplicates.** Reuse and extend existing components.

### Component Specifications

**Button:**
- Border radius: 8px
- Padding: 12px 16px (md size)
- Font: DM Sans, 16px
- Transition: 300ms ease-out

**Card:**
- Border radius: 12px
- Padding: 24px
- Background: gray-900
- Border: 1px solid gray-700
- Shadow: md (for elevation)

**Table:**
- Row height: 30px (compact)
- Cell padding: 12px (p-3)
- Max 15 rows visible
- Expandable rows for details

---

## 📱 Responsive Design

### Desktop-First Approach

**Breakpoint:** 1280px (xl)
- Primary target: Desktop SOC environments
- Minimum width: 1280px
- Optimize for large screens

**Responsive Strategy:**
- Use `lg:` prefix for 1280px+ adjustments
- Tables: Horizontal scroll on smaller screens
- Cards: Stack vertically on mobile
- Graphs: Maintain aspect ratio

---

## ♿ Accessibility

### Color Contrast

**WCAG AA Standards:**
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements: 3:1 contrast ratio

**Verify:**
- Text on gray-900 background
- Text on threat color backgrounds
- Interactive element focus states

### Keyboard Navigation

**All interactive elements must be:**
- Keyboard accessible (Tab navigation)
- Focus indicators visible
- Logical tab order

**Focus Style:**
```css
.focusable:focus {
  outline: 2px solid #00FF41; /* Matrix green */
  outline-offset: 2px;
}
```

### Screen Reader Support

**ARIA Labels:**
- All icons need aria-label
- All buttons need descriptive text
- All form inputs need labels

---

## 🎯 Design Review Priorities

### P0 (Critical) - Block Release
- Hardcoded colors (not using design tokens)
- Missing accessibility (keyboard nav, ARIA)
- Breaking design system (new colors, fonts, spacing)

### P1 (High) - Significant Issues
- Component duplication (not reusing existing)
- Typography violations (wrong fonts, sizes)
- Spacing violations (not on 8px grid)

### P2 (Medium) - Minor Issues
- Missing animations (feels static)
- Subtle spacing inconsistencies
- Minor color contrast issues

### P3 (Low) - Polish
- Animation timing tweaks
- Micro-interaction improvements
- Visual refinement

---

## 📚 Design System References

**Primary Sources:**
- `design-tokens.ts` - Complete design system
- `agents_instructions/shared-standards.md` - Project standards
- `src/components/ui/` - Component library

**Always reference these files before making design decisions.**

---

## ✅ Design Checklist

Before approving any UI implementation:

- [ ] All colors from design-tokens.ts
- [ ] Typography follows font system (Poppins/DM Sans/JetBrains Mono)
- [ ] Spacing on 8px grid
- [ ] Components reused (not duplicated)
- [ ] Responsive design considered
- [ ] Accessibility standards met
- [ ] Animations purposeful (not decorative)
- [ ] Dark theme optimized
- [ ] Cyber aesthetic maintained
- [ ] No generic design patterns

---

**End of Frontend Design Skill**

