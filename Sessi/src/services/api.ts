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
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json; charset=utf-8',
    },
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

export type UsuarioCompleto = UsuarioResposta & {
  senha?: string
  criadoEm?: string
}

export function listarUsuarios() {
  return requisicao<{ usuarios: UsuarioCompleto[] }>('/usuarios', {
    method: 'GET',
  })
}

export function buscarUsuarioPorId(id: string) {
  return requisicao<{ usuario: UsuarioResposta }>(`/usuarios/${id}`, {
    method: 'GET',
  })
}

export function adicionarMoedasUsuario(id: string, quantidade = 100) {
  return requisicao<{ mensagem: string; usuario: UsuarioResposta }>(
    `/usuarios/${id}/moedas`,
    {
      method: 'POST',
      body: JSON.stringify({ quantidade }),
    },
  )
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

export type EnviarMensagemChatPayload = {
  usuarioId: string
  usuarioCobrancaId: string
  nome: string
  texto: string
  /** Enviado pelo cliente — vulnerabilidade intencional para demo (Caido/Postman). */
  moedasDescontar?: number | string
}

export function enviarMensagemChat(dados: EnviarMensagemChatPayload) {
  const corpo: EnviarMensagemChatPayload = {
    usuarioId: dados.usuarioId,
    usuarioCobrancaId: dados.usuarioCobrancaId,
    nome: dados.nome,
    texto: dados.texto,
    moedasDescontar: dados.moedasDescontar ?? CUSTO_MENSAGEM_CHAT,
  }

  return requisicao<{
    mensagem: string
    chat: MensagemChat
    moedasDescontadas: number
    usuarioCobranca: UsuarioResposta
  }>('/chat', {
    method: 'POST',
    body: JSON.stringify(corpo),
  })
}
