import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if server directory exists
if (!fs.existsSync(path.join(__dirname, 'server'))) {
  fs.mkdirSync(path.join(__dirname, 'server'));
  console.log('Created server directory');
}

// Check if database directory exists
if (!fs.existsSync(path.join(__dirname, 'server/db'))) {
  fs.mkdirSync(path.join(__dirname, 'server/db'), { recursive: true });
  console.log('Created database directory');
}

// Function to run commands and handle errors
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

// Install dependencies
runCommand('npm run install-all');

// Create admin user
runCommand('npm run create-admin');

console.log('\n🚀 Setup completed successfully! 🚀');
console.log('\nTo start the application in development mode:');
console.log('npm run dev');
console.log('\nThis will start both the server (http://localhost:5000) and client (http://localhost:5173).');
