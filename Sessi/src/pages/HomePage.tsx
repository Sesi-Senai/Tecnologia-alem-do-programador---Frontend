import { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material'
import { ApiError, buscarUsuarioPorId, type UsuarioResposta } from '../services/api'

export function HomePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const id = params.get('id')

  const [usuario, setUsuario] = useState<UsuarioResposta | null>(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!id) {
      navigate('/login', { replace: true })
      return
    }

    setCarregando(true)
    setErro('')

    buscarUsuarioPorId(id)
      .then((resposta) => setUsuario(resposta.usuario ?? null))
      .catch((erro) => {
        const mensagem =
          erro instanceof ApiError
            ? erro.message
            : 'Não foi possível carregar o usuário.'
        setErro(mensagem)
      })
      .finally(() => setCarregando(false))
  }, [id, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Card sx={{ width: 400, borderRadius: 4, boxShadow: 10, p: 2 }}>
        <CardContent>
          <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}>
            Home
          </Typography>

          {carregando && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          {!carregando && usuario && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ID na URL: <strong>{id}</strong>
              </Typography>
              <Typography sx={{ mb: 0.5 }}>Nome: {usuario.nome}</Typography>
              <Typography sx={{ mb: 0.5 }}>E-mail: {usuario.email}</Typography>
              <Typography sx={{ mb: 0.5 }}>CPF: {usuario.cpf}</Typography>
              <Typography sx={{ mb: 2 }}>Moedas: {usuario.moedas ?? 0}</Typography>
            </>
          )}

          <Button
            component={RouterLink}
            to="/login"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
          >
            Sair
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
