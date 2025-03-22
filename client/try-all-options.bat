@echo off
echo === Attempting to resolve Vite startup issues ===

echo 1. Cleaning node_modules and reinstalling...
rmdir /s /q node_modules
del package-lock.json
npm install

echo 2. Testing with --host flag...
npm run dev -- --host

echo 3. If the above doesn't work, try with explicit port...
echo npm run dev -- --host --port 3000

echo 4. If still not working, try with disabled browser security...
echo "Run Chrome with: chrome.exe --disable-web-security --user-data-dir=c:\temp"

echo 5. Testing with Vite preview instead of dev...
npm run build && npm run preview -- --host
