import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
  IconButton,
  Box,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";

function JobCard({ job, onToggleSave, isSaved }) {
  const saved = isSaved ? isSaved(job) : false;

  const handleToggle = (e) => {
    // Prevenir abrir el enlace del CardActionArea
    e.preventDefault();
    e.stopPropagation();
    onToggleSave && onToggleSave(job);
  };

  // Determine which profiles matched this job
  const matchedProfiles = job.matchedProfiles || (job.profileName ? [job.profileName] : null);

  return (
    <Card sx={{ position: "relative" }}>
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <Tooltip title={saved ? "Remove from saved" : "Save job"}>
          <IconButton size="small" color={saved ? "primary" : "default"} onClick={handleToggle} aria-label="save job">
            {/* Bookmark icon inline SVG */}
            <Box
              component="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              sx={{ width: 20, height: 20, fill: "currentColor" }}
            >
              {saved ? (
                <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2z" />
              ) : (
                <path d="M6 2h12a2 2 0 0 1 2 2v18l-8-4-8 4V4a2 2 0 0 1 2-2zm0 2v14.764l6-3 6 3V4H6z" />
              )}
            </Box>
          </IconButton>
        </Tooltip>
      </Box>

      <CardActionArea
        component="a"
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardContent>
          <Typography variant="h6" component="div">
            {job.title}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {job.company}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: matchedProfiles ? 1 : 0,
            }}
          >
            {job.description}
          </Typography>

          {/* Show matched profiles if available */}
          {matchedProfiles && matchedProfiles.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                {matchedProfiles.map((profileName, idx) => (
                  <Chip
                    key={idx}
                    label={profileName}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: "0.7rem", height: 20 }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default JobCard;
