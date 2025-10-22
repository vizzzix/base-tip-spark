@echo off
echo 🚀 Setting up creator registration script...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo ✅ Dependencies installed successfully!
    echo.
    echo 📝 Next steps:
    echo 1. Edit register-creators.js and set your private key
    echo 2. Get test ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
    echo 3. Run: npm run register
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

pause
