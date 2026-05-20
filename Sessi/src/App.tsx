import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

type Tela = 'login' | 'cadastro'

function App() {
  const [tela, setTela] = useState<Tela>('login')

  if (tela === 'cadastro') {
    return <RegisterPage onVoltarLogin={() => setTela('login')} />
  }

  return <LoginPage onIrParaCadastro={() => setTela('cadastro')} />
}

export default App
