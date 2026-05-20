const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

type RespostaApi<T> = {
  mensagem: string
  usuario?: T
}

export type UsuarioResposta = {
  id: string
  nome: string
  email: string
  cpf: string
  moedas?: number
}

export class ApiError extends Error {
  status: number

  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.status = status
  }
}

async function requisicao<T>(
  caminho: string,
  opcoes: RequestInit,
): Promise<T> {
  const resposta = await fetch(`${API_BASE}${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  })

  const dados = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    throw new ApiError(
      (dados as { mensagem?: string }).mensagem ?? 'Erro na requisição',
      resposta.status,
    )
  }

  return dados as T
}

export type CadastroPayload = {
  nome: string
  email: string
  cpf: string
  senha: string
  confirmarSenha: string
}

export type LoginPayload = {
  email: string
  senha: string
}

export function cadastrarUsuario(dados: CadastroPayload) {
  return requisicao<RespostaApi<UsuarioResposta>>('/cadastro', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export function loginUsuario(dados: LoginPayload) {
  return requisicao<RespostaApi<UsuarioResposta>>('/login', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
}

export function buscarUsuarioPorId(id: string) {
  return requisicao<{ usuario: UsuarioResposta }>(`/usuarios/${id}`, {
    method: 'GET',
  })
}
