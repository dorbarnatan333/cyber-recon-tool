# Designer Agent - Quick Start

The **Designer** agent ensures all UI/UX follows your design system and provides design guidance throughout the development process.

---

## 🎨 What the Designer Does

### 1. Design Guidance (Before Implementation)
- Reviews PRD for design feasibility
- Maps all UI elements to design tokens
- Identifies component reuse opportunities
- Provides design specifications

**Output:** `design-guidance/design-[feature-name].md`

### 2. Design Review (After Implementation)
- Reviews screenshots for design system compliance
- Checks code for design token usage
- Identifies violations (hardcoded colors, wrong fonts, spacing issues)
- Provides specific fixes with code examples

**Output:** `design-reviews/review-[feature-name].md`

---

## 🚀 How to Use

### Automatic (Recommended)

The Designer is automatically included in the workflow:

```
@orchestrator I want to add a browser timeline visualization
```

**Workflow:**
1. PRD Writer creates PRD
2. You approve PRD
3. **Designer creates design guidance** ← Automatic
4. Code Developer implements using design guidance
5. **Designer reviews implementation** ← Automatic
6. QA Tester validates
7. Product Manager reviews
8. Done!

### Manual Invocation

**For Design Guidance:**
```
@designer Review PRDs/prd-browser-timeline.md and create design guidance
```

**For Design Review:**
```
@designer Review the implementation in screenshots/browser-timeline/ for design system compliance
```

---

## 📋 Design System Sources

The Designer uses these sources (in priority order):

1. **`design-tokens.ts`** - Primary design system
2. **`agents_instructions/shared-standards.md`** - Project standards
3. **`.claude/skills/frontend-design-skill.md`** - Design best practices
4. **`src/components/ui/`** - Existing component library

---

## ✅ What Gets Checked

### Colors
- ✅ Uses design tokens (`bg-gray-900`, `text-cyber-matrix`)
- ❌ No hardcoded colors (`bg-[#191E1C]`)

### Typography
- ✅ Uses Poppins (headings), DM Sans (body), JetBrains Mono (code)
- ❌ No generic fonts (Inter, Roboto)

### Spacing
- ✅ Follows 8px grid (4px, 8px, 12px, 16px, 24px, 32px)
- ❌ No off-grid spacing (5px, 7px, 13px, 17px)

### Components
- ✅ Reuses existing components (Badge, Button, Card)
- ❌ No duplicate components

### Responsive
- ✅ Desktop-first (≥1280px)
- ✅ Proper breakpoint usage

### Accessibility
- ✅ WCAG AA color contrast
- ✅ Keyboard navigation
- ✅ Screen reader support

---

## 🎯 Design Review Priorities

**P0 (Critical) - Block Release:**
- Hardcoded colors
- Missing accessibility
- Breaking design system

**P1 (High) - Significant Issues:**
- Component duplication
- Typography violations
- Spacing violations

**P2 (Medium) - Minor Issues:**
- Missing animations
- Subtle spacing inconsistencies

**P3 (Low) - Polish:**
- Animation timing tweaks
- Visual refinement

---

## 📁 Artifacts Created

### Design Guidance
```
design-guidance/
└── design-[feature-name].md
    ├── Design System Mapping
    ├── Component Specifications
    ├── Responsive Design Notes
    └── Accessibility Requirements
```

### Design Review
```
design-reviews/
└── review-[feature-name].md
    ├── Design System Compliance
    ├── Violations (with fixes)
    ├── Component Reuse Analysis
    └── Priority Fix List
```

---

## 🔍 Example Review Output

### Design Violation Found

```markdown
#### P0 (Critical): Hardcoded Colors

**Location:** `src/pages/Feature.tsx:45`
**Issue:** Using hardcoded hex color instead of design token

**Current Code:**
```tsx
<div className="bg-[#191E1C]"> // ❌ BAD
```

**Required Fix:**
```tsx
<div className="bg-gray-900"> // ✅ GOOD
```
```

---

## 💡 Tips

1. **Designer reviews automatically** - No need to invoke manually
2. **Design guidance comes first** - Code Developer uses it for implementation
3. **Design review catches issues** - Before Product Manager reviews
4. **Fixes are specific** - Code Developer knows exactly what to change

---

## 🆘 Troubleshooting

**Designer not reviewing?**
- Check if PRD was approved
- Verify workflow-state.json shows designer step

**Design violations not caught?**
- Check design-reviews/review-[name].md
- Verify screenshots were captured

**Need design guidance?**
```
@designer Create design guidance for PRDs/prd-[name].md
```

---

**The Designer ensures your UI stays consistent with your design system!** 🎨



