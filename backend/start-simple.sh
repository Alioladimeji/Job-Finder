#!/bin/bash

# Alternative startup script that handles Python installation issues

echo "🚀 LinkedIn JobFinder Backend - Alternative Startup"
echo ""

# Try to find a working Python installation
if command -v python3.13 &> /dev/null; then
    PYTHON_CMD="python3.13"
elif command -v python3.12 &> /dev/null; then
    PYTHON_CMD="python3.12"
elif command -v python3.11 &> /dev/null; then
    PYTHON_CMD="python3.11"
elif command -v python3.10 &> /dev/null; then
    PYTHON_CMD="python3.10"
elif command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
else
    echo "❌ No Python 3 installation found"
    exit 1
fi

echo "✅ Using Python: $PYTHON_CMD ($($PYTHON_CMD --version))"
echo ""

# Check if we're in the backend directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py not found. Please run this script from the backend directory."
    exit 1
fi

# Try to install/upgrade pip first
echo "📦 Checking pip installation..."
$PYTHON_CMD -m pip --version &> /dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  pip not available, trying to install..."
    curl https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py
    $PYTHON_CMD /tmp/get-pip.py --user
    rm /tmp/get-pip.py
fi

# Install dependencies
echo "📥 Installing/updating dependencies..."
$PYTHON_CMD -m pip install --user fastapi uvicorn requests beautifulsoup4 lxml python-dotenv pydantic

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Trying without --user flag..."
    $PYTHON_CMD -m pip install fastapi uvicorn requests beautifulsoup4 lxml python-dotenv pydantic
fi

echo ""
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📖 API docs available at http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
$PYTHON_CMD main.py
