import { useState } from 'react'
import { Alert, Button, TextField } from '@mui/material'
import { AuthLayout } from '../components/AuthLayout'
import { CampoSenha } from '../components/CampoSenha'
import { mascaraCpf } from '../utils/mascaraCpf'

type RegisterPageProps = {
  onVoltarLogin: () => void
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

export function RegisterPage({ onVoltarLogin }: RegisterPageProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erros, setErros] = useState<ErrosCadastro>({})

  function handleCadastro(e: React.FormEvent) {
    e.preventDefault()

    const errosValidacao = validarCadastro(nome, email, cpf, senha, confirmarSenha)
    setErros(errosValidacao)

    if (Object.keys(errosValidacao).length > 0) {
      return
    }

    const dados = { nome, email, cpf, senha }
    console.log('Cadastro:', dados)
    localStorage.setItem('usuario_cadastrado', JSON.stringify(dados))
    alert(`Cadastro realizado com sucesso!\n\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}`)
  }

  return (
    <AuthLayout titulo="Cadastro">
      <form onSubmit={handleCadastro} noValidate>
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
          sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
        >
          Cadastrar
        </Button>

        <Button
          type="button"
          fullWidth
          variant="text"
          sx={{ mt: 2 }}
          onClick={onVoltarLogin}
        >
          Já tenho conta
        </Button>
      </form>
    </AuthLayout>
  )
}
