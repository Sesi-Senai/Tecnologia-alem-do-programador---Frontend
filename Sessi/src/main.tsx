import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      paper: '#ffffff',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #ffffff inset',
            WebkitTextFillColor: 'inherit',
            caretColor: 'inherit',
            transition: 'background-color 99999s ease-out',
          },
          '&:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 100px #ffffff inset',
          },
          '&:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 100px #ffffff inset',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)