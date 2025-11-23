# Architecture Patterns Skill

**Skill Type:** Procedural Knowledge  
**Domain:** Software Architecture  
**Purpose:** Apply proven architectural patterns for React/TypeScript applications

---

## 🎯 Core Principle: Pattern Consistency

Follow established architectural patterns consistently. Don't invent new patterns unless absolutely necessary. Consistency across the codebase is more valuable than clever solutions.

---

## 🏗️ React Architecture Patterns

### Component Composition Pattern

**Principle:** Compose complex UIs from simple, reusable components.

**Pattern:**
```typescript
// ✅ GOOD: Composition
export const ComplexFeature = () => {
  return (
    <Card>
      <FeatureHeader />
      <FeatureContent />
      <FeatureActions />
    </Card>
  );
};

// ❌ BAD: Monolithic component
export const ComplexFeature = () => {
  return (
    <div>
      {/* 200 lines of JSX */}
    </div>
  );
};
```

### Custom Hooks Pattern

**Principle:** Extract stateful logic into reusable hooks.

**Pattern:**
```typescript
// ✅ GOOD: Custom hook
// src/hooks/useDeviceData.ts
export function useDeviceData(deviceId: string) {
  const [data, setData] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDeviceData(deviceId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [deviceId]);
  
  return { data, loading, error };
}

// Component uses hook
export const DeviceView = ({ deviceId }: { deviceId: string }) => {
  const { data, loading, error } = useDeviceData(deviceId);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  return <DeviceCard device={data} />;
};
```

### Container/Presentational Pattern

**Principle:** Separate data fetching (container) from presentation (presentational).

**Pattern:**
```typescript
// Container: Handles data and logic
export const DeviceContainer = ({ deviceId }: { deviceId: string }) => {
  const device = useDeviceData(deviceId);
  const handleAction = () => { /* logic */ };
  
  return <DeviceView device={device} onAction={handleAction} />;
};

// Presentational: Pure UI component
export const DeviceView: React.FC<DeviceViewProps> = ({ 
  device, 
  onAction 
}) => {
  return (
    <Card>
      <DeviceInfo device={device} />
      <Button onClick={onAction}>Action</Button>
    </Card>
  );
};
```

---

## 📁 File Organization Patterns

### Feature-Based Organization

**Structure:**
```
src/
├── features/
│   ├── device-search/
│   │   ├── components/
│   │   │   ├── DeviceCard.tsx
│   │   │   └── SearchInput.tsx
│   │   ├── hooks/
│   │   │   └── useDeviceSearch.ts
│   │   ├── utils/
│   │   │   └── searchUtils.ts
│   │   └── types.ts
```

**Benefits:**
- Related code grouped together
- Easy to find feature code
- Clear boundaries between features

### Colocation Pattern

**Principle:** Keep related files together.

**Pattern:**
```
Component.tsx
Component.test.tsx
Component.stories.tsx (if using Storybook)
Component.types.ts (if types are complex)
```

---

## 🔄 State Management Patterns

### Local State (useState)

**Use for:**
- Component-specific state
- UI state (open/closed, selected item)
- Form input values

**Pattern:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
```

### Context (useContext)

**Use for:**
- Theme preferences
- User authentication
- Global UI state

**Pattern:**
```typescript
// Create context
const ThemeContext = createContext<Theme>('dark');

// Provide context
<ThemeContext.Provider value={theme}>
  {children}
</ThemeContext.Provider>

// Use context
const theme = useContext(ThemeContext);
```

### Local Storage (Persistence)

**Use for:**
- User preferences
- Recent searches
- Form drafts

**Pattern:**
```typescript
// Save
localStorage.setItem('recentSearches', JSON.stringify(searches));

// Load
const saved = localStorage.getItem('recentSearches');
const searches = saved ? JSON.parse(saved) : [];
```

---

## 🎨 Styling Patterns

### Tailwind Utility Classes

**Pattern:**
```typescript
// ✅ GOOD: Utility classes
<div className="bg-gray-900 p-6 rounded-lg border border-gray-700">

// ❌ BAD: Inline styles
<div style={{ background: '#191E1C', padding: '24px' }}>
```

### Design Token Usage

**Pattern:**
```typescript
// ✅ GOOD: Design tokens
<div className="bg-gray-900 text-cyber-matrix font-heading">

// ❌ BAD: Hardcoded values
<div className="bg-[#191E1C] text-[#00FF41]">
```

### Component Variants

**Pattern:**
```typescript
// ✅ GOOD: Variant-based styling
<Button variant="primary" size="lg">
<Button variant="danger" size="sm">

// ❌ BAD: Conditional classes everywhere
<button className={isPrimary ? 'primary' : 'secondary'}>
```

---

## 🔐 Error Handling Patterns

### Error Boundaries

**Pattern:**
```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Try-Catch for Async

**Pattern:**
```typescript
const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const data = await api.getData();
    setData(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setLoading(false);
  }
};
```

### Error State Components

**Pattern:**
```typescript
if (error) {
  return (
    <div className="bg-threat-high/10 border border-threat-high p-4 rounded-md">
      <p className="font-semibold text-threat-high">Error</p>
      <p className="text-sm">{error}</p>
      <Button onClick={retry}>Retry</Button>
    </div>
  );
}
```

---

## 🧪 Testing Patterns

### Component Testing

**Pattern:**
```typescript
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### Mock Patterns

**Pattern:**
```typescript
// Mock API calls
jest.mock('@/lib/api', () => ({
  fetchData: jest.fn(() => Promise.resolve(mockData))
}));

// Mock hooks
jest.mock('@/hooks/useDeviceData', () => ({
  useDeviceData: () => ({ data: mockDevice, loading: false })
}));
```

---

## 🚀 Performance Patterns

### Memoization

**Pattern:**
```typescript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  onAction(id);
}, [id, onAction]);

// Memoize components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

### Lazy Loading

**Pattern:**
```typescript
// Lazy load routes
const LazyPage = React.lazy(() => import('./pages/Page'));

// Use Suspense
<Suspense fallback={<Loading />}>
  <LazyPage />
</Suspense>
```

---

## 📚 Pattern Reference

### Always Follow These Patterns

1. **Component Composition:** Break complex UIs into smaller components
2. **Custom Hooks:** Extract reusable stateful logic
3. **Type Safety:** Type everything, no `any`
4. **Design Tokens:** Use design system, not hardcoded values
5. **Error Handling:** Always handle errors and edge cases
6. **Testing:** Write tests for critical functionality

### Project-Specific Patterns

**Check existing code for patterns:**
- How are similar features structured?
- What patterns do existing components use?
- How is state managed in similar features?

**Follow existing patterns:**
- Don't invent new patterns
- Match existing code structure
- Maintain consistency

---

## 🚫 Anti-Patterns to Avoid

### ❌ Prop Drilling
```typescript
// BAD: Passing props through many levels
<A prop={value}>
  <B prop={value}>
    <C prop={value}>
      <D prop={value} />
    </C>
  </B>
</A>
```

### ✅ Context or Composition
```typescript
// GOOD: Use context or composition
<Context.Provider value={value}>
  <D /> // Accesses via useContext
</Context.Provider>
```

### ❌ God Components
```typescript
// BAD: One component does everything
export const GodComponent = () => {
  // 500 lines of logic
  // Handles data, UI, business logic
};
```

### ✅ Separated Concerns
```typescript
// GOOD: Separated into focused components
export const Feature = () => {
  const data = useFeatureData();
  return (
    <FeatureContainer>
      <FeatureHeader />
      <FeatureContent data={data} />
      <FeatureActions />
    </FeatureContainer>
  );
};
```

---

**End of Architecture Patterns Skill**



