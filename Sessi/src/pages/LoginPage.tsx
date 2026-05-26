import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert, Button, CircularProgress, TextField } from '@mui/material'
import { AuthLayout } from '../components/AuthLayout'
import { CampoSenha } from '../components/CampoSenha'
import { ApiError, loginUsuario } from '../services/api'
import { salvarSessao } from '../services/auth'

type ErrosLogin = {
  email?: string
  senha?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState<ErrosLogin>({})
  const [erroApi, setErroApi] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErroApi('')

    const novosErros: ErrosLogin = {}
    if (!email.trim()) novosErros.email = 'Preencha o e-mail'
    if (!senha) novosErros.senha = 'Preencha a senha'

    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    setCarregando(true)
    try {
      const resposta = await loginUsuario({ email, senha })
      if (resposta.usuario?.id && resposta.token) {
        salvarSessao(resposta.token, resposta.usuario.id)
        navigate('/home', { replace: true })
      }
    } catch (erro) {
      const mensagem =
        erro instanceof ApiError
          ? erro.message
          : 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
      setErroApi(mensagem)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout titulo="Sesi" subtitulo="Login">
      <form onSubmit={handleLogin} noValidate>
        {erroApi && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erroApi}
          </Alert>
        )}

        {Object.keys(erros).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Preencha todos os campos para entrar.
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          disabled={carregando}
          onChange={(e) => {
            setEmail(e.target.value)
            if (erros.email) setErros((prev) => ({ ...prev, email: undefined }))
          }}
          error={Boolean(erros.email)}
          helperText={erros.email}
        />

        <CampoSenha
          label="Senha"
          value={senha}
          disabled={carregando}
          onChange={(valor) => {
            setSenha(valor)
            if (erros.senha) setErros((prev) => ({ ...prev, senha: undefined }))
          }}
          error={Boolean(erros.senha)}
          helperText={erros.senha}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={carregando}
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
        >
          {carregando ? <CircularProgress size={26} color="inherit" /> : 'Entrar'}
        </Button>

        <Button
          component={RouterLink}
          to="/cadastro"
          fullWidth
          variant="text"
          disabled={carregando}
          sx={{ mt: 2 }}
        >
          Registrar-se
        </Button>

      </form>
    </AuthLayout>
  )
}
