import { mascaraCpf } from './mascaraCpf'

export function formatarCpf(digitos: string) {
  return mascaraCpf(digitos.replace(/\D/g, '').slice(0, 11))
}

export function validarCpf(cpf: string) {
  const bruto = cpf.trim()

  if (!bruto) {
    return { ok: false as const, mensagem: 'Preencha o CPF' }
  }

  if (/[a-zA-ZÀ-ÿ]/.test(bruto)) {
    return { ok: false as const, mensagem: 'CPF deve conter apenas números' }
  }

  if (!/^[0-9.\-\s]+$/.test(bruto)) {
    return { ok: false as const, mensagem: 'CPF contém caracteres inválidos' }
  }

  const digitos = bruto.replace(/\D/g, '')

  if (digitos.length !== 11) {
    return { ok: false as const, mensagem: 'CPF deve ter 11 dígitos numéricos' }
  }

  return {
    ok: true as const,
    digitos,
    cpfFormatado: formatarCpf(digitos),
  }
}
