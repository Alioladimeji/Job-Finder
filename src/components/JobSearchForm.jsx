import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Chip,
  Typography,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import ProfileManager from "./ProfileManager";

function JobSearchForm({ onSearch }) {
  // Load profiles from localStorage
  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem("searchProfiles");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProfileIds, setSelectedProfileIds] = useState([]);
  const [showQuickSearch, setShowQuickSearch] = useState(true);

  // Quick search state (non-profile mode)
  const [keyword, setKeyword] = useState("python");
  const [location, setLocation] = useState("Mexico");
  const [workLocations, setWorkLocations] = useState([]);
  const [timeFilter, setTimeFilter] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [exclusions, setExclusions] = useState([]);

  // Persist profiles to localStorage
  useEffect(() => {
    localStorage.setItem("searchProfiles", JSON.stringify(profiles));
  }, [profiles]);

  // Migrate existing search settings to default profile on first load
  useEffect(() => {
    const migrated = localStorage.getItem("profilesMigrated");
    if (!migrated && profiles.length === 0) {
      const defaultProfile = {
        id: Date.now().toString(),
        name: "Default Search",
        includeKeywords: [keyword],
        excludeKeywords: exclusions,
        location: location,
        workLocations: workLocations,
        postingAge: timeFilter,
      };
      setProfiles([defaultProfile]);
      localStorage.setItem("profilesMigrated", "true");
    }
  }, []);

  const handleSaveProfile = (profile) => {
    const exists = profiles.find((p) => p.id === profile.id);
    if (exists) {
      setProfiles(profiles.map((p) => (p.id === profile.id ? profile : p)));
    } else {
      setProfiles([...profiles, profile]);
    }
  };

  const handleDeleteProfile = (profileId) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      setProfiles(profiles.filter((p) => p.id !== profileId));
      setSelectedProfileIds(selectedProfileIds.filter((id) => id !== profileId));
    }
  };

  const handleSelectProfile = (profileId) => {
    setSelectedProfileIds((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleWorkLocationChange = (location) => {
    setWorkLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const addExclusionsFromInput = () => {
    if (!excludeInput) return;
    const parts = excludeInput
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const next = Array.from(new Set([...exclusions, ...parts]));
    setExclusions(next);
    setExcludeInput("");
  };

  const handleKeyDownExclude = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addExclusionsFromInput();
    }
  };

  const handleDeleteChip = (chipToDelete) => {
    setExclusions((prev) => prev.filter((c) => c !== chipToDelete));
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    onSearch({
      keyword: keyword.trim(),
      location: location.trim(),
      exclude: exclusions,
      modalities: workLocations,
      time_filter: timeFilter,
    });
  };

  const handleProfileSearch = async () => {
    if (selectedProfileIds.length === 0) {
      alert("Please select at least one profile to search");
      return;
    }

    const selectedProfiles = profiles.filter((p) =>
      selectedProfileIds.includes(p.id)
    );

    if (selectedProfiles.length === 1) {
      // Single profile search
      const profile = selectedProfiles[0];
      const combinedKeywords = profile.includeKeywords.join(" OR ");
      onSearch({
        keyword: combinedKeywords,
        location: profile.location,
        exclude: profile.excludeKeywords,
        modalities: profile.workLocations,
        time_filter: profile.postingAge,
        profileName: profile.name,
      });
    } else {
      // Multiple profile search
      onSearch({
        multipleProfiles: selectedProfiles,
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Profile Manager Section */}
      <Box>
        <ProfileManager
          profiles={profiles}
          onSaveProfile={handleSaveProfile}
          onDeleteProfile={handleDeleteProfile}
          onSelectProfile={handleSelectProfile}
          selectedProfileIds={selectedProfileIds}
        />

        {selectedProfileIds.length > 0 && (
          <Button
            onClick={handleProfileSearch}
            variant="contained"
            fullWidth
            size="large"
          >
            Search {selectedProfileIds.length} Selected Profile{selectedProfileIds.length > 1 ? "s" : ""}
          </Button>
        )}
      </Box>

      <Divider>OR</Divider>

      {/* Quick Search Section */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Quick Search</Typography>
          <Button
            size="small"
            onClick={() => setShowQuickSearch(!showQuickSearch)}
          >
            {showQuickSearch ? "Hide" : "Show"}
          </Button>
        </Box>

        {showQuickSearch && (
          <Box
            component="form"
            onSubmit={handleQuickSearch}
            sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr" }}
          >
            <TextField
              label="Keyword"
              name="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              fullWidth
            />

            <TextField
              label="Location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />

            {/* Exclusions with chips */}
            <Box>
              <TextField
                label="Exclude words (press Enter or , to add)"
                placeholder="e.g: senior, 5+ years, angular"
                value={excludeInput}
                onChange={(e) => setExcludeInput(e.target.value)}
                onKeyDown={handleKeyDownExclude}
                onBlur={addExclusionsFromInput}
                fullWidth
              />

              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}
              >
                {exclusions.length === 0 ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    No exclusions added
                  </Typography>
                ) : (
                  exclusions.map((ex) => (
                    <Chip
                      key={ex}
                      label={ex}
                      onDelete={() => handleDeleteChip(ex)}
                      sx={{ maxWidth: 240 }}
                    />
                  ))
                )}
              </Stack>
            </Box>

            {/* Work Modality - Multiple Selection */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Work Location
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={workLocations.includes("remoto")}
                      onChange={() => handleWorkLocationChange("remoto")}
                      name="remoto"
                    />
                  }
                  label="Remote"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={workLocations.includes("hibrido")}
                      onChange={() => handleWorkLocationChange("hibrido")}
                      name="hibrido"
                    />
                  }
                  label="Hybrid"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={workLocations.includes("presencial")}
                      onChange={() => handleWorkLocationChange("presencial")}
                      name="presencial"
                    />
                  }
                  label="On-site"
                />
              </FormGroup>
            </Box>

            {/* Time filter */}
            <FormControl fullWidth>
              <InputLabel>Job posting age</InputLabel>
              <Select
                value={timeFilter}
                label="Job posting age"
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <MenuItem value="">No filter</MenuItem>
                <MenuItem value="1h">Last hour</MenuItem>
                <MenuItem value="2h">Last 2 hours</MenuItem>
                <MenuItem value="6h">Last 6 hours</MenuItem>
                <MenuItem value="12h">Last 12 hours</MenuItem>
                <MenuItem value="24h">Last 24 hours</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained">
              Search
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default JobSearchForm;
