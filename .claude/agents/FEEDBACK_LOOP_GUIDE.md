# Feedback Loop Workflow Guide

## Overview

The feedback loop enables continuous improvement after initial implementation. When feedback is received (MD file + images), the orchestrator processes it and delegates fixes to the code-developer, who may also update documentation.

**⚡ PERFORMANCE:** Use the **Fast Path** for simple feedback (10x faster). See [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) for details.

## Quick Start

### Fast Path (Recommended - 10x Faster)

### 1. User Provides Feedback

Place feedback in:
```
feedback/
├── feedback-[feature-name]-[iteration].md
└── images/
    └── [feature-name]/
        ├── problem-01-description.png
        └── problem-02-description.png
```

### 2. Orchestrator Processes Feedback (Fast Path)

The orchestrator will:
- Quick scan of feedback (count issues)
- **Directly delegate:** "Read feedback/[file].md and fix all issues"
- No intermediate task files created

### 3. Code Developer Fixes Issues (Fast Path)

The code-developer will:
- Read feedback document and images directly
- Fix each issue systematically
- Update code files
- **Update documentation only if requirements changed**
- Brief report back: files modified, issues fixed count

### 4. Done!

Orchestrator reports completion - no verification step needed for simple fixes.

---

### Full Path (Complex Cases Only)

Use full path only when:
- Complex feedback requiring analysis
- Multiple agents needed
- Architectural changes
- > 20 issues

**Full Path Steps:**
1. Orchestrator creates task file
2. Code-developer reads task file
3. Code-developer writes detailed fix report
4. Orchestrator verifies fixes
5. Multiple verification steps

## Feedback Document Formats

### Format 1: Simple Numbered List
```markdown
1. image.png - the browser activity graph is not showing nothing
2. pressing on custom in the browser activity graph is not trigger nothing
3. clicking on the last 7 days is not changing the x axis values
```

### Format 2: Structured Feedback
```markdown
### 2.1 Component Name

**Current Implementation Issues:**
- Issue description

**Required Changes:**
[ASCII diagram]

**Implementation Requirements:**
- Specific fix 1
- Specific fix 2
```

Both formats are supported.

## Documentation Updates

When fixing feedback issues, the code-developer may update:

1. **PRD** (`PRDs/prd-[feature-name].md`)
   - If requirements changed
   - Document why changes were made

2. **Design Docs** (`design-guidance/design-[feature-name].md`)
   - If UI/UX changes affect design system
   - Update design tokens if needed

3. **API/Interface Docs**
   - If component interfaces changed
   - Update TypeScript documentation

4. **User Documentation**
   - If feature behavior changed significantly
   - Update usage examples

## Workflow State Tracking

Each iteration is tracked in `workflow-state.json`:

```json
{
  "feedback_iterations": [
    {
      "iteration": 1,
      "feedback_file": "feedback/feedback-browser-timeline-1.md",
      "fix_task": "tasks/task-fix-browser-timeline-1.md",
      "fix_report": "fix-reports/fix-browser-timeline-1.md",
      "status": "completed",
      "issues_fixed": 8,
      "docs_updated": ["PRDs/prd-browser-timeline.md"]
    }
  ]
}
```

## File Structure

```
cyber-recon-tool/
├── feedback/
│   ├── feedback-[feature]-[iteration].md
│   └── images/
│       └── [feature]/
│           └── problem-*.png
├── tasks/
│   └── task-fix-[feature]-[iteration].md
├── fix-reports/
│   └── fix-[feature]-[iteration].md
└── workflow-state.json
```

## Example Workflow

1. **Initial Implementation:** Feature built, screenshots captured
2. **Feedback Received:** User provides `feedback/feedback-browser-1.md` + images
3. **Orchestrator:** Creates `tasks/task-fix-browser-1.md`
4. **Code Developer:** 
   - Fixes all 12 issues
   - Updates PRD (requirements changed)
   - Updates design docs (UI layout changed)
   - Captures new screenshots
   - Writes `fix-reports/fix-browser-1.md`
5. **Orchestrator:** Verifies fixes, updates workflow state
6. **Next Iteration:** If more feedback, repeat with iteration 2

## Key Points

- ✅ Feedback documents can reference images
- ✅ Code-developer updates documentation when needed
- ✅ All changes tracked in workflow state
- ✅ Iterations numbered sequentially
- ✅ Fix reports document all changes
- ✅ Both simple and structured feedback formats supported

