const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { existsSync, mkdtempSync, writeFileSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { getDbPath, getCandidatePaths } = require('../lib/db-path');

const DB_FILENAMES = ['opencode.db', 'opencode-stable.db', 'opencode-local.db'];

describe('getCandidatePaths', () => {

  it('returns only OPENCODE_DB when set', () => {
    const result = getCandidatePaths({ OPENCODE_DB: '/custom/opencode.db' });
    assert.deepStrictEqual(result, ['/custom/opencode.db']);
  });

  it('includes OPENCODE_DATA_DIR paths', () => {
    const result = getCandidatePaths({ OPENCODE_DATA_DIR: '/custom/data' });
    for (const f of DB_FILENAMES) {
      assert.ok(result.includes(path.join('/custom/data', f)));
    }
  });

  it('includes XDG_DATA_HOME paths', () => {
    const result = getCandidatePaths({ XDG_DATA_HOME: '/xdg' });
    for (const f of DB_FILENAMES) {
      assert.ok(result.includes(path.join('/xdg', 'opencode', f)));
    }
  });

  it('includes ~/.local/share fallback paths', () => {
    const result = getCandidatePaths({});
    for (const f of DB_FILENAMES) {
      assert.ok(result.some(p => p.endsWith(path.join('.local', 'share', 'opencode', f))));
    }
  });

  it('does not mix XDG paths when XDG_DATA_HOME is unset', () => {
    const result = getCandidatePaths({});
    for (const p of result) {
      assert.ok(!p.includes('/xdg'), `unexpected XDG path: ${p}`);
    }
  });

  it('OPENCODE_DATA_DIR paths come before XDG paths', () => {
    const result = getCandidatePaths({
      OPENCODE_DATA_DIR: '/data',
      XDG_DATA_HOME: '/xdg',
    });
    const dataIdx = result.findIndex(p => p.startsWith('/data/'));
    const xdgIdx = result.findIndex(p => p.startsWith('/xdg/'));
    assert.ok(dataIdx < xdgIdx, 'data dir should come before xdg dir');
  });

  it('XDG paths come before ~/.local/share fallback', () => {
    const result = getCandidatePaths({ XDG_DATA_HOME: '/xdg' });
    const xdgIdx = result.findIndex(p => p.startsWith('/xdg/'));
    const fallbackIdx = result.findIndex(p => p.includes('.local/share'));
    assert.ok(xdgIdx < fallbackIdx, 'xdg paths should come before fallback');
  });

});

describe('getDbPath', () => {

  it('returns OPENCODE_DB directly when set', () => {
    const result = getDbPath({ OPENCODE_DB: '/explicit/path.db' });
    assert.strictEqual(result, '/explicit/path.db');
  });

  it('returns last candidate when none exist', () => {
    const result = getDbPath({ XDG_DATA_HOME: '/nonexistent/xdg' });
    assert.ok(result.endsWith('opencode.db'), `unexpected: ${result}`);
  });

});

describe('getDbPath with real filesystem', () => {

  let tmpDir;

  before(() => {
    tmpDir = mkdtempSync(path.join(tmpdir(), 'opencode-dash-test-'));
  });

  after(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('finds existing db via OPENCODE_DB', () => {
    const dbPath = path.join(tmpDir, 'custom.db');
    writeFileSync(dbPath, '');
    const result = getDbPath({ OPENCODE_DB: dbPath });
    assert.strictEqual(result, dbPath);
  });

  it('finds existing db via OPENCODE_DATA_DIR', () => {
    const dir = path.join(tmpDir, 'data-test');
    require('fs').mkdirSync(dir, { recursive: true });
    const dbPath = path.join(dir, 'opencode.db');
    writeFileSync(dbPath, '');
    const result = getDbPath({ OPENCODE_DATA_DIR: dir });
    assert.strictEqual(result, dbPath);
  });

  it('finds existing db via XDG_DATA_HOME', () => {
    const xdgDir = path.join(tmpDir, 'xdg-test', 'opencode');
    require('fs').mkdirSync(xdgDir, { recursive: true });
    const dbPath = path.join(xdgDir, 'opencode.db');
    writeFileSync(dbPath, '');
    const result = getDbPath({ XDG_DATA_HOME: path.join(tmpDir, 'xdg-test') });
    assert.strictEqual(result, dbPath);
  });

  it('finds opencode-stable.db when opencode.db is absent', () => {
    const xdgDir = path.join(tmpDir, 'xdg-stable', 'opencode');
    require('fs').mkdirSync(xdgDir, { recursive: true });
    const stablePath = path.join(xdgDir, 'opencode-stable.db');
    writeFileSync(stablePath, '');
    const result = getDbPath({ XDG_DATA_HOME: path.join(tmpDir, 'xdg-stable') });
    assert.ok(result.endsWith('opencode-stable.db'), `expected stable, got: ${result}`);
  });

});
