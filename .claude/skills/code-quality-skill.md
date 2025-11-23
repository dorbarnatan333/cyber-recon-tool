# Code Quality Skill

**Skill Type:** Procedural Knowledge  
**Domain:** Software Engineering  
**Purpose:** Maintain high code quality through linting, type checking, and refactoring

---

## 🎯 Core Principle: Quality Gates

Code quality is not optional. Every piece of code must pass quality gates before being considered complete:

1. **TypeScript Compilation:** Zero errors
2. **Linting:** Zero warnings (or approved exceptions)
3. **Type Safety:** No `any` types
4. **Code Style:** Consistent with project standards
5. **Performance:** No obvious performance issues

---

## ✅ Quality Checklist

### Before Committing Code

**TypeScript:**
- [ ] `npm run build` succeeds (zero errors)
- [ ] No `any` types used
- [ ] All functions properly typed
- [ ] Interfaces defined for all props

**Linting:**
- [ ] `npm run lint` passes (zero warnings)
- [ ] Code follows project style guide
- [ ] No unused imports
- [ ] No console.log statements (use proper logging)

**Code Quality:**
- [ ] No duplicate code
- [ ] Functions are focused (single responsibility)
- [ ] Complex logic extracted to utilities
- [ ] Error handling included
- [ ] Edge cases handled

**Design System:**
- [ ] Uses design tokens (no hardcoded values)
- [ ] Reuses existing components
- [ ] Follows spacing grid (8px multiples)
- [ ] Typography follows design system

---

## 🔍 TypeScript Quality Standards

### Type Safety Rules

**NEVER use `any`:**
```typescript
// ❌ BAD
function process(data: any) {
  return data.value;
}

// ✅ GOOD
interface ProcessData {
  value: string;
}
function process(data: ProcessData): string {
  return data.value;
}
```

**ALWAYS type function parameters and returns:**
```typescript
// ❌ BAD
function calculate(input) {
  return input * 2;
}

// ✅ GOOD
function calculate(input: number): number {
  return input * 2;
}
```

**Use existing types from `src/types/`:**
```typescript
// ✅ GOOD
import { Device, SearchQuery } from '@/types';

function searchDevices(query: SearchQuery): Device[] {
  // Implementation
}
```

### Type Checking Workflow

1. **Write Code:**
   ```typescript
   export const Component: React.FC<Props> = ({ data }) => {
     // Implementation
   };
   ```

2. **Check Types:**
   ```bash
   npm run build
   # Should show: "No type errors found"
   ```

3. **Fix Any Errors:**
   - Read error message
   - Fix type issue
   - Re-run build
   - Repeat until zero errors

4. **Verify:**
   ```bash
   npm run build
   # Expected: Success, zero errors
   ```

---

## 🧹 Linting Standards

### ESLint Configuration

**Project uses:** ESLint with TypeScript plugin

**Common Rules:**
- No unused variables
- No unused imports
- Consistent quote style
- Consistent semicolon usage
- No console.log (use proper logging)

### Linting Workflow

1. **Run Linter:**
   ```bash
   npm run lint
   ```

2. **Fix Warnings:**
   - Read linting errors
   - Fix automatically if possible: `npm run lint -- --fix`
   - Fix manually if needed
   - Re-run lint

3. **Verify:**
   ```bash
   npm run lint
   # Expected: Zero warnings
   ```

### Auto-Fix Common Issues

```bash
# Auto-fix formatting and simple issues
npm run lint -- --fix
```

**Note:** Review auto-fixes before committing. Some may need manual adjustment.

---

## 🔄 Refactoring Standards

### When to Refactor

**Refactor when:**
- Code duplication detected
- Function is too long (>50 lines)
- Complex logic that's hard to understand
- Performance issues identified
- Code doesn't follow project patterns

### Refactoring Workflow

1. **Ensure Tests Pass:**
   ```bash
   npm test
   # All tests must pass before refactoring
   ```

2. **Refactor Code:**
   - Extract complex logic to utilities
   - Break down large functions
   - Remove duplication
   - Improve naming

3. **Verify Tests Still Pass:**
   ```bash
   npm test
   # Tests should still pass after refactoring
   ```

4. **Verify Quality:**
   ```bash
   npm run build  # TypeScript
   npm run lint   # Linting
   ```

### Refactoring Patterns

**Extract Utility Function:**
```typescript
// Before: Logic in component
const Component = () => {
  const result = data.map(item => {
    // Complex logic here
    return processed;
  });
};

// After: Logic extracted
// src/lib/utils.ts
export function processData(data: Data[]): Processed[] {
  return data.map(item => {
    // Complex logic here
    return processed;
  });
}

// Component uses utility
const Component = () => {
  const result = processData(data);
};
```

**Break Down Large Functions:**
```typescript
// Before: One large function
function handleComplexTask() {
  // 100 lines of logic
}

// After: Broken into smaller functions
function validateInput() { /* ... */ }
function processData() { /* ... */ }
function formatOutput() { /* ... */ }

function handleComplexTask() {
  validateInput();
  const processed = processData();
  return formatOutput(processed);
}
```

---

## 🚨 Code Quality Violations

### Critical Violations (Must Fix)

**TypeScript Errors:**
- Compilation failures
- Type mismatches
- Missing type definitions

**Linting Errors:**
- Syntax errors
- Unused code
- Style violations

**Design System Violations:**
- Hardcoded colors
- Wrong fonts
- Off-grid spacing

### High Priority (Should Fix)

**Code Smells:**
- Duplicate code
- Long functions (>50 lines)
- Complex nested logic
- Poor naming

**Performance Issues:**
- Unnecessary re-renders
- Missing memoization
- Inefficient algorithms

### Medium Priority (Nice to Fix)

**Code Style:**
- Inconsistent formatting
- Missing comments
- Unclear variable names

---

## 🔧 Quality Tools

### TypeScript Compiler

```bash
# Check types
npm run build

# Watch mode (development)
npm run dev
```

### ESLint

```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Pre-commit Checks

**Before committing, always:**
1. Run `npm run build` (TypeScript)
2. Run `npm run lint` (Linting)
3. Run `npm test` (Tests)
4. Verify all pass

---

## 📊 Quality Metrics

### Code Quality Targets

**TypeScript:**
- Zero compilation errors
- Zero `any` types
- 100% type coverage

**Linting:**
- Zero warnings
- Consistent style
- No unused code

**Test Coverage:**
- >80% coverage
- All critical paths tested
- Edge cases covered

---

## 💡 Quality Best Practices

1. **Check Early, Check Often:**
   - Run `npm run build` after each significant change
   - Don't accumulate errors

2. **Fix Immediately:**
   - Don't leave TypeScript errors
   - Don't ignore linting warnings
   - Fix quality issues as you go

3. **Refactor Continuously:**
   - Don't let code quality degrade
   - Refactor when you see duplication
   - Keep functions focused

4. **Use Tools:**
   - Let TypeScript catch errors
   - Let ESLint enforce style
   - Let tests verify behavior

---

## 🚫 Quality Anti-Patterns

### ❌ Ignoring TypeScript Errors
```typescript
// BAD: Using @ts-ignore to bypass errors
// @ts-ignore
const value = data.unknownProperty;
```

### ✅ Fixing Type Errors Properly
```typescript
// GOOD: Define proper types
interface Data {
  knownProperty: string;
}
const value = data.knownProperty;
```

### ❌ Skipping Linting
```bash
# BAD: Not running linter
# Code has style issues
```

### ✅ Running Linter Always
```bash
# GOOD: Always check
npm run lint
# Fix all warnings
```

---

**End of Code Quality Skill**



