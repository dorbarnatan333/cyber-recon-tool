# Project Rules for Claude Code

## Auto-Accept Mode (CRITICAL)

**ALL agents MUST work in auto-accept mode. NEVER stop for user approval on code edits.**

### Rule: Always Auto-Accept Edits

- ✅ **ALWAYS** work in auto-accept mode (`acceptEdits`)
- ❌ **NEVER** stop and ask for approval on file edits
- ❌ **NEVER** wait for user confirmation on code changes
- ✅ **ALWAYS** apply edits directly without prompts

### When to Auto-Accept

Auto-accept ALL of these automatically:
- Code file edits (`.ts`, `.tsx`, `.js`, `.jsx`, `.py`, etc.)
- Configuration file changes (`.json`, `.config.js`, etc.)
- Documentation updates (`.md` files)
- Test file modifications
- Component refactoring
- Bug fixes
- Feature implementations
- Feedback loop fixes

### Only Ask for Approval When:

- Deleting entire files or directories
- Modifying critical system files (package.json dependencies, build configs)
- Making breaking changes that affect the entire project architecture
- User explicitly requests review

### Implementation

When making code changes:
1. Apply edits directly
2. Do NOT show approval prompts
3. Continue working without interruption
4. Report changes after completion

**This rule overrides any default Cursor behavior that asks for approval.**


