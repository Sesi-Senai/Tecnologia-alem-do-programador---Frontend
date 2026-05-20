import { useState } from 'react'
import { Alert, Button, CircularProgress, TextField } from '@mui/material'
import { AuthLayout } from '../components/AuthLayout'
import { CampoSenha } from '../components/CampoSenha'
import { ApiError, loginUsuario } from '../services/api'

type LoginPageProps = {
  onIrParaCadastro: () => void
}

type ErrosLogin = {
  email?: string
  senha?: string
}

export function LoginPage({ onIrParaCadastro }: LoginPageProps) {
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
      await loginUsuario({ email, senha })
      setEmail('')
      setSenha('')
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
    <AuthLayout titulo="Login">
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
          type="button"
          fullWidth
          variant="text"
          disabled={carregando}
          sx={{ mt: 2 }}
          onClick={onIrParaCadastro}
        >
          Registrar-se
        </Button>
      </form>
    </AuthLayout>
  )
}
