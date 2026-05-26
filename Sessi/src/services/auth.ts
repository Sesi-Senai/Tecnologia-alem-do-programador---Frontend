const CHAVE_TOKEN = 'sesi_token'
const CHAVE_USUARIO_ID = 'sesi_usuario_id'

export function salvarSessao(token: string, usuarioId: string) {
  sessionStorage.setItem(CHAVE_TOKEN, token)
  sessionStorage.setItem(CHAVE_USUARIO_ID, usuarioId)
}

export function obterToken() {
  return sessionStorage.getItem(CHAVE_TOKEN)
}

export function obterUsuarioIdSessao() {
  return sessionStorage.getItem(CHAVE_USUARIO_ID)
}

export function limparSessao() {
  sessionStorage.removeItem(CHAVE_TOKEN)
  sessionStorage.removeItem(CHAVE_USUARIO_ID)
}

export function estaAutenticado() {
  return Boolean(obterToken() && obterUsuarioIdSessao())
}
