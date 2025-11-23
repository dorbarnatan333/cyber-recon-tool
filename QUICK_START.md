# Quick Start Guide - Using Agents in Claude Code

This guide shows you how to start working with the agent system in your Claude Code terminal.

---

## 🚀 Step 1: Navigate to Your Project

Open your terminal and navigate to the project:

```bash
cd C:\Users\A\.claude\cyber-recon-tool
```

---

## 🎯 Step 2: Start Claude Code

### Option A: Using Claude Code CLI (Recommended)

If you have Claude Code installed globally:

```bash
claude-code
```

### Option B: Using Claude Desktop

1. Open Claude Desktop
2. Navigate to your project folder
3. Open terminal in Claude Desktop

### Option C: Direct Command

```bash
# Windows PowerShell
claude-code --project C:\Users\A\.claude\cyber-recon-tool

# Or if in project directory
claude-code .
```

---

## 🤖 Step 3: Invoke the Orchestrator Agent

The **Orchestrator** is your main interface. Start by talking to it:

### Basic Invocation

```
@orchestrator I want to add a browser timeline visualization feature
```

### Or Use the Agent Name Directly

```
Use the orchestrator agent to help me add a browser timeline visualization
```

### Explicit Agent Selection

```
I need help with a new feature. Please use the orchestrator agent from .claude/agents/orchestrator.md
```

---

## 📋 Step 4: Your First Workflow

### Example: Adding a New Feature

**1. Start the conversation:**

```
@orchestrator I want to add a feature that shows browser activity timeline with hourly page visit counts
```

**2. Orchestrator will:**
- Acknowledge your request
- Create a plan
- Delegate to PRD Writer
- Show you the PRD for approval

**3. Approve the PRD:**

```
The PRD looks good, approved
```

**4. Orchestrator will:**
- Delegate to Code Developer
- Implement the feature
- Take screenshots
- Run tests
- Get PM feedback
- Report back when done

**5. Review the result:**

Orchestrator will show you:
- Files modified
- Screenshots
- Feedback (if any)
- Final status

---

## 🔧 Step 5: Understanding Agent Invocation

### How Claude Code Finds Agents

Claude Code automatically discovers agents in:
- `.claude/agents/*.md` (project-level)
- `~/.claude/agents/*.md` (user-level)

Your agents are in: `.claude/agents/`

### Agent Names

You can reference agents by:
- **Name:** `@orchestrator`, `@prd-writer`, `@code-developer`
- **Description:** "Use the workflow coordinator agent"
- **File path:** "Use agent from .claude/agents/orchestrator.md"

### Direct Agent Invocation

If you want to talk directly to a specific agent:

```
@prd-writer Create a PRD for a file hash search feature
```

```
@code-developer Fix the table sizing issue mentioned in feedback/feedback-browsers.md
```

```
@product-manager Review the screenshots in screenshots/browser-timeline/ and provide feedback
```

---

## 📁 Step 6: Understanding Artifacts

The agents communicate through files. Here's what gets created:

### During Workflow

```
cyber-recon-tool/
├── tasks/                          # Task specifications
│   └── task-20241120-143000.md
├── workflow-state.json            # Current workflow state
├── workflow-plan.md               # Generated plan
├── PRDs/                          # Product Requirements
│   └── prd-browser-timeline.md
├── implementation-reports/        # Developer reports
│   └── impl-browser-timeline.md
├── test-reports/                  # QA reports
│   └── test-browser-timeline.md
├── feedback/                      # PM feedback
│   └── feedback-browser-timeline.md
└── screenshots/                   # Screenshots
    └── browser-timeline/
        ├── 01-full-page.png
        └── 02-interaction.png
```

### Viewing Artifacts

You can read any artifact:

```
Read PRDs/prd-browser-timeline.md
```

```
Show me the workflow state
```

```
What's in the implementation report?
```

---

## 🎛️ Step 7: Common Commands

### Check Workflow Status

```
What's the current workflow status?
```

```
Read workflow-state.json
```

### Review Artifacts

```
Show me the PRD for the browser timeline feature
```

```
What feedback did the product manager provide?
```

### Manual Intervention

```
Stop the current workflow
```

```
Skip to the next step
```

```
Retry the last agent task
```

### Direct Agent Tasks

```
@code-developer Take screenshots of the current implementation
```

```
@qa-tester Test the browser timeline feature against the PRD
```

---

## 🔍 Step 8: Monitoring Workflow

### Check What's Happening

```
What agents are currently working?
```

```
Show me the workflow plan
```

### View Logs

```
Read workflow-errors.log
```

### Check Artifacts

```
List all artifacts created in this workflow
```

---

## ⚡ Quick Examples

### Example 1: New Feature

```
@orchestrator I want to add a network topology visualization showing device connections
```

**What happens:**
1. Orchestrator creates plan
2. PRD Writer creates PRD
3. You approve PRD
4. Code Developer implements
5. QA Tester validates
6. Product Manager reviews
7. You get final report

### Example 2: Bug Fix

```
@orchestrator Fix the table sizing issue in the browser analysis page. The cards are too large.
```

**What happens:**
1. Orchestrator reads feedback
2. Code Developer fixes issue
3. QA Tester verifies fix
4. You get confirmation

### Example 3: Refinement

```
@orchestrator Implement the feedback from feedback/feedback-browsers.md
```

**What happens:**
1. Orchestrator reads feedback
2. Code Developer implements fixes
3. Product Manager re-reviews
4. Iterates until approved
5. You get final report

---

## 🛠️ Step 9: Troubleshooting

### Agents Not Found

**Problem:** Claude Code can't find agents

**Solution:**
1. Verify agents are in `.claude/agents/`
2. Check file names match (orchestrator.md, not orchestrator-agent.md)
3. Verify YAML frontmatter is correct

### Workflow Stuck

**Problem:** Workflow seems to have stopped

**Solution:**
```
Read workflow-state.json
```

Check the `status` field. If it's "waiting_for_user", you need to approve something.

### Artifacts Not Created

**Problem:** Expected files aren't there

**Solution:**
```
List files in tasks/
```

```
List files in PRDs/
```

If missing, ask orchestrator:
```
Why wasn't the PRD created?
```

### Agent Errors

**Problem:** Agent reports errors

**Solution:**
```
Read workflow-errors.log
```

Check the error, then:
```
Retry the last task with clearer instructions
```

---

## 📚 Step 10: Advanced Usage

### Using Plan Mode

Force orchestrator to plan first:

```
@orchestrator Plan the complete workflow for adding a user activity dashboard. 
Save the plan to workflow-plan.md before starting.
```

### Parallel Agent Execution

For complex features, you might want multiple agents:

```
@orchestrator I need both a PRD for the feature AND a review of the current implementation. 
Run prd-writer and product-manager in parallel.
```

### Custom Agent Prompts

You can override agent behavior:

```
@code-developer Implement the table component, but use a different color scheme: 
primary blue #0066CC instead of the default.
```

### Artifact Inspection

Review any artifact:

```
Read implementation-reports/impl-browser-timeline.md
```

```
Show me the test results
```

---

## ✅ Verification Checklist

Before starting, verify:

- [ ] Agents are in `.claude/agents/` directory
- [ ] Agent files have YAML frontmatter
- [ ] You're in the project root directory
- [ ] Claude Code is running
- [ ] You can see the orchestrator agent

**Test it:**

```
@orchestrator Hello, can you help me?
```

You should get a response acknowledging you're the orchestrator.

---

## 🎯 Next Steps

1. **Try a simple request:**
   ```
   @orchestrator I want to add a "Last Updated" timestamp to the device cards
   ```

2. **Watch the workflow:**
   - See how artifacts are created
   - Check `workflow-state.json` updates
   - Review generated files

3. **Experiment:**
   - Try different feature requests
   - Test bug fixes
   - Request refinements

4. **Review artifacts:**
   - Read PRDs to see quality
   - Check implementation reports
   - Review feedback documents

---

## 💡 Pro Tips

1. **Be Specific:** The more detail you provide, the better the PRD
   - ❌ "Add a graph"
   - ✅ "Add a bar chart showing hourly page visits for the last 7 days"

2. **Reference Existing Features:** Help agents understand patterns
   - "Similar to the browser history table, but for downloads"

3. **Review Artifacts:** Check PRDs and feedback before approving
   - "Read PRDs/prd-feature-name.md and make sure it includes error handling"

4. **Use Checkpoints:** Don't skip approvals
   - Always review PRDs before implementation
   - Review critical issues before auto-fixing

5. **Monitor State:** Check workflow-state.json regularly
   - "What's the current step?"
   - "What artifacts have been created?"

---

## 🆘 Getting Help

If something doesn't work:

1. **Check workflow state:**
   ```
   Read workflow-state.json
   ```

2. **Read error logs:**
   ```
   Read workflow-errors.log
   ```

3. **Ask orchestrator:**
   ```
   @orchestrator What went wrong? Why did the workflow fail?
   ```

4. **Review agent definitions:**
   ```
   Read .claude/agents/orchestrator.md
   ```

---

**You're ready to start!** Try your first feature request and watch the agents work. 🚀



