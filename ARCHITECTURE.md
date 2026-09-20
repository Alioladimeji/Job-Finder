# JobFinder Architecture - Updated System Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    JobSearchForm.jsx                       │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │          ProfileManager.jsx (NEW)                    │  │  │
│  │  ├─────────────────────────────────────────────────────┤  │  │
│  │  │  - Create Profile                                    │  │  │
│  │  │  - Edit Profile                                      │  │  │
│  │  │  - Delete Profile                                    │  │  │
│  │  │  - Duplicate Profile                                 │  │  │
│  │  │  - Multi-Select Profiles                             │  │  │
│  │  │                                                       │  │  │
│  │  │  Profile Data:                                       │  │  │
│  │  │    {                                                 │  │  │
│  │  │      id: string                                      │  │  │
│  │  │      name: string                                    │  │  │
│  │  │      includeKeywords: string[]                       │  │  │
│  │  │      excludeKeywords: string[]                       │  │  │
│  │  │      location: string                                │  │  │
│  │  │      workLocations: ["remoto", "hibrido"]  (NEW)     │  │  │
│  │  │      postingAge: string                              │  │  │
│  │  │    }                                                 │  │  │
│  │  │                                                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                           │                                 │  │
│  │                           ▼                                 │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │         localStorage: "searchProfiles"               │  │  │
│  │  │         (Profile Persistence)                        │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │          Quick Search (Traditional)                  │  │  │
│  │  ├─────────────────────────────────────────────────────┤  │  │
│  │  │  - Single keyword search                             │  │  │
│  │  │  - Multiple work locations (NEW)                     │  │  │
│  │  │  - Exclusions                                        │  │  │
│  │  │  - Time filter                                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  └───────────────────────┬─────────────────────────────────────┘  │
│                          │                                         │
│                          ▼                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      App.jsx                               │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  handleSearch(filters)                                     │  │
│  │                                                             │  │
│  │  Single Profile:                                           │  │
│  │    → Join keywords with " OR "                             │  │
│  │    → Single API request                                    │  │
│  │                                                             │  │
│  │  Multiple Profiles:                                        │  │
│  │    → Loop through selected profiles                        │  │
│  │    → Execute separate API request per profile             │  │
│  │    → Combine results                                       │  │
│  │    → Deduplicate by job.link                              │  │
│  │    → Track matched profile names                          │  │
│  │                                                             │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                         │
└──────────────────────────┼─────────────────────────────────────────┘
                           │
                           │ HTTP POST /api/jobs/
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    main.py                                 │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  POST /api/jobs/                                           │  │
│  │                                                             │  │
│  │  1. Receive JobSearchRequest                              │  │
│  │  2. Merge modality + modalities (backward compat)         │  │
│  │  3. Call scraper.scrape_jobs()                            │  │
│  │  4. Fallback to mock data if scraping fails               │  │
│  │  5. Return JobSearchResponse                              │  │
│  │                                                             │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                         │
│                          ▼                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    models.py                               │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  JobSearchRequest:                                         │  │
│  │    - keyword: str                                          │  │
│  │    - location: str                                         │  │
│  │    - exclude: List[str]                                    │  │
│  │    - modality: str (deprecated, backward compat)           │  │
│  │    - modalities: List[str] (NEW)                           │  │
│  │    - time_filter: str                                      │  │
│  │                                                             │  │
│  │  Validator: Ensures modalities is always a list           │  │
│  │                                                             │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                         │
│                          ▼                                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  scraper.py                                │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  scrape_jobs(keyword, location, modalities, ...)          │  │
│  │                                                             │  │
│  │  1. Build LinkedIn URL                                     │  │
│  │     - Convert modalities to f_WT parameter                │  │
│  │     - remoto → 2, hibrido → 3, presencial → 1            │  │
│  │     - Multiple: f_WT=2%2C3 (comma-separated)              │  │
│  │                                                             │  │
│  │  2. Make HTTP request to LinkedIn                         │  │
│  │                                                             │  │
│  │  3. Parse HTML for job listings                           │  │
│  │                                                             │  │
│  │  4. Filter by exclusion keywords                          │  │
│  │                                                             │  │
│  │  5. Return job list                                        │  │
│  │                                                             │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                         │
└──────────────────────────┼─────────────────────────────────────────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │   LinkedIn Jobs     │
                 │   (or Mock Data)    │
                 └─────────────────────┘
```

## Data Flow Examples

### Example 1: Single Profile Search

```
User selects "Cloud & DevOps" profile
  ↓
Profile data:
  - includeKeywords: ["DevOps", "Terraform", "AWS"]
  - excludeKeywords: ["senior", "lead"]
  - workLocations: ["remoto", "hibrido"]
  - location: "Remote"
  ↓
Frontend combines keywords: "DevOps OR Terraform OR AWS"
  ↓
API Request:
  POST /api/jobs/
  {
    keyword: "DevOps OR Terraform OR AWS",
    location: "Remote",
    exclude: ["senior", "lead"],
    modalities: ["remoto", "hibrido"],
    time_filter: "24h"
  }
  ↓
Backend builds LinkedIn URL:
  https://linkedin.com/jobs/search?
    keywords=DevOps+OR+Terraform+OR+AWS
    &location=Remote
    &f_WT=2%2C3          ← Remote + Hybrid
    &f_TPR=r86400        ← Last 24h
  ↓
Scrape LinkedIn → Filter exclusions → Return jobs
  ↓
Frontend displays results with profile badge:
  [Cloud & DevOps]
```

### Example 2: Multiple Profile Search

```
User selects 2 profiles:
  1. "Cloud & DevOps"
  2. "Platform Engineering"
  ↓
Frontend loops through profiles:
  ↓
Request 1:
  keyword: "DevOps OR Terraform OR AWS"
  modalities: ["remoto", "hibrido"]
  exclude: ["senior", "lead"]
  → Results: [JobA, JobB, JobC]
  → Tag each: profileName = "Cloud & DevOps"
  ↓
Request 2:
  keyword: "Platform Engineer OR SRE OR Kubernetes"
  modalities: ["remoto"]
  exclude: ["senior", "principal"]
  → Results: [JobB, JobD, JobE]  (JobB is duplicate)
  → Tag each: profileName = "Platform Engineering"
  ↓
Deduplication (by job.link):
  - JobA → matched by: ["Cloud & DevOps"]
  - JobB → matched by: ["Cloud & DevOps", "Platform Engineering"]
  - JobC → matched by: ["Cloud & DevOps"]
  - JobD → matched by: ["Platform Engineering"]
  - JobE → matched by: ["Platform Engineering"]
  ↓
Display with profile badges:
  JobA: [Cloud & DevOps]
  JobB: [Cloud & DevOps] [Platform Engineering]
  JobC: [Cloud & DevOps]
  JobD: [Platform Engineering]
  JobE: [Platform Engineering]
```

### Example 3: Quick Search with Multiple Work Locations

```
User fills Quick Search:
  - Keyword: "React Developer"
  - Location: "San Francisco"
  - Work Locations: ☑ Remote ☑ Hybrid ☐ On-site
  - Exclude: ["senior"]
  - Time: "24h"
  ↓
API Request:
  POST /api/jobs/
  {
    keyword: "React Developer",
    location: "San Francisco",
    exclude: ["senior"],
    modalities: ["remoto", "hibrido"],  ← Multiple locations
    time_filter: "24h"
  }
  ↓
Backend merges modalities → Scrapes LinkedIn → Returns jobs
  ↓
Display results (no profile badges)
```

## Component Relationships

```
App.jsx
  ├── JobSearchForm.jsx
  │     ├── ProfileManager.jsx (NEW)
  │     │     └── ProfileEditor (dialog)
  │     └── Quick Search (form)
  │
  ├── JobList.jsx
  │     └── JobCard.jsx (modified to show profile badges)
  │
  └── SavedJobs.jsx (unchanged)
```

## State Management

```
App.jsx State:
  - jobs: Job[]
  - savedJobs: Job[]
  - mode: 'light' | 'dark'
  - errorMessage: string
  - noResultsMessage: string

JobSearchForm.jsx State:
  - profiles: Profile[]  (NEW)
  - selectedProfileIds: string[]  (NEW)
  - keyword: string
  - location: string
  - workLocations: string[]  (changed from object to array)
  - timeFilter: string
  - exclusions: string[]

localStorage:
  - searchProfiles: Profile[]  (NEW)
  - savedJobs: Job[]
  - themeMode: string
  - profilesMigrated: boolean  (NEW)
```

## API Contract Evolution

### Before (v1.0)
```typescript
interface JobSearchRequest {
  keyword: string;
  location: string;
  exclude: string[];
  modality: string;  // Single value only
  time_filter: string;
}
```

### After (v2.0) - Backward Compatible
```typescript
interface JobSearchRequest {
  keyword: string;
  location: string;
  exclude: string[];
  modality: string;        // Deprecated but still works
  modalities: string[];    // NEW - Multiple values
  time_filter: string;
}

// Backend merges both fields:
// finalModalities = [...modalities, modality].filter(unique)
```

## Key Design Decisions

1. **localStorage over Backend Database**
   - Simplest implementation
   - No backend persistence needed
   - Works immediately
   - Limitation: No cross-device sync

2. **Sequential vs Parallel Profile Searches**
   - Chose sequential to avoid rate limiting
   - Easier to implement
   - Better error handling per profile
   - Trade-off: Slower for multiple profiles

3. **Client-Side Deduplication**
   - Backend unchanged (no batch endpoint)
   - Frontend has full control
   - Can track which profiles matched
   - Trade-off: More frontend logic

4. **Backward Compatible API**
   - Old clients still work
   - No breaking changes
   - Gradual migration
   - Trade-off: Two fields for same purpose

5. **Keyword OR Joining**
   - Simplest multi-keyword approach
   - Works with LinkedIn's search
   - Trade-off: Not as precise as separate searches

## Success Criteria ✅

✅ All existing features work unchanged
✅ New profile management works
✅ Multiple work locations work
✅ Multi-profile search works
✅ Deduplication works
✅ Backward compatibility maintained
✅ No breaking changes
✅ Build successful
✅ No new dependencies
✅ Documentation complete
