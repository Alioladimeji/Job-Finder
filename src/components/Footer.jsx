import { Box, Container, IconButton, Typography } from '@mui/material'
import React from 'react'

const Footer = () => {
  return (
    <Box component='footer' sx={{ borderTop: 3, borderColor: 'divider', mt: 6, py: 3 }}>
    <Container maxWidth='lg' sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant='body2' color='text.secondary'>
        © {new Date().getFullYear()} Sebastian Luna | JobFinder
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton component='a' href={'https://github.com/SebastianLunar/'} target='_blank' rel='noopener noreferrer' color='inherit' aria-label='GitHub'>
          <Box component='svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' sx={{ width: 24, height: 24, fill: 'currentColor' }}>
            <path d='M12 .5C5.73.5.98 5.25.98 11.52c0 4.86 3.15 8.98 7.51 10.43.55.1.75-.24.75-.54 0-.27-.01-1.15-.02-2.08-3.06.66-3.71-1.31-3.71-1.31-.5-1.28-1.22-1.62-1.22-1.62-.99-.67.08-.66.08-.66 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.54 1.18 3.16.9.1-.7.38-1.18.7-1.45-2.44-.28-5.01-1.22-5.01-5.41 0-1.2.43-2.17 1.13-2.94-.11-.28-.49-1.42.11-2.95 0 0 .93-.3 3.05 1.12.88-.24 1.82-.36 2.76-.36.94 0 1.88.12 2.76.36 2.12-1.42 3.05-1.12 3.05-1.12.6 1.53.22 2.67.11 2.95.7.77 1.13 1.74 1.13 2.94 0 4.2-2.57 5.12-5.02 5.39.39.34.74 1.01.74 2.04 0 1.47-.01 2.65-.01 3.01 0 .3.2.64.76.53 4.35-1.45 7.5-5.57 7.5-10.43C23.02 5.25 18.27.5 12 .5z'/>
          </Box>
        </IconButton>
        <IconButton component='a' href={'https://www.linkedin.com/in/dev-sebaslunar/'} target='_blank' rel='noopener noreferrer' color='inherit' aria-label='LinkedIn'>
          <Box component='svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' sx={{ width: 24, height: 24, fill: 'currentColor' }}>
            <path d='M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.34 18.34H6.16V10.5h2.18v7.84zM7.25 9.47a1.26 1.26 0 1 1 0-2.52 1.26 1.26 0 0 1 0 2.52zM18.34 18.34h-2.17v-3.84c0-.92-.02-2.1-1.28-2.1-1.28 0-1.47.99-1.47 2.03v3.91h-2.17V10.5h2.08v1.07h.03c.29-.55 1-1.13 2.06-1.13 2.2 0 2.6 1.45 2.6 3.33v4.57z'/>
          </Box>
        </IconButton>
      </Box>
    </Container>
  </Box>
  )
}

export default Footer