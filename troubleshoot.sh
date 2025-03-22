# 1. Make sure you're in the project root directory
cd c:\Users\shara\OneDrive\Desktop\Amrita B.tech\Semester 6\Lab\DBSP\Entreprenuership

# 2. Stop any running processes (you may need to use Ctrl+C)

# 3. Kill any process using the Vite port
# For Windows:
netstat -ano | findstr :5173
# Then kill the process:
# taskkill /F /PID <PID_NUMBER>

# 4. Navigate to client directory and start Vite directly
cd client
npm run dev -- --host

# 5. If it works, the terminal will show a URL - open your browser to this URL
# (Note: this is typically http://localhost:5173)

# 6. If still not working, try explicitly specifying a different port:
npm run dev -- --host --port 3000

# 7. Check if browser opens automatically. If not, manually navigate to:
# http://localhost:3000
