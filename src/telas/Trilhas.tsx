import didi from '../assets/app-didi.webp'
import menuAbas from '../assets/app-menu-abas.webp'
import iconePratica from '../assets/app-icone-pratica.svg'
import iconeLeitura from '../assets/app-icone-leitura.svg'
import iconeSimulacao from '../assets/app-icone-simulacao.svg'
import iconeQuiz from '../assets/app-icone-quiz.svg'
import { BarraDeStatus, Camada, Toque } from './aparelho'
import { LARGURA, TOPO_SEGURO } from './medidas'
import { JAKARTA, LEXEND } from './fontes'
import { interpolar, mola, suave, useEntrada, useQuadro } from './tempo'

/** Um desenho por tipo de atividade; o travado é o mesmo em escala de cinza. */
const ICONES: Record<string, string> = {
  pratica: iconePratica,
  leitura: iconeLeitura,
  simulacao: iconeSimulacao,
  quiz: iconeQuiz,
}

/* As trilhas (Figma 2966:15527), a leitura (1315:1281) e o exercício
   (887:12714). O percurso abre a trilha, entra na leitura e passa para o
   exercício em formato de stories, com o exercício sendo respondido.
   
   Só ilustração é bitmap (Didi, os quatro ícones de atividade e a barra de
   abas). O resto é markup, inclusive os ícones de traço, cujos paths vêm da
   exportação dos nós.
   
   Tipografia e cor vêm do arquivo: Lexend Deca em título e rótulo, Plus
   Jakarta Sans em corpo.
   
   Duas diferenças em relação ao arquivo, ambas deliberadas: a atividade atual
   aqui é "Leitura" e não "Simulação", porque é ela que abre as duas telas
   seguintes; e a leitura fala de LinkedIn enquanto o exercício fala de
   dinheiro, porque são sessões de trilhas diferentes no arquivo. */

export const DURACAO = 496
/** Quadro exibido quando o visitante pediu menos movimento: exercício respondido. */
export const QUADRO_PARADO = 460

const COR = {
  texto: '#272727',
  textoQuiz: '#1c1b1f',
  apoio: '#4e4e4f',
  apoioClaro: '#626263',
  cinzaTravado: '#a0a0a1',
  borda: '#dfdfdf',
  trilho: '#f4f4f4',
  verde: '#28a37a',
  verdeClaro: '#33cc99',
  verdeEscuro: '#1e7a5b',
  mint: '#d6f4ea',
  preto: '#131313',
  chave: '#fba71e',
  raio: '#ffb833',
  enunciado: '#424242',
  opcao: '#242326',
}

/* ------------------------------------------------------------------ tempo */

const ROLA_TRILHA_DE = 55
const ROLA_TRILHA_ATE = 105
const TOQUE_CARTAO = 108
const ABRE_HISTORIAS = 122
/* Logo depois da abertura, pelo mesmo motivo do exercício: a tela chega composta. */
const ENTRA_LEITURA = ABRE_HISTORIAS + 4
const ROLA_TEXTO_DE = 200
const ROLA_TEXTO_ATE = 288
const ENTRA_BOTAO_LER = 232
const TOQUE_BOTAO_LER = 292
const VIRA_CARTAO = 306
/* Junto com a virada, não depois: cartão de stories entra composto, e um
   cartão em branco deslizando para dentro denuncia que é montagem. */
const ENTRA_QUIZ = VIRA_CARTAO
const TOQUE_OPCAO = 400
const ACERTA = 408
const ENTRA_TOAST = 426
const SAI = DURACAO - 16

/** Deslocamento da trilha quando a atividade atual entra em quadro. */
const ROLAGEM_TRILHA = 440

/* ------------------------------------------------------------------ ícones */
/* Paths exportados dos nós do arquivo; só a cor e o tamanho são parâmetro. */

function IconeZap({ tamanho = 14 }: { tamanho?: number }) {
  return (
    <svg viewBox="0 0 12.504 13.6697" width={(tamanho * 12.504) / 13.6697} height={tamanho} fill="none">
      <path
        d="M1.58532 8.00152C1.47494 8.0019 1.36671 7.97094 1.27321 7.91226C1.17972 7.85357 1.10479 7.76956 1.05714 7.66999C1.0095 7.57041 0.991077 7.45936 1.00403 7.34974C1.01699 7.24011 1.06078 7.13641 1.13032 7.05069L6.90532 1.10069C6.94864 1.05068 7.00767 1.0169 7.07273 1.00486C7.13778 0.992834 7.205 1.00328 7.26333 1.03448C7.32167 1.06568 7.36766 1.11579 7.39377 1.17658C7.41987 1.23737 7.42453 1.30523 7.40699 1.36902L6.28699 4.88069C6.25396 4.96908 6.24287 5.06416 6.25467 5.15778C6.26646 5.25139 6.30079 5.34075 6.35471 5.41819C6.40863 5.49562 6.48052 5.55882 6.56423 5.60236C6.64794 5.64591 6.74097 5.66849 6.83532 5.66819H10.9187C11.029 5.66781 11.1373 5.69876 11.2308 5.75745C11.3243 5.81614 11.3992 5.90015 11.4468 5.99972C11.4945 6.0993 11.5129 6.21035 11.4999 6.31997C11.487 6.4296 11.4432 6.5333 11.3737 6.61902L5.59866 12.569C5.55534 12.619 5.49631 12.6528 5.43125 12.6648C5.3662 12.6769 5.29898 12.6664 5.24065 12.6352C5.18231 12.604 5.13632 12.5539 5.11021 12.4931C5.08411 12.4323 5.07944 12.3645 5.09699 12.3007L6.21699 8.78902C6.25002 8.70063 6.26111 8.60555 6.24931 8.51193C6.23752 8.41832 6.20319 8.32896 6.14927 8.25152C6.09535 8.17409 6.02346 8.11089 5.93975 8.06734C5.85604 8.0238 5.76301 8.00121 5.66866 8.00152H1.58532Z"
        stroke={COR.raio}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeX({ cor }: { cor: string }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none">
      <path d="M18 6L6 18M6 6L18 18" stroke={cor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconeCheckTrilha() {
  return (
    <svg viewBox="0 0 18.6667 18.6667" width={20} height={20} fill="none">
      <path
        d="M6.83333 9.33333L8.5 11L11.8333 7.66667M17.6667 9.33333C17.6667 13.9357 13.9357 17.6667 9.33333 17.6667C4.73096 17.6667 1 13.9357 1 9.33333C1 4.73096 4.73096 1 9.33333 1C13.9357 1 17.6667 4.73096 17.6667 9.33333Z"
        stroke={COR.verde}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeCadeado() {
  return (
    <svg viewBox="0 0 15.5 17" width={18} height={18} fill="none">
      <path
        d="M4 7.75V4.75C4 3.75544 4.39509 2.80161 5.09835 2.09835C5.80161 1.39509 6.75544 1 7.75 1C8.74456 1 9.69839 1.39509 10.4017 2.09835C11.1049 2.80161 11.5 3.75544 11.5 4.75V7.75M2.5 7.75H13C13.8284 7.75 14.5 8.42157 14.5 9.25V14.5C14.5 15.3284 13.8284 16 13 16H2.5C1.67157 16 1 15.3284 1 14.5V9.25C1 8.42157 1.67157 7.75 2.5 7.75Z"
        stroke={COR.cinzaTravado}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeCheckOpcao({ tamanho }: { tamanho: number }) {
  return (
    <svg viewBox="0 0 13.43 13.43" width={tamanho} height={tamanho} fill="none">
      <path
        d="M5.03625 6.715L6.15542 7.83417L8.39375 5.59583M12.3108 6.715C12.3108 9.80549 9.80549 12.3108 6.715 12.3108C3.62451 12.3108 1.11917 9.80549 1.11917 6.715C1.11917 3.62451 3.62451 1.11917 6.715 1.11917C9.80549 1.11917 12.3108 3.62451 12.3108 6.715Z"
        stroke="#ffffff"
        strokeWidth={1.11917}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeChave() {
  return (
    <svg viewBox="0 0 33.2423 16.0001" width={33.24} height={16} fill="none">
      <path
        d="M14.9716 7.48581C14.9716 11.6201 11.6201 14.9716 7.48581 14.9716C3.35151 14.9716 0 11.6201 0 7.48581C0 3.35151 3.35151 0 7.48581 0C11.6201 0 14.9716 3.35151 14.9716 7.48581ZM3.66799 7.48581C3.66799 9.59434 5.37729 11.3036 7.48581 11.3036C9.59434 11.3036 11.3036 9.59434 11.3036 7.48581C11.3036 5.37729 9.59434 3.66799 7.48581 3.66799C5.37729 3.66799 3.66799 5.37729 3.66799 7.48581Z"
        fill={COR.chave}
      />
      <rect x="13.7716" y="5.71429" width="19.4286" height="3.42857" fill={COR.chave} />
      <rect x="28.6707" y="5.71429" width="4.57143" height="10.2857" fill={COR.chave} />
      <rect x="21.7716" y="5.78934" width="4.57143" height="9.14286" fill={COR.chave} />
      <path
        d="M1.56638 4.97521C2.14976 3.60897 4.0459 1.84533 5.5253 1.46882"
        stroke="#ffbb52"
        strokeWidth={0.981941}
        strokeLinecap="round"
      />
      <path d="M17.2002 6.85714H30.9145" stroke="#ffbb52" strokeWidth={1.32558} strokeLinecap="round" />
    </svg>
  )
}

function IconeJoinha({ paraBaixo = false }: { paraBaixo?: boolean }) {
  const desenho = paraBaixo
    ? 'M14.1663 11.6667V1.66667M7.49961 15.1L8.33294 11.6667H3.47461C3.21587 11.6667 2.96068 11.6064 2.72925 11.4907C2.49783 11.375 2.29652 11.207 2.14128 11C1.98603 10.793 1.88111 10.5527 1.83483 10.2981C1.78854 10.0436 1.80216 9.78172 1.87461 9.53333L3.81628 2.86667C3.91725 2.52047 4.12778 2.21637 4.41628 2C4.70477 1.78363 5.05566 1.66667 5.41628 1.66667H16.6663C17.1083 1.66667 17.5322 1.84226 17.8448 2.15482C18.1573 2.46738 18.3329 2.89131 18.3329 3.33333V10C18.3329 10.442 18.1573 10.866 17.8448 11.1785C17.5322 11.4911 17.1083 11.6667 16.6663 11.6667H14.3663C14.0562 11.6668 13.7523 11.7535 13.4888 11.9169C13.2253 12.0803 13.0126 12.314 12.8746 12.5917L9.99961 18.3333C9.60663 18.3285 9.21983 18.2349 8.86811 18.0595C8.51638 17.8841 8.20884 17.6316 7.96844 17.3207C7.72804 17.0098 7.56101 16.6485 7.47983 16.264C7.39864 15.8795 7.40541 15.4816 7.49961 15.1Z'
    : 'M5.83366 8.33333V18.3333M12.5003 4.9L11.667 8.33333H16.5253C16.7841 8.33333 17.0393 8.39357 17.2707 8.50929C17.5021 8.625 17.7034 8.79301 17.8587 9C18.0139 9.20699 18.1188 9.44729 18.1651 9.70186C18.2114 9.95643 18.1978 10.2183 18.1253 10.4667L16.1837 17.1333C16.0827 17.4795 15.8722 17.7836 15.5837 18C15.2952 18.2164 14.9443 18.3333 14.5837 18.3333H3.33366C2.89163 18.3333 2.46771 18.1577 2.15515 17.8452C1.84259 17.5326 1.66699 17.1087 1.66699 16.6667V10C1.66699 9.55797 1.84259 9.13405 2.15515 8.82149C2.46771 8.50893 2.89163 8.33333 3.33366 8.33333H5.63366C5.94373 8.33317 6.24761 8.24651 6.51112 8.0831C6.77464 7.91969 6.98734 7.68601 7.12533 7.40833L10.0003 1.66667C10.3933 1.67153 10.7801 1.76514 11.1318 1.9405C11.4836 2.11585 11.7911 2.36842 12.0315 2.67934C12.2719 2.99025 12.4389 3.35147 12.5201 3.736C12.6013 4.12054 12.5945 4.51845 12.5003 4.9Z'
  return (
    <svg viewBox="0 0 20 20" width={20} height={20} fill="none">
      <path d={desenho} stroke="#ffffff" strokeWidth={1.66667} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconeSeta() {
  return (
    <svg viewBox="0 0 13.6667 13.6667" width={20} height={20} fill="none">
      <path
        d="M6.83333 1V12.6667M1 6.83333L6.83333 12.6667L12.6667 6.83333"
        stroke={COR.texto}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ trilha */

type Estado = 'feito' | 'atual' | 'travado'

type Atividade = {
  tipo: string
  medida: string
  descricao: string
  icone: string
  estado: Estado
  altura: number
}

/*
 * Alturas fixas como no arquivo (64 para descrição de uma linha, 74 para duas,
 * 90 para a atual, que perde largura para o botão). Fixas de propósito: é
 * delas que sai a posição da atividade atual, e é essa posição que a rolagem e
 * a marca de toque precisam saber sem depender de medir o render.
 */
const ATIVIDADES: Atividade[] = [
  {
    tipo: 'Prática',
    medida: '· 15 min',
    descricao: 'Um exercício pra fazer agora e usar no dia.',
    icone: 'pratica',
    estado: 'feito',
    altura: 64,
  },
  {
    tipo: 'Simulação',
    medida: '· 10 turnos',
    descricao: 'Você conversa com o recrutador e recebe devolutiva no fim.',
    icone: 'simulacao',
    estado: 'feito',
    altura: 74,
  },
  {
    tipo: 'Leitura',
    medida: '· 5 min',
    descricao: 'Conteúdo curto sobre o que cai na sua entrevista.',
    icone: 'leitura',
    estado: 'atual',
    altura: 90,
  },
  {
    tipo: 'Quiz',
    medida: '· 4 min',
    descricao: 'Perguntas rápidas pra fixar o que você acabou de ver.',
    icone: 'quiz',
    estado: 'travado',
    altura: 74,
  },
  {
    tipo: 'Simulação',
    medida: '· 10 turnos',
    descricao: 'Você conversa com o recrutador e recebe devolutiva no fim.',
    icone: 'simulacao',
    estado: 'travado',
    altura: 74,
  },
  {
    tipo: 'Prática',
    medida: '· 15 min',
    descricao: 'Um exercício pra fazer agora e usar no dia.',
    icone: 'pratica',
    estado: 'travado',
    altura: 64,
  },
  {
    tipo: 'Leitura',
    medida: '· 5 min',
    descricao: 'Conteúdo curto sobre o que cai na sua entrevista.',
    icone: 'leitura',
    estado: 'travado',
    altura: 64,
  },
  {
    tipo: 'Quiz',
    medida: '· 4 min',
    descricao: 'Perguntas rápidas pra fixar o que você acabou de ver.',
    icone: 'quiz',
    estado: 'travado',
    altura: 74,
  },
]

const ALTURA_CABECALHO_TRILHA = 562
const TOPO_DA_LISTA = 24
const ALTURA_CONECTOR = 18
const MARGEM_LISTA = 16
const ALTURA_ABAS = 97

/** Topo de cada atividade dentro da tela, já com o cartão de contagem somado. */
const TOPOS = ATIVIDADES.reduce<number[]>((acc, _, i) => {
  const anterior = i === 0 ? ALTURA_CABECALHO_TRILHA + TOPO_DA_LISTA : acc[i - 1] + ATIVIDADES[i - 1].altura + ALTURA_CONECTOR
  acc.push(anterior)
  return acc
}, [])

const INDICE_ATUAL = ATIVIDADES.findIndex((a) => a.estado === 'atual')
const TOPO_ATUAL_NA_TELA = TOPOS[INDICE_ATUAL] + TOPO_SEGURO - ROLAGEM_TRILHA
/* Centro do botão "Iniciar": x=244 dentro da lista, 105 de largura, y=28, 34 de altura. */
const TOQUE_INICIAR = { x: MARGEM_LISTA + 244 + 52.5, y: TOPO_ATUAL_NA_TELA + 28 + 17 }

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: COR.preto,
        borderRadius: 9999,
        padding: '4px 10px',
        fontFamily: LEXEND,
        fontSize: 14,
        fontWeight: 600,
        lineHeight: '18px',
        color: '#ffffff',
      }}
    >
      {children}
    </div>
  )
}

function CartaoContagem() {
  const cabecalho = useEntrada(0)
  const avatar = useEntrada(8)
  const nivel = useEntrada(14)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        padding: '28px 20px',
        height: ALTURA_CABECALHO_TRILHA,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ ...cabecalho, display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
        <div style={{ flex: 1, height: 8, borderRadius: 999, backgroundColor: COR.trilho, overflow: 'hidden' }}>
          <div style={{ width: 38, height: 8, borderRadius: 999, backgroundColor: COR.verde }} />
        </div>
        <Chip>2/18</Chip>
        <Chip>
          <IconeZap />3
        </Chip>
      </div>

      <div style={{ ...cabecalho, display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: LEXEND,
            fontSize: 24,
            fontWeight: 500,
            lineHeight: '36px',
            color: COR.texto,
          }}
        >
          Faltam 5 dias!
        </p>
        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontFamily: JAKARTA,
            fontSize: 14,
            lineHeight: '24px',
            color: COR.apoio,
          }}
        >
          Sua trilha para a vaga de Analista de dados na Nubank. Cada atividade gasta 1 de energia. Faça no seu ritmo.
        </p>
      </div>

      <div style={{ ...avatar, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ position: 'relative', width: 206, height: 206 }}>
          <img alt="" src={didi}
            style={{
              position: 'absolute',
              left: 13,
              top: 13,
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: `2px solid ${COR.borda}`,
              boxSizing: 'border-box',
              objectFit: 'cover',
            }}
          />
          {/* Arco de progresso do nível, sobre o aro */}
          <svg
            viewBox="0 0 70.5084 32.4213"
            width={70.51}
            height={32.42}
            fill="none"
            style={{ position: 'absolute', left: 103, top: 0 }}
          >
            <path
              d="M1.22826e-06 0C26.1977 3.12405e-07 51.411 9.98266 70.5084 27.9163L66.2779 32.4213C48.3264 15.5637 24.6259 6.18 1.15457e-06 6.18L1.22826e-06 0Z"
              fill={COR.verdeClaro}
            />
          </svg>
        </div>
        <div style={{ ...nivel, textAlign: 'center', fontFamily: JAKARTA, fontSize: 14, lineHeight: '24px' }}>
          <p style={{ margin: 0, fontWeight: 600, color: COR.texto }}>Nível 2: Dando aquela estudada</p>
          <p style={{ margin: 0, color: COR.apoioClaro }}>Próximo nível em 2 atividades.</p>
        </div>
      </div>

      <div
        style={{
          ...nivel,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 46,
          padding: '12px 24px',
          borderRadius: 10,
          backgroundColor: '#ffffff',
          border: `2px solid ${COR.borda}`,
          boxShadow: `0 6px 0 ${COR.borda}`,
          boxSizing: 'border-box',
          fontFamily: LEXEND,
          fontSize: 16,
          fontWeight: 600,
          lineHeight: '20px',
          color: COR.texto,
        }}
      >
        Configurar
      </div>
    </div>
  )
}

function LinhaAtividade({ atividade, entra, pressao }: { atividade: Atividade; entra: number; pressao: number }) {
  const estilo = useEntrada(entra)
  const atual = atividade.estado === 'atual'
  const travado = atividade.estado === 'travado'
  return (
    <div
      style={{
        ...estilo,
        transform: `${estilo.transform} scale(${atual ? pressao : 1})`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: atividade.altura,
        padding: '8px 12px',
        borderRadius: 12,
        boxSizing: 'border-box',
        backgroundColor: atual ? COR.mint : 'transparent',
      }}
    >
      {/* Um desenho por tipo: o estado travado é o mesmo SVG dessaturado, que é
          o que o arquivo faz (medido — #fed380 vira #d6d6d6, a luminância dele). */}
      <img alt="" src={ICONES[atividade.icone]}
        style={{ width: 48, height: 48, flexShrink: 0, filter: travado ? 'grayscale(1)' : undefined }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: LEXEND,
              fontSize: 14,
              fontWeight: 500,
              lineHeight: '24px',
              color: travado ? COR.cinzaTravado : COR.texto,
            }}
          >
            {atividade.tipo}
          </span>
          <span
            style={{
              fontFamily: LEXEND,
              fontSize: 12,
              fontWeight: 300,
              lineHeight: '16px',
              color: travado ? COR.cinzaTravado : COR.apoio,
            }}
          >
            {atividade.medida}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: JAKARTA,
            fontSize: 10,
            lineHeight: '16px',
            color: travado ? COR.cinzaTravado : COR.apoio,
          }}
        >
          {atividade.descricao}
        </p>
      </div>
      {atual ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 9999,
            backgroundColor: COR.verdeEscuro,
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: LEXEND, fontSize: 12, lineHeight: '16px', color: '#ffffff' }}>Iniciar</span>
          <IconeZap />
          <span style={{ fontFamily: LEXEND, fontSize: 14, fontWeight: 600, lineHeight: '18px', color: '#ffffff' }}>
            -1
          </span>
        </div>
      ) : travado ? (
        <IconeCadeado />
      ) : (
        <IconeCheckTrilha />
      )}
    </div>
  )
}

function TelaTrilha() {
  const quadro = useQuadro()

  const rolagem = interpolar(quadro, [ROLA_TRILHA_DE, ROLA_TRILHA_ATE], [0, ROLAGEM_TRILHA],
    suave,
  )

  /* Afundar e voltar: o cartão responde ao dedo antes de a tela abrir. */
  const volta = mola(quadro - TOQUE_CARTAO - 5, { damping: 14, stiffness: 200, mass: 0.6 })
  const afunda = interpolar(quadro, [TOQUE_CARTAO, TOQUE_CARTAO + 5], [0, 1])
  const pressao = 1 - 0.03 * afunda * (1 - volta)

  return (
    <Camada style={{ backgroundColor: '#ffffff' }}>
      <div style={{ paddingTop: TOPO_SEGURO, transform: `translateY(${-rolagem}px)` }}>
        <CartaoContagem />
        <div style={{ padding: `${TOPO_DA_LISTA}px ${MARGEM_LISTA}px 0` }}>
          {ATIVIDADES.map((atividade, i) => (
            <div key={i}>
              {i > 0 && (
                <div style={{ height: ALTURA_CONECTOR, display: 'flex', paddingLeft: 34 }}>
                  <div
                    style={{
                      width: 4,
                      height: '100%',
                      borderRadius: 999,
                      backgroundColor: i <= INDICE_ATUAL ? COR.verdeEscuro : COR.trilho,
                    }}
                  />
                </div>
              )}
              <LinhaAtividade atividade={atividade} entra={18 + i * 4} pressao={pressao} />
            </div>
          ))}
        </div>
      </div>

      {/* A lista rola por baixo da barra de status, então o topo é opaco. */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: LARGURA, height: TOPO_SEGURO, backgroundColor: '#ffffff' }}
      />

      {/* Fundo branco explícito: a exportação da barra tem área transparente
          embaixo dos rótulos, e sem ele a lista rolando aparece por trás. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: LARGURA,
          height: ALTURA_ABAS,
          backgroundColor: '#ffffff',
        }}
      >
        <img alt="" src={menuAbas} style={{ width: LARGURA, height: ALTURA_ABAS }} />
      </div>
      <Toque x={TOQUE_INICIAR.x} y={TOQUE_INICIAR.y} quando={TOQUE_CARTAO} />
    </Camada>
  )
}

/* -------------------------------------------------------------- histórias */

/**
 * Barra de stories: dez segmentos, com o segmento vivo enchendo no tempo.
 * Trilho e preenchimento são irmãos, não pai e filho: aninhados, a opacidade do
 * trilho multiplicaria a do preenchimento e o segmento vivo nunca chegaria a
 * cheio. `tingidoAte` reproduz o arquivo, onde os segmentos da seção atual já
 * vêm na cor da marca mesmo antes de serem vistos.
 */
function BarraStories({
  vivo,
  progresso,
  corCheia,
  corVazia,
  opacidadeVazia,
  tingidoAte = -1,
}: {
  vivo: number
  progresso: number
  corCheia: string
  corVazia: string
  opacidadeVazia: number
  tingidoAte?: number
}) {
  return (
    <div style={{ flex: 1, display: 'flex', gap: 8, height: 8 }}>
      {Array.from({ length: 10 }, (_, i) => {
        const preenchido = i < vivo ? 1 : i === vivo ? progresso : 0
        return (
          <div key={i} style={{ position: 'relative', flex: 1, height: 8 }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 9999,
                backgroundColor: i <= tingidoAte ? corCheia : corVazia,
                opacity: opacidadeVazia,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${preenchido * 100}%`,
                borderRadius: 9999,
                backgroundColor: corCheia,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function CabecalhoHistoria({ corX, children }: { corX: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        height: 63,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '12px 24px 12px 16px',
        boxSizing: 'border-box',
      }}
    >
      <IconeX cor={corX} />
      {children}
    </div>
  )
}

function PilulaAvaliar() {
  return (
    <div
      style={{
        /* Ancorada à direita: no arquivo ela encosta na borda e sangra à esquerda. */
        position: 'absolute',
        right: 0,
        top: 71.8 + TOPO_SEGURO,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 12px',
        borderRadius: 99,
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconeChave />
        <span
          style={{ fontFamily: LEXEND, fontSize: 16, lineHeight: '20px', color: '#ffffff', whiteSpace: 'nowrap' }}
        >
          Avalie e ganhe chaves!
        </span>
      </div>
      <IconeJoinha />
      <IconeJoinha paraBaixo />
    </div>
  )
}

const PARAGRAFOS = [
  'Evite mencionar queixas sobre empregos anteriores ou expressar opiniões políticas extremas no seu perfil.',
  'Fotos de festas com legendas inadequadas também não são bem-vindas. É fundamental manter um tom profissional e evitar indiretas sobre colegas ou superiores, assim como não compartilhar conteúdo agressivo sobre qualquer grupo.',
  'Lembre-se de que o LinkedIn é uma vitrine para sua carreira, onde você deve destacar suas habilidades e conquistas. Este não é o lugar para desabafar ou processar sentimentos. Para isso, utilize suas redes sociais pessoais, que são mais adequadas para discussões informais.',
  'Mantenha seu perfil focado em sua trajetória profissional e nos objetivos que deseja alcançar. Um perfil bem elaborado pode abrir portas e criar oportunidades, então cuide da sua imagem e do conteúdo que compartilha.',
]

function Paragrafo({ texto, entra }: { texto: string; entra: number }) {
  const estilo = useEntrada(entra)
  return (
    <p style={{ ...estilo, margin: '0 0 28px', fontFamily: JAKARTA, fontSize: 16, lineHeight: '28px', color: '#ffffff' }}>
      {texto}
    </p>
  )
}

function CartaoLeitura() {
  const quadro = useQuadro()
  const titulo = useEntrada(ENTRA_LEITURA)

  const progresso = interpolar(quadro, [ENTRA_LEITURA, VIRA_CARTAO], [0, 1])
  const rolagem = interpolar(quadro, [ROLA_TEXTO_DE, ROLA_TEXTO_ATE], [0, 140],
    suave,
  )
  const botao = mola(quadro - ENTRA_BOTAO_LER, { damping: 15, stiffness: 120, mass: 0.8 })
  /* O botão afunda os 6px da própria sombra quando recebe o toque. */
  const afunda = interpolar(quadro, [TOQUE_BOTAO_LER, TOQUE_BOTAO_LER + 5], [0, 6])

  return (
    <Camada style={{ backgroundColor: COR.verde, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          left: 35,
          top: 142 + TOPO_SEGURO,
          width: 320,
          transform: `translateY(${-rolagem}px)`,
        }}
      >
        <p
          style={{
            ...titulo,
            margin: '0 0 24px',
            fontFamily: LEXEND,
            fontSize: 24,
            fontWeight: 500,
            lineHeight: '36px',
            color: '#ffffff',
          }}
        >
          O que nunca postar se quer ser contratado
        </p>
        {PARAGRAFOS.map((texto, i) => (
          <Paragrafo key={i} texto={texto} entra={ENTRA_LEITURA + 12 + i * 11} />
        ))}
      </div>

      {/* O texto some antes do rodapé, como no arquivo: lá é máscara, aqui é a
          própria cor de fundo — o resultado é o mesmo e não viaja com a rolagem. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 600,
          bottom: 0,
          background: `linear-gradient(180deg, rgba(40,163,122,0) 0%, ${COR.verde} 70%)`,
        }}
      />

      {/* Mesmo recurso do rodapé, no topo: o texto rolando passa por baixo dos
          controles e some antes de encostar neles. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 122 + TOPO_SEGURO,
          background: `linear-gradient(180deg, ${COR.verde} 55%, rgba(40,163,122,0) 100%)`,
        }}
      />

      <CabecalhoHistoria corX="#ffffff">
        <BarraStories vivo={0} progresso={progresso} corCheia="#ffffff" corVazia="#ffffff" opacidadeVazia={0.3} />
      </CabecalhoHistoria>
      <PilulaAvaliar />

      <div
        style={{
          position: 'absolute',
          left: 21,
          top: 711 + afunda,
          width: 348,
          height: 55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          borderRadius: 10,
          backgroundColor: '#ffffff',
          border: `2px solid ${COR.borda}`,
          boxShadow: `0 ${6 - afunda}px 0 ${COR.borda}`,
          boxSizing: 'border-box',
          transform: `translateY(${(1 - botao) * 90}px)`,
        }}
      >
        <IconeSeta />
        <span style={{ fontFamily: LEXEND, fontSize: 16, fontWeight: 600, lineHeight: '20px', color: COR.texto }}>
          Continuar lendo
        </span>
      </div>
      {/* O alvo é um botão branco, então a marca do toque tem que ser escura. */}
      <Toque x={195} y={738} quando={TOQUE_BOTAO_LER} />
    </Camada>
  )
}

const OPCOES = [
  'Decidir o valor do lazer.',
  'Guardar tudo sem separar categorias.',
  'Identificar gastos fixos e definir quanto vai para a reserva.',
  'Adiantar próximas parcelas do curso.',
]
const INDICE_CERTO = 2
const TOPO_DAS_OPCOES = 307
const ALTURA_OPCAO = 67
const GAP_OPCOES = 9

function Opcao({ texto, indice, entra }: { texto: string; indice: number; entra: number }) {
  const quadro = useQuadro()
  const estilo = useEntrada(entra)
  const certa = indice === INDICE_CERTO

  /* Ao acertar: a certa afunda os 6px da sombra e vira verde; as outras recuam. */
  const marca = certa
    ? interpolar(quadro, [ACERTA, ACERTA + 7], [0, 1])
    : 0
  const recuo = certa
    ? 0
    : interpolar(quadro, [ACERTA + 4, ACERTA + 18], [0, 0.45])

  return (
    <div
      style={{
        ...estilo,
        transform: `${estilo.transform} translateY(${marca * 6}px)`,
        opacity: estilo.opacity * (1 - recuo),
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: ALTURA_OPCAO,
        marginBottom: GAP_OPCOES,
        padding: '20px 24px',
        borderRadius: 10 - marca * 2,
        boxSizing: 'border-box',
        backgroundColor: certa && marca > 0 ? COR.verdeClaro : '#ffffff',
        border: `2px solid ${certa && marca > 0 ? COR.verdeClaro : COR.borda}`,
        boxShadow: `0 ${6 - marca * 6}px 0 ${COR.borda}`,
      }}
    >
      <span
        style={{
          flex: 1,
          fontFamily: LEXEND,
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '24px',
          color: certa && marca > 0 ? '#ffffff' : COR.opcao,
        }}
      >
        {texto}
      </span>
      {certa && marca > 0 && (
        <div style={{ position: 'absolute', left: 315.5, top: 4.5, opacity: marca, transform: `scale(${marca})` }}>
          <IconeCheckOpcao tamanho={13.43} />
        </div>
      )}
    </div>
  )
}

function CartaoQuiz() {
  const quadro = useQuadro()
  const cabecalho = useEntrada(ENTRA_QUIZ)
  const enunciado = useEntrada(ENTRA_QUIZ + 5)

  const progresso = interpolar(quadro, [ENTRA_QUIZ, SAI], [0, 1])
  const toast = mola(quadro - ENTRA_TOAST, { damping: 14, stiffness: 130, mass: 0.8 })

  return (
    <Camada style={{ backgroundColor: '#ffffff' }}>
      <div style={{ position: 'absolute', left: 26, top: 187 + TOPO_SEGURO, width: 335 }}>
        <p
          style={{
            ...cabecalho,
            margin: '0 0 8px',
            fontFamily: LEXEND,
            fontSize: 24,
            fontWeight: 500,
            lineHeight: '36px',
            color: COR.textoQuiz,
          }}
        >
          Responda 💬
        </p>
        <p
          style={{
            ...enunciado,
            margin: 0,
            fontFamily: LEXEND,
            fontSize: 12,
            fontWeight: 300,
            lineHeight: '16px',
            color: COR.enunciado,
          }}
        >
          Você recebeu R$1.200,00 reais de um freela e quer organizar melhor o dinheiro. O que você deve fazer primeiro?
        </p>
      </div>

      <div style={{ position: 'absolute', left: 26, top: TOPO_DAS_OPCOES + TOPO_SEGURO, width: 335 }}>
        {OPCOES.map((texto, i) => (
          <Opcao key={i} texto={texto} indice={i} entra={ENTRA_QUIZ + 8 + i * 5} />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: LARGURA,
          height: 63 + TOPO_SEGURO,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 11px 12px rgba(0,0,0,0.05)',
        }}
      />
      <CabecalhoHistoria corX={COR.textoQuiz}>
        <BarraStories
          vivo={1}
          progresso={progresso}
          corCheia={COR.verdeClaro}
          corVazia={COR.borda}
          opacidadeVazia={0.3}
          tingidoAte={3}
        />
      </CabecalhoHistoria>
      <PilulaAvaliar />

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 701,
          width: LARGURA,
          height: 61,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          borderRadius: 7,
          boxSizing: 'border-box',
          backgroundColor: COR.verdeEscuro,
          boxShadow: '0 9px 10.5px rgba(0,0,0,0.1), 0 38px 19px rgba(0,0,0,0.09)',
          transform: `translateY(${(1 - toast) * 110}px)`,
        }}
      >
        <span style={{ fontSize: 27, lineHeight: 1 }}>🎉</span>
        <div style={{ flex: 1, fontFamily: JAKARTA, color: '#ffffff' }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '24px' }}>Mandou bem!</p>
          <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: '20px' }}>Valeu!</p>
        </div>
      </div>

      <Toque
        x={195}
        y={TOPO_DAS_OPCOES + INDICE_CERTO * (ALTURA_OPCAO + GAP_OPCOES) + ALTURA_OPCAO / 2}
        quando={TOQUE_OPCAO}
      />
    </Camada>
  )
}

/* ------------------------------------------------------------------- raiz */

export function Trilhas() {
  const quadro = useQuadro()

  /*
   * Abertura: a camada de histórias cresce a partir do cartão tocado, com a
   * origem da transformação no centro dele. Escala pequena de propósito — o
   * cartão é quase da largura da tela, e escala grande viraria zoom, não
   * abertura.
   */
  const abre = mola(quadro - ABRE_HISTORIAS, { damping: 18, stiffness: 110, mass: 0.9 })
  const escala = 0.86 + abre * 0.14
  const raio = (1 - abre) * 26
  const opacidade = interpolar(quadro, [ABRE_HISTORIAS, ABRE_HISTORIAS + 9], [0, 1])

  /* Passagem de cartão: a leitura sai pela esquerda e o exercício entra pela direita. */
  const vira = mola(quadro - VIRA_CARTAO, { damping: 20, stiffness: 105, mass: 0.9 })

  const saida = interpolar(quadro, [SAI, DURACAO - 1], [1, 0])

  /*
   * A barra de status inverte enquanto a leitura, que é escura, está na
   * frente — é o que o aparelho faz de verdade. Duas cópias sobrepostas em vez
   * de interpolar canal a canal: assim cada estado tem a cor exata do arquivo.
   */
  const claro = interpolar(
    quadro,
    [ABRE_HISTORIAS, ABRE_HISTORIAS + 8, VIRA_CARTAO + 6, VIRA_CARTAO + 16],
    [0, 1, 1, 0],
  )

  return (
    <Camada style={{ backgroundColor: '#ffffff', opacity: saida }}>
      <Camada
        style={{
          transform: `scale(${1 - abre * 0.06})`,
          opacity: 1 - abre * 0.45,
        }}
      >
        <TelaTrilha />
      </Camada>

      {quadro >= ABRE_HISTORIAS && (
        <Camada
          style={{
            opacity: opacidade,
            transform: `scale(${escala})`,
            transformOrigin: `195px ${TOPO_ATUAL_NA_TELA + 45}px`,
            borderRadius: raio,
            overflow: 'hidden',
          }}
        >
          <Camada style={{ transform: `translateX(${-vira * LARGURA}px)` }}>
            <CartaoLeitura />
          </Camada>
          {quadro >= VIRA_CARTAO && (
            <Camada style={{ transform: `translateX(${(1 - vira) * LARGURA}px)` }}>
              <CartaoQuiz />
            </Camada>
          )}
        </Camada>
      )}

      <BarraDeStatus cor={COR.textoQuiz} />
      <div style={{ opacity: claro }}>
        <BarraDeStatus cor="#ffffff" />
      </div>
    </Camada>
  )
}
