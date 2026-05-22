import { Box, Card, CardContent, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type AuthLayoutProps = {
  titulo: string
  subtitulo?: string
  children: ReactNode
}

export function AuthLayout({ titulo, subtitulo, children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 4,
          boxShadow: 10,
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              mb: subtitulo ? 0.5 : 2,
              fontWeight: 'bold',
            }}
          >
            {titulo}
          </Typography>
          {subtitulo && (
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 2 }}
            >
              {subtitulo}
            </Typography>
          )}
          {children}
        </CardContent>
      </Card>
    </Box>
  )
}
