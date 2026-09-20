# JobFinder User Guide - New Features

## What's New?

JobFinder now includes two powerful new features:

### 1. Search Profiles
Save multiple search configurations and run them individually or together. Perfect for:
- Searching different job types simultaneously
- Maintaining separate configurations for different career paths
- Quickly switching between common searches

### 2. Multiple Work Location Selection
Select any combination of Remote, Hybrid, and On-site positions in a single search.

---

## Getting Started

### First Time Setup

When you first open the updated JobFinder, your existing search settings will be automatically saved as a "Default Search" profile. This ensures you don't lose your current configuration.

---

## Using Search Profiles

### Creating a Profile

1. Click the **"+ New Profile"** button
2. Fill in the profile details:
   - **Profile Name**: Give it a descriptive name (e.g., "Cloud & DevOps")
   - **Include Keywords**: Add keywords one at a time
     - Type a keyword and press **Enter** or **comma (,)** to add it
     - Examples: "DevOps Engineer", "Terraform", "AWS"
   - **Exclude Keywords**: Add words to exclude from results
     - Type a word and press **Enter** or **comma (,)** to add it
     - Examples: "senior", "lead", "principal"
   - **Location**: Enter a location or leave blank
   - **Work Location**: Check any combination of Remote, Hybrid, or On-site
   - **Job Posting Age**: Select how recent jobs should be
3. Click **"Save Profile"**

### Managing Profiles

Each profile has three action buttons:

- **📋 Duplicate**: Create a copy of the profile
- **✏️ Edit**: Modify the profile settings
- **🗑️ Delete**: Remove the profile (requires confirmation)

### Searching with Profiles

#### Single Profile Search
1. Check the checkbox next to one profile
2. Click **"Search 1 Selected Profile"**
3. Results will show jobs matching that profile's criteria

#### Multiple Profile Search
1. Check the checkboxes next to multiple profiles
2. Click **"Search X Selected Profiles"**
3. JobFinder will:
   - Search each profile separately
   - Combine all results
   - Remove duplicate jobs
   - Show which profile(s) matched each job

**Example Result Display:**
```
Cloud DevOps Engineer
TechCorp Inc.
...job description...
[Cloud & DevOps]  ← Profile that matched this job
```

If a job matches multiple profiles:
```
Infrastructure Engineer
CloudSolutions
...job description...
[Cloud & DevOps] [Platform Engineering]  ← Multiple matches
```

---

## Multiple Work Location Selection

### How It Works

Previously, you could only select ONE work location type at a time. Now you can select ANY COMBINATION:

#### Examples:

**Remote + Hybrid**
- ☑ Remote
- ☑ Hybrid  
- ☐ On-site
- **Result**: Shows jobs that are Remote OR Hybrid

**Remote + On-site**
- ☑ Remote
- ☐ Hybrid
- ☑ On-site
- **Result**: Shows jobs that are Remote OR On-site

**All Three**
- ☑ Remote
- ☑ Hybrid
- ☑ On-site
- **Result**: Shows all jobs regardless of work location

**None Selected**
- ☐ Remote
- ☐ Hybrid
- ☐ On-site
- **Result**: No work location filter applied (shows all jobs)

### Where to Set This

Work location selection is available in:
1. **Profile Editor**: When creating or editing a profile
2. **Quick Search**: In the quick search form

---

## Quick Search

Don't want to create a profile? Use Quick Search for one-off searches.

### Accessing Quick Search

The Quick Search section appears below the Profile Manager. If it's hidden, click **"Show"** to expand it.

### Quick Search Features

- All the same options as before
- **NEW**: Select multiple work locations
- Results work exactly as before
- No profile required

---

## Example Workflows

### Workflow 1: Job Hunter with Multiple Specializations

**Scenario**: You're qualified for both Frontend and Backend positions.

**Setup**:
1. Create "Frontend Developer" profile
   - Keywords: React, Vue, Angular, JavaScript
   - Exclude: Senior, Lead
   - Work Location: Remote + Hybrid
   
2. Create "Backend Developer" profile
   - Keywords: Python, Node.js, Java, Go
   - Exclude: Senior, Lead
   - Work Location: Remote + Hybrid

**Usage**:
- Select both profiles
- Click "Search 2 Selected Profiles"
- Get all junior frontend AND backend positions
- Duplicates removed automatically

### Workflow 2: Career Change Explorer

**Scenario**: Exploring different industries.

**Setup**:
1. Create "Tech Industry" profile
   - Keywords: Software Engineer, Developer
   - Location: Remote
   - Work Location: Remote only

2. Create "Data Science" profile
   - Keywords: Data Analyst, Data Scientist
   - Location: Remote
   - Work Location: Remote + Hybrid

3. Create "Project Management" profile
   - Keywords: Project Manager, Scrum Master
   - Location: Remote
   - Work Location: Remote

**Usage**:
- Search profiles individually to explore each path
- Or search all three to see all opportunities
- Each result shows which career path it matches

### Workflow 3: Location-Specific Search

**Scenario**: Moving to a new city, want to see local opportunities.

**Setup**:
1. Create "Austin - Tech" profile
   - Keywords: Software Developer, Engineer
   - Location: Austin, TX
   - Work Location: All three options (flexible)

2. Create "Austin - Startups" profile
   - Keywords: Startup, Early Stage
   - Location: Austin, TX
   - Work Location: All three options

**Usage**:
- Search both to get comprehensive Austin tech scene view
- Adjust work location preferences as you learn more

---

## Tips and Best Practices

### For Keywords

**DO:**
- ✅ Use specific job titles: "DevOps Engineer", "Senior Analyst"
- ✅ Include technologies: "Python", "React", "AWS"
- ✅ Add certifications: "CPA", "PMP", "AWS Certified"
- ✅ Use variations: "QA Analyst", "Quality Assurance Analyst"

**DON'T:**
- ❌ Make keywords too long or complex
- ❌ Use full sentences
- ❌ Include exclusion words in keywords

### For Exclusions

**DO:**
- ✅ Exclude seniority levels: "senior", "lead", "principal"
- ✅ Exclude requirements: "5+ years", "PhD required"
- ✅ Exclude technologies you don't know: "Angular", "Ruby"
- ✅ Use lowercase (filtering is case-insensitive)

**DON'T:**
- ❌ Over-exclude (you might miss good opportunities)
- ❌ Exclude common words that appear everywhere

### For Multiple Profiles

**DO:**
- ✅ Keep profiles focused on distinct job types
- ✅ Use descriptive profile names
- ✅ Regularly update exclusions based on what you see
- ✅ Duplicate and modify existing profiles for variations

**DON'T:**
- ❌ Create too many similar profiles (causes confusion)
- ❌ Search 10+ profiles at once (very slow)
- ❌ Forget to update profiles as your skills grow

### For Work Locations

**DO:**
- ✅ Be realistic about what you can commit to
- ✅ Select multiple options if you're flexible
- ✅ Adjust as you learn your preferences
- ✅ Consider selecting all three to see what's available

**DON'T:**
- ❌ Assume "Remote" means "work from anywhere" (check job details)
- ❌ Exclude on-site if you're local to a job hub

---

## Troubleshooting

### "No results found"
- Try removing some exclusions
- Check if work location is too restrictive
- Verify location is spelled correctly
- Try broader keywords

### Profile search is slow
- This is normal when searching multiple profiles
- Each profile sends a separate request to LinkedIn
- 3 profiles = 3× the time of one search
- Consider searching fewer profiles at once

### Job appears in wrong profile results
- LinkedIn's search isn't perfect
- The job may contain your keyword in an unexpected way
- Add more specific exclusions
- Refine your keywords

### Lost my profiles
- Profiles are stored in browser localStorage
- Clearing browser data deletes profiles
- Use the same browser/device
- Export/backup feature not yet implemented

### Multiple profiles showing same jobs
- This is expected! Jobs can match multiple profiles
- Look for the profile badges showing which profiles matched
- Duplicates are automatically removed

---

## Keyboard Shortcuts

- **Enter** or **Comma (,)** when typing keywords → Add the keyword
- **Tab** → Move between fields
- **Escape** → Close profile editor dialog
- **Click outside dialog** → Cancel profile editing

---

## Data Privacy

- All profiles are stored locally in your browser
- No profile data is sent to any server
- Profiles don't sync across devices
- Clearing browser data will delete profiles

---

## Known Limitations

1. **No cloud sync**: Profiles are device-specific
2. **No export/import**: Can't backup or share profiles yet
3. **LinkedIn rate limiting**: Too many searches may be blocked by LinkedIn
4. **Mock data**: When LinkedIn blocks requests, you'll see test data instead
5. **No pagination**: Large searches load all results at once

---

## Need Help?

If you encounter issues:
1. Check the browser console for error messages (F12)
2. Verify the backend is running on port 8000
3. Try refreshing the page
4. Clear browser data and try again (will lose profiles)

---

## Coming Soon (Not Yet Implemented)

- Profile export/import
- Profile sharing
- Cloud sync across devices
- Saved search history
- Job application tracking
- Email notifications for new matches
- Advanced filtering (salary, company size, etc.)

---

Enjoy your enhanced job search experience! 🚀
