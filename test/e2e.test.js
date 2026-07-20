const { execSync, spawn } = require('child_process');
const { existsSync, mkdtempSync, rmSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
const http = require('http');
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');

const ROOT = join(__dirname, '..');
const PORT = parseInt(process.env.TEST_PORT) || 3099;
const TIMEOUT = 120_000;

let server = null;
let tmpDir = '';

describe('E2E smoke test', { timeout: TIMEOUT }, () => {
  before(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'otel-e2e-'));
    console.log('  temp dir:', tmpDir);

    execSync('npm pack', { cwd: ROOT, stdio: 'pipe' });
    const tgz = require('fs').readdirSync(ROOT).find(f => f.endsWith('.tgz'));
    if (!tgz) throw new Error('no tarball found after npm pack');

    execSync(`tar -xzf ${tgz} -C ${tmpDir}`, { cwd: ROOT });
    execSync('npm install', { cwd: join(tmpDir, 'package'), stdio: 'inherit' });

    server = spawn('node', ['bin/cli.js'], {
      cwd: join(tmpDir, 'package'),
      env: { ...process.env, PORT: String(PORT) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    server.stdout.on('data', d => process.stdout.write(`[server] ${d}`));
    server.stderr.on('data', d => process.stderr.write(`[server] ${d}`));
  });

  after(() => {
    if (server) { server.kill(); server = null; }
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  });

  it('serves the dashboard page', async () => {
    const html = await waitForPage(`http://localhost:${PORT}`);
    assert.ok(html.includes('Opencode Telematics'), 'page contains title');
    assert.ok(!html.includes('Error in Query'), 'no SQL error on page');
    assert.ok(!html.includes('not found'), 'no 404 text on page');
    assert.ok(html.includes('github.com/MuhammadOmarMuhdhar'), 'GitHub link present');
  });
});

function waitForPage(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const poll = () => {
      if (Date.now() - start > TIMEOUT) return reject(new Error('timed out waiting for server'));
      http.get(url, (res) => {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          if (res.statusCode === 200 && body.length > 100) return resolve(body);
          setTimeout(poll, 1000);
        });
      }).on('error', () => setTimeout(poll, 500));
    };
    poll();
  });
}
