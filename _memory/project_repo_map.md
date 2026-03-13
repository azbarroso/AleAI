---
name: Project repository map
description: Maps each AleLabs project to its knowledge base folder and code repo location. Use when working on any project to find the right files.
type: reference
---

## Repository Structure Convention

- **Knowledge base (this repo):** `~/dev/claude_dev/AleAI/` — strategy, decisions, tasks, logs (markdown only)
- **Code repos:** separate git repos at `~/dev/claude_dev/[project-name]/` — app code, deployments

## Project Map

| Project | Knowledge Base | Code Repo | Domain | Stack |
|---------|---------------|-----------|--------|-------|
| AgentsBoard | `AleAI/projects/agentsboard-ai/` | `~/dev/claude_dev/agentsboard-ai/` | agentsboard.ai | Next.js, Prisma, Neon, Vercel |
| QuoteNorm | `AleAI/projects/quotenorm-ai/` | `~/dev/claude_dev/quotenorm-ai/` | quotenorm.ai | Next.js, Claude API, x402, Neon, Vercel |
| PolicyNorm | `AleAI/projects/policynorm-ai/` | `~/dev/claude_dev/policynorm-ai/` | policynorm.ai | Next.js, Claude API, x402, Neon, Vercel |

## Convention

- Code repo `CLAUDE.md` points back to the knowledge base for strategy/decisions context
- Knowledge base is source of truth for decisions, strategy, task briefs
- Code repo `CLAUDE.md` is source of truth for build/test/run/deploy instructions
- Phase 0 scratch work (test scripts, schema drafts) lives in `projects/[name]/scratch/` in the knowledge base until Phase 1 scaffolds the real code repo
- All projects under AleLabs LLC (`alelabs.io`)
