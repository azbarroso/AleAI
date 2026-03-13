# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a markdown-based project knowledge base for use with Claude Code. It holds context, briefs, and logs for multiple concurrent projects so that Claude sessions can pick up where the last one left off.

## Directory Structure

```
_memory/                # Claude Code memory — preferences, project map, feedback (synced via git)
├── MEMORY.md           # Index of memory files
├── *.md                # Individual memory files
projects/
├── _active.md          # Status page — one-liner per project
├── _inbox.md           # Unsorted capture for new ideas/notes
├── journal.md          # Daily notes, observations, cross-project history
├── _templates/         # Templates for creating new projects
│   ├── overview.md
│   ├── tasks.md
│   └── log.md
├── _archive/           # Completed/parked projects (moved here, one-liner kept in _active.md)
│   └── [project-name]/ # Full project folder preserved for reference
└── [project-name]/     # One folder per project
    ├── overview.md     # Goal, context, decisions, links
    ├── tasks.md        # Session brief — questions, directives, open items
    └── log.md          # Progress notes and session summaries
```

## Memory

Claude Code memory lives in `_memory/` at the repo root (committed and synced via git). This replaces the default `~/.claude/` memory path so that memory is portable across machines.

- `_memory/MEMORY.md` is the index — read it at the start of a session to see what's available
- Memory files store user preferences, project-to-repo mappings, and feedback
- When saving new memories, write them to `_memory/` and update `_memory/MEMORY.md`
- See `_memory/MEMORY.md` for the full list of memory files

## Key Files

**projects/_active.md**: Lightweight status page
- One line per project summarizing current state
- Sections: "Active", "Parked", and "Completed"
- Completed projects keep a one-liner for reference; full folder moved to `_archive/`
- Last updated date tracked at top

**projects/_inbox.md**: Quick capture location
- Unsorted ideas, notes, questions before assignment to projects
- Optional source tags: [onenote], [meeting], [idea], [bug], [research], [followup]

**projects/journal.md**: Daily log
- Dated entries for observations, notes, and miscellaneous items worth keeping
- Cross-project or general — not tied to a specific project
- Permanent record (unlike inbox, which gets processed and cleared)
- **Descending order** — most recent entry at the top

**projects/[name]/overview.md**: Project definition
- Goal: Success criteria
- Context: Background, constraints, links, OneNote references
- Decisions: Table tracking date, decision, and rationale

**projects/[name]/tasks.md**: Session brief
- **Questions**: Things to research or answer, with enough context for Claude to work on them
- **Directives**: Specific actions for Claude to take
- **Open Items**: Decisions pending, things to investigate, loose ends

**projects/[name]/log.md**: Progress journal
- Date-stamped entries
- Records what was done, what changed, what's next
- Session summaries and context for future reference

## Working with Projects

### Creating a New Project

1. Copy template files from `projects/_templates/` to `projects/[project-name]/`
2. Fill in overview.md with goal and context
3. Add initial items to tasks.md brief
4. Add entry in log.md documenting project creation

### Working on a Project

1. Read overview.md for context on what the project is about
2. Check tasks.md for the current brief — questions to answer, directives to execute, open items to consider
3. Do the work
4. Log what was done in log.md with today's date
5. Update tasks.md — remove completed items, add new ones that came up
6. Update _active.md status line if the project state changed

## Code Repos vs Knowledge Base

This repo is **strategy and context only** — no application code lives here. Each project that has a codebase gets its own separate git repo:

```
~/dev/claude_dev/
├── AleAI/                    # This repo — knowledge base (markdown only)
│   └── projects/
│       ├── agentsboard-ai/   # Strategy, tasks, logs
│       ├── quotenorm-ai/
│       └── policynorm-ai/
├── agentsboard-ai/           # Code repo — Next.js app
├── quotenorm-ai/             # Code repo — Next.js app
└── policynorm-ai/            # Code repo — Next.js app
```

### Separation of concerns
- **Knowledge base (this repo):** decisions, strategy, task briefs, session logs
- **Code repos:** application code, build/test/deploy instructions, code-level `CLAUDE.md`
- Each code repo's `CLAUDE.md` should point back here for strategy context
- Phase 0 scratch work (test scripts, schema drafts) can live in `projects/[name]/scratch/` until the real code repo is scaffolded in Phase 1

## Git Usage

This repository uses git for version control. Changes are committed as work progresses to track evolution of projects. The main branch is `main`.

## Working with Claude

When asked to work on this repository:
- Read relevant project files before making changes
- Preserve the markdown structure and formatting conventions
- Add log entries with current date when making significant changes
- Update _active.md if project status changes (update the "Last updated" date on any change)
- Keep tasks.md briefs clean — strike through completed items with `~~text~~` and add a note (e.g., "— Done, 2026-03-05"), don't delete them

### Note-Taking Mode

Ale frequently dictates quick notes during meetings and conversations. When capturing notes:
- Write to the correct files without being told which ones — typically journal.md + the relevant project's log.md + tasks.md if action items emerge
- Keep notes concise but preserve the important details
- If a note spans multiple projects, update each project's log
- Journal entries should always be created for the current day if one doesn't exist yet

### Meeting Notes Processing

When Ale pastes raw meeting notes:
- Summarize and organize — don't just copy/paste raw content
- Extract decisions and add them to the project's decisions table (date, decision, rationale)
- Extract action items and add them to tasks.md open items
- Add a session summary to log.md
- Update overview.md if the meeting produced significant new context (scope, architecture, requirements)

### Confluence Integration

Ale pulls project context from Confluence pages using MCP tools. When integrating Confluence content:
- Summarize and structure the content to fit the project's overview.md format
- Don't dump raw Confluence markup — clean it up
- Note the Confluence reference (space/page ID) for future access

### Project Creation from Conversation

New projects often emerge mid-conversation from a discussion topic. When this happens:
- Create the project folder with all three files (overview.md, tasks.md, log.md)
- Populate from whatever context is available (conversation, Confluence, meeting notes)
- Add the project to _active.md
- Log the creation in the project's log.md

### Archiving Projects

When archiving a completed or paused project:
- Move the project folder to `projects/_archive/`
- Remove the project from the Active section in _active.md
- Add a one-liner to the correct section: **Parked** (may resume later) or **Completed** (done), with date and summary
- Don't delete any content — the full project is preserved in _archive/

### Git Workflow

- Ale typically requests "commit and push" as a single action — always do both together when asked
- Write clear, concise commit messages summarizing what changed and why
- Commit related changes together (e.g., project files + _active.md + journal.md)
- Don't commit unless asked
