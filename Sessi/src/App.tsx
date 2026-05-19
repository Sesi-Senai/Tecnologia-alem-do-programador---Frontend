import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material'

function App() {
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    alert(`Nome: ${nome}\nSenha: ${senha}`)
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          boxShadow: 10,
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 'bold',
                }}
          >
             Login
            </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Nome"
              variant="outlined"
              margin="normal"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <TextField
              fullWidth
              label="Senha"
              type="password"
              variant="outlined"
              margin="normal"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Entrar
            </Button>

            <Button
              type="button"
              fullWidth
              variant="text"
              sx={{ mt: 2 }}
            >
              Registrar-se
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default App