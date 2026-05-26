import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import LogoutIcon from '@mui/icons-material/Logout'
import SendIcon from '@mui/icons-material/Send'
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { BotaoMoedasAnimado } from '../components/BotaoMoedasAnimado'
import { TextoMensagemChat } from '../components/TextoMensagemChat'
import {
  ApiError,
  buscarUsuarioPorId,
  CUSTO_MENSAGEM_CHAT,
  enviarMensagemChat,
  limparMensagensChat,
  listarMensagensChat,
  type MensagemChat,
  type UsuarioResposta,
} from '../services/api'

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HomePage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const id = params.get('id')
  const areaChatRef = useRef<HTMLDivElement>(null)

  const [usuario, setUsuario] = useState<UsuarioResposta | null>(null)
  const [mensagens, setMensagens] = useState<MensagemChat[]>([])
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState('')
  const [erroChat, setErroChat] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [limpando, setLimpando] = useState(false)
  const [dialogMoedasAberto, setDialogMoedasAberto] = useState(false)
  const [avisoMoedas, setAvisoMoedas] = useState('')
  const [menuAvatar, setMenuAvatar] = useState<null | HTMLElement>(null)

  const carregarMensagens = useCallback(async () => {
    if (!id) return
    const resposta = await listarMensagensChat(id)
    setMensagens(resposta.mensagens)
  }, [id])

  useEffect(() => {
    if (!id) {
      navigate('/login', { replace: true })
      return
    }

    setCarregando(true)
    setErro('')

    Promise.all([buscarUsuarioPorId(id), listarMensagensChat(id)])
      .then(([usuarioRes, chatRes]) => {
        setUsuario(usuarioRes.usuario ?? null)
        setMensagens(chatRes.mensagens)
      })
      .catch((erro) => {
        const mensagem =
          erro instanceof ApiError
            ? erro.message
            : 'Não foi possível carregar os dados.'
        setErro(mensagem)
      })
      .finally(() => setCarregando(false))
  }, [id, navigate])

  useEffect(() => {
    const area = areaChatRef.current
    if (!area) return
    area.scrollTo({ top: area.scrollHeight, behavior: 'smooth' })
  }, [mensagens])

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault()
    if (!usuario || !texto.trim()) return

    const saldo = usuario.moedas ?? 0

    if (saldo < CUSTO_MENSAGEM_CHAT) {
      setErroChat(
        `Moedas insuficientes. São necessárias ${CUSTO_MENSAGEM_CHAT} moedas (saldo: ${saldo}).`,
      )
      return
    }

    setErroChat('')
    setEnviando(true)

    try {
      const resposta = await enviarMensagemChat({
        usuarioId: usuario.id,
        usuarioCobrancaId: usuario.id,
        nome: usuario.nome,
        texto: texto.trim(),
        moedasDescontar: CUSTO_MENSAGEM_CHAT,
      })
      setTexto('')
      if (resposta.usuarioCobranca.id === usuario.id) {
        setUsuario((atual) =>
          atual
            ? { ...atual, moedas: resposta.usuarioCobranca.moedas }
            : atual,
        )
      }
      await carregarMensagens()
    } catch (erro) {
      const mensagem =
        erro instanceof ApiError
          ? erro.message
          : 'Não foi possível enviar a mensagem.'
      setErroChat(mensagem)
    } finally {
      setEnviando(false)
    }
  }

  function handleAdicionarMoedas() {
    setAvisoMoedas('Não está disponível no momento.')
  }

  async function handleLimparConversa() {
    if (mensagens.length === 0 || !id) return

    setErroChat('')
    setLimpando(true)

    try {
      await limparMensagensChat(id)
      setMensagens([])
    } catch (erro) {
      const mensagem =
        erro instanceof ApiError
          ? erro.message
          : 'Não foi possível limpar a conversa.'
      setErroChat(mensagem)
    } finally {
      setLimpando(false)
    }
  }

  function handleAbrirMenuAvatar(event: React.MouseEvent<HTMLElement>) {
    setMenuAvatar(event.currentTarget)
  }

  function handleFecharMenuAvatar() {
    setMenuAvatar(null)
  }

  function handleSair() {
    handleFecharMenuAvatar()
    navigate('/login')
  }

  const iniciais = usuario?.nome
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Box
      sx={{
        height: '100dvh',
        maxHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        p: { xs: 1.5, sm: 3 },
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: 960,
          height: '100%',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#ffffff',
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: '#ffffff',
            color: 'text.primary',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Toolbar
            sx={{
              gap: { xs: 1, sm: 2 },
              py: 1.25,
              minHeight: { xs: 80, sm: 88 },
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, flex: 1 }}>
              <Box sx={{ lineHeight: 1.2 }}>
                <Typography
                  variant="h6"
                  sx={{ color: 'primary.main', fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  Sesi
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  ChatBot
                </Typography>
              </Box>

              {carregando ? (
                <CircularProgress size={24} />
              ) : usuario ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    lineHeight: 1.3,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Nome
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {usuario.nome}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      E-mail
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {usuario.email}
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>

            {usuario && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 'auto' }}>
                <BotaoMoedasAnimado
                  moedas={usuario.moedas ?? 0}
                  onClick={() => {
                    setAvisoMoedas('')
                    setDialogMoedasAberto(true)
                  }}
                />

                <IconButton onClick={handleAbrirMenuAvatar} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: 'primary.main',
                      fontWeight: 700,
                    }}
                  >
                    {iniciais || '?'}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={menuAvatar}
                  open={Boolean(menuAvatar)}
                  onClose={handleFecharMenuAvatar}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    disabled={
                      carregando || enviando || limpando || mensagens.length === 0
                    }
                    onClick={() => {
                      handleFecharMenuAvatar()
                      void handleLimparConversa()
                    }}
                  >
                    <ListItemIcon>
                      <DeleteSweepIcon fontSize="small" />
                    </ListItemIcon>
                    Limpar conversa
                  </MenuItem>
                  <MenuItem onClick={handleSair}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Sair
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Dialog
          open={dialogMoedasAberto}
          onClose={() => setDialogMoedasAberto(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Status do usuário</DialogTitle>
          <DialogContent dividers>
            {usuario && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    ID
                  </Typography>
                  <Typography variant="body1">{usuario.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    CPF
                  </Typography>
                  <Typography variant="body1">{usuario.cpf || '—'}</Typography>
                </Box>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Saldo atual
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                    {usuario.moedas ?? 0} moedas
                  </Typography>
                </Box>
              </Box>
            )}
            {avisoMoedas && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {avisoMoedas}
              </Alert>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button onClick={() => setDialogMoedasAberto(false)}>Fechar</Button>
            <Button variant="contained" onClick={handleAdicionarMoedas}>
              Adicionar moedas
            </Button>
          </DialogActions>
        </Dialog>

        {erro && (
          <Alert severity="error" sx={{ mx: 3, mt: 2, flexShrink: 0 }}>
            {erro}
          </Alert>
        )}

        <Box
          ref={areaChatRef}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            px: { xs: 2, sm: 4 },
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: '#fafafa',
          }}
        >
          {carregando && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!carregando && mensagens.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', mt: 4 }}
            >
              Nenhuma mensagem ainda. Envie a primeira!
            </Typography>
          )}

          {mensagens.map((msg) => {
            const propria = msg.usuarioId === id
            const corTexto = propria ? 'primary.contrastText' : 'text.primary'
            return (
              <Box
                key={msg.id}
                sx={{
                  alignSelf: propria ? 'flex-end' : 'flex-start',
                  maxWidth: propria ? '85%' : '92%',
                  width: propria ? 'auto' : '100%',
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 2,
                    bgcolor: propria ? 'primary.main' : 'background.paper',
                    color: corTexto,
                    border: propria ? 'none' : 1,
                    borderColor: 'divider',
                  }}
                >
                  {!propria && (
                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, mb: 0.5 }}>
                      {msg.nome}
                    </Typography>
                  )}
                  <TextoMensagemChat texto={msg.texto} cor={corTexto} />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', textAlign: propria ? 'right' : 'left', mt: 0.25 }}
                >
                  {formatarHora(msg.criadoEm)}
                </Typography>
              </Box>
            )
          })}
        </Box>

        {erroChat && (
          <Alert severity="error" sx={{ mx: 2, mb: 1, flexShrink: 0 }}>
            {erroChat}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleEnviar}
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderTop: 1,
            borderColor: 'divider',
            flexShrink: 0,
            bgcolor: '#ffffff',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Digite sua mensagem..."
              value={texto}
              disabled={!usuario || enviando || limpando}
              onChange={(e) => setTexto(e.target.value)}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  alignItems: 'center',
                },
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={
                !usuario ||
                enviando ||
                limpando ||
                !texto.trim() ||
                (usuario.moedas ?? 0) < CUSTO_MENSAGEM_CHAT
              }
              sx={{
                flexShrink: 0,
                width: 48,
                height: 48,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
                '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              {enviando ? <CircularProgress size={22} color="inherit" /> : <SendIcon />}
            </IconButton>
          </Box>
          {usuario && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Cada mensagem custa {CUSTO_MENSAGEM_CHAT} moedas.
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
