import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Alert, Button, CircularProgress, TextField } from '@mui/material'
import { AuthLayout } from '../components/AuthLayout'
import { CampoSenha } from '../components/CampoSenha'
import { ApiError, cadastrarUsuario } from '../services/api'
import { mascaraCpf } from '../utils/mascaraCpf'
import { validarCpf } from '../utils/validarCpf'

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
  } else if (!email.includes('@')) {
    erros.email = 'E-mail deve conter @'
  }

  const resultadoCpf = validarCpf(cpf)
  if (!resultadoCpf.ok) {
    erros.cpf = resultadoCpf.mensagem
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

export function RegisterPage() {
  const navigate = useNavigate()
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

    const cpfValidado = validarCpf(cpf)
    if (!cpfValidado.ok) {
      setErros({ cpf: cpfValidado.mensagem })
      return
    }

    setCarregando(true)
    try {
      await cadastrarUsuario({
        nome,
        email,
        cpf: cpfValidado.cpfFormatado,
        senha,
        confirmarSenha,
      })
      navigate('/login', { replace: true })
    } catch (erro) {
      const mensagem =
        erro instanceof ApiError
          ? erro.message
          : 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
      setErroApi(mensagem)

      if (erro instanceof ApiError && /cpf/i.test(mensagem)) {
        setErros((prev) => ({ ...prev, cpf: mensagem }))
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout titulo="Sesi" subtitulo="Cadastro">
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
            const valor = e.target.value

            if (/[a-zA-ZÀ-ÿ]/.test(valor)) {
              setErros((prev) => ({
                ...prev,
                cpf: 'CPF deve conter apenas números',
              }))
              return
            }

            setCpf(mascaraCpf(valor))
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
          component={RouterLink}
          to="/login"
          fullWidth
          variant="text"
          disabled={carregando}
          sx={{ mt: 2 }}
        >
          Já tenho conta
        </Button>
      </form>
    </AuthLayout>
  )
}
