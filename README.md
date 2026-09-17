# LinkedIn JobFinder

A full-stack application for searching and filtering LinkedIn job postings with advanced search capabilities.

## Features

- 🔍 **Advanced Search**: Search by keyword and location
- 🏷️ **Smart Filtering**: Filter by work modality (Remote, Hybrid, On-site)
- ⏰ **Time Filters**: Find recent postings (last hour, 24h, etc.)
- 🚫 **Keyword Exclusion**: Exclude unwanted terms from results
- 💾 **Save Jobs**: Bookmark jobs for later review
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Works on desktop and mobile devices

## Project Structure

```
linkedIn-JobFinder/
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── scraper.py       # LinkedIn scraping logic
│   ├── models.py        # Pydantic models
│   └── requirements.txt # Python dependencies
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
└── package.json        # Node dependencies
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Start the backend server:**
```bash
python main.py
```

Or use the startup script:
```bash
./start.sh
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to project root:**
```bash
cd ..
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Running the Application

1. **Start the backend** (in terminal 1):
```bash
cd backend
python main.py
```

2. **Start the frontend** (in terminal 2):
```bash
npm run dev
```

3. **Open your browser** to `http://localhost:5173`

## API Documentation

Once the backend is running, visit:
- Interactive API docs: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Technologies Used

### Frontend
- React 19
- Material-UI (MUI)
- Vite

### Backend
- FastAPI
- BeautifulSoup4
- Requests
- Python 3.x

## Important Notes

⚠️ **LinkedIn Anti-Scraping**: LinkedIn actively blocks web scrapers. This application includes:
- Mock data fallback for testing
- User-agent headers to improve scraping success
- Graceful error handling

For production use, consider:
- Using LinkedIn's official API
- Using third-party job aggregation services
- Implementing proxy rotation

## License

MIT
