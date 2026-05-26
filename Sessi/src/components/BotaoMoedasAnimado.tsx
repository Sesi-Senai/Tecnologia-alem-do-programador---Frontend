import { useEffect, useRef, useState } from 'react'
import { Box, Button, keyframes, type ButtonProps } from '@mui/material'

const pulsarDesconto = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.4); }
  35% { transform: scale(0.92); box-shadow: 0 0 0 8px rgba(211, 47, 47, 0.15); }
  65% { transform: scale(1.06); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(211, 47, 47, 0); }
`

const pulsarGanho = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`

const subirDelta = keyframes`
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-28px); }
`

type BotaoMoedasAnimadoProps = ButtonProps & {
  moedas: number
}

export function BotaoMoedasAnimado({ moedas, sx, ...props }: BotaoMoedasAnimadoProps) {
  const [moedasExibidas, setMoedasExibidas] = useState(moedas)
  const [efeito, setEfeito] = useState<'idle' | 'desconto' | 'ganho'>('idle')
  const [deltaFlutuante, setDeltaFlutuante] = useState<string | null>(null)
  const moedasAnteriores = useRef(moedas)
  const primeiraCarga = useRef(true)

  useEffect(() => {
    const destino = moedas
    const origem = moedasAnteriores.current

    if (primeiraCarga.current) {
      primeiraCarga.current = false
      moedasAnteriores.current = destino
      setMoedasExibidas(destino)
      return
    }

    if (destino === origem) return

    const diferenca = destino - origem

    if (diferenca < 0) {
      setEfeito('desconto')
      setDeltaFlutuante(`${diferenca}`)
    } else if (diferenca > 0) {
      setEfeito('ganho')
      setDeltaFlutuante(`+${diferenca}`)
    }

    const duracao = 550
    const inicio = performance.now()

    function animar(agora: number) {
      const progresso = Math.min(1, (agora - inicio) / duracao)
      const suavizado = 1 - (1 - progresso) ** 3
      const valor = Math.round(origem + diferenca * suavizado)
      setMoedasExibidas(valor)

      if (progresso < 1) {
        requestAnimationFrame(animar)
      } else {
        setMoedasExibidas(destino)
        moedasAnteriores.current = destino
        window.setTimeout(() => setEfeito('idle'), 650)
      }
    }

    requestAnimationFrame(animar)

    const timerDelta = window.setTimeout(() => setDeltaFlutuante(null), 900)
    return () => window.clearTimeout(timerDelta)
  }, [moedas])

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {deltaFlutuante && (
        <Box
          component="span"
          sx={{
            position: 'absolute',
            top: -4,
            right: 8,
            zIndex: 2,
            fontWeight: 800,
            fontSize: '0.95rem',
            color: deltaFlutuante.startsWith('+') ? 'success.main' : 'error.main',
            pointerEvents: 'none',
            animation: `${subirDelta} 0.9s ease-out forwards`,
          }}
        >
          {deltaFlutuante}
        </Box>
      )}

      <Button
        variant="contained"
        {...props}
        sx={{
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: 2,
          minWidth: 120,
          transition: 'background-color 0.3s ease, color 0.3s ease',
          ...(efeito === 'desconto' && {
            animation: `${pulsarDesconto} 0.65s ease-out`,
            bgcolor: 'error.main',
            '&:hover': { bgcolor: 'error.dark' },
          }),
          ...(efeito === 'ganho' && {
            animation: `${pulsarGanho} 0.5s ease-out`,
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' },
          }),
          ...sx,
        }}
      >
        {moedasExibidas} moedas
      </Button>
    </Box>
  )
}
