import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type TextoMensagemChatProps = {
  texto: string
  cor?: string
}

function formatarInline(linha: string, cor?: string): ReactNode[] {
  const partes = linha.split(/(\*\*[^*]+\*\*)/g)
  return partes.map((parte, indice) => {
    if (parte.startsWith('**') && parte.endsWith('**')) {
      return (
        <Box
          component="strong"
          key={indice}
          sx={{ fontWeight: 700, color: cor ?? 'inherit' }}
        >
          {parte.slice(2, -2)}
        </Box>
      )
    }
    return <span key={indice}>{parte}</span>
  })
}

export function TextoMensagemChat({ texto, cor }: TextoMensagemChatProps) {
  const linhas = texto.split('\n')

  return (
    <Box
      sx={{
        color: cor ?? 'inherit',
        wordBreak: 'break-word',
        overflowWrap: 'anywhere',
        '& > *:last-child': { mb: 0 },
      }}
    >
      {linhas.map((linha, indice) => {
        const conteudo = linha.trimEnd()
        const lista = /^(\*|-)\s+/.test(conteudo)
        const titulo = /^\*\*[^*]+\*\*:?\s*$/.test(conteudo.trim())

        if (!conteudo) {
          return <Box key={indice} sx={{ height: 8 }} />
        }

        if (lista) {
          return (
            <Typography
              key={indice}
              component="div"
              variant="body2"
              sx={{
                display: 'flex',
                gap: 0.75,
                mb: 0.5,
                pl: 0.5,
                color: cor ?? 'inherit',
              }}
            >
              <Box component="span" sx={{ flexShrink: 0 }}>
                •
              </Box>
              <Box component="span">{formatarInline(conteudo.replace(/^(\*|-)\s+/, ''), cor)}</Box>
            </Typography>
          )
        }

        return (
          <Typography
            key={indice}
            component="div"
            variant="body2"
            sx={{
              mb: 0.5,
              fontWeight: titulo ? 700 : 400,
              color: cor ?? 'inherit',
              whiteSpace: 'pre-wrap',
            }}
          >
            {formatarInline(conteudo, cor)}
          </Typography>
        )
      })}
    </Box>
  )
}
