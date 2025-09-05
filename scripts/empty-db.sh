#!/usr/bin/env bash

# Check if node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js to run this script."
  exit 1
fi

# Change to the project directory (where this script is located)
cd "$(dirname "$0")/.." || exit

# Check if ts-node is installed
if ! command -v npx ts-node &> /dev/null; then
  echo "📦 Installing ts-node for one-time use..."
  npx ts-node --help > /dev/null
fi

# Execute the script
echo "🗑️  Running database reset script..."
npx ts-node ./scripts/empty-db.ts

# Exit with the status of the last command
exit $?
