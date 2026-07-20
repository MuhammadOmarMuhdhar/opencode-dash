# opencode-telematics

Evidence.dev dashboard that visualizes your [opencode](https://github.com/anomalyco/opencode) CLI usage from your local SQLite database.

## Quick Start

```bash
npm install
npx opencode-telematics
```

Opens a local dashboard at `http://localhost:3000` showing your sessions, tokens, costs, models, and projects — all from data stored on your device.

The CLI auto-detects your OS (macOS, Linux, Windows) and finds your opencode database automatically.

## How It Works

- **No backend, no account, no telemetry.** Everything runs locally.
- Reads opencode's SQLite database (`~/.local/share/opencode/opencode.db` on macOS/Linux, `%LOCALAPPDATA%/opencode/opencode.db` on Windows)
- Built on [Evidence.dev](https://evidence.dev) — SQL-driven, Svelte-based reporting

## Testing

```bash
npm run build           # CI — verifies the dashboard builds without errors
npm run test:e2e        # E2E — full npx simulation before publishing (run from app/)
```
