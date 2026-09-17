import React, { useState } from "react";
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
} from "@mui/material";

function JobSearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState("python");
  const [location, setLocation] = useState("Mexico");

  // ✅ Modalidad
  const [modality, setModality] = useState({
    remoto: false,
    hibrido: false,
    presencial: false,
  });

  // ✅ Filtro de tiempo
  const [timeFilter, setTimeFilter] = useState("");

  // ✅ Exclusiones
  const [excludeInput, setExcludeInput] = useState("");
  const [exclusions, setExclusions] = useState([]);

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

  const handleModalityChange = (event) => {
    const { name, checked } = event.target;
    // seleccionar solo uno; si se desmarca, todos quedan en false
    if (checked) {
      setModality({ remoto: false, hibrido: false, presencial: false, [name]: true });
    } else {
      setModality({ remoto: false, hibrido: false, presencial: false });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch({
      keyword: keyword.trim(),
      location: location.trim(),
      exclude: exclusions,
      modality: Object.keys(modality).find((m) => modality[m]) || "",
      time_filter: timeFilter, // ej: "1h", "2h", etc.
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "grid", gap: 2, gridTemplateColumns: "1fr", mb: 2 }}
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

      {/* Work Modality */}
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={modality.remoto}
              onChange={handleModalityChange}
              name="remoto"
            />
          }
          label="Remote"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={modality.hibrido}
              onChange={handleModalityChange}
              name="hibrido"
            />
          }
          label="Hybrid"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={modality.presencial}
              onChange={handleModalityChange}
              name="presencial"
            />
          }
          label="On-site"
        />
      </FormGroup>

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
  );
}

export default JobSearchForm;
