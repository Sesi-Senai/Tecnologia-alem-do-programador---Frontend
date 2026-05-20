import { useState } from 'react'
import { Alert, Button, CircularProgress, TextField } from '@mui/material'
import { AuthLayout } from '../components/AuthLayout'
import { CampoSenha } from '../components/CampoSenha'
import { ApiError, cadastrarUsuario } from '../services/api'
import { mascaraCpf } from '../utils/mascaraCpf'

type RegisterPageProps = {
  onVoltarLogin: () => void
  onCadastroSucesso: () => void
}

type ErrosCadastro = {
  nome?: string
  email?: string
  cpf?: string
  senha?: string
  confirmarSenha?: string
}

function validarCadastro(
  nome: string,
  email: string,
  cpf: string,
  senha: string,
  confirmarSenha: string,
): ErrosCadastro {
  const erros: ErrosCadastro = {}

  if (!nome.trim()) {
    erros.nome = 'Preencha o nome'
  }

  if (!email.trim()) {
    erros.email = 'Preencha o e-mail'
  }

  if (!cpf.trim()) {
    erros.cpf = 'Preencha o CPF'
  } else if (cpf.replace(/\D/g, '').length !== 11) {
    erros.cpf = 'CPF incompleto'
  }

  if (!senha) {
    erros.senha = 'Preencha a senha'
  }

  if (!confirmarSenha) {
    erros.confirmarSenha = 'Confirme a senha'
  } else if (senha !== confirmarSenha) {
    erros.confirmarSenha = 'As senhas não coincidem'
  }

  return erros
}

export function RegisterPage({ onVoltarLogin, onCadastroSucesso }: RegisterPageProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erros, setErros] = useState<ErrosCadastro>({})
  const [erroApi, setErroApi] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setErroApi('')

    const errosValidacao = validarCadastro(nome, email, cpf, senha, confirmarSenha)
    setErros(errosValidacao)

    if (Object.keys(errosValidacao).length > 0) {
      return
    }

    setCarregando(true)
    try {
      await cadastrarUsuario({
        nome,
        email,
        cpf,
        senha,
        confirmarSenha,
      })
      onCadastroSucesso()
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
    <AuthLayout titulo="Cadastro">
      <form onSubmit={handleCadastro} noValidate>
        {erroApi && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erroApi}
          </Alert>
        )}

        {Object.keys(erros).length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Verifique os campos destacados abaixo.
          </Alert>
        )}

        <TextField
          fullWidth
          label="Nome"
          variant="outlined"
          margin="normal"
          value={nome}
          disabled={carregando}
          onChange={(e) => {
            setNome(e.target.value)
            if (erros.nome) setErros((prev) => ({ ...prev, nome: undefined }))
          }}
          error={Boolean(erros.nome)}
          helperText={erros.nome}
        />

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

        <TextField
          fullWidth
          label="CPF"
          name="cpf"
          id="cpf"
          variant="outlined"
          margin="normal"
          value={cpf}
          disabled={carregando}
          onChange={(e) => {
            setCpf(mascaraCpf(e.target.value))
            if (erros.cpf) setErros((prev) => ({ ...prev, cpf: undefined }))
          }}
          placeholder="000.000.000-00"
          error={Boolean(erros.cpf)}
          helperText={erros.cpf}
          slotProps={{
            htmlInput: {
              maxLength: 14,
              inputMode: 'numeric',
            },
          }}
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

        <CampoSenha
          label="Confirmar senha"
          value={confirmarSenha}
          disabled={carregando}
          onChange={(valor) => {
            setConfirmarSenha(valor)
            if (erros.confirmarSenha) {
              setErros((prev) => ({ ...prev, confirmarSenha: undefined }))
            }
          }}
          error={Boolean(erros.confirmarSenha)}
          helperText={erros.confirmarSenha}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={carregando}
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
        >
          {carregando ? <CircularProgress size={26} color="inherit" /> : 'Cadastrar'}
        </Button>

        <Button
          type="button"
          fullWidth
          variant="text"
          disabled={carregando}
          sx={{ mt: 2 }}
          onClick={onVoltarLogin}
        >
          Já tenho conta
        </Button>
      </form>
    </AuthLayout>
  )
}
