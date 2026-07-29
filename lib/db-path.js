const { join } = require('path');
const { homedir } = require('os');
const { existsSync } = require('fs');

const DB_FILENAMES = ['opencode.db', 'opencode-stable.db', 'opencode-local.db'];

function getCandidatePaths(overrides = {}) {
  const candidates = [];
  const env = { ...process.env, ...overrides };

  if (env.OPENCODE_DB) {
    return [env.OPENCODE_DB];
  }

  const dataDir = env.OPENCODE_DATA_DIR;
  if (dataDir) {
    for (const f of DB_FILENAMES) candidates.push(join(dataDir, f));
  }

  const xdgData = env.XDG_DATA_HOME;
  if (xdgData) {
    for (const f of DB_FILENAMES) candidates.push(join(xdgData, 'opencode', f));
  }

  const home = homedir();
  for (const f of DB_FILENAMES) candidates.push(join(home, '.local', 'share', 'opencode', f));

  return candidates;
}

function getDbPath(overrides = {}) {
  const env = { ...process.env, ...overrides };
  if (env.OPENCODE_DB) return env.OPENCODE_DB;
  for (const candidate of getCandidatePaths(overrides)) {
    if (existsSync(candidate)) return candidate;
  }
  const all = getCandidatePaths(overrides);
  return all[all.length - 1];
}

module.exports = { getDbPath, getCandidatePaths, DB_FILENAMES };
