# Quick Start Guide - Testing the New Features

## The Issue You're Seeing

You're likely viewing an old dev server instance. Multiple servers were running on different ports.

## Solution: Restart the Frontend

### Option 1: Use the restart script
```bash
cd /Users/aliakinfenwa/linkedIn-JobFinder
./restart-frontend.sh
```

### Option 2: Manual restart
```bash
# Kill all existing servers
lsof -ti:5173,5174 | xargs kill -9
pkill -f "npm run dev"

# Start fresh
cd /Users/aliakinfenwa/linkedIn-JobFinder
npm run dev
```

Then open: **http://localhost:5173** (or check the terminal for the actual port)

---

## What You Should See Now

### ✅ New UI Elements

1. **At the Top of the Search Form:**
   ```
   ┌─────────────────────────────────────────┐
   │ Search Profiles        [+ New Profile]  │
   ├─────────────────────────────────────────┤
   │ No profiles yet. Create your first...   │
   └─────────────────────────────────────────┘
   ```

2. **Divider:**
   ```
   ────────────── OR ──────────────
   ```

3. **Quick Search Section:**
   ```
   ┌─────────────────────────────────────────┐
   │ Quick Search                    [Hide]  │
   ├─────────────────────────────────────────┤
   │ [Keyword field]                         │
   │ [Location field]                        │
   │ [Exclude words field]                   │
   │                                         │
   │ Work Location:                          │
   │ ☐ Remote  ☐ Hybrid  ☐ On-site         │
   │                                         │
   │ [Job posting age dropdown]             │
   │ [Search Button]                         │
   └─────────────────────────────────────────┘
   ```

### ✅ Key Differences from Before

**BEFORE (old version):**
- Work location: Only ONE checkbox could be selected (exclusive)
- No profile section
- No divider

**AFTER (new version):**
- Work location: MULTIPLE checkboxes can be selected (inclusive)
- Profile Manager section at the top
- "OR" divider between sections
- Quick Search is collapsible

---

## Quick Test Steps

### Test 1: Multiple Work Locations
1. In Quick Search, check **Remote** checkbox
2. Also check **Hybrid** checkbox
3. Both should stay checked (this is NEW!)
4. Click Search
5. You should get jobs that are Remote OR Hybrid

### Test 2: Create a Profile
1. Click **"+ New Profile"** button
2. A dialog should open
3. Fill in:
   - Name: "Test Profile"
   - Add keyword: "developer" (press Enter)
   - Location: "Remote"
   - Check: Remote + Hybrid
4. Click "Save Profile"
5. Profile should appear in the list

### Test 3: Verify Persistence
1. Refresh the page (F5)
2. Your profile should still be there
3. This proves localStorage is working

---

## Troubleshooting

### Still seeing the old UI?

**Check 1: Browser cache**
```bash
# Hard refresh in browser
Mac: Cmd + Shift + R
Windows: Ctrl + Shift + R
```

**Check 2: Correct port**
```bash
# Check what port the server is on
lsof -ti:5173 && echo "Using 5173" || echo "Not 5173"
lsof -ti:5174 && echo "Using 5174" || echo "Not 5174"
```

**Check 3: Console errors**
- Open browser DevTools (F12)
- Go to Console tab
- Look for any red errors
- If you see "ProfileManager not found" or similar, the import failed

**Check 4: Verify files exist**
```bash
cd /Users/aliakinfenwa/linkedIn-JobFinder
ls -la src/components/ProfileManager.jsx
```

### Backend also needs restart

If you modified backend files:
```bash
cd /Users/aliakinfenwa/linkedIn-JobFinder/backend
# Kill old backend
lsof -ti:8000 | xargs kill -9

# Start fresh
source venv/bin/activate
python main.py
```

---

## Visual Comparison

### Old UI Structure:
```
┌──────────────────────────┐
│ Keyword                  │
│ Location                 │
│ Exclude words            │
│ ○ Remote  ○ Hybrid       │  ← Only ONE selectable
│ [Search]                 │
└──────────────────────────┘
```

### New UI Structure:
```
┌──────────────────────────┐
│ Search Profiles          │
│ [+ New Profile]          │
│ (profile list here)      │
└──────────────────────────┘

────────── OR ──────────

┌──────────────────────────┐
│ Quick Search    [Hide]   │
│ Keyword                  │
│ Location                 │
│ Exclude words            │
│ ☐ Remote ☐ Hybrid        │  ← MULTIPLE selectable
│ [Search]                 │
└──────────────────────────┘
```

---

## Still Not Working?

If after restarting you still see the old UI:

1. **Check the file was actually updated:**
   ```bash
   head -20 /Users/aliakinfenwa/linkedIn-JobFinder/src/components/JobSearchForm.jsx
   ```
   Should show `import ProfileManager from "./ProfileManager";` on line 18

2. **Check for build errors:**
   ```bash
   cd /Users/aliakinfenwa/linkedIn-JobFinder
   npm run build
   ```
   Should complete without errors

3. **Try a different browser:**
   - Open in incognito/private mode
   - This eliminates cache issues

4. **Check you're in the right project directory:**
   ```bash
   pwd
   # Should output: /Users/aliakinfenwa/linkedIn-JobFinder
   ```

---

## Next Steps After Confirming UI

Once you see the new UI:
1. Read [USER_GUIDE.md](USER_GUIDE.md) for usage instructions
2. Create a test profile
3. Try searching with multiple work locations
4. Check browser console for any errors
5. Report back any issues found

---

## Contact

If you're still having issues, share:
- Screenshot of what you see
- Browser console output (F12 → Console tab)
- Output of: `lsof -ti:5173 && echo "5173 active"`
- Output of: `head -20 src/components/JobSearchForm.jsx`
