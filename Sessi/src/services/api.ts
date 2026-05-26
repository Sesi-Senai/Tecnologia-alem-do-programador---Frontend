import { obterToken } from './auth'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

type RespostaApi<T> = {
  mensagem: string
  usuario?: T
  token?: string
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
  exigeAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json; charset=utf-8',
  }

  if (exigeAuth) {
    const token = obterToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const resposta = await fetch(`${API_BASE}${caminho}`, {
    ...opcoes,
    headers: {
      ...headers,
      ...(opcoes.headers as Record<string, string>),
    },
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
  return requisicao<RespostaApi<UsuarioResposta>>(
    '/cadastro',
    {
      method: 'POST',
      body: JSON.stringify(dados),
    },
    false,
  )
}

export function loginUsuario(dados: LoginPayload) {
  return requisicao<RespostaApi<UsuarioResposta> & { token: string }>(
    '/login',
    {
      method: 'POST',
      body: JSON.stringify(dados),
    },
    false,
  )
}

export function buscarUsuarioAtual() {
  return requisicao<{ usuario: UsuarioResposta }>('/usuarios/me', {
    method: 'GET',
  })
}

export function buscarUsuarioPorId(id: string) {
  return requisicao<{ usuario: UsuarioResposta }>(`/usuarios/${id}`, {
    method: 'GET',
  })
}

export type MensagemChat = {
  id: string
  usuarioId: string
  conversaUsuarioId?: string
  nome: string
  texto: string
  criadoEm: string
}

export function listarMensagensChat(usuarioId: string) {
  const params = new URLSearchParams({ usuarioId })
  return requisicao<{ mensagens: MensagemChat[] }>(`/chat?${params}`, {
    method: 'GET',
  })
}

export function limparMensagensChat(usuarioId: string) {
  const params = new URLSearchParams({ usuarioId })
  return requisicao<{ mensagem: string; mensagens: MensagemChat[] }>(
    `/chat?${params}`,
    {
      method: 'DELETE',
    },
  )
}

export const CUSTO_MENSAGEM_CHAT = 15

export function enviarMensagemChat(dados: { texto: string }) {
  return requisicao<{
    mensagem: string
    chat: MensagemChat
    moedasDescontadas: number
    usuarioCobranca: UsuarioResposta
  }>('/chat', {
    method: 'POST',
    body: JSON.stringify({ texto: dados.texto }),
  })
}
