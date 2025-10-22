#!/bin/bash

echo "🚀 Setting up creator registration script..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Edit register-creators.js and set your private key"
    echo "2. Get test ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
    echo "3. Run: npm run register"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
