# Quick Reference - Claude Code Agent Commands

Copy-paste ready commands for common tasks.

---

## 🚀 Starting a Workflow

### New Feature Request
```
@orchestrator I want to add [feature description]
```

### Bug Fix
```
@orchestrator Fix [bug description]. [Additional context]
```

### Refinement
```
@orchestrator Implement the feedback from feedback/feedback-[name].md
```

---

## 📋 Checking Status

### Workflow Status
```
Read workflow-state.json
```

### Current Plan
```
Read workflow-plan.md
```

### Errors
```
Read workflow-errors.log
```

---

## 🔍 Reviewing Artifacts

### PRD
```
Read PRDs/prd-[feature-name].md
```

### Implementation Report
```
Read implementation-reports/impl-[feature-name].md
```

### Test Report
```
Read test-reports/test-[feature-name].md
```

### Feedback
```
Read feedback/feedback-[feature-name].md
```

---

## 🤖 Direct Agent Invocation

### PRD Writer
```
@prd-writer Create a PRD for [feature description]
```

### Code Developer
```
@code-developer Implement [task] from PRDs/prd-[name].md
```

### QA Tester
```
@qa-tester Test [feature] against PRDs/prd-[name].md
```

### Product Manager
```
@product-manager Review screenshots in screenshots/[feature-name]/ and provide feedback
```

---

## ⚙️ Workflow Control

### Approve PRD
```
The PRD looks good, approved. Proceed with implementation.
```

### Request Changes
```
The PRD needs changes: [list changes]. Please update it.
```

### Auto-Fix Issues
```
Auto-fix the critical issues. Iterate until Product Manager approves.
```

### Review Feedback
```
Show me the full feedback document
```

### Stop Workflow
```
Stop the current workflow
```

---

## 📁 File Operations

### List Artifacts
```
List files in tasks/
```

```
List files in PRDs/
```

```
List files in screenshots/
```

### View Screenshots
```
Show me screenshots/browser-timeline/01-full-page.png
```

---

## 🔧 Troubleshooting

### Retry Last Task
```
Retry the last agent task with clearer instructions
```

### Check Agent Status
```
What agents are currently working?
```

### Force Plan Mode
```
@orchestrator Plan the workflow for [task] before starting
```

---

## 💡 Example Workflows

### Complete Feature Implementation
```
@orchestrator I want to add a network topology graph showing device connections with interactive nodes
```

Then:
1. Review PRD when shown
2. Say "approved" or request changes
3. Wait for implementation
4. Review final report

### Quick Bug Fix
```
@orchestrator Fix the table row height issue. Rows are 180px but should be 30px.
```

### Refinement Workflow
```
@orchestrator Implement all fixes from feedback/feedback-browsers.md
```

---

**Tip:** Save this file for quick reference while working!



