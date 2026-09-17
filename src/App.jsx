import { useState, useMemo, useEffect } from 'react'
import { AppBar, Toolbar, IconButton, Container, Typography, Box, CssBaseline, Snackbar, Alert, Grid, Drawer, Badge, Divider } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import JobSearchForm from './components/JobSearchForm'
import JobList from './components/JobList'
import SavedJobs from './components/SavedJobs'
import Footer from './components/Footer'

function App () {
  const [jobs, setJobs] = useState([])
  const [mode, setMode] = useState('dark')
  const [errorMessage, setErrorMessage] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState('')
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('savedJobs') : null
      const parsed = raw ? JSON.parse(raw) : []
      // Normalizar: si vienen strings (ids), convertir a objetos mínimos
      if (Array.isArray(parsed) && (parsed[0] == null || typeof parsed[0] === 'string')) {
        return parsed.filter(Boolean).map((id) => ({ id }))
      }
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [savedOpen, setSavedOpen] = useState(false)

  // Cargar preferencia guardada o usar preferencia del sistema en el primer render
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('themeMode') : null
    if (saved === 'light' || saved === 'dark') {
      setMode(saved)
    } else if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setMode(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // Persistir preferencia cuando cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeMode', mode)
    }
  }, [mode])

  // Persistir empleos guardados
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs))
    }
  }, [savedJobs])

  // Hidratar guardados con datos completos cuando haya nuevos resultados
  useEffect(() => {
    if (!jobs || jobs.length === 0) return
    const jobMap = new Map(
      jobs.map((j) => [(j?.link || j?.id || ''), j]).filter(([k]) => !!k)
    )
    setSavedJobs((prev) =>
      prev.map((s) => {
        const id = getJobId(s)
        // Si hay un job completo con el mismo id, reemplazar
        return id && jobMap.has(id) ? jobMap.get(id) : s
      })
    )
  }, [jobs])

  const getJobId = (job) => job?.link || job?.id || ''

  const isJobSaved = (job) => {
    const id = getJobId(job)
    return !!id && savedJobs.some((j) => getJobId(j) === id)
  }

  const toggleSaveJob = (job) => {
    const id = getJobId(job)
    if (!id) return
    setSavedJobs((prev) => {
      const exists = prev.some((j) => getJobId(j) === id)
      if (exists) return prev.filter((j) => getJobId(j) !== id)
      return [...prev, job]
    })
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#0A66C2' },
          secondary: { main: '#004182' },
          ...(mode === 'light'
            ? {
                background: { default: '#F5F7FA', paper: '#FFFFFF' },
                text: { primary: '#1D2226', secondary: '#5E6B75' }
              }
            : {
                background: { default: '#0B0F14', paper: '#10161B' },
                text: { primary: '#E6EDF3', secondary: '#9BA8B5' }
              })
        },
        shape: { borderRadius: 12 },
        typography: {
          h4: { fontWeight: 700 },
          subtitle1: { fontWeight: 500 },
          button: { textTransform: 'none', fontWeight: 600 }
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundImage:
                  mode === 'light'
                    ? 'radial-gradient(1000px 600px at -10% -10%, rgba(10,102,194,0.06) 0%, rgba(10,102,194,0) 70%), radial-gradient(800px 500px at 120% -20%, rgba(0,65,130,0.05) 0%, rgba(0,65,130,0) 70%)'
                    : 'none'
              }
            }
          },
          MuiButton: {
            defaultProps: { variant: 'contained', disableElevation: true },
            styleOverrides: {
              root: { borderRadius: 10 },
              containedPrimary: {
                backgroundColor: '#0A66C2',
                '&:hover': { backgroundColor: '#084E94' }
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                transition: 'box-shadow .2s ease, transform .2s ease',
                borderColor: 'rgba(10,102,194,0.18)',
                '&:hover': {
                  boxShadow:
                    '0 6px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(10,102,194,0.12)',
                  transform: 'translateY(-2px)'
                }
              }
            }
          },
          MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
          MuiTextField: { defaultProps: { size: 'medium' } }
        }
      }),
    [mode]
  )

  const handleSearch = async filters => {
    try {
      console.log('Searching with filters:', filters);
      const res = await fetch('http://localhost:8000/api/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      })

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${res.status}: ${errorText}`)
      }

      const data = await res.json()
      console.log('Received data:', data);

      if (data.no_results) {
        setJobs([])
        setNoResultsMessage(data.message || 'No results found')
        setErrorMessage('')
      } else {
        setJobs(data.results || data || [])
        setNoResultsMessage('')
        setErrorMessage('')
      }
    } catch (err) {
      console.error('Error searching:', err)
      setErrorMessage('There was a problem performing the search. Make sure the backend is running on port 8000.')
      setJobs([])
      setNoResultsMessage('')
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AppBar position='sticky' color='default' elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Toolbar>
            <Typography variant='h6' sx={{ flexGrow: 1, fontWeight: 700 }}>
              JobFinder
            </Typography>
            <IconButton color='inherit' onClick={() => setSavedOpen(true)} aria-label='View saved jobs' sx={{ mr: 1 }}>
              <Badge color='primary' badgeContent={savedJobs.length} overlap='rectangular'>
                {/* Bookmark list icon */}
                <Box component='svg' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' sx={{ width: 22, height: 22, fill: 'currentColor' }}>
                  <path d='M6 2h10a2 2 0 0 1 2 2v15l-7-3-7 3V4a2 2 0 0 1 2-2zm2 5h6v2H8V7zm0 4h6v2H8v-2z' />
                </Box>
              </Badge>
            </IconButton>
            <IconButton color='inherit' onClick={() => setMode(prev => (prev === 'light' ? 'dark' : 'light'))} aria-label='Toggle theme'>
              <span role='img' aria-label={mode === 'light' ? 'Switch to dark' : 'Switch to light'}>
                {mode === 'light' ? '🌙' : '☀️'}
              </span>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component='main' sx={{ flexGrow: 1 }}>
          <Container maxWidth='lg' sx={{ py: 4 }}>
            <Grid container spacing={12} alignItems='center'>
              <Grid item xs={12} md={8}>
                <Box
                  component='img'
                  src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop'
                  alt='Personas trabajando y buscando empleo'
                  sx={{ width: '100%', height: { xs: 220, md: 380 }, objectFit: 'cover', borderRadius: 2, boxShadow: 1 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 2 }}>
                  <Typography variant='h4'>Job Search</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Apply custom filters and exclude keywords
                  </Typography>
                </Box>

                <JobSearchForm onSearch={handleSearch} />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <JobList jobs={jobs} message={noResultsMessage} onToggleSave={toggleSaveJob} isSaved={isJobSaved} />
            </Box>

            {/* Saved list is accessible from AppBar Drawer */}

            {/* Snackbar para errores */}
            <Snackbar
              open={!!errorMessage}
              autoHideDuration={4000}
              onClose={() => setErrorMessage('')}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity='error' onClose={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            </Snackbar>
          </Container>
        </Box>

        <Footer />
      </Box>

      {/* Drawer for Saved Jobs */}
      <Drawer anchor='right' open={savedOpen} onClose={() => setSavedOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, p: 2 } }}>
        <Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>Saved Jobs</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>Jobs you bookmarked</Typography>
        <Divider sx={{ mb: 2 }} />
        <SavedJobs items={savedJobs} onToggleSave={toggleSaveJob} isSaved={isJobSaved} />
      </Drawer>
    </ThemeProvider>
  )
}

export default App
