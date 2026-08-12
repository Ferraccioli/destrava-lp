import { createContext, useContext } from 'react'
import { FPS } from './medidas'

/* O motor de tempo das telas do app. Elas leem o quadro atual de um contexto
   e não sabem de onde ele vem, então `interpolar` e `mola` moram aqui. */

export const ContextoDoQuadro = createContext(0)

/** Quadro atual, contado a partir do início da peça. */
export const useQuadro = () => useContext(ContextoDoQuadro)

export const suave = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Mapeia `valor` da faixa de entrada para a de saída, preso nas duas pontas.
 * As faixas precisam ter o mesmo tamanho e a entrada precisa ser crescente.
 * `easing` recebe e devolve 0..1, e se aplica dentro de cada trecho.
 */
export function interpolar(
  valor: number,
  entradas: readonly number[],
  saidas: readonly number[],
  easing?: (t: number) => number,
): number {
  if (valor <= entradas[0]) return saidas[0]
  const ultimo = entradas.length - 1
  if (valor >= entradas[ultimo]) return saidas[ultimo]

  let i = 1
  while (i < ultimo && valor >= entradas[i]) i++
  const faixa = entradas[i] - entradas[i - 1]
  const t = faixa === 0 ? 0 : (valor - entradas[i - 1]) / faixa
  const suavizado = easing ? easing(t) : t
  return saidas[i - 1] + (saidas[i] - saidas[i - 1]) * suavizado
}

type Config = { damping: number; stiffness: number; mass: number }

/* Mola de zero a um, com velocidade inicial nula. Solução analítica do
   oscilador amortecido nos três regimes: a configuração de damping 20 passa
   de 1, e sem o ramo certo devolveria oscilação onde não existe. */
export function mola(quadro: number, { damping, stiffness, mass }: Config): number {
  if (quadro <= 0) return 0
  const t = quadro / FPS
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))

  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
  }
  if (zeta === 1) {
    return 1 - Math.exp(-w0 * t) * (1 + w0 * t)
  }
  const raiz = Math.sqrt(zeta * zeta - 1)
  const r1 = -w0 * (zeta - raiz)
  const r2 = -w0 * (zeta + raiz)
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1)
}

/** Entrada padrão de qualquer elemento: mola discreta no eixo Y com fade. */
export function useEntrada(entra: number) {
  const quadro = useQuadro()
  const m = mola(quadro - entra, { damping: 16, stiffness: 130, mass: 0.7 })
  return {
    opacity: interpolar(quadro, [entra, entra + 8], [0, 1]),
    transform: `translateY(${(1 - m) * 14}px)`,
  }
}
