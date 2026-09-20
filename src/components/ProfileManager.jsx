import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Chip,
  Stack,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Alert,
} from "@mui/material";

function ProfileManager({ profiles, onSaveProfile, onDeleteProfile, onSelectProfile, selectedProfileIds }) {
  const [editingProfile, setEditingProfile] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const createNewProfile = () => {
    setEditingProfile({
      id: Date.now().toString(),
      name: "",
      includeKeywords: [],
      excludeKeywords: [],
      location: "",
      workLocations: [],
      postingAge: "",
    });
    setShowDialog(true);
  };

  const editProfile = (profile) => {
    setEditingProfile({ ...profile });
    setShowDialog(true);
  };

  const duplicateProfile = (profile) => {
    setEditingProfile({
      ...profile,
      id: Date.now().toString(),
      name: `${profile.name} (Copy)`,
    });
    setShowDialog(true);
  };

  const handleSaveProfile = () => {
    if (!editingProfile.name.trim()) {
      alert("Profile name is required");
      return;
    }
    if (editingProfile.includeKeywords.length === 0) {
      alert("At least one include keyword is required");
      return;
    }
    onSaveProfile(editingProfile);
    setShowDialog(false);
    setEditingProfile(null);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingProfile(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Search Profiles</Typography>
        <Button onClick={createNewProfile} variant="contained" size="small">
          + New Profile
        </Button>
      </Box>

      {profiles.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No profiles yet. Create your first profile to save search configurations.
        </Alert>
      ) : (
        <List sx={{ bgcolor: "background.paper", borderRadius: 1, mb: 2 }}>
          {profiles.map((profile, idx) => (
            <React.Fragment key={profile.id}>
              {idx > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => duplicateProfile(profile)} size="small" title="Duplicate">
                      <Box component="span" sx={{ fontSize: 16 }}>📋</Box>
                    </IconButton>
                    <IconButton edge="end" onClick={() => editProfile(profile)} size="small" title="Edit" sx={{ ml: 1 }}>
                      <Box component="span" sx={{ fontSize: 16 }}>✏️</Box>
                    </IconButton>
                    <IconButton edge="end" onClick={() => onDeleteProfile(profile.id)} size="small" title="Delete" sx={{ ml: 1 }}>
                      <Box component="span" sx={{ fontSize: 16 }}>🗑️</Box>
                    </IconButton>
                  </Box>
                }
                disablePadding
              >
                <ListItemButton
                  onClick={() => onSelectProfile(profile.id)}
                  sx={{ pr: 12 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedProfileIds.includes(profile.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => onSelectProfile(profile.id)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="subtitle1">{profile.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {profile.includeKeywords.length} keyword(s), {profile.excludeKeywords.length} exclusion(s)
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Profile Editor Dialog */}
      <Dialog open={showDialog} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProfile?.id && profiles.find(p => p.id === editingProfile.id) ? "Edit Profile" : "New Profile"}</DialogTitle>
        <DialogContent>
          {editingProfile && (
            <ProfileEditor
              profile={editingProfile}
              onChange={setEditingProfile}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">Save Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ProfileEditor({ profile, onChange }) {
  const [keywordInput, setKeywordInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");

  const addKeyword = () => {
    if (!keywordInput.trim()) return;
    const keywords = keywordInput
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    onChange({
      ...profile,
      includeKeywords: Array.from(new Set([...profile.includeKeywords, ...keywords])),
    });
    setKeywordInput("");
  };

  const removeKeyword = (keyword) => {
    onChange({
      ...profile,
      includeKeywords: profile.includeKeywords.filter((k) => k !== keyword),
    });
  };

  const addExclusion = () => {
    if (!excludeInput.trim()) return;
    const exclusions = excludeInput
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    onChange({
      ...profile,
      excludeKeywords: Array.from(new Set([...profile.excludeKeywords, ...exclusions])),
    });
    setExcludeInput("");
  };

  const removeExclusion = (exclusion) => {
    onChange({
      ...profile,
      excludeKeywords: profile.excludeKeywords.filter((e) => e !== exclusion),
    });
  };

  const handleWorkLocationChange = (location) => {
    const current = profile.workLocations || [];
    const updated = current.includes(location)
      ? current.filter((l) => l !== location)
      : [...current, location];
    onChange({ ...profile, workLocations: updated });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
      <TextField
        label="Profile Name"
        value={profile.name}
        onChange={(e) => onChange({ ...profile, name: e.target.value })}
        fullWidth
        required
      />

      {/* Include Keywords */}
      <Box>
        <TextField
          label="Include keywords (press Enter or comma to add)"
          placeholder="e.g. DevOps Engineer, Terraform, AWS"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addKeyword();
            }
          }}
          onBlur={addKeyword}
          fullWidth
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
          {profile.includeKeywords.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No keywords added
            </Typography>
          ) : (
            profile.includeKeywords.map((keyword) => (
              <Chip
                key={keyword}
                label={keyword}
                onDelete={() => removeKeyword(keyword)}
                size="small"
                color="primary"
              />
            ))
          )}
        </Stack>
      </Box>

      {/* Exclude Keywords */}
      <Box>
        <TextField
          label="Exclude keywords (press Enter or comma to add)"
          placeholder="e.g. senior, lead, principal"
          value={excludeInput}
          onChange={(e) => setExcludeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addExclusion();
            }
          }}
          onBlur={addExclusion}
          fullWidth
        />
        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 1 }}>
          {profile.excludeKeywords.length === 0 ? (
            <Typography variant="caption" color="text.secondary">
              No exclusions added
            </Typography>
          ) : (
            profile.excludeKeywords.map((exclusion) => (
              <Chip
                key={exclusion}
                label={exclusion}
                onDelete={() => removeExclusion(exclusion)}
                size="small"
                color="error"
              />
            ))
          )}
        </Stack>
      </Box>

      <TextField
        label="Location"
        value={profile.location}
        onChange={(e) => onChange({ ...profile, location: e.target.value })}
        fullWidth
      />

      {/* Work Location (multiple selection) */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Work Location
        </Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={profile.workLocations.includes("remoto")}
                onChange={() => handleWorkLocationChange("remoto")}
              />
            }
            label="Remote"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={profile.workLocations.includes("hibrido")}
                onChange={() => handleWorkLocationChange("hibrido")}
              />
            }
            label="Hybrid"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={profile.workLocations.includes("presencial")}
                onChange={() => handleWorkLocationChange("presencial")}
              />
            }
            label="On-site"
          />
        </FormGroup>
      </Box>

      <FormControl fullWidth>
        <InputLabel>Job posting age</InputLabel>
        <Select
          value={profile.postingAge}
          label="Job posting age"
          onChange={(e) => onChange({ ...profile, postingAge: e.target.value })}
        >
          <MenuItem value="">No filter</MenuItem>
          <MenuItem value="1h">Last hour</MenuItem>
          <MenuItem value="2h">Last 2 hours</MenuItem>
          <MenuItem value="6h">Last 6 hours</MenuItem>
          <MenuItem value="12h">Last 12 hours</MenuItem>
          <MenuItem value="24h">Last 24 hours</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default ProfileManager;
