import React from 'react'
import { Grid, Typography, Alert } from '@mui/material'
import JobCard from './JobCard'

const SavedJobs = ({ items = [], onToggleSave, isSaved }) => {
  if (!items || items.length === 0) {
    return (
      <Alert severity='info'>
        You haven't saved any jobs yet. Use the bookmark icon on each card to save them.
      </Alert>
    )
  }

  return (
    <>
      <Typography variant='h6' sx={{ mb: 2 }}>
        Saved Jobs ({items.length})
      </Typography>
      <Grid container spacing={2}>
        {items.map((job, idx) => (
          <Grid item xs={12} md={6} lg={4} key={(job.link || job.id || idx) + '-saved'}>
            <JobCard job={job} onToggleSave={onToggleSave} isSaved={isSaved} />
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default SavedJobs