import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('====================================================');
console.log('           SMARTQUEUE AI - DEV LAUNCHER             ');
console.log('====================================================');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const nodeCmd = process.execPath;

// Start Express Backend
console.log('[1/2] Starting Express REST API Backend (Port 5000)...');
const backend = spawn(nodeCmd, ['backend/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: isWin
});

// Start Vite React Frontend
console.log('[2/2] Starting Vite React Frontend (Port 3000)...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: isWin
});

function shutdown() {
  console.log('\nStopping SmartQueue AI services...');
  backend.kill();
  frontend.kill();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
