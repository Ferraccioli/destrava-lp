import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { preservarRolagem } from './rolagem'

/* Antes de renderizar: a restauração do navegador precisa ser desligada antes
   que ele a tente, e o observador de altura precisa estar de pé para o primeiro
   quadro em que a página ganha tamanho. */
preservarRolagem()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
