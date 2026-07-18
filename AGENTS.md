# opencode-telematics

Evidence.dev dashboard that visualizes your opencode CLI usage from the local SQLite database.

## Tech Stack

- **Framework:** Evidence.dev (Svelte-based, Markdown-driven reporting)
- **Data source:** SQLite (`@evidence-dev/sqlite` plugin) — reads `~/.local/share/opencode/opencode.db`
- **Connection config:** `app/sources/opencode/connection.yaml`
- **Hosting:** Static site via `evidence build`, served any way

## Commands

Run from project root:
- `npm run dev` — start dev server (opens at `/`)
- `npm run build` — build static site
- `npm run build:strict` — strict build
- `npm run sources` — refresh data sources
- `npm run preview` — preview built site
- `npm run sources:strict` — refresh with strict mode

## Architecture

- **Queries:** 34 `.sql` files in `app/sources/opencode/`. Each is a named query referenced in pages as `opencode.queryName`.
- **Pages:** 9 `.md` files in `app/pages/`. Markdown with Evidence components: `<Value>`, `<BigValue>`, `<BarChart>`, `<ECharts>`, `<CalendarHeatmap>`, `<DataTable>`, `<Grid>`, `<LinkButton>`, `<AreaChart>`.
- **No backend, no account, no telemetry.** Data stays on-device.

## Core Tables (from opencode SQLite)

### `session`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK, e.g. `ses_xxx` |
| project_id | text | FK → project(id) |
| parent_id | text | NULL = main session, set = subagent |
| agent | text | e.g. `code`, `explore`, `plan` |
| model | text | JSON: `{id, providerID, ...}` |
| cost | real | Total session cost |
| tokens_input | integer | |
| tokens_output | integer | |
| tokens_reasoning | integer | Reasoning/thinking tokens |
| tokens_cache_read | integer | Context cache hits |
| tokens_cache_write | integer | Context cache writes |
| time_created | integer | Unix epoch ms |
| time_updated | integer | |
| title | text | Session title |

### `message`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK |
| session_id | text | FK |
| data | text | JSON with `role`, `mode`, `finish`, `tokens.reasoning` |
| time_created | integer | |

### `part`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK |
| message_id | text | FK |
| session_id | text | FK |
| data | text | JSON with `type` (text/tool/tool_call/reasoning) and `text` |
| time_created | integer | |

### `project`
| Column | Type | Notes |
|--------|------|-------|
| id | text | PK |
| worktree | text | File path |
| vcs | text | e.g. `git` |
| name | text | Often NULL — derive from worktree basename |

### Other: `todo`, `event`, `event_sequence`

## Pages & Purpose

| Page | File | Focus |
|------|------|-------|
| Index | `index.md` | Overview — sessions, activity heatmap, model pie, costing, projects |
| Cost | `cost.md` | Token economics — input/output/reasoning breakdown, daily cost, by model/project/provider |
| Activity | `activity.md` | Usage over time — sessions, duration, active projects, longest sessions |
| Agents | `agents.md` | Agent distribution — code/explore/plan sessions, mode distribution, switches |
| Messages | `messages.md` | Message/part analysis — roles, part types, tool calls, reasoning, patches |
| Models | `models.md` | Model usage — distribution, switching frequency, daily usage |
| Projects | `projects.md` | Top projects by sessions/cost, project list |
| Events | `events.md` | Event type distribution, model/agent switch events |
| Quality | `quality.md` | Finish reasons, todo stats/completion, compaction frequency |

## Design Conventions

- **index.md is the polished target** — use it as style reference for any new pages
- Charts: `<BarChart>` for comparisons, `<ECharts>` for custom viz (pie/donut), `<CalendarHeatmap>` for activity density
- Layout: `<Grid cols=3>` for metric cards, `---` for section breaks
- BigValues: use `fmt=usd` for money, `fmt=num0` for counts, `fmt=usd2` for precision
- Minimal — no inline comments in production pages

## Key Reference

Load the `opencode-memory` skill (from `~/.agents/skills/opencode-memory/`) for DB schema, example queries, and storage locations — it has the full SQLite schema this project depends on.
