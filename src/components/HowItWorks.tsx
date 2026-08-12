import { useRef, useState } from 'react'
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
  titulo: string
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
    titulo: 'Ele treina a entrevista antes da entrevista.',
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
    titulo: 'O que ninguém sentou pra ensinar pra ele.',
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
    titulo: 'Aqui ele pode errar quantas vezes precisar.',
    text: 'Ele refaz quantas vezes precisar, até a resposta sair boa.',
    tela: Relatorio,
    duracao: DURACAO_RELATORIO,
    quadroParado: PARADO_RELATORIO,
    descricaoDaTela: 'o relatório da simulação, com a nota, o que ele acertou, o que dá pra melhorar e o botão de refazer',
  },
]

/* Órbitas decorativas: o texto do passo já nomeia as quatro. Valem para os
   três passos — em um só, o aparelho mudaria de tamanho na troca de aba. */
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

/* Seta de navegação do carrossel. Dá a volta nas duas pontas, então nunca
   fica desabilitada. Disco de 44px, que é o mínimo de alvo de toque; é
   controle, e por isso não leva `aria-hidden`. */
function Seta({ sentido, onClick }: { sentido: 'anterior' | 'proximo'; onClick: () => void }) {
  const anterior = sentido === 'anterior'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={anterior ? 'Passo anterior' : 'Próximo passo'}
      className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-mint text-forest transition-[background-color,color,transform] duration-200 hover:bg-brand hover:text-white active:scale-95 ${
        anterior ? 'left-0' : 'right-0'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={anterior ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}

/* Largura da figura do passo, igual nos três. A figura é maior que o
   aparelho: o mock ocupa o miolo e as trilhas ficam nas laterais. */
const LARGURA_DA_FIGURA = 'w-full max-w-[22rem] md:max-w-[24rem] lg:max-w-none'

/* O aparelho e a tela que roda dentro dele. O relógio só corre na aba
   visível; as três ficam montadas para a troca ser um fade. */
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
      {/* O raio dos cantos é `cqw` e não `rem`: em medida fixa a proporção do aro
         muda conforme o aparelho encolhe. 15,5% é a proporção do aparelho real. */}
      <div className="@container relative z-10 mx-auto w-[62%]">
        <span aria-hidden="true" className="absolute -left-0.5 top-[16%] h-[6%] w-1 rounded-full bg-forest-deep" />
        <span aria-hidden="true" className="absolute -left-0.5 top-[24%] h-[9%] w-1 rounded-full bg-forest-deep" />
        <span aria-hidden="true" className="absolute -right-0.5 top-[20%] h-[11%] w-1 rounded-full bg-forest-deep" />

        {/* O raio da tela é o do aro menos a espessura do aro, que é como cantos
           concêntricos se comportam. */}
        <div className="relative rounded-[15.5cqw] bg-forest-deep p-1.5 shadow-[0_30px_60px_-18px_rgba(15,61,37,0.45),0_10px_20px_-10px_rgba(15,61,37,0.3)]">
          <div className="relative overflow-hidden rounded-[calc(15.5cqw-0.375rem)] bg-white">
            {/* Ilha dinâmica. `top` em porcentagem, não em rem: com valor fixo ela desce
               dentro da tela conforme o aparelho encolhe e cobre o cabeçalho. */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[1.25%] z-10 h-[2.8%] w-[27%] -translate-x-1/2 rounded-full bg-forest-deep"
            />
            {/* Miolo escondido do leitor de tela: a legenda abaixo já diz o que a tela
               mostra, e ler o conteúdo seria despejar a interface inteira do app. */}
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
  /* Com preferência por menos movimento, a troca de passo é instantânea. */
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  /* O passo é dado só por quem clica: tag, seta ou teclado. */
  function goTo(index: number, moveFocus = false) {
    /* Dá a volta nos dois sentidos. O `+ TABS.length` antes do módulo é o que
       faz o passo -1 virar o último em vez de NaN negativo. */
    const alvo = (index + TABS.length) % TABS.length
    setActive(alvo)
    if (moveFocus) tabRefs.current[alvo]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    event.preventDefault()
    goTo(active + delta, true)
  }

  return (
    <section id="como-funciona" className="px-5 py-16 md:px-8 md:py-24">
      {/* `relative` dá referência às setas, que são absolutas contra a cena inteira.
         O `overflow-hidden` segura o passo que entra deslizando pela borda. */}
      <div className="relative mx-auto w-full max-w-6xl overflow-hidden">
        {/* Altura em `min-h` e não `h`: numa janela baixa e larga o aparelho tem
           altura própria, e um teto rígido o cortaria. */}
        {/* No mobile as setas passam por cima da cena: reservar 44px de cada lado
           custaria um terço da largura do aparelho. Elas caem sobre a margem
           transparente da figura, larga o bastante para não encobri-lo. */}
        <div className="flex min-h-[75svh] flex-col justify-center md:px-16">
          <Seta sentido="anterior" onClick={() => goTo(active - 1)} />
          <Seta sentido="proximo" onClick={() => goTo(active + 1)} />

          {/* A coluna do aparelho tem largura declarada, e não `auto`: com track
             automática e a figura em `w-full`, a largura fica circular e a coluna zera. */}
          <div className="grid gap-8 lg:grid-cols-[1fr_28rem] lg:items-center lg:gap-16">
            <div>
              <div
                role="tablist"
                aria-label="Como funciona, em três passos"
                onKeyDown={onKeyDown}
                className="flex flex-wrap gap-2.5"
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
                    /* No mobile a tag encolhe para devolver altura ao aparelho. py-2.5 mais
                       disco de 24 mantêm o alvo de toque em 44px. */
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

              {/* Título e texto do passo dividem a mesma célula e deslizam. O deslocamento
                 sai de `i - active`: quem está antes espera à esquerda, quem está depois
                 espera à direita, então o sentido sai certo mesmo pulando do 1 para o 3. */}
              <div className="mt-7 grid md:mt-8">
                {TABS.map((tab, i) => (
                  <div
                    key={tab.id}
                    role="tabpanel"
                    id={`painel-${tab.id}`}
                    aria-labelledby={`tab-${tab.id}`}
                    aria-hidden={active !== i}
                    hidden={reduced && active !== i}
                    style={reduced ? undefined : { transform: `translateX(${(i - active) * 2.5}rem)` }}
                    className={`col-start-1 row-start-1 ${
                      reduced
                        ? ''
                        : `transition-[opacity,transform] duration-500 ease-out ${
                            active === i ? 'opacity-100' : 'pointer-events-none opacity-0'
                          }`
                    }`}
                  >
                    <h2 className="max-w-[19ch] font-display text-[2rem] font-semibold leading-[1.03] tracking-display text-forest md:text-[2.75rem]">
                      {tab.titulo}
                    </h2>
                    <p className="mt-4 max-w-[34ch] font-display text-xl font-medium leading-[1.35] text-ink md:mt-5 md:text-[1.6rem]">
                      {tab.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* `min-w-0` é o que segura a largura: a track de um grid tem mínimo `auto`,
               então cresceria até caber a figura e o `max-w-full` dela mediria contra si
               mesma. */}
            {/* Só a figura visível é exposta ao leitor de tela: sem isso, as três legendas
               seriam lidas em sequência. */}
            <div className="grid w-full min-w-0 justify-items-center">
              {TABS.map((tab, i) => (
                <div
                  key={tab.id}
                  hidden={reduced && active !== i}
                  aria-hidden={active !== i}
                  /* `w-full min-w-0` pelo mesmo motivo da coluna: este wrapper é o item do
                     grid. */
                  style={reduced ? undefined : { transform: `translateX(${(i - active) * 4}rem)` }}
                  className={`col-start-1 row-start-1 w-full min-w-0 ${
                    reduced
                      ? ''
                      : `transition-[opacity,transform] duration-500 ease-out ${
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
                    className={LARGURA_DA_FIGURA}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl pt-14 md:pt-20">
        <p className="border-t-2 border-mint pt-8 text-center font-display text-2xl font-medium tracking-display text-forest md:text-3xl">
          O Destrava construiu o caminho que faltava.
        </p>
      </div>
    </section>
  )
}
