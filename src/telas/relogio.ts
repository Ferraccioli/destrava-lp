import { useEffect, useRef, useState } from 'react'
import { FPS } from './medidas'

/**
 * Relógio da peça no navegador: devolve o quadro atual, em laço.
 *
 * `ativo` liga e desliga o laço, e é o que segura o custo — só a aba visível
 * anima. Ao ser desligada, a tela **congela no último quadro** em vez de voltar
 * a zero: o congelamento é o que a transição de saída mostra, e voltar a zero
 * ali seria um piscar de tela vazia. Ao ser religada, recomeça do início.
 *
 * `parado` atende `prefers-reduced-motion`: nenhum laço roda e a tela fica no
 * quadro representativo que a peça escolheu.
 */
export function useRelogio({
  ativo,
  duracao,
  parado,
  quadroParado,
}: {
  ativo: boolean
  duracao: number
  parado: boolean
  quadroParado: number
}): number {
  const [quadro, definirQuadro] = useState(0)
  const ultimo = useRef(-1)

  useEffect(() => {
    if (parado || !ativo) return
    let animacao = 0
    const inicio = performance.now()
    ultimo.current = -1
    /*
     * Volta ao início já, e não no primeiro quadro do laço: sem isto a tela
     * renderiza uma vez com o quadro congelado da última vez que esteve em cena
     * e só então salta para zero, o que aparece como um flash do estado final
     * no começo da transição.
     */
    definirQuadro(0)
    const passo = (agora: number) => {
      const atual = Math.floor(((agora - inicio) / 1000) * FPS) % duracao
      /* O rAF roda a 60Hz ou mais e a peça é de 30: sem esta guarda, metade
         dos quadros dispara um render que desenha exatamente o mesmo. */
      if (atual !== ultimo.current) {
        ultimo.current = atual
        definirQuadro(atual)
      }
      animacao = requestAnimationFrame(passo)
    }
    animacao = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(animacao)
  }, [ativo, duracao, parado])

  return parado ? quadroParado : quadro
}
