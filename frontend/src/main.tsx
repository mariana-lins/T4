import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Roteador from './componentes/Roteador'

// Carregar debug em desenvolvimento
if (import.meta.env.DEV) {
  import('./debug');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Roteador />
  </StrictMode>,
)
