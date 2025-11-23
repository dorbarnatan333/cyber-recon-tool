# Component Scaffolding Skill

**Skill Type:** Procedural Knowledge  
**Domain:** Frontend Development  
**Purpose:** Ensure consistent React component creation following project patterns

---

## 🎯 Core Principle: The "Smart Clone" Pattern

When creating new components, **never start from scratch**. Always use the "Smart Clone" pattern:

1. **Reference:** Read an existing similar component from `src/components/ui/`
2. **Template:** Use its structure as a template
3. **Adapt:** Modify only the logic, preserve the boilerplate
4. **Verify:** Ensure the new component matches project patterns exactly

This prevents "Drift" - where AI-generated code slowly diverges from established patterns.

---

## 📋 Component Scaffolding Workflow

### Step 1: Identify Reference Component

**Before creating a new component, ask:**
- Is there a similar component in `src/components/ui/`?
- What patterns does it follow (imports, exports, typing style)?
- How does it handle props, state, and styling?

**Example:**
```
Need: New "DeviceCard" component
Reference: src/components/ui/Card.tsx
Pattern: Functional component, TypeScript interface, Tailwind classes
```

### Step 2: Read Reference Component

**Always read the reference component completely:**
```typescript
// Read: src/components/ui/Card.tsx
// Understand:
// - Import patterns
// - Export style
// - TypeScript interface structure
// - Styling approach (Tailwind classes)
// - Error handling patterns
// - Edge case handling
```

### Step 3: Create Component Using Template

**Use the reference as a structural template:**

```typescript
// Template from Card.tsx
import React, { useState } from 'react';
import { ComponentProps } from '@/types';

export interface DeviceCardProps {
  // Define props following same pattern
  device: Device;
  onSelect: (device: Device) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ 
  device, 
  onSelect 
}) => {
  // Component logic here
  // Preserve same structure as reference
  
  return (
    <div className="...">
      {/* JSX following reference patterns */}
    </div>
  );
};
```

### Step 4: Verify Consistency

**Check before finalizing:**
- [ ] Imports match project style
- [ ] TypeScript interface follows same pattern
- [ ] Export style matches (named export)
- [ ] Styling uses design tokens (not hardcoded)
- [ ] Error handling follows same pattern
- [ ] Edge cases handled (empty, loading, error)

---

## 🏗️ Component Structure Template

### Standard React Component Pattern

```typescript
// 1. Imports (grouped by type)
import React, { useState, useEffect } from 'react';
import { ComponentType } from '@/types';
import { ExistingComponent } from '@/components/ui/ExistingComponent';

// 2. TypeScript Interface (exported)
export interface NewComponentProps {
  // Props definition
  data: ComponentType;
  onAction: (id: string) => void;
  className?: string;
}

// 3. Component (functional, typed)
export const NewComponent: React.FC<NewComponentProps> = ({ 
  data, 
  onAction,
  className = ''
}) => {
  // 4. State (if needed)
  const [state, setState] = useState<StateType>(initialValue);
  
  // 5. Effects (if needed)
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 6. Handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // 7. Early returns (edge cases)
  if (!data) {
    return <div>No data available</div>;
  }
  
  // 8. Main render
  return (
    <div className={`base-classes ${className}`}>
      {/* JSX */}
    </div>
  );
};
```

---

## ✅ Component Quality Checklist

Before marking a component as complete:

**Structure:**
- [ ] Functional component (not class)
- [ ] TypeScript interface exported
- [ ] Props properly typed
- [ ] Named export (not default)

**Code Quality:**
- [ ] No `any` types
- [ ] Error handling included
- [ ] Edge cases handled (empty, null, undefined)
- [ ] Loading states considered

**Design System:**
- [ ] Uses design tokens (no hardcoded colors)
- [ ] Follows spacing grid (8px multiples)
- [ ] Uses existing UI components when possible
- [ ] Typography follows design system

**Patterns:**
- [ ] Matches reference component structure
- [ ] Imports follow project conventions
- [ ] Styling approach consistent
- [ ] No duplicate logic (reuse utilities)

---

## 🚫 Anti-Patterns to Avoid

### ❌ Starting from Scratch
```typescript
// BAD: Creating component without reference
export const NewComponent = () => {
  // May drift from project patterns
};
```

### ✅ Using Smart Clone
```typescript
// GOOD: Using reference component as template
// Read: src/components/ui/Card.tsx
// Adapt: Change logic, preserve structure
export const NewComponent: React.FC<Props> = ({ ... }) => {
  // Matches project patterns exactly
};
```

### ❌ Inconsistent Patterns
```typescript
// BAD: Mixing patterns
import React from 'react';
const Component = (props) => { // No types, default export
```

### ✅ Consistent Patterns
```typescript
// GOOD: Following project patterns
import React, { useState } from 'react';
import { ComponentProps } from '@/types';

export interface ComponentProps { ... }
export const Component: React.FC<ComponentProps> = ({ ... }) => {
```

---

## 📚 Reference Components Library

**Always check these before creating new components:**

**UI Components (`src/components/ui/`):**
- `Badge.tsx` - For badges, tags, labels
- `Button.tsx` - For all buttons
- `Card.tsx` - For containers, panels
- `Input.tsx` - For form inputs
- `Table.tsx` - For data tables

**Layout Components (`src/components/layout/`):**
- `AppLayout.tsx` - Main app structure
- `Header.tsx` - Page headers
- `Sidebar.tsx` - Navigation sidebars

**Pattern to Follow:**
1. Read the reference component
2. Understand its structure
3. Clone the structure
4. Adapt the logic
5. Verify consistency

---

## 🔄 Component Creation Workflow

```
1. Identify need for new component
   ↓
2. Search for similar component in src/components/ui/
   ↓
3. Read reference component completely
   ↓
4. Understand patterns (imports, types, styling)
   ↓
5. Create new component using reference as template
   ↓
6. Adapt logic for new use case
   ↓
7. Verify against checklist
   ↓
8. Test component works
   ↓
9. Verify TypeScript compilation
```

---

## 💡 Best Practices

1. **Always Reference First:** Never create without checking existing components
2. **Preserve Structure:** Keep imports, exports, typing style identical
3. **Adapt Logic Only:** Change business logic, not structural patterns
4. **Verify Consistency:** Run checklist before finalizing
5. **Document Deviations:** If you must deviate, document why

---

**End of Component Scaffolding Skill**

