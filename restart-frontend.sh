#!/bin/bash

# Script to cleanly restart JobFinder frontend

echo "🔄 Restarting JobFinder Frontend..."
echo ""

# Kill any existing dev servers
echo "1. Stopping old dev servers..."
lsof -ti:5173,5174 | xargs kill -9 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
sleep 2

# Navigate to project directory
cd /Users/aliakinfenwa/linkedIn-JobFinder

# Start fresh dev server
echo "2. Starting fresh dev server..."
npm run dev &

# Wait for server to start
sleep 4

# Check which port it's using
if lsof -ti:5173 > /dev/null 2>&1; then
    echo ""
    echo "✅ Frontend running on: http://localhost:5173"
    echo ""
elif lsof -ti:5174 > /dev/null 2>&1; then
    echo ""
    echo "✅ Frontend running on: http://localhost:5174"
    echo ""
else
    echo ""
    echo "⚠️  Server may still be starting. Check manually."
    echo ""
fi

echo "📋 What you should see:"
echo "   - Search Profiles section at the top"
echo "   - '+ New Profile' button"
echo "   - 'OR' divider"
echo "   - Quick Search section below"
echo "   - Multiple checkbox options for Remote/Hybrid/On-site"
echo ""
echo "Press Ctrl+C to stop the dev server when done."
