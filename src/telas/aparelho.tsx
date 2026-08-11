import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ContextoDoQuadro, interpolar, suave, useQuadro } from './tempo'
import { ALTURA, LARGURA, TOPO_SEGURO } from './medidas'

/*
 * O cromo do aparelho, que não pertence a nenhuma tela, mais os dois
 * invólucros de layout que substituem os do Remotion.
 */

/** Fornece o quadro atual para a árvore da tela. */
export function Palco({ quadro, children }: { quadro: number; children: ReactNode }) {
  return <ContextoDoQuadro.Provider value={quadro}>{children}</ContextoDoQuadro.Provider>
}

/** Camada que ocupa o quadro inteiro. Equivale ao `AbsoluteFill` do Remotion. */
export function Camada({ style, children }: { style?: CSSProperties; children?: ReactNode }) {
  return <div style={{ position: 'absolute', inset: 0, ...style }}>{children}</div>
}

/**
 * Barra de status: hora à esquerda, sinal, wi-fi e bateria à direita. Fica fora
 * das telas e não acompanha nem rolagem nem transição, porque é o aparelho. O
 * vão do meio é da ilha dinâmica, que o mock desenha por cima da tela.
 */
export function BarraDeStatus({ cor }: { cor: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: LARGURA,
        height: TOPO_SEGURO,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 22px',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ fontFamily: "'Lexend Deca', sans-serif", fontSize: 15, fontWeight: 600, color: cor, letterSpacing: 0.2 }}>
        09:41
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg viewBox="0 0 18 12" width={18} height={12} fill={cor}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={8 - i * 2.4} width={3.2} height={4 + i * 2.4} rx={1} opacity={i === 3 ? 0.35 : 1} />
          ))}
        </svg>
        <svg viewBox="0 0 16 12" width={16} height={12} fill="none" stroke={cor} strokeWidth={1.6} strokeLinecap="round">
          <path d="M1 4.4a10 10 0 0 1 14 0M3.6 7.2a6.2 6.2 0 0 1 8.8 0" />
          <circle cx="8" cy="10.2" r="0.9" fill={cor} stroke="none" />
        </svg>
        <svg viewBox="0 0 26 12" width={26} height={12} fill="none">
          <rect x="0.7" y="0.7" width="21.6" height="10.6" rx="3.2" stroke={cor} strokeWidth={1.4} opacity={0.45} />
          <rect x="2.6" y="2.6" width="14" height="6.8" rx="1.8" fill={cor} />
          <path d="M24.2 4.4v3.2a2.4 2.4 0 0 0 0-3.2Z" fill={cor} opacity={0.45} />
        </svg>
      </div>
    </div>
  )
}

/**
 * Marca de toque: um ponto que aparece e um anel que expande e some, o mesmo
 * desenho que gravação de tela usa. Serve para todos os toques do roteiro, para
 * o gesto ser sempre o mesmo sinal.
 */
export function Toque({
  x,
  y,
  quando,
  cor = 'rgba(39,39,39,0.5)',
}: {
  x: number
  y: number
  quando: number
  cor?: string
}) {
  const quadro = useQuadro()
  if (quadro < quando || quadro > quando + 26) return null
  const t = interpolar(quadro, [quando, quando + 26], [0, 1])
  const raio = 13 + suave(t) * 30
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - raio,
          top: y - raio,
          width: raio * 2,
          height: raio * 2,
          borderRadius: 999,
          border: `2px solid ${cor}`,
          opacity: 1 - t,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 11,
          top: y - 11,
          width: 22,
          height: 22,
          borderRadius: 999,
          backgroundColor: cor,
          opacity: (1 - t) * 0.45,
        }}
      />
    </>
  )
}

/**
 * A tela do aparelho: caixa de 390 × 800 que se ajusta à largura disponível.
 * As telas são escritas nessas medidas — as mesmas do arquivo do Figma — e a
 * página as reduz por escala, então nenhuma delas precisa saber em que tamanho
 * vai aparecer. O fator vem medido do container, porque `scale()` quer um
 * número e `calc()` com unidade de container devolve comprimento.
 */
export function Tela({ children }: { children: ReactNode }) {
  const caixa = useRef<HTMLDivElement>(null)
  const [escala, definirEscala] = useState(0)

  useEffect(() => {
    const alvo = caixa.current
    if (!alvo) return
    const observador = new ResizeObserver(([entrada]) => {
      definirEscala(entrada.contentRect.width / LARGURA)
    })
    observador.observe(alvo)
    return () => observador.disconnect()
  }, [])

  return (
    <div
      ref={caixa}
      style={{ position: 'relative', width: '100%', aspectRatio: `${LARGURA} / ${ALTURA}`, overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: LARGURA,
          height: ALTURA,
          transformOrigin: 'top left',
          transform: `scale(${escala})`,
          /* Escondida até a primeira medida, senão pisca em tamanho cheio. */
          visibility: escala ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
