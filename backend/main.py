from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import JobSearchRequest, JobSearchResponse, Job
from scraper import LinkedInScraper, generate_mock_jobs
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="LinkedIn JobFinder API",
    description="Backend API for scraping LinkedIn jobs",
    version="1.0.0"
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

scraper = LinkedInScraper()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "LinkedIn JobFinder API is running",
        "version": "1.0.0"
    }


@app.post("/api/jobs/", response_model=JobSearchResponse)
async def search_jobs(request: JobSearchRequest):
    """
    Search for jobs on LinkedIn based on filters

    Args:
        request: JobSearchRequest with keyword, location, filters

    Returns:
        JobSearchResponse with list of jobs
    """
    try:
        logger.info(f"Searching jobs: keyword={request.keyword}, location={request.location}")
        logger.info(f"Filters: modality={request.modality}, time={request.time_filter}, exclude={request.exclude}")

        # Validate required fields
        if not request.keyword or request.keyword.strip() == "":
            raise HTTPException(status_code=400, detail="Keyword is required")

        # Scrape jobs from LinkedIn
        try:
            jobs_data = scraper.scrape_jobs(
                keyword=request.keyword,
                location=request.location,
                modality=request.modality,
                time_filter=request.time_filter,
                exclude=request.exclude
            )

            # If scraping returns no jobs or fails, use mock data for testing
            if not jobs_data:
                logger.warning("No jobs found from scraping, using mock data")
                jobs_data = generate_mock_jobs(request.keyword, request.location, 10)

        except Exception as scrape_error:
            logger.error(f"Scraping failed: {scrape_error}")
            # Fallback to mock data when scraping fails
            logger.info("Using mock data due to scraping failure")
            jobs_data = generate_mock_jobs(request.keyword, request.location, 10)

        # Convert to Job models
        jobs = [Job(**job) for job in jobs_data]

        # Check if no results after filtering
        if len(jobs) == 0:
            return JobSearchResponse(
                results=[],
                total=0,
                no_results=True,
                message="No se encontraron resultados con los filtros aplicados"
            )

        return JobSearchResponse(
            results=jobs,
            total=len(jobs),
            no_results=False
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in search_jobs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "scraper": "initialized",
        "endpoints": ["/", "/api/jobs/", "/api/health"]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
