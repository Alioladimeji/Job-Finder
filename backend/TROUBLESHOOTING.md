# Troubleshooting Guide

## Python 3.14 Installation Issues

If you encounter errors with Python 3.14 (like `ImportError: Symbol not found: _XML_SetAllocTrackerActivationThreshold`), this is a known issue with Python 3.14 and system libraries on macOS.

### Solutions:

**Option 1: Use an older Python version (Recommended)**
```bash
# Install Python 3.12 with Homebrew
brew install python@3.12

# Use it directly
/opt/homebrew/bin/python3.12 -m pip install -r requirements.txt
/opt/homebrew/bin/python3.12 main.py
```

**Option 2: Use the alternative startup script**
```bash
./start-simple.sh
```

This script automatically finds a working Python installation.

**Option 3: Fix Python 3.14**
```bash
# Reinstall Python 3.14
brew reinstall python@3.14

# Update expat library
brew upgrade expat
```

## Dependencies Won't Install

If pip fails to install dependencies:

```bash
# Install each package individually
python3 -m pip install fastapi
python3 -m pip install uvicorn
python3 -m pip install requests
python3 -m pip install beautifulsoup4
python3 -m pip install lxml
python3 -m pip install python-dotenv
python3 -m pip install pydantic
```

## Backend Won't Start

1. **Check if port 8000 is already in use:**
```bash
lsof -i :8000
# Kill the process if needed
kill -9 <PID>
```

2. **Run backend directly without script:**
```bash
cd backend
python3 main.py
```

## LinkedIn Blocking Requests

The scraper includes mock data fallback. If all searches return mock data:

- LinkedIn is blocking your IP
- Consider using a VPN
- Use LinkedIn's official API (requires approval)
- Use third-party job APIs (RapidAPI, etc.)

## CORS Errors

If the frontend can't connect to the backend:

1. Make sure backend is running on port 8000
2. Frontend should be on port 5173
3. Check browser console for specific errors

## No Jobs Returned

If search returns no results:

1. Check backend logs for errors
2. Try different search keywords
3. The mock data fallback should work as a test
