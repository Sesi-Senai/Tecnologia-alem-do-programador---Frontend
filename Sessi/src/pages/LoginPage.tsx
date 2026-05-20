import { useState } from 'react'
import { Alert, Button, TextField } from '@mui/material'
import { AuthLayout } from '../components/AuthLayout'
import { CampoSenha } from '../components/CampoSenha'

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

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    const novosErros: ErrosLogin = {}
    if (!email.trim()) novosErros.email = 'Preencha o e-mail'
    if (!senha) novosErros.senha = 'Preencha a senha'

    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    alert(`Email: ${email}\nSenha: ${senha}`)
  }

  return (
    <AuthLayout titulo="Login">
      <form onSubmit={handleLogin} noValidate>
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
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
        >
          Entrar
        </Button>

        <Button
          type="button"
          fullWidth
          variant="text"
          sx={{ mt: 2 }}
          onClick={onIrParaCadastro}
        >
          Registrar-se
        </Button>
      </form>
    </AuthLayout>
  )
}
