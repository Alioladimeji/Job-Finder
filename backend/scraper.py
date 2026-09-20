import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import urllib.parse
import time
import re


class LinkedInScraper:
    def __init__(self):
        self.base_url = "https://www.linkedin.com/jobs/search"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }

    def build_search_url(self, keyword: str, location: str, modalities: List[str], time_filter: str) -> str:
        """Build LinkedIn job search URL with filters"""
        params = {
            'keywords': keyword,
            'location': location,
        }

        # Add modality filter (LinkedIn's f_WT parameter)
        # 1 = On-site, 2 = Remote, 3 = Hybrid
        modality_map = {
            'remoto': '2',  # Remote
            'presencial': '1',  # On-site
            'hibrido': '3'  # Hybrid
        }

        # Support multiple modalities - LinkedIn accepts comma-separated values
        if modalities:
            valid_codes = [modality_map[m] for m in modalities if m in modality_map]
            if valid_codes:
                params['f_WT'] = '%2C'.join(valid_codes)  # URL-encoded comma

        # Add time filter (LinkedIn's f_TPR parameter)
        # r86400 = Past 24 hours, r604800 = Past week, r2592000 = Past month
        time_map = {
            '1h': 'r3600',
            '2h': 'r7200',
            '6h': 'r21600',
            '12h': 'r43200',
            '24h': 'r86400'
        }
        if time_filter and time_filter in time_map:
            params['f_TPR'] = time_map[time_filter]

        query_string = urllib.parse.urlencode(params)
        return f"{self.base_url}?{query_string}"

    def scrape_jobs(self, keyword: str, location: str = "", modalities: List[str] = None,
                    time_filter: str = "", exclude: List[str] = None) -> List[Dict]:
        """
        Scrape LinkedIn jobs based on search parameters

        Args:
            keyword: Job search keyword
            location: Job location
            modalities: List of work location types (remote/hybrid/on-site)
            time_filter: Time range filter
            exclude: List of words to exclude from results

        Returns:
            List of job dictionaries
        """
        if exclude is None:
            exclude = []
        if modalities is None:
            modalities = []

        url = self.build_search_url(keyword, location, modalities, time_filter)

        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'lxml')

            # LinkedIn job cards are in <li> with class containing "job"
            job_cards = soup.find_all('li', class_=lambda x: x and 'job' in x.lower())

            # Alternative: look for job card containers
            if not job_cards:
                job_cards = soup.find_all('div', {'class': re.compile(r'base-card|job.*card', re.I)})

            jobs = []

            for card in job_cards[:30]:  # Limit to 30 jobs
                try:
                    job = self._extract_job_info(card)
                    if job and not self._should_exclude(job, exclude):
                        jobs.append(job)
                except Exception as e:
                    print(f"Error extracting job: {e}")
                    continue

            return jobs

        except requests.RequestException as e:
            print(f"Request error: {e}")
            raise Exception(f"Failed to fetch jobs from LinkedIn: {str(e)}")

    def _extract_job_info(self, card) -> Dict:
        """Extract job information from a job card element"""
        job = {}

        # Extract title
        title_elem = card.find('h3', class_=re.compile(r'base-search-card__title', re.I))
        if not title_elem:
            title_elem = card.find('a', class_=re.compile(r'job.*title', re.I))
        job['title'] = title_elem.get_text(strip=True) if title_elem else "N/A"

        # Extract company
        company_elem = card.find('h4', class_=re.compile(r'base-search-card__subtitle', re.I))
        if not company_elem:
            company_elem = card.find('a', class_=re.compile(r'company', re.I))
        job['company'] = company_elem.get_text(strip=True) if company_elem else "N/A"

        # Extract location
        location_elem = card.find('span', class_=re.compile(r'job-search-card__location', re.I))
        job['location'] = location_elem.get_text(strip=True) if location_elem else "N/A"

        # Extract link
        link_elem = card.find('a', href=True)
        job['link'] = link_elem['href'] if link_elem else "#"

        # Clean up LinkedIn tracking parameters
        if '?' in job['link']:
            job['link'] = job['link'].split('?')[0]

        # Extract description/snippet
        desc_elem = card.find('p', class_=re.compile(r'snippet', re.I))
        if not desc_elem:
            desc_elem = card.find('div', class_=re.compile(r'description', re.I))
        job['description'] = desc_elem.get_text(strip=True) if desc_elem else ""

        # Extract posted date
        date_elem = card.find('time')
        if not date_elem:
            date_elem = card.find('span', class_=re.compile(r'date', re.I))
        job['posted_date'] = date_elem.get_text(strip=True) if date_elem else None

        return job if job.get('title') != "N/A" else None

    def _should_exclude(self, job: Dict, exclude_words: List[str]) -> bool:
        """Check if job should be excluded based on exclusion keywords"""
        if not exclude_words:
            return False

        # Combine title, company, and description for checking
        search_text = f"{job.get('title', '')} {job.get('company', '')} {job.get('description', '')}".lower()

        for word in exclude_words:
            if word.lower() in search_text:
                return True

        return False


# Fallback: Mock data generator for testing
def generate_mock_jobs(keyword: str, location: str, count: int = 10) -> List[Dict]:
    """Generate mock job data for testing when scraping fails"""
    jobs = []
    companies = ["TechCorp", "InnovateSoft", "DataDynamics", "CloudSolutions", "AIStartup"]
    locations = [location if location else "Remote", "Mexico City", "Guadalajara", "Monterrey"]

    for i in range(count):
        jobs.append({
            'title': f"{keyword.title()} Developer {i+1}",
            'company': companies[i % len(companies)],
            'location': locations[i % len(locations)],
            'description': f"We are looking for a talented {keyword} professional to join our team. Great opportunity for growth and development.",
            'link': f"https://www.linkedin.com/jobs/view/{3000000000 + i}",
            'posted_date': "2 days ago"
        })

    return jobs
