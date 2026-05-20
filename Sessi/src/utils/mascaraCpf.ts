export function mascaraCpf(valor: string): string {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)

  if (numeros.length <= 3) return numeros
  if (numeros.length <= 6) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3)}`
  }
  if (numeros.length <= 9) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`
  }
  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`
}
