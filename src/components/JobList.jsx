import React from "react";
import { Grid, Typography, Alert } from "@mui/material";
import JobCard from "./JobCard";

function JobList({ jobs, message, onToggleSave, isSaved }) {
  if (message) {
    return (
      <Alert severity="info" sx={{ width: "100%" }}>
        {message}
      </Alert>
    );
  }

  if (jobs.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary">
        Perform a search to see available jobs.
      </Typography>
    );
  }

  // if (jobs.length === 0) {
  //   return (
  //     <Typography variant="body1" color="text.secondary">
  //       No se encontraron empleos. Intenta otra búsqueda.
  //     </Typography>
  //   );
  // }

  return (
    <Grid container spacing={2}>
      {jobs.map((job, idx) => (
        <Grid item xs={12} md={6} lg={4} key={idx}>
          <JobCard job={job} onToggleSave={onToggleSave} isSaved={isSaved} />
        </Grid>
      ))}
    </Grid>
  );
}

export default JobList;
