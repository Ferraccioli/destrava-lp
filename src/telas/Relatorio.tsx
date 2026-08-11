import medalha from '../assets/app-medalha.webp'
import estrela from '../assets/app-estrela.webp'
import info from '../assets/app-info.webp'
import lampada from '../assets/app-lampada.webp'
import { BarraDeStatus, Camada, Toque } from './aparelho'
import { LARGURA, TOPO_SEGURO } from './medidas'
import { JAKARTA, LEXEND, NUNITO } from './fontes'
import { interpolar, mola, suave, useEntrada, useQuadro } from './tempo'

/*
 * O Relatório da Simulação (Figma 1902:1691) para o mock do "Sem limite". A
 * tela fecha com "Refazer simulação", que é exatamente o que a aba promete —
 * refazer quantas vezes precisar até a resposta sair boa.
 *
 * Codada em React, como as outras duas. Bitmap só ilustração: medalha, estrela,
 * ícone de informação e lâmpada. Os ícones de traço têm os paths exportados dos
 * nós, não redesenhados.
 *
 * O medidor circular é desenhado com `strokeDasharray` em vez de usar o arco
 * exportado, porque o arco precisa **varrer**: é o momento principal da peça, e
 * um SVG estático não varre. Geometria conforme a descrição do componente no
 * arquivo (188 × 188, traço de 10, arco proporcional ao valor).
 *
 * Terceira família tipográfica: além de Lexend Deca (título/rótulo) e Plus
 * Jakarta Sans (corpo), esta tela usa **Nunito Sans** nos apoios cinza, nos
 * números e nas citações. Está aqui por fidelidade ao arquivo de design, e o
 * conserto, se um dia for tratada como deriva, é trocar por Plus Jakarta Sans
 * em um lugar só.
 */

export const DURACAO = 520
/** Quadro exibido quando o visitante pediu menos movimento: relatório no fim. */
export const QUADRO_PARADO = 490

const COR = {
  tinta: '#16181a',
  texto: '#272727',
  apoio: '#6b7280',
  cinza: '#9ca3af',
  borda: '#dfdfdf',
  bordaClara: '#e5e7eb',
  divisor: '#efefef',
  verde: '#33cc99',
  verdeTexto: '#239676',
  verdeEscuro: '#1e7a5b',
  ambar: '#ffb833',
  ambarEscuro: '#ee9300',
  creme: '#f7ead6',
}

/* ------------------------------------------------------------------ tempo */

const ENTRA_TOPO = 0
const ENTRA_TITULO = 8
const GIRA_DE = 24
const GIRA_ATE = 96
const ENTRA_PASSOU = 100
const ENTRA_RESUMO = 110
const ENTRA_MEDALHA = 122
/*
 * As entradas caem DURANTE a rolagem que traz a seção, não depois: com elas
 * atrasadas, a rolagem chegava numa área vazia e o conteúdo pipocava com a tela
 * já parada, o que lê como carregamento e não como leitura.
 */
const ENTRA_BARRAS = [176, 186, 196]
const ENTRA_BRILHOU = [226, 238, 250]
const ENTRA_MELHORAR = [300, 314, 328]
const ENTRA_PRONTIDAO = 388
const ENTRA_SUBIR = [408, 418]
const TOQUE_REFAZER = 470
const SAI = DURACAO - 16

/** A nota da peça: 6,2 de 10. O arco e o número contam para o mesmo lugar. */
const NOTA = 6.2

/*
 * Marcos de rolagem [quadro, px]. Os píncaros vêm das coordenadas das seções no
 * arquivo, não de still calibrado: cada seção tem posição fixa conhecida, então
 * a rolagem é calculável.
 */
const ROLAGEM: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [136, 0],
  [226, 700],
  [238, 700],
  [306, 1130],
  [318, 1130],
  [386, 1650],
  [398, 1650],
  [464, 1973],
  [DURACAO, 1973],
]

/* --------------------------------------------------- posições das seções */
/* Coordenadas do arquivo. Fixas de propósito: é delas que sai a rolagem. */

const Y = {
  topbar: 0,
  abas: 88,
  hero: 175,
  medalha: 591,
  notas: 755,
  divisor1: 1051,
  brilhou: 1083,
  divisor2: 1572,
  melhorar: 1604,
  divisor3: 2166,
  prontidao: 2198,
  divisor4: 2352,
  subir: 2384,
  ctabar: 2592,
}

/* ------------------------------------------------------------------ ícones */

function IconeVoltar() {
  return (
    <svg viewBox="0 0 8 14" width={8} height={14} fill="none">
      <path d="M7 13L1 7L7 1" stroke={COR.texto} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconeCheck() {
  return (
    <svg viewBox="0 0 15 15" width={15} height={15} fill="none">
      <path
        d="M12.5 3.75L5.625 10.625L2.5 7.5"
        stroke={COR.verdeTexto}
        strokeWidth={1.5625}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeLivro({ cor, tamanho = 18 }: { cor: string; tamanho?: number }) {
  return (
    <svg viewBox="0 0 16.5 15" width={tamanho} height={(tamanho * 15) / 16.5} fill="none">
      <path
        d="M8.25 3.75C8.25 2.95435 7.93393 2.19129 7.37132 1.62868C6.80871 1.06607 6.04565 0.75 5.25 0.75H0.75V12H6C6.59674 12 7.16903 12.2371 7.59099 12.659C8.01295 13.081 8.25 13.6533 8.25 14.25M8.25 3.75V14.25M8.25 3.75C8.25 2.95435 8.56607 2.19129 9.12868 1.62868C9.69129 1.06607 10.4544 0.75 11.25 0.75H15.75V12H10.5C9.90326 12 9.33097 12.2371 8.90901 12.659C8.48705 13.081 8.25 13.6533 8.25 14.25M3.75 4.5H5.25M3.75 7.5H5.25M11.25 4.5H12.75M11.25 7.5H12.75"
        stroke={cor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeBalao({ cor, tamanho = 18 }: { cor: string; tamanho?: number }) {
  return (
    <svg viewBox="0 0 15.7559 15.7559" width={tamanho} height={tamanho} fill="none">
      <path
        d="M5.25002 7.5059H5.25752M8.25002 7.5059H8.25752M11.25 7.5059H11.2575M5.17502 13.5059C6.60645 14.2402 8.25308 14.4391 9.81819 14.0667C11.3833 13.6944 12.7639 12.7753 13.7113 11.475C14.6587 10.1748 15.1106 8.57893 14.9855 6.97502C14.8603 5.3711 14.1665 3.86462 13.0289 2.72704C11.8913 1.58946 10.3848 0.895584 8.7809 0.770458C7.17699 0.645331 5.58112 1.09718 4.28089 2.04458C2.98065 2.99198 2.06154 4.37263 1.68919 5.93773C1.31684 7.50283 1.51573 9.14946 2.25002 10.5809L0.750021 15.0059L5.17502 13.5059Z"
        stroke={cor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconeCompartilhar() {
  return (
    <svg viewBox="0 0 15 15" width={15} height={15} fill="none">
      <path
        d="M7.5 10V1.5M7.5 1.5L4.5 4.5M7.5 1.5L10.5 4.5M2.5 8.5V12.5C2.5 13.05 2.95 13.5 3.5 13.5H11.5C12.05 13.5 12.5 13.05 12.5 12.5V8.5"
        stroke={COR.texto}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------- topo */

function Topbar() {
  const estilo = useEntrada(ENTRA_TOPO)
  return (
    <div
      style={{
        ...estilo,
        position: 'absolute',
        top: Y.topbar + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
      <IconeVoltar />
      <span
        style={{
          flex: 1,
          textAlign: 'center',
          marginLeft: -8,
          fontFamily: LEXEND,
          fontSize: 16,
          fontWeight: 600,
          color: COR.texto,
        }}
      >
        Review
      </span>
    </div>
  )
}

function Abas() {
  const estilo = useEntrada(ENTRA_TOPO + 3)
  return (
    <div
      style={{
        ...estilo,
        position: 'absolute',
        top: Y.abas + TOPO_SEGURO,
        left: 24,
        width: 342,
        height: 55,
        display: 'flex',
        borderRadius: 12,
        border: `1px solid ${COR.borda}`,
        boxShadow: `0 4px 0 ${COR.borda}`,
        overflow: 'hidden',
        backgroundColor: '#f4f4f4',
      }}
    >
      {['Análise', 'Conversa'].map((rotulo, i) => (
        <div
          key={rotulo}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: i === 1 ? '#ffffff' : 'transparent',
            borderRadius: i === 1 ? 12 : 0,
            fontFamily: LEXEND,
            fontSize: 16,
            fontWeight: 600,
            color: COR.texto,
          }}
        >
          {rotulo}
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- medidor */

/**
 * Anel de nota. O arco varre de zero até a fração da nota, e o número conta
 * junto — os dois lêem o mesmo progresso, então nunca discordam na tela.
 */
function Medidor() {
  const quadro = useQuadro()
  const progresso = interpolar(quadro, [GIRA_DE, GIRA_ATE], [0, 1],
    suave,
  )
  const raio = 89
  const volta = 2 * Math.PI * raio
  const valor = NOTA * progresso

  return (
    <div style={{ position: 'relative', width: 188, height: 188 }}>
      <svg width={188} height={188} viewBox="0 0 188 188">
        <circle cx={94} cy={94} r={raio} fill="none" stroke={COR.borda} strokeWidth={10} />
        <circle
          cx={94}
          cy={94}
          r={raio}
          fill="none"
          stroke={COR.verde}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={volta}
          strokeDashoffset={volta * (1 - (NOTA / 10) * progresso)}
          transform="rotate(-90 94 94)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: LEXEND,
            fontSize: 58,
            fontWeight: 700,
            lineHeight: '62px',
            letterSpacing: -2,
            color: COR.ambar,
          }}
        >
          {valor.toFixed(1).replace('.', ',')}
        </span>
        <span style={{ fontFamily: LEXEND, fontSize: 12, lineHeight: '16px', color: '#a0a0a1' }}>de 10</span>
      </div>
    </div>
  )
}

function Hero() {
  const titulo = useEntrada(ENTRA_TITULO)
  const passou = useEntrada(ENTRA_PASSOU)
  const resumo = useEntrada(ENTRA_RESUMO)
  return (
    <div
      style={{
        position: 'absolute',
        top: Y.hero + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          ...titulo,
          margin: 0,
          fontFamily: LEXEND,
          fontSize: 24,
          fontWeight: 500,
          lineHeight: '36px',
          color: COR.tinta,
        }}
      >
        Sua primeira vaga
      </p>
      <p style={{ ...titulo, margin: 0, fontFamily: NUNITO, fontSize: 12, color: COR.cinza }}>
        Hoje, 14h32 · 7 rodadas
      </p>
      <div style={{ height: 24 }} />
      <Medidor />
      <div style={{ ...passou, display: 'flex', alignItems: 'center', gap: 7, paddingTop: 20 }}>
        <IconeCheck />
        <span style={{ fontFamily: JAKARTA, fontSize: 14, fontWeight: 600, lineHeight: '24px', color: COR.verdeTexto }}>
          Você passou na entrevista
        </span>
      </div>
      <div style={{ height: 16 }} />
      <p
        style={{
          ...resumo,
          margin: 0,
          width: 290,
          textAlign: 'center',
          fontFamily: NUNITO,
          fontSize: 14,
          lineHeight: 1.6,
          color: COR.apoio,
        }}
      >
        3 momentos te custaram <strong style={{ fontWeight: 600, color: COR.tinta }}>2,3 pontos</strong>. Resolvendo
        eles, sua próxima mira é <strong style={{ fontWeight: 600, color: COR.tinta }}>8,5</strong>.
      </p>
    </div>
  )
}

function CartaoMedalha() {
  const estilo = useEntrada(ENTRA_MEDALHA)
  return (
    <div
      style={{
        ...estilo,
        position: 'absolute',
        top: Y.medalha + TOPO_SEGURO,
        left: 24,
        width: 342,
        height: 132,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '16px 8px',
        borderRadius: 16,
        backgroundColor: COR.creme,
        boxSizing: 'border-box',
      }}
    >
      <img alt="" src={medalha} style={{ width: 92, height: 92, objectFit: 'contain' }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontFamily: JAKARTA, fontSize: 14, fontWeight: 600, lineHeight: '24px', color: COR.tinta }}>
          Sabe escutar
        </p>
        <p style={{ margin: '4px 0 0', fontFamily: NUNITO, fontSize: 12, lineHeight: 1.5, color: COR.apoio }}>
          Em <strong style={{ fontWeight: 700, color: COR.tinta }}>4 das 7 rodadas</strong> você retomou algo que a
          recrutadora tinha falado. É raro, e é o que faz alguém ser lembrado.
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------- de onde veio a nota */

const NOTAS = [
  { rotulo: 'Decisões na conversa', valor: '3,7', total: '6,0', fracao: 3.7 / 6, apoio: '5 dos 8 momentos decisivos acertados.' },
  { rotulo: 'Desafios de palavra', valor: '1,3', total: '2,0', fracao: 1.3 / 2, apoio: '2 de 3 palavras encaixadas com naturalidade.' },
  { rotulo: 'Comunicação', valor: '1,2', total: '2,0', fracao: 1.2 / 2, apoio: 'Clareza, escuta e postura nas 7 rodadas.' },
]

/** Uma linha da rubrica. Componente próprio para o hook de entrada não viver num laço. */
function LinhaDeNota({ nota, entra }: { nota: (typeof NOTAS)[number]; entra: number }) {
  const quadro = useQuadro()
  const estilo = useEntrada(entra)
  /*
   * A largura sai da própria nota. No arquivo as três instâncias estão com o
   * mesmo preenchimento, o que a descrição do componente pede para ajustar por
   * instância e ninguém ajustou.
   */
  const preenchido = interpolar(quadro, [entra + 4, entra + 26], [0, nota.fracao],
    suave,
  )
  return (
    <div style={{ ...estilo, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ flex: 1, fontFamily: JAKARTA, fontSize: 14, fontWeight: 600, lineHeight: '24px', color: COR.tinta }}>
          {nota.rotulo}
        </span>
        <span style={{ fontFamily: NUNITO, fontSize: 14, fontWeight: 700, color: COR.tinta }}>{nota.valor}</span>
        <span style={{ fontFamily: NUNITO, fontSize: 12, color: COR.cinza }}>{` / ${nota.total}`}</span>
      </div>
      <div
        style={{
          position: 'relative',
          height: 4,
          margin: '8px 0',
          borderRadius: 999,
          backgroundColor: COR.borda,
          overflow: 'hidden',
        }}
      >
        <div style={{ width: `${preenchido * 100}%`, height: '100%', borderRadius: 999, backgroundColor: COR.verde }} />
      </div>
      <p style={{ margin: 0, fontFamily: NUNITO, fontSize: 12, color: COR.cinza }}>{nota.apoio}</p>
    </div>
  )
}

function Rubrica() {
  const cabecalho = useEntrada(ENTRA_BARRAS[0] - 12)
  return (
    <div
      style={{
        position: 'absolute',
        top: Y.notas + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          ...cabecalho,
          margin: '0 0 20px',
          fontFamily: JAKARTA,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '24px',
          color: COR.cinza,
        }}
      >
        DE ONDE VEIO SUA NOTA
      </p>
      {NOTAS.map((nota, i) => (
        <LinhaDeNota key={nota.rotulo} nota={nota} entra={ENTRA_BARRAS[i]} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------ brilhou e melhorar */

type Ponto = {
  titulo: string
  citacaoRotulo?: string
  citacao?: string
  corpo?: string
  melhorRotulo?: string
  melhor?: string
}

const BRILHOU: Ponto[] = [
  {
    titulo: 'Falou de resultado, não de tarefa',
    citacaoRotulo: 'VOCÊ, NA RODADA 3',
    citacao: '"No grêmio eu organizei um evento pra mais de 200 pessoas, do zero."',
    corpo: 'Números ficam na cabeça de quem entrevista.',
  },
  {
    titulo: 'Admitiu o que não sabe, sem se diminuir',
    citacaoRotulo: 'VOCÊ, NA RODADA 5',
    citacao: '"Excel avançado eu ainda não domino, mas já comecei um curso."',
    corpo: 'Honestidade com plano de ação. Resposta de candidato maduro.',
  },
  {
    titulo: 'Fechou com interesse de verdade',
    corpo: 'Você perguntou como é o dia a dia da vaga. Quem pergunta pensou em ficar, não só em passar.',
  },
]

const MELHORAR: Ponto[] = [
  {
    titulo: 'Salário: aceitou a primeira oferta na hora',
    citacaoRotulo: 'VOCÊ, NA RODADA 6',
    citacao: '"Tá ótimo, pode ser esse valor mesmo."',
    melhorRotulo: 'COMO SOARIA MELHOR',
    melhor: '"Tá dentro do que eu esperava. Depois do período de experiência, existe espaço pra gente revisar?"',
  },
  {
    titulo: 'Defeito no automático: "sou perfeccionista"',
    corpo: 'Resposta que todo recrutador já ouviu mil vezes. Soa decorada, mesmo quando é verdade.',
    melhorRotulo: 'COMO SOARIA MELHOR',
    melhor:
      'Um defeito real e o que você já faz pra lidar. Ex: "Tenho dificuldade de pedir ajuda cedo. Hoje eu marco um check-in no meio da tarefa."',
  },
  {
    titulo: 'Começo acelerado, sem pausas',
    melhorRotulo: 'COMO SOARIA MELHOR',
    melhor: 'Responde em 2 partes: a resposta curta primeiro, depois 1 exemplo. Ponto final é seu amigo.',
  },
]

function Bloco({ rotulo, texto, cor }: { rotulo: string; texto: string; cor: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingLeft: 24, marginTop: 12 }}>
      <div style={{ width: 2, borderRadius: 999, backgroundColor: COR.bordaClara, alignSelf: 'stretch' }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontFamily: JAKARTA, fontSize: 14, fontWeight: 600, lineHeight: '24px', color: cor }}>
          {rotulo}
        </p>
        <p
          style={{
            margin: '2px 0 0',
            fontFamily: NUNITO,
            fontSize: 13,
            lineHeight: 1.6,
            fontStyle: texto.startsWith('"') ? 'italic' : 'normal',
            color: COR.apoio,
          }}
        >
          {texto}
        </p>
      </div>
    </div>
  )
}

/** Um ponto da lista. Componente próprio pelo mesmo motivo da linha de nota. */
function PontoDaLista({
  ponto,
  entra,
  icone,
  corDoTitulo,
}: {
  ponto: Ponto
  entra: number
  icone: string
  corDoTitulo: string
}) {
  const estilo = useEntrada(entra)
  return (
    <div style={{ ...estilo, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <img src={icone} style={{ width: 24, height: 24, flexShrink: 0, objectFit: 'contain' }} />
        <p
          style={{
            flex: 1,
            margin: 0,
            fontFamily: JAKARTA,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            color: corDoTitulo,
          }}
        >
          {ponto.titulo}
        </p>
      </div>
      {ponto.citacao && <Bloco rotulo={ponto.citacaoRotulo ?? ''} texto={ponto.citacao} cor={COR.cinza} />}
      {ponto.corpo && (
        <p
          style={{
            margin: '12px 0 0',
            paddingLeft: 24,
            fontFamily: NUNITO,
            fontSize: 13,
            lineHeight: 1.6,
            color: COR.texto,
          }}
        >
          {ponto.corpo}
        </p>
      )}
      {ponto.melhor && <Bloco rotulo={ponto.melhorRotulo ?? ''} texto={ponto.melhor} cor={COR.verdeTexto} />}
    </div>
  )
}

function ListaDePontos({
  topo,
  cabecalho,
  pontos,
  entradas,
  icone,
  corDoTitulo,
}: {
  topo: number
  cabecalho: string
  pontos: Ponto[]
  entradas: number[]
  icone: string
  corDoTitulo: string
}) {
  const tituloDaSecao = useEntrada(entradas[0] - 12)
  return (
    <div
      style={{
        position: 'absolute',
        top: topo + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          ...tituloDaSecao,
          margin: '0 0 20px',
          fontFamily: JAKARTA,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '24px',
          color: COR.cinza,
        }}
      >
        {cabecalho}
      </p>
      {pontos.map((ponto, i) => (
        <PontoDaLista
          key={ponto.titulo}
          ponto={ponto}
          entra={entradas[i]}
          icone={icone}
          corDoTitulo={corDoTitulo}
        />
      ))}
    </div>
  )
}

/* -------------------------------------------------- prontidão e o fechamento */

function Prontidao() {
  const quadro = useQuadro()
  const estilo = useEntrada(ENTRA_PRONTIDAO)
  const preenchido = interpolar(quadro, [ENTRA_PRONTIDAO + 6, ENTRA_PRONTIDAO + 30], [0, 0.68],
    suave,
  )
  return (
    <div
      style={{
        ...estilo,
        position: 'absolute',
        top: Y.prontidao + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          margin: '0 0 12px',
          fontFamily: JAKARTA,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '24px',
          color: COR.cinza,
        }}
      >
        SUA PRONTIDÃO
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <img alt="" src={lampada} style={{ width: 65, height: 65, objectFit: 'contain' }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{ flex: 1, fontFamily: JAKARTA, fontSize: 14, fontWeight: 600, lineHeight: '24px', color: COR.tinta }}
            >
              Entrevista de emprego
            </span>
            <span style={{ fontFamily: NUNITO, fontSize: 14, fontWeight: 700, color: COR.tinta }}>68%</span>
            <span style={{ marginLeft: 8, fontFamily: NUNITO, fontSize: 14, fontWeight: 700, color: COR.verdeTexto }}>
              +4%
            </span>
          </div>
          <div
            style={{
              position: 'relative',
              height: 4,
              margin: '8px 0',
              borderRadius: 999,
              backgroundColor: COR.borda,
              overflow: 'hidden',
            }}
          >
            <div style={{ width: `${preenchido * 100}%`, height: '100%', borderRadius: 999, backgroundColor: COR.verde }} />
          </div>
          <p style={{ margin: 0, fontFamily: NUNITO, fontSize: 13, lineHeight: 1.6, color: COR.apoio }}>
            Refazendo com os 3 ajustes acima, você mira{' '}
            <strong style={{ fontWeight: 700, color: COR.tinta }}>8,5</strong> e chega perto de{' '}
            <strong style={{ fontWeight: 700, color: COR.tinta }}>80% de prontidão</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

const SUGESTOES = [
  { rotulo: 'SER UM CIDADÃO MELHOR', titulo: 'Segurança em primeiro lugar', icone: 'livro' as const, cor: COR.texto, opacidade: 0.53 },
  { rotulo: 'SIMULAÇÃO', titulo: 'Entrevista de emprego', icone: 'balao' as const, cor: COR.ambar, opacidade: 1 },
]

function Subir() {
  const cabecalho = useEntrada(ENTRA_SUBIR[0] - 10)
  return (
    <div
      style={{
        position: 'absolute',
        top: Y.subir + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        padding: '0 24px',
        boxSizing: 'border-box',
      }}
    >
      <p
        style={{
          ...cabecalho,
          margin: '0 0 12px',
          fontFamily: JAKARTA,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '24px',
          color: COR.cinza,
        }}
      >
        PRA SUBIR ESSA NOTA
      </p>
      {SUGESTOES.map((sugestao, i) => (
        <CartaoDeSugestao key={sugestao.rotulo} sugestao={sugestao} entra={ENTRA_SUBIR[i]} />
      ))}
    </div>
  )
}

function CartaoDeSugestao({ sugestao, entra }: { sugestao: (typeof SUGESTOES)[number]; entra: number }) {
  const estilo = useEntrada(entra)
  return (
          <div
            style={{
              ...estilo,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              padding: '12px 16px',
              borderRadius: 12,
              border: `1px solid ${COR.borda}`,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: sugestao.opacidade }}>
                {sugestao.icone === 'livro' ? <IconeLivro cor={COR.texto} /> : <IconeBalao cor={COR.ambar} />}
                <span style={{ fontFamily: JAKARTA, fontSize: 14, fontWeight: 600, lineHeight: '24px', color: sugestao.cor }}>
                  {sugestao.rotulo}
                </span>
              </div>
              <p
                style={{ margin: 0, fontFamily: LEXEND, fontSize: 12, fontWeight: 600, lineHeight: '16px', color: COR.texto }}
              >
                {sugestao.titulo}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 87,
                height: 37,
                flexShrink: 0,
                borderRadius: 10,
                backgroundColor: '#ffffff',
                border: `2px solid ${COR.borda}`,
                boxShadow: `0 6px 0 ${COR.borda}`,
                boxSizing: 'border-box',
                fontFamily: LEXEND,
                fontSize: 12,
                fontWeight: 600,
                color: COR.texto,
              }}
            >
              Bora!
            </div>
          </div>
  )
}

function BarraDeAcao() {
  const quadro = useQuadro()
  const entrada = mola(quadro - ENTRA_SUBIR[1] - 8, { damping: 15, stiffness: 120, mass: 0.8 })
  /* Afunda os 6px da própria sombra, como o botão do app faz. */
  const afunda = interpolar(quadro, [TOQUE_REFAZER, TOQUE_REFAZER + 5], [0, 6])
  return (
    <div
      style={{
        position: 'absolute',
        top: Y.ctabar + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        height: 131,
        opacity: entrada,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 14 + afunda,
          width: 342,
          height: 55,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: COR.verdeEscuro,
          boxShadow: `0 ${6 - afunda}px 0 #14523d`,
          fontFamily: LEXEND,
          fontSize: 16,
          fontWeight: 600,
          color: '#ffffff',
        }}
      >
        Refazer simulação
      </div>
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 83,
          width: 342,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <IconeCompartilhar />
        <span style={{ fontFamily: JAKARTA, fontSize: 14, fontWeight: 600, lineHeight: '24px', color: COR.texto }}>
          Compartilhar minha nota
        </span>
      </div>
    </div>
  )
}

function Divisor({ y }: { y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: y + TOPO_SEGURO,
        left: 0,
        width: LARGURA,
        height: 1,
        backgroundColor: COR.divisor,
      }}
    />
  )
}

/* ------------------------------------------------------------------- raiz */

export function Relatorio() {
  const quadro = useQuadro()

  const rolagem = interpolar(
    quadro,
    ROLAGEM.map(([f]) => f),
    ROLAGEM.map(([, y]) => y),
    suave,
  )

  const saida = interpolar(quadro, [SAI, DURACAO - 1], [1, 0])

  return (
    <Camada style={{ backgroundColor: '#ffffff', opacity: saida }}>
      <Camada style={{ transform: `translateY(${-rolagem}px)`, height: 'auto' }}>
        <Topbar />
        <Abas />
        <Hero />
        <CartaoMedalha />
        <Rubrica />
        <Divisor y={Y.divisor1} />
        <ListaDePontos
          topo={Y.brilhou}
          cabecalho="ONDE VOCÊ BRILHOU"
          pontos={BRILHOU}
          entradas={ENTRA_BRILHOU}
          icone={estrela}
          corDoTitulo={COR.ambarEscuro}
        />
        <Divisor y={Y.divisor2} />
        <ListaDePontos
          topo={Y.melhorar}
          cabecalho="ONDE DÁ PRA MELHORAR"
          pontos={MELHORAR}
          entradas={ENTRA_MELHORAR}
          icone={info}
          corDoTitulo="#2f80ed"
        />
        <Divisor y={Y.divisor3} />
        <Prontidao />
        <Divisor y={Y.divisor4} />
        <Subir />
        <BarraDeAcao />
      </Camada>

      {/* A lista rola por baixo da barra de status, então o topo é opaco. */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: LARGURA, height: TOPO_SEGURO, backgroundColor: '#ffffff' }}
      />
      <BarraDeStatus cor={COR.tinta} />

      <Toque x={195} y={Y.ctabar + TOPO_SEGURO + 41 - 1973} quando={TOQUE_REFAZER} cor="rgba(255,255,255,0.8)" />
    </Camada>
  )
}
