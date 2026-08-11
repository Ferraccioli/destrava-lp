import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Palco, Tela } from '../telas/aparelho'
import { useRelogio } from '../telas/relogio'
import { Simulacao, DURACAO as DURACAO_SIMULACAO, QUADRO_PARADO as PARADO_SIMULACAO } from '../telas/Simulacao'
import { Trilhas, DURACAO as DURACAO_TRILHAS, QUADRO_PARADO as PARADO_TRILHAS } from '../telas/Trilhas'
import { Relatorio, DURACAO as DURACAO_RELATORIO, QUADRO_PARADO as PARADO_RELATORIO } from '../telas/Relatorio'
import trilhaCarreira from '../assets/trilha-carreira.webp'
import trilhaFinancas from '../assets/trilha-financas.webp'
import trilhaCidadania from '../assets/trilha-cidadania.webp'
import trilhaBemEstar from '../assets/trilha-bem-estar.webp'

type Tab = {
  id: string
  n: string
  label: string
  text: string
  tela: () => ReactNode
  duracao: number
  quadroParado: number
  /* O que a tela mostra, para quem não a vê. */
  descricaoDaTela: string
}

const TABS: Tab[] = [
  {
    id: 'simulacao',
    n: '1',
    label: 'A Simulação',
    text: 'Ele entra numa entrevista de verdade: a pergunta aparece, ele responde, e o app devolve onde ele travou.',
    tela: Simulacao,
    duracao: DURACAO_SIMULACAO,
    quadroParado: PARADO_SIMULACAO,
    descricaoDaTela: 'uma entrevista simulada, com as falas aparecendo uma a uma e a resposta do jovem sendo avaliada',
  },
  {
    id: 'trilhas',
    n: '2',
    label: 'As trilhas',
    text: 'Carreira, Finanças, Cidadania e Bem-estar. Uma decisão de cada vez, no ritmo dele.',
    tela: Trilhas,
    duracao: DURACAO_TRILHAS,
    quadroParado: PARADO_TRILHAS,
    descricaoDaTela:
      'a trilha da vaga com as atividades em sequência, uma leitura curta sendo aberta e um exercício sendo respondido',
  },
  {
    id: 'sem-limite',
    n: '3',
    label: 'Sem limite',
    text: 'Ele refaz quantas vezes precisar, até a resposta sair boa.',
    tela: Relatorio,
    duracao: DURACAO_RELATORIO,
    quadroParado: PARADO_RELATORIO,
    descricaoDaTela: 'o relatório da simulação, com a nota, o que ele acertou, o que dá pra melhorar e o botão de refazer',
  },
]

/*
 * As quatro trilhas orbitam o aparelho e passam por trás dele, alternando os
 * lados. Ficam presas ao próprio mock, então somem junto com ele em tela baixa
 * em vez de sobrar flutuando. Decorativas: o texto do passo já nomeia as quatro.
 *
 * Valem para os três passos, não só para "As trilhas": com elas em um só, o
 * aparelho mudava de tamanho e de posição na troca de aba, e o olho lia isso
 * como a página pulando.
 */
const TRILHAS = [
  { nome: 'Carreira', img: trilhaCarreira, pos: 'left-0 top-[4%]', tam: 'w-[27%]' },
  { nome: 'Finanças', img: trilhaFinancas, pos: 'right-0 top-[28%]', tam: 'w-[23%]' },
  { nome: 'Cidadania', img: trilhaCidadania, pos: 'left-0 bottom-[26%]', tam: 'w-[29%]' },
  { nome: 'Bem-estar', img: trilhaBemEstar, pos: 'right-0 bottom-[4%]', tam: 'w-[27%]' },
]

function TrilhasOrbitando() {
  return (
    <>
      {TRILHAS.map(({ nome, img, pos, tam }) => (
        <img
          key={nome}
          src={img}
          alt=""
          aria-hidden="true"
          title={nome}
          className={`absolute z-0 h-auto ${pos} ${tam}`}
          loading="lazy"
        />
      ))}
    </>
  )
}

/**
 * Largura da figura do passo, igual nos três. A figura é maior que o aparelho:
 * o mock ocupa só o miolo e as trilhas ficam nas laterais, tudo dentro dela.
 */
function larguraDaFigura(reduced: boolean) {
  if (reduced) return 'w-full max-w-[22rem] md:max-w-[24rem] lg:max-w-[29rem]'
  /*
   * Até o lg a composição fica empilhada, e aí o aparelho divide a altura da
   * cena presa com o texto. Dois cuidados vêm daí:
   *
   * No mobile a largura é dada em `svh` porque o que limita o aparelho é a
   * altura da tela, não a largura: tamanho fixo obriga a escolher pelo pior
   * caso (701px de altura, o mais baixo em que ele ainda aparece) e desperdiça
   * a sobra num aparelho alto. O clamp segura os extremos.
   *
   * A tela é 390 × 800, então cada rem de largura custa mais que o dobro em
   * altura: os degraus do md e do mobile compensam isso para a cena presa não
   * estourar — os limites foram medidos em 768 × 800 e 375 × 701, os dois
   * piores casos.
   */
  // `max-w-full` é o teto de largura: sem ele, tela alta e estreita transborda.
  return 'scrolly-phone w-[clamp(14rem,34svh,20rem)] max-w-full md:w-[18rem] lg:w-[26rem]'
}

/**
 * O aparelho e a tela que roda dentro dele.
 *
 * A tela é DOM, não vídeo: texto é texto, então fica nítido em qualquer
 * densidade e em qualquer zoom, e o peso da página cai. O relógio só corre na
 * aba visível — as três ficam montadas para a troca ser um fade, mas as duas
 * paradas não custam quadro nenhum.
 */
function Aparelho({
  label,
  tela: Conteudo,
  duracao,
  quadroParado,
  descricaoDaTela,
  className,
  ativo,
  reduced = false,
}: {
  label: string
  tela: () => ReactNode
  duracao: number
  quadroParado: number
  descricaoDaTela: string
  className: string
  ativo: boolean
  reduced?: boolean
}) {
  const quadro = useRelogio({ ativo, duracao, parado: reduced, quadroParado })
  return (
    <figure className={`relative mx-auto ${className}`}>
      <TrilhasOrbitando />
      {/* O aparelho cede as laterais para as órbitas, e nada precisa vazar da
          figura — que seria cortado pelo overflow da cena presa.

          É container justamente para o raio dos cantos: em `rem` o aro mantinha
          40px enquanto o aparelho encolhia de 258px para 178px, e o que era
          15,5% da largura virava 22,5% — aparelho de brinquedo. Em `cqw` a
          proporção é a mesma em qualquer tamanho, e 15,5% é onde o iPhone
          real fica. */}
      <div className="@container relative z-10 mx-auto w-[62%]">
        {/* Botões físicos: dois de volume à esquerda, um de energia à direita */}
        <span aria-hidden="true" className="absolute -left-0.5 top-[16%] h-[6%] w-1 rounded-full bg-forest-deep" />
        <span aria-hidden="true" className="absolute -left-0.5 top-[24%] h-[9%] w-1 rounded-full bg-forest-deep" />
        <span aria-hidden="true" className="absolute -right-0.5 top-[20%] h-[11%] w-1 rounded-full bg-forest-deep" />

        {/* Aro fino com sombra em duas camadas: elevação longa + contato curto.
            O raio da tela é o do aro menos a espessura do aro, que é como
            cantos concêntricos se comportam de verdade. */}
        <div className="relative rounded-[15.5cqw] bg-forest-deep p-1.5 shadow-[0_30px_60px_-18px_rgba(15,61,37,0.45),0_10px_20px_-10px_rgba(15,61,37,0.3)]">
          <div className="relative overflow-hidden rounded-[calc(15.5cqw-0.375rem)] bg-white">
            {/* Ilha dinâmica, sobre a tela. `top` em porcentagem, não em rem:
                com valor fixo ela mantém 10px enquanto a altura encolhe, então
                num aparelho pequeno ela desce dentro do vídeo e cobre o
                cabeçalho da tela — a barra de stories some atrás dela. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[1.25%] z-10 h-[2.8%] w-[27%] -translate-x-1/2 rounded-full bg-forest-deep"
            />
            {/* O conteúdo é decorativo para quem lê a página com leitor de
                tela: a legenda abaixo já diz o que a tela mostra, e ler o
                miolo seria despejar a interface inteira do app. */}
            <div className="w-full bg-white" aria-hidden="true">
              <Tela>
                <Palco quadro={quadro}>
                  <Conteudo />
                </Palco>
              </Tela>
            </div>
            <figcaption className="sr-only">{`Tela de “${label}”: ${descricaoDaTela}`}</figcaption>
          </div>
        </div>
      </div>
    </figure>
  )
}

export default function HowItWorks() {
  const [active, setActive] = useState(0)
  // Com preferência por menos movimento, a seção volta a ser abas estáticas, sem cena presa.
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const scrollyRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  /*
   * Destino de uma rolagem disparada por clique. Enquanto ela estiver em curso,
   * o ouvinte de rolagem não manda no passo ativo: a rolagem é suave e atravessa
   * as faixas do meio, então clicar no passo 3 vindo do 1 acendia o 2 no
   * caminho — era isso que piscava.
   */
  const destinoDoClique = useRef<number | null>(null)
  const travaDoClique = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(travaDoClique.current), [])

  /* A rolagem dirige o passo ativo: 100svh de rolagem por passo enquanto a cena está presa. */
  useEffect(() => {
    if (reduced) return
    const scrolly = scrollyRef.current
    const sticky = stickyRef.current
    if (!scrolly || !sticky) return
    let raf = 0
    const update = () => {
      raf = 0
      if (destinoDoClique.current !== null) {
        if (Math.abs(window.scrollY - destinoDoClique.current) < 2) destinoDoClique.current = null
        return
      }
      const scrollable = scrolly.offsetHeight - sticky.offsetHeight
      if (scrollable <= 0) return
      const progress = Math.min(Math.max(-scrolly.getBoundingClientRect().top / scrollable, 0), 0.999)
      setActive(Math.floor(progress * TABS.length))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  function goTo(index: number, moveFocus = false) {
    setActive(index)
    if (!reduced) {
      const scrolly = scrollyRef.current
      const sticky = stickyRef.current
      if (scrolly && sticky) {
        const top = scrolly.getBoundingClientRect().top + window.scrollY
        const scrollable = scrolly.offsetHeight - sticky.offsetHeight
        const destino = Math.round(top + ((index + 0.5) / TABS.length) * scrollable)
        destinoDoClique.current = destino
        /* Rede: se a rolagem não chegar ao alvo exato (fim de página, gesto do
           visitante no meio), a trava cai sozinha e o ouvinte volta a mandar. */
        window.clearTimeout(travaDoClique.current)
        travaDoClique.current = window.setTimeout(() => {
          destinoDoClique.current = null
        }, 900)
        window.scrollTo({ top: destino, behavior: 'smooth' })
      }
    }
    if (moveFocus) tabRefs.current[index]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    event.preventDefault()
    goTo((active + delta + TABS.length) % TABS.length, true)
  }

  return (
    <section id="como-funciona">
      {/* Scrollytelling: o wrapper alto dá 100svh de rolagem por passo; a cena fica presa no sticky */}
      <div
        ref={scrollyRef}
        className={reduced ? undefined : 'relative'}
        style={reduced ? undefined : { height: `${(TABS.length + 1) * 100}svh` }}
      >
        <div
          ref={stickyRef}
          className={
            reduced
              ? 'mx-auto w-full max-w-6xl px-5 pt-16 md:px-8 md:pt-24'
              : 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-5 md:px-8'
          }
        >
          {/*
            Duas colunas do topo: título, abas e texto do passo empilhados à
            esquerda, aparelho à direita centrado no conjunto. O texto vive no
            fluxo da coluna, logo abaixo das abas — antes ele dividia a célula
            com o aparelho e herdava a altura dele, o que abria um vão morto
            entre as abas e a frase.
          */}
          <div
            className={`grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 ${
              reduced ? '' : 'mx-auto w-full max-w-6xl'
            }`}
          >
            <div>
              <h2 className="max-w-[19ch] font-display text-[2rem] font-semibold leading-[1.03] tracking-display text-forest md:text-[2.75rem]">
                É isso que ele passa a ter em mãos.
              </h2>

              <div
                role="tablist"
                aria-label="Como funciona, em três passos"
                onKeyDown={onKeyDown}
                className="mt-7 flex flex-wrap gap-2.5"
              >
                {TABS.map((tab, i) => (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    role="tab"
                    id={`tab-${tab.id}`}
                    aria-selected={active === i}
                    aria-controls={`painel-${tab.id}`}
                    tabIndex={active === i ? 0 : -1}
                    onClick={() => goTo(i)}
                    /* No mobile a tag encolhe para devolver altura ao aparelho.
                       py-2.5 + disco de 24 mantém o alvo de toque em 44px. */
                    className={`flex items-center gap-2 rounded-full py-2.5 pl-2 pr-4 font-display text-sm font-medium transition-colors duration-200 md:gap-2.5 md:pl-2.5 md:pr-5 md:text-base ${
                      active === i ? 'bg-forest text-white' : 'bg-mint text-forest hover:bg-brand/20'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold md:h-7 md:w-7 md:text-sm ${
                        active === i ? 'bg-sun text-forest-deep' : 'bg-white text-forest'
                      }`}
                      aria-hidden="true"
                    >
                      {tab.n}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Os textos dividem a mesma célula e se alternam por opacidade */}
              <div className="mt-7 grid md:mt-8">
                {TABS.map((tab, i) => (
                  <p
                    key={tab.id}
                    role="tabpanel"
                    id={`painel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    aria-hidden={active !== i}
                    hidden={reduced && active !== i}
                    className={`col-start-1 row-start-1 max-w-[34ch] font-display text-2xl font-medium leading-[1.3] text-ink md:text-[2.1rem] ${
                      reduced
                        ? ''
                        : `transition-[opacity,transform] duration-500 ease-out ${
                            active === i
                              ? 'translate-y-0 opacity-100'
                              : 'pointer-events-none translate-y-3 opacity-0'
                          }`
                    }`}
                  >
                    {tab.text}
                  </p>
                ))}
              </div>
            </div>

            {/* Coluna do aparelho: as telas se alternam junto com o texto */}
            {/* `min-w-0` é o que segura a largura: a track de um grid tem
                mínimo `auto`, então ela cresce até caber a figura e o
                `max-w-full` dela passa a medir contra si mesma, sem limitar
                nada. Com o mínimo em zero, a track obedece ao pai e a figura
                é que se ajusta. */}
            {/* Só a figura visível é exposta ao leitor de tela: sem isso, as
                três legendas seriam lidas em sequência. O miolo de cada uma
                fica escondido de qualquer jeito, dentro do próprio Aparelho. */}
            <div className="grid w-full min-w-0 justify-items-center lg:w-auto">
              {TABS.map((tab, i) => (
                <div
                  key={tab.id}
                  hidden={reduced && active !== i}
                  aria-hidden={active !== i}
                  /* `w-full min-w-0`: este wrapper é o item do grid, e com
                     mínimo `auto` ele esticava até a largura pedida pela
                     figura — que então media o próprio `max-w-full` contra
                     ele, e nunca contra a coluna. */
                  className={`col-start-1 row-start-1 w-full min-w-0 ${
                    reduced
                      ? ''
                      : `transition-opacity duration-500 ease-out ${
                          active === i ? 'opacity-100' : 'pointer-events-none opacity-0'
                        }`
                  }`}
                >
                  <Aparelho
                    label={tab.label}
                    tela={tab.tela}
                    duracao={tab.duracao}
                    quadroParado={tab.quadroParado}
                    descricaoDaTela={tab.descricaoDaTela}
                    ativo={active === i}
                    reduced={reduced}
                    className={larguraDaFigura(reduced)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 md:px-8 md:pb-24">
        <p className="border-t-2 border-mint pt-8 text-center font-display text-2xl font-medium tracking-display text-forest md:text-3xl">
          O Destrava construiu o caminho que faltava.
        </p>
      </div>
    </section>
  )
}
