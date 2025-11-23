# Test-Driven Development (TDD) Workflow Skill

**Skill Type:** Procedural Knowledge  
**Domain:** Software Engineering  
**Purpose:** Implement features using TDD loop for reliable, self-correcting development

---

## 🎯 Core Principle: The TDD Ratchet

TDD creates a "ratchet effect" where functionality is locked in by tests, preventing regression as development continues. This is the **most reliable workflow for autonomous agents** because it provides a binary success metric: tests pass or fail.

---

## 🔄 The TDD Loop

### Standard TDD Cycle

```
1. Write Failing Test (Red)
   ↓
2. Run Test (Verify it fails)
   ↓
3. Write Minimum Code to Pass (Green)
   ↓
4. Refactor (Improve code quality)
   ↓
5. Run Tests (Verify still passing)
   ↓
6. Repeat for next requirement
```

---

## 📋 TDD Workflow for Feature Implementation

### Phase 1: Test Generation

**Before writing any implementation code:**

1. **Read Requirements:**
   - Read PRD or task specification
   - Identify acceptance criteria
   - Understand expected behavior

2. **Write Failing Test:**
   ```typescript
   // src/components/Feature/Feature.test.tsx
   import { render, screen } from '@testing-library/react';
   import { Feature } from './Feature';
   
   describe('Feature', () => {
     it('should display data when loaded', () => {
       const mockData = { id: '1', name: 'Test' };
       render(<Feature data={mockData} />);
       
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
     
     it('should show loading state initially', () => {
       render(<Feature data={null} />);
       
       expect(screen.getByText('Loading...')).toBeInTheDocument();
     });
   });
   ```

3. **Verify Test Fails:**
   ```bash
   npm test Feature.test.tsx
   # Expected: Test fails (component doesn't exist yet)
   ```

### Phase 2: Implementation

**Write minimum code to pass:**

```typescript
// src/components/Feature/Feature.tsx
export const Feature: React.FC<FeatureProps> = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }
  
  return <div>{data.name}</div>;
};
```

4. **Run Test Again:**
   ```bash
   npm test Feature.test.tsx
   # Expected: Test passes
   ```

### Phase 3: Refinement

**Once tests pass, improve code:**

- Refactor for readability
- Add error handling
- Follow design system
- Optimize performance
- Add edge cases

5. **Verify Tests Still Pass:**
   ```bash
   npm test Feature.test.tsx
   # Expected: All tests still passing
   ```

---

## ✅ TDD Checklist

**Before Starting Implementation:**
- [ ] Acceptance criteria from PRD identified
- [ ] Test cases written for all requirements
- [ ] Tests fail (confirming they test real behavior)
- [ ] Test file created in correct location

**During Implementation:**
- [ ] Write minimum code to pass tests
- [ ] Run tests after each change
- [ ] Verify tests pass before moving on
- [ ] Don't skip tests (no "I'll add tests later")

**After Implementation:**
- [ ] All tests passing
- [ ] Code refactored for quality
- [ ] Tests still passing after refactor
- [ ] Edge cases covered by tests

---

## 🧪 Test Structure Standards

### Component Tests

```typescript
// src/components/Feature/Feature.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Feature } from './Feature';

describe('Feature Component', () => {
  describe('Rendering', () => {
    it('renders with data', () => {
      // Test happy path
    });
    
    it('renders loading state', () => {
      // Test loading state
    });
    
    it('renders error state', () => {
      // Test error handling
    });
  });
  
  describe('Interactions', () => {
    it('handles user clicks', () => {
      // Test user interactions
    });
  });
  
  describe('Edge Cases', () => {
    it('handles empty data', () => {
      // Test edge cases
    });
  });
});
```

### Utility Function Tests

```typescript
// src/lib/utils.test.ts
import { utilityFunction } from './utils';

describe('utilityFunction', () => {
  it('returns expected result for valid input', () => {
    const result = utilityFunction('valid');
    expect(result).toBe('expected');
  });
  
  it('handles edge cases', () => {
    const result = utilityFunction('');
    expect(result).toBe('default');
  });
});
```

---

## 🚫 TDD Anti-Patterns

### ❌ Writing Tests After Code
```typescript
// BAD: Implementation first
export const Component = () => {
  return <div>Hello</div>;
};

// Then writing test (may miss edge cases)
```

### ✅ Writing Tests Before Code
```typescript
// GOOD: Test first
it('should render hello', () => {
  render(<Component />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});

// Then implementation
export const Component = () => {
  return <div>Hello</div>;
};
```

### ❌ Skipping Test Verification
```typescript
// BAD: Not verifying test fails first
it('should work', () => {
  // Test written but not run
  // Implementation written
  // Test passes (but might be false positive)
});
```

### ✅ Verifying Test Fails
```typescript
// GOOD: Verify test fails, then implement
it('should work', () => {
  // Write test
  // Run: npm test → FAIL (expected)
  // Write implementation
  // Run: npm test → PASS (verified)
});
```

---

## 🎯 TDD for Different Scenarios

### New Feature Implementation

1. Read PRD acceptance criteria
2. Write tests for each AC
3. Verify tests fail
4. Implement feature
5. Verify tests pass
6. Refactor

### Bug Fix

1. Write test that reproduces bug
2. Verify test fails (bug confirmed)
3. Fix bug
4. Verify test passes (bug fixed)
5. Add regression test

### Refactoring

1. Ensure all tests pass before refactoring
2. Refactor code
3. Run tests (should still pass)
4. If tests fail, fix refactoring
5. Verify all tests pass

---

## 🔧 Test Execution Commands

**Run all tests:**
```bash
npm test
```

**Run specific test file:**
```bash
npm test Feature.test.tsx
```

**Run tests in watch mode:**
```bash
npm test -- --watch
```

**Run tests with coverage:**
```bash
npm test -- --coverage
```

---

## 📊 Test Coverage Goals

**Minimum Coverage:**
- Critical paths: 100%
- Edge cases: Covered
- Error handling: Tested
- User interactions: Tested

**Coverage Targets:**
- Unit tests: >80% coverage
- Integration tests: Critical flows
- E2E tests: Main user journeys

---

## 💡 TDD Benefits for Agents

1. **Binary Success Metric:** Tests pass or fail (no ambiguity)
2. **Self-Correction:** Agent can verify its own work
3. **Regression Prevention:** Tests lock in functionality
4. **Clear Requirements:** Tests document expected behavior
5. **Confidence:** Passing tests = working code

---

## 🚨 Common TDD Mistakes

### Mistake 1: False Positives
**Problem:** Test passes without implementation  
**Solution:** Always verify test fails first

### Mistake 2: Testing Implementation Details
**Problem:** Tests break when refactoring  
**Solution:** Test behavior, not implementation

### Mistake 3: Skipping Edge Cases
**Problem:** Tests only cover happy path  
**Solution:** Test empty, null, error states

### Mistake 4: Not Refactoring
**Problem:** Code works but is messy  
**Solution:** Refactor after tests pass

---

**End of TDD Workflow Skill**

