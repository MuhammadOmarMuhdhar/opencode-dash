#!/usr/bin/env node
const { join, resolve, extname } = require('path');
const { platform } = require('os');
const { existsSync, copyFileSync, symlinkSync, unlinkSync, rmSync, createReadStream, statSync } = require('fs');
const { spawn } = require('child_process');
const http = require('http');

const { getDbPath, getCandidatePaths } = require('../lib/db-path');

const APP_DIR = resolve(__dirname, '..', 'app');
const SOURCE_DIR = join(APP_DIR, 'sources', 'opencode');
const CONNECTION_PATH = join(SOURCE_DIR, 'connection.yaml');
const TEMPLATE_PATH = join(SOURCE_DIR, 'connection.template.yaml');
const SYMLINK_PATH = join(SOURCE_DIR, 'opencode.db');
const BUILD_DIR = join(APP_DIR, 'build');

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.arrow': 'application/octet-stream',
  '.wasm': 'application/wasm',
  '.parquet': 'application/octet-stream',
};

function runWithSpinner(script, label) {
  return new Promise((resolve, reject) => {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const t = setInterval(() => {
      process.stdout.write(`\r  ${frames[i]} ${label}...`);
      i = (i + 1) % frames.length;
    }, 80);

    const cmd = platform() === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(cmd, ['run', script], { cwd: APP_DIR, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, NODE_NO_WARNINGS: '1' } });
    let output = '';
    child.stdout.on('data', d => output += d);
    child.stderr.on('data', d => output += d);
    child.on('close', code => {
      clearInterval(t);
      if (code === 0) {
        process.stdout.write(`\r  \x1b[32m\u2713\x1b[0m ${label} \x1b[K\n`);
        resolve();
      } else {
        process.stderr.write(output);
        reject(new Error(`${label} failed (exit code ${code})`));
      }
    });
  });
}

(async () => {
  const dbPath = getDbPath();
  const goQuota = process.argv.slice(2).includes('--go');
  if (!existsSync(dbPath)) {
    console.error(`\n  Opencode database not found.`);
    console.error(`  Tried the following locations:\n`);
    for (const loc of getCandidatePaths()) {
      console.error(`    ${loc}`);
    }
    console.error(`\n  Make sure opencode CLI is installed and has been run at least once.`);
    console.error(`  You can set OPENCODE_DB to point directly to your database file.\n`);
    process.exit(1);
  }

  if (existsSync(TEMPLATE_PATH)) {
    copyFileSync(TEMPLATE_PATH, CONNECTION_PATH);
  }

  try { unlinkSync(SYMLINK_PATH); } catch (_) {}
  if (platform() === 'win32') {
    copyFileSync(dbPath, SYMLINK_PATH);
  } else {
    symlinkSync(dbPath, SYMLINK_PATH);
  }

  console.log(`  \x1b[90mDatabase:\x1b[0m ${dbPath}\n`);

  rmSync(join(APP_DIR, '.evidence'), { recursive: true, force: true });
  rmSync(join(APP_DIR, '.gitignore'), { force: true });

  const autoimportPath = join(APP_DIR, 'node_modules', '@evidence-dev', 'sdk', 'node_modules', 'sveltekit-autoimport', 'src', 'index.js');
  if (existsSync(autoimportPath)) {
    let autoimportSrc = require('fs').readFileSync(autoimportPath, 'utf-8');
    if (!autoimportSrc.includes("'opencode-patched'")) {
      autoimportSrc = autoimportSrc.replace(
        "'**/node_modules/**'",
        "'opencode-patched'"
      );
      require('fs').writeFileSync(autoimportPath, autoimportSrc);
    }
  }

  try {
    await runWithSpinner('sources', 'Extracting data sources');
  } catch (e) {
    console.error(`\n  ${e.message}\n`);
    process.exit(1);
  }

  try { unlinkSync(SYMLINK_PATH); } catch (_) {}
  try { unlinkSync(CONNECTION_PATH); } catch (_) {}

  try {
    await runWithSpinner('build', 'Building static dashboard');
  } catch (e) {
    console.error(`\n  ${e.message}\n`);
    process.exit(1);
  }

  startServer(parseInt(process.env.PORT) || 3000, goQuota);
})();

function startServer(port, goQuota) {
  const server = http.createServer((req, res) => {
    let filePath = join(BUILD_DIR, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }
    if (!existsSync(filePath)) filePath = join(BUILD_DIR, 'index.html');

    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}${goQuota ? '/go-quota' : ''}`;
    const label = goQuota ? 'Go Quota ' : '';
    console.log(`\n  ${label}Dashboard ready at ${url}\n`);

    if (goQuota) {
      const { exec } = require('child_process');
      const cmd = platform() === 'darwin' ? 'open' : platform() === 'win32' ? 'start' : 'xdg-open';
      exec(`${cmd} ${url}`);
    }
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      startServer(port + 1, goQuota);
    } else {
      console.error('  Server error:', e.message);
      process.exit(1);
    }
  });
}

