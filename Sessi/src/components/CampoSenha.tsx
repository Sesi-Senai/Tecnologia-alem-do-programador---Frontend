import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
} from '@mui/material'
import { useState } from 'react'

type CampoSenhaProps = Omit<TextFieldProps, 'type'> & {
  value: string
  onChange: (valor: string) => void
}

export function CampoSenha({ value, onChange, label, ...rest }: CampoSenhaProps) {
  const [mostrar, setMostrar] = useState(false)

  return (
    <TextField
      fullWidth
      label={label}
      type={mostrar ? 'text' : 'password'}
      variant="outlined"
      margin="normal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete="off"
      {...rest}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={mostrar ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setMostrar((v) => !v)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {mostrar ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}
