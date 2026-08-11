import type { ReactNode } from 'react'
import cenaEntrevista from '../assets/app-cena-entrevista.webp'
import { BarraDeStatus, Camada } from './aparelho'
import { LARGURA, TOPO_SEGURO } from './medidas'
import { JAKARTA, LEXEND } from './fontes'
import { interpolar, mola, suave, useEntrada, useQuadro } from './tempo'

/*
 * A tela da Simulação (Figma 878:469). A conversa é codada elemento a elemento
 * — só a cena da entrevistadora no topo é imagem, exportada limpa do nó
 * 878:471, sem o X e a barra de progresso, que são desenhados aqui.
 *
 * A paleta veio medida da exportação da tela: texto #272727, apoio #a0a0a1,
 * verde do app #33cc99, botão #1e7a5b, feedback #4d62b6 sobre #f0f1f8, X do
 * desafio #f02e2e.
 *
 * Nota fiel ao Figma: a terceira fala da Helena aparece DUPLICADA no arquivo
 * (nós 878:480 e 1603:715, texto idêntico). Aqui ela entra uma vez só.
 */

export const DURACAO = 430
/** Quadro exibido quando o visitante pediu menos movimento: conversa cheia. */
export const QUADRO_PARADO = 400

const COR = {
  texto: '#272727',
  apoio: '#a0a0a1',
  apoioEscuro: '#626263',
  verde: '#33cc99',
  botao: '#1e7a5b',
  cartao: '#f4f4f4',
  bordaBolha: '#ececec',
  feedbackFundo: '#f0f1f8',
  feedbackTitulo: '#4d62b6',
  feedbackTexto: '#213ba4',
  vermelho: '#f02e2e',
  ambar: '#e8b25c',
  /* Trilho das etapas. Antes elas eram brancas sobre a foto; fora dela, o par
     que sobra é escuro no cheio e cinza claro no vazio. */
  trilhoEtapa: '#e4e4e4',
}

const ALTURA_RODAPE = 86
const ALTURA_CENA = 228

/*
 * Linha do tempo da conversa. `digita` liga o indicador de digitação da Helena
 * até `entra`, quando a bolha assume o lugar dele.
 */
const FALAS = [
  { tipo: 'helena', nome: true, texto: 'Oi, tudo bem? Eu sou a Helena.', digita: 15, entra: 36 },
  { tipo: 'helena', nome: false, texto: 'Obrigada por vir. Pode se sentar à vontade.', digita: 50, entra: 70 },
  {
    tipo: 'helena',
    nome: false,
    texto:
      'Vou te explicar como vai funcionar: é uma conversa rápida, sem pegadinha. Quero te conhecer um pouco e entender se faz sentido pros dois lados.',
    digita: 84,
    entra: 106,
  },
  { tipo: 'status', texto: 'Helena está aguardando sua resposta.', entra: 122 },
  {
    tipo: 'jovem',
    texto:
      'Tenho 18 anos, moro com minha mãe e minha irmã mais nova. Ajudo em casa desde os 14, então me acostumei com rotina e responsabilidade. Gosto de resolver problemas e não consigo deixar as coisas pela metade.',
    entra: 138,
  },
  { tipo: 'status', texto: 'Helena acena com a cabeça enquanto anota.', entra: 225 },
  {
    tipo: 'helena',
    nome: true,
    texto: 'Entendi. Dá pra ver que você não tem medo de assumir responsabilidade, isso conta bastante aqui.',
    digita: 240,
    entra: 262,
  },
  { tipo: 'helena', nome: true, texto: 'E já que você falou em resolver problemas…', digita: 276, entra: 296 },
  { tipo: 'feedback', entra: 315 },
] as const

const ENTRA_BOTAO = 345

/*
 * Marcos de rolagem [quadro, px]: calibrados por quadros renderizados, não no
 * olho. Refeitos quando a cena saiu da área que rola — antes a janela era a
 * tela inteira e a foto subia junto; agora a conversa rola dentro dos 482px que
 * sobram abaixo dela, e a mesma fala precisa de bem mais rolagem para aparecer.
 *
 * Cada valor é o que põe o elemento recém-chegado a 14px do fim da janela,
 * calculado sobre a posição medida de cada bolha. Os pares que parecem
 * repetidos (225 e 237, por exemplo) são o "segura e então rola": a fala chega
 * primeiro, a rolagem responde depois, como faz app de conversa.
 *
 * Os três degraus extras (250, 288) são do indicador de digitação, que entra
 * abaixo da última bolha e pede 49px a mais. Sem eles ele nasceria cortado.
 *
 * O último (357) é maior porque o rodapé chega no 345 e come 86px da janela.
 */
const ROLAGEM: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [104, 0],
  [118, 52],
  [132, 83],
  [152, 286],
  [225, 286],
  [237, 318],
  [250, 367],
  [274, 457],
  [288, 506],
  [308, 549],
  [327, 674],
  [357, 760],
  [DURACAO, 760],
]

function IconeX({ cor, tamanho }: { cor: string; tamanho: number }) {
  return (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} fill="none" stroke={cor} strokeWidth={2.6} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function IconeChave() {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke={COR.ambar} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="4.2" />
      <path d="M11 11l8 8M16 16l2.6-2.6M18.6 18.6l2-2" />
    </svg>
  )
}

function IconeInfo() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke={COR.feedbackTitulo} strokeWidth={2.1} strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.8v.2" />
    </svg>
  )
}

/**
 * Cabeçalho fixo: etapas do stories e a cena da entrevistadora. Só isso — o
 * título e o cargo rolam junto com a conversa.
 *
 * A cena desceu para **abaixo** das etapas em vez de ficar atrás delas: sobre a
 * foto, a barra de dez segmentos caía em cima do rosto da entrevistadora. Com a
 * faixa branca por cima, os controles não disputam mais com a ilustração, e
 * duas coisas caem por consequência — o véu escuro que existia só para dar
 * contraste aos controles brancos, e a barra de status que trocava de cor
 * conforme a cena escura saía de cena. Agora o topo é sempre branco, e a barra
 * de status é sempre escura.
 *
 * A altura da cena é a proporção exata do asset (1170 × 685) na largura do
 * aparelho. Encolher aqui não redimensiona: `cover` corta, e o que sai é a
 * cabeça dela ou a mesa.
 */
function Cabecalho() {
  return (
    <div style={{ flexShrink: 0, backgroundColor: '#ffffff' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: `${TOPO_SEGURO + 8}px 16px 12px`,
        }}
      >
        <IconeX cor={COR.texto} tamanho={20} />
        <div style={{ display: 'flex', flex: 1, gap: 7 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                height: 6,
                flex: 1,
                borderRadius: 999,
                backgroundColor: i === 0 ? COR.texto : COR.trilhoEtapa,
              }}
            />
          ))}
        </div>
      </div>

      <img
        src={cenaEntrevista}
        alt=""
        style={{ display: 'block', width: LARGURA, height: ALTURA_CENA, objectFit: 'cover' }}
      />
    </div>
  )
}

/** Título e cargo. Rolam com a conversa, e não com a cena. */
function Titulo() {
  return (
    <div style={{ padding: '16px 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontFamily: LEXEND, fontSize: 23, fontWeight: 700, color: COR.texto }}>
          Entrevista de Emprego
        </h1>
        <span
          style={{
            fontFamily: LEXEND,
            fontSize: 12.5,
            fontWeight: 600,
            color: COR.apoio,
            backgroundColor: COR.cartao,
            borderRadius: 999,
            padding: '4px 10px',
          }}
        >
          1 de 10
        </span>
      </div>
      <p style={{ margin: '5px 0 0', fontFamily: JAKARTA, fontSize: 12, color: COR.apoio }}>
        Cargo: Assistente Administrativo Júnior · Contato Soluções
      </p>
    </div>
  )
}

function Desafio() {
  const estilo = useEntrada(4)
  return (
    <div style={{ ...estilo, backgroundColor: COR.cartao, borderRadius: 14, padding: '12px 14px', marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: LEXEND, fontSize: 13, fontWeight: 600, color: COR.texto }}>Palavra de Desafio</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: LEXEND, fontSize: 13, fontWeight: 700, color: COR.ambar }}>
          <IconeChave />
          +10
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <span style={{ fontFamily: LEXEND, fontSize: 24, fontWeight: 700, color: COR.apoio, textDecoration: 'line-through' }}>
          GATO
        </span>
        <IconeX cor={COR.vermelho} tamanho={19} />
      </div>
      <p style={{ margin: '6px 0 0', fontFamily: JAKARTA, fontSize: 12, lineHeight: 1.5, color: COR.apoioEscuro }}>
        Utilize a palavra na sua resposta para ganhar um bônus de Chaves (mas precisa fazer sentido)
      </p>
    </div>
  )
}

/** Três pontos pulsando enquanto a Helena "digita". Morre quando a bolha entra. */
function Digitando({ de, ate }: { de: number; ate: number }) {
  const quadro = useQuadro()
  if (quadro < de || quadro >= ate) return null
  const entrada = interpolar(quadro, [de, de + 6], [0, 1])
  return (
    <div
      style={{
        opacity: entrada,
        alignSelf: 'flex-start',
        display: 'flex',
        gap: 5,
        padding: '13px 16px',
        marginTop: 8,
        backgroundColor: '#ffffff',
        border: `1px solid ${COR.bordaBolha}`,
        borderRadius: '14px 14px 14px 4px',
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            backgroundColor: COR.apoio,
            transform: `translateY(${Math.sin((quadro - de) / 2.4 - i * 0.9) * 2.5}px)`,
          }}
        />
      ))}
    </div>
  )
}

function BolhaHelena({ nome, texto, entra }: { nome: boolean; texto: string; entra: number }) {
  const quadro = useQuadro()
  const estilo = useEntrada(entra)
  if (quadro < entra) return null
  return (
    <div
      style={{
        ...estilo,
        alignSelf: 'flex-start',
        maxWidth: 236,
        padding: '10px 13px',
        marginTop: 8,
        backgroundColor: '#ffffff',
        border: `1px solid ${COR.bordaBolha}`,
        borderRadius: '14px 14px 14px 4px',
        boxShadow: '0 1px 3px rgba(39,39,39,0.05)',
        transformOrigin: 'bottom left',
      }}
    >
      {nome && (
        <p style={{ margin: 0, fontFamily: LEXEND, fontSize: 12.5, fontWeight: 600, color: COR.verde }}>Helena Duarte</p>
      )}
      <p style={{ margin: nome ? '3px 0 0' : 0, fontFamily: JAKARTA, fontSize: 13.5, lineHeight: 1.5, color: COR.texto }}>
        {texto}
      </p>
    </div>
  )
}

/** Resposta do jovem: a bolha entra inteira e o texto se revela palavra a palavra. */
function BolhaJovem({ texto, entra }: { texto: string; entra: number }) {
  const quadro = useQuadro()
  const estilo = useEntrada(entra)
  if (quadro < entra) return null
  const palavras = texto.split(' ')
  return (
    <div
      style={{
        ...estilo,
        alignSelf: 'flex-end',
        maxWidth: 236,
        padding: '11px 14px',
        marginTop: 8,
        backgroundColor: COR.verde,
        borderRadius: '14px 14px 4px 14px',
        transformOrigin: 'bottom right',
      }}
    >
      <p style={{ margin: 0, fontFamily: JAKARTA, fontSize: 13.5, lineHeight: 1.55, color: '#ffffff' }}>
        {palavras.map((palavra, i) => (
          <span key={i} style={{ opacity: interpolar(quadro, [entra + 6 + i * 2.2, entra + 12 + i * 2.2], [0, 1]) }}>
            {palavra}{' '}
          </span>
        ))}
      </p>
    </div>
  )
}

function Status({ texto, entra }: { texto: string; entra: number }) {
  const quadro = useQuadro()
  const opacity = interpolar(quadro, [entra, entra + 12], [0, 1])
  if (quadro < entra) return null
  return (
    <p style={{ opacity, margin: '14px 0 6px', fontFamily: JAKARTA, fontSize: 12, color: COR.apoio, textAlign: 'center' }}>
      {texto}
    </p>
  )
}

function Feedback({ entra }: { entra: number }) {
  const quadro = useQuadro()
  const estilo = useEntrada(entra)
  if (quadro < entra) return null
  // Um realce breve na chegada, para o cartão pedir o olhar
  const brilho = interpolar(quadro, [entra + 4, entra + 14, entra + 34], [0, 0.5, 0])
  return (
    <div
      style={{
        ...estilo,
        marginTop: 14,
        padding: '13px 15px',
        backgroundColor: COR.feedbackFundo,
        borderRadius: 14,
        boxShadow: `0 0 0 3px rgba(77,98,182,${brilho * 0.35})`,
        transformOrigin: 'bottom center',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconeInfo />
        <span style={{ fontFamily: LEXEND, fontSize: 13, fontWeight: 600, color: COR.feedbackTitulo }}>
          Feedback da Resposta
        </span>
      </div>
      <p style={{ margin: '7px 0 0', fontFamily: JAKARTA, fontSize: 12.5, lineHeight: 1.55, color: COR.feedbackTexto }}>
        Boa abertura — você trouxe contexto real, não uma lista de adjetivos. Mencionar responsabilidade doméstica mostra
        maturidade sem parecer forçado.
      </p>
    </div>
  )
}

function Rodape() {
  const quadro = useQuadro()
  const m = mola(quadro - ENTRA_BOTAO, { damping: 15, stiffness: 120, mass: 0.8 })
  if (quadro < ENTRA_BOTAO) return null
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: LARGURA,
        height: ALTURA_RODAPE,
        backgroundColor: '#ffffff',
        boxShadow: '0 -6px 18px rgba(39,39,39,0.06)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        boxSizing: 'border-box',
        transform: `translateY(${(1 - m) * ALTURA_RODAPE}px)`,
      }}
    >
      <div
        style={{
          width: '100%',
          height: 52,
          borderRadius: 14,
          backgroundColor: COR.botao,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: LEXEND,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Próximo turno
      </div>
    </div>
  )
}

function Fala({ fala }: { fala: (typeof FALAS)[number] }) {
  if (fala.tipo === 'status') return <Status texto={fala.texto} entra={fala.entra} />
  if (fala.tipo === 'jovem') return <BolhaJovem texto={fala.texto} entra={fala.entra} />
  if (fala.tipo === 'feedback') return <Feedback entra={fala.entra} />
  return <BolhaHelena nome={fala.nome} texto={fala.texto} entra={fala.entra} />
}

export function Simulacao() {
  const quadro = useQuadro()

  const rolagem = interpolar(
    quadro,
    ROLAGEM.map(([f]) => f),
    ROLAGEM.map(([, y]) => y),
    suave,
  )

  const digitandoHelena: ReactNode[] = FALAS.filter((f) => f.tipo === 'helena').map((f) => (
    <Digitando key={`digita-${f.entra}`} de={f.digita} ate={f.entra} />
  ))

  return (
    <Camada style={{ backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <Cabecalho />

      {/*
        Do título para baixo, tudo rola. O `overflow: hidden` aqui é o que
        segura o conteúdo atrás do cabeçalho — sem ele o título passaria por
        cima da foto ao subir. E é `flex: 1` em vez de altura declarada para a
        janela ser o que sobrar da tela depois da cena.
      */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            transform: `translateY(${-rolagem}px)`,
            display: 'flex',
            flexDirection: 'column',
            padding: '0 14px 120px',
          }}
        >
          <Titulo />
          <Desafio />

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 12 }}>
            {FALAS.map((fala, i) => (
              <Fala key={i} fala={fala} />
            ))}
            {digitandoHelena}
          </div>
        </div>
      </div>

      <Rodape />
      <BarraDeStatus cor={COR.texto} />
    </Camada>
  )
}
