#!/usr/bin/env node
const { join, resolve, extname } = require('path');
const { homedir, platform } = require('os');
const { existsSync, copyFileSync, symlinkSync, unlinkSync, readFileSync, createReadStream } = require('fs');
const { spawnSync } = require('child_process');
const http = require('http');

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
};

function getDbPath() {
  const home = homedir();
  if (platform() === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || join(home, 'AppData', 'Local');
    return join(localAppData, 'opencode', 'opencode.db');
  }
  return join(home, '.local', 'share', 'opencode', 'opencode.db');
}

function runNpm(script) {
  const cmd = platform() === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(cmd, ['run', script], { cwd: APP_DIR, stdio: 'inherit', shell: true });
  return result.status === 0;
}

const dbPath = getDbPath();
if (!existsSync(dbPath)) {
  console.error(`\n  Opencode database not found at:\n    ${dbPath}`);
  console.error('\n  Make sure opencode CLI is installed and has been run at least once.\n');
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

console.log(`  Database: ${dbPath}\n`);

console.log('  Extracting data sources...');
if (!runNpm('sources')) {
  console.error('\n  Failed to extract data sources. See above for details.\n');
  process.exit(1);
}

console.log('\n  Building static dashboard...');
if (!runNpm('build')) {
  console.error('\n  Failed to build dashboard. See above for details.\n');
  process.exit(1);
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    let filePath = join(BUILD_DIR, req.url === '/' ? '/index.html' : req.url.split('?')[0]);
    if (!existsSync(filePath)) filePath = join(BUILD_DIR, 'index.html');

    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  });

  server.listen(port, () => {
    console.log(`\n  Dashboard ready at http://localhost:${port}\n`);
  });

  server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      startServer(port + 1);
    } else {
      console.error('  Server error:', e.message);
      process.exit(1);
    }
  });
}

startServer(parseInt(process.env.PORT) || 3000);
