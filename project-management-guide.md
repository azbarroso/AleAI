# Project & Task Management with Claude

A Quick Reference Guide — February 2026

---

## Table of Contents

1. The Core Idea
2. Layer 1: Capture (Inbox)
3. Inbox Format & Examples
4. Layer 2: Projects
5. The Session Brief (tasks.md)
6. Brief Format & Examples
7. Layer 3: Journal
8. Journal Format & Examples
9. Layer 4: Status Page
10. Status Page Format & Real Example
11. Folder Structure
12. The Workflow in Practice
13. How Claude Helps at Each Stage
14. What Makes This Work vs. Not Work

---

## 1. The Core Idea

One place for all project information, structured so that both you and Claude can work with it efficiently. The system has four layers: **Capture**, **Projects**, **Journal**, and **Status Page**.

The guiding principle: this is a **working knowledge base for Claude sessions**, not a backlog to maintain. Every file should either give Claude context or tell Claude what to do. If a file requires manual upkeep but doesn't serve either purpose, it doesn't belong.

---

## 2. Layer 1: Capture

**_inbox.md** — Your dumping ground

The rule is simple: if something crosses your mind, drop it here. Don't classify, don't prioritize, just capture. This includes:

- Ideas from meetings
- Things you remember from OneNote
- Random thoughts
- Vague "I should probably..." items

The inbox only works if you trust it and keep the friction near zero. It's not where things live permanently — it's where they land before being processed.

---

## 3. Inbox Format & Examples

### Format

Keep each item to one line. Optionally add a source tag for traceability:

```
- [source] item description
```

### Source Tags

| Tag | Meaning |
|-----|---------|
| `[onenote]` | Extracted from OneNote |
| `[meeting]` | Came up in a meeting |
| `[idea]` | Random thought |
| `[bug]` | Something broken |
| `[research]` | Something to look into |
| `[followup]` | Someone asked or you promised |

### Examples

```markdown
- [meeting] John mentioned the reporting API is changing
  in March - check impact on our dashboard
- [onenote] Had notes on auth flow redesign from last
  month - pull into a project
- [idea] Automate the weekly data export instead of
  doing it manually
- [bug] Login page flickers on Safari when switching tabs
- [followup] Send Maria the API docs she asked about
- [research] DynamoDB vs Postgres for event logging?
```

### What makes a good inbox item

- **One thought per line** — if it's two things, write two lines
- **Enough context to understand later** — "fix the thing" won't mean anything in a week
- **No priority, no assignment** — that happens during processing
- **Imperfect is fine** — a vague item captured beats a precise item forgotten

### Processing inbox items

- Move it to a project's tasks.md brief as a question, directive, or open item
- Create a new project if it's big enough to warrant one
- Delete it if it's no longer relevant
- Leave it if undecided (but flag items sitting too long)

---

## 4. Layer 2: Projects

Each project is a folder with three files that serve distinct purposes:

### overview.md — The context file

When you start a Claude session about a project, this is the first thing Claude should read. It answers: *What is this project? Why does it exist? What constraints matter? What has been decided already?*

The decisions table is particularly valuable. Without it, you'll reliably revisit the same questions. If you already decided and recorded why, you won't waste cycles re-debating it.

### tasks.md — The session brief

This is **not a task list**. It's a brief for Claude — a place to put questions you want answered, actions you want Claude to take, and loose ends to track. When you start a Claude session, this file tells Claude what to work on. When a session ends, update it to reflect what's left.

### log.md — The memory file

Captures what actually happened, not what was planned. Useful for: resuming after a break (*"where was I?"*), reviewing with Claude (*"here's what I've done, what should shift?"*), and noticing patterns (*"I keep getting stuck at the same phase"*).

---

## 5. The Session Brief (tasks.md)

The brief has three sections:

| Section | Purpose |
|---------|---------|
| **Questions** | Things to research or answer. Include enough context so Claude can work on them independently. |
| **Directives** | Specific actions for Claude to take. Be clear about what you want done. |
| **Open Items** | Decisions pending, things to investigate, loose ends to track. |

### Template

```markdown
# Brief

## Questions
_Things to research or answer. Add context so Claude can work on these._

## Directives
_Actions for Claude to take. Be specific about what you want done._

## Open Items
_Decisions pending, things to investigate, loose ends._
```

---

## 6. Brief Format & Examples

### Questions — things to research

```markdown
## Questions
- What's the gas cost difference between using a mapping
  vs an array for the whitelist in SwapPool.sol?
  Context: current whitelist is a mapping but we may need
  enumeration for the admin portal.
- How does Consensys handle KYC for institutional MetaMask
  wallets? We need to know before designing the onboarding
  flow. Check their developer docs first.
```

Good questions include context so Claude can work on them without further clarification.

### Directives — things for Claude to do

```markdown
## Directives
- Read the Trail of Bits audit report (see overview.md
  for link) and draft responses for each finding.
  Save output to audit-responses.md in this project folder.
- Generate a developer contribution report from all TF
  Bitbucket repos. Use the Bitbucket MCP to pull commits.
  Save as tf-developer-report.md.
```

Good directives are specific about the action and the expected output.

### Open Items — things to track

```markdown
## Open Items
- Bitbucket MCP has no "list repositories" endpoint —
  some repos may be missing from reports
- Ale to re-engage with Trail of Bits for another audit
- Waiting on Consensys to respond to integration questions
  sent 2026-02-15
```

Open items are things that don't have an action right now but shouldn't be forgotten.

### Real example (from benjiswap project)

```markdown
# Brief

## Questions
_Things to research or answer. Add context so Claude
can work on these._

## Directives
_Actions for Claude to take. Be specific about what
you want done._

## Open Items
_Decisions pending, things to investigate, loose ends._
- Ale to re-engage with Trail of Bits to do another
  audit review
```

### What changed from the old task system

The previous version of this system used structured tasks with priorities (P1/P2/P3), sequential IDs (#1, #2...), and dependency chains (blocks/blocked-by). That approach created overhead — tasks accumulated faster than they were completed, and maintaining IDs and dependencies became a chore that discouraged use.

The brief format works because:
- **No IDs to manage** — items are just bullet points
- **No priorities to assign** — if it's in the brief, it matters; if it doesn't, remove it
- **No dependencies to track** — Claude figures out execution order from context
- **Easy to update** — remove what's done, add what's new, move on

---

## 7. Layer 3: Journal

**journal.md** — Your daily log

The journal fills the gap between the inbox and project logs. The inbox is temporary — items get processed and removed. Project logs are project-specific. The journal is for everything else that's worth remembering: daily observations, meeting takeaways, cross-project notes, things you noticed that don't have an action yet.

| | Inbox | Journal | Project Log |
|---|---|---|---|
| Purpose | "Do something about this" | "This happened" | "This is what I did" |
| Lifespan | Temporary — process and remove | Permanent — history | Permanent — history |
| Scope | Unassigned | Cross-project or general | Single project |
| Action needed? | Yes | Not necessarily | No (it's a record) |

---

## 8. Journal Format & Examples

### Format

A single file with dated entries. Newest at the top.

```markdown
# Journal

Daily notes, observations, and miscellaneous items
worth keeping for context and history.

### 2026-02-23

- Noticed staging environment has different Okta config
  than prod — could explain the auth failures last week
- Met with compliance team, they're reconsidering the
  USDC custody position. May affect benjiswap Day 2.

### 2026-02-22

- First dev contribution report took ~45 min to generate.
  Could be automated with a script if we do this monthly.
- Greg Bigwood seems to be the only one working on
  security-related changes across repos.
```

### What makes a good journal entry

- **One observation per bullet** — keep it scannable
- **Include enough context** — "auth is broken" is less useful than "staging has different Okta config than prod"
- **Date it** — entries live under the day's heading
- **No action required** — if it needs action, put it in the inbox or a project brief instead

### When to use the journal vs. other files

- *"I need to do something about this"* → **Inbox**
- *"This happened today, worth remembering"* → **Journal**
- *"Here's what I did on this project"* → **Project log**
- *"Claude should work on this next session"* → **Project brief**

---

## 9. Layer 4: Status Page

**_active.md** — Cross-project status at a glance

This sits above individual projects and answers: *What am I working on and where does each project stand?* It's a simple list — one line per project with a short status summary.

The status page is updated when a project's state changes meaningfully. It doesn't track individual items or counts — just the overall picture.

---

## 10. Status Page Format & Real Example

### Format

```markdown
# Projects

Last updated: YYYY-MM-DD

## Active

**project-name** — one-line status summary

## Parked
_Projects not being actively worked on._
```

### Real example from the AleAI workspace

```markdown
# Projects

Last updated: 2026-02-22

## Active

**benjiswap** — MVP launched, Day 2 roadmap pending
  prioritization
**benji-metamask** — Discovery phase, waiting on
  Consensys responses
**pwc-audit-review-2026** — Draft responses complete,
  14 items pending team confirmation
**productivity-reports** — First TF developer contribution
  report generated (22 repos, 19 devs)

## Parked
_Projects not being actively worked on._
```

### What changed from the old dashboard

The previous version had sections for "In Progress", "Up Next", "Blocked" with per-task listings and a summary table with counts (Total, Done, Unblocked, Blocked). That level of detail duplicated what was already in each project's tasks.md and required frequent regeneration.

The new status page is:
- **One line per project** — just the headline status
- **No task counts** — the brief has the details
- **Two sections** — Active and Parked
- **Updated when state changes** — not on a schedule

---

## 11. Folder Structure

```
projects/
  _inbox.md               # Quick capture
  _active.md              # Cross-project status page
  journal.md              # Daily notes and observations
  _templates/
    overview.md           # Copy when starting a new project
    tasks.md              # Brief template
    log.md                # Log template
  benjiswap/              # Real project
    overview.md           # Goals, context, decisions, links
    tasks.md              # Session brief
    log.md                # Progress entries
  productivity-reports/   # Another project
    overview.md
    tasks.md
    log.md
    tf-developer-report.md  # Project deliverable
  another-project/
    ...
```

To start a new project, copy the `_templates/` files into a new folder, or ask Claude to create one for you. The folder name should be short and descriptive (lowercase, hyphens for spaces).

Projects can also contain deliverables and artifacts (reports, response documents, etc.) alongside the three standard files.

---

## 12. The Workflow in Practice

### Starting a session

Tell Claude what you want to work on. Claude will read the project's overview.md for context and tasks.md for the current brief. Example:

> "Let's work on benji-metamask. Check the brief and see what needs doing."

Or point Claude at a specific item:

> "Read the benjiswap overview and answer the first question in the brief."

### During a session

Work naturally. Claude reads the context, executes directives, researches questions, and produces output. If new questions or open items come up during the session, they get noted.

### Ending a session

Claude updates the project files:
- **tasks.md**: Remove completed items, add new ones that emerged
- **log.md**: Add a dated entry summarizing what was done
- **_active.md**: Update the status line if the project state changed

### Processing the inbox

Periodically (or when it gets long), go through `_inbox.md` with Claude:

> "Read the inbox. Help me sort these into existing projects or identify new ones."

### OneNote Integration

Don't try to sync or automate. The practical approach:

- When you spot something actionable in OneNote, drop a one-liner into `_inbox.md`
- In overview.md, link to relevant OneNote sections by name (e.g., "See OneNote > Work > Project Alpha > Meeting Notes")

### Git & Backup

The workspace is git-tracked locally and pushed to a bare repo on OneDrive for backup. After making changes, commit and push:

```bash
git add <files>
git commit -m "description of changes"
git push backup
```

---

## 13. How Claude Helps at Each Stage

| Stage | What to Ask Claude | Example |
|-------|-------------------|---------|
| Capture | Turn brain dumps into structured items | *"Here's a dump, sort it into my projects"* |
| Research | Answer questions from the brief | *"Answer the questions in the benji-metamask brief"* |
| Execute | Carry out directives | *"Run the directive about generating the dev report"* |
| Review | Check project health | *"Read all projects, what's stale?"* |
| Decide | Think through tradeoffs | *"I'm torn between X and Y, help me decide"* |
| Update | Refresh status page | *"Update _active.md with current project states"* |

### Example prompts for Claude sessions

**Starting a work session:**
```
Read projects/_active.md and projects/benji-metamask/
tasks.md. What should I focus on?
```

**Processing the inbox:**
```
Read projects/_inbox.md. Help me sort these into
existing projects or identify new ones.
```

**Checking on all projects:**
```
Read all project files. What's stale? What needs
attention? Update _active.md.
```

**Working on a directive:**
```
Read the benjiswap overview and brief. Execute the
first directive.
```

---

## 14. What Makes This Work vs. Not Work

### Works when:

- **You capture consistently** — inbox is always available
- **You keep briefs current** — remove what's done, add what's new
- **You keep it minimal** — resist adding more structure or fields
- **You let Claude do the work** — writing, researching, updating files

### Breaks when:

- You try to make it perfect before using it
- Briefs accumulate stale items that never get addressed
- You add so much structure that updating becomes a chore
- You treat it as a task tracker instead of a working knowledge base

The templates are starting points. If after a few weeks you find you never use the decisions table, drop it. If you find you want a "waiting on" section in the brief, add it. Let the system evolve from your actual needs.
