# LinkedIn JobFinder Backend

FastAPI backend for scraping LinkedIn job postings.

## Setup

1. **Create a virtual environment:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Run the server:**
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### POST /api/jobs/
Search for jobs with filters.

**Request Body:**
```json
{
  "keyword": "python",
  "location": "Mexico",
  "exclude": ["senior", "+5 años"],
  "modality": "remoto",
  "time_filter": "24h"
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "Python Developer",
      "company": "TechCorp",
      "location": "Remote",
      "description": "Job description...",
      "link": "https://www.linkedin.com/jobs/view/...",
      "posted_date": "2 days ago"
    }
  ],
  "total": 10,
  "no_results": false
}
```

### GET /
Health check endpoint

### GET /api/health
Detailed health check

## Notes

- The scraper includes fallback to mock data if LinkedIn blocks the request
- CORS is configured for frontend at `http://localhost:5173`
- LinkedIn has anti-scraping measures - consider using their official API for production
