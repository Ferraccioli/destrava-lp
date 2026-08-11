/**
 * Preserva a posição de rolagem entre recarregamentos.
 *
 * O navegador já faz isso sozinho em página comum, e aqui ele não consegue: o
 * HTML servido tem só um `<div id="root">` vazio, então no instante em que ele
 * tenta restaurar, o documento tem uma tela de altura e a restauração é
 * limitada a zero. Quando o JS está em cache e o React pinta rápido, dá certo
 * por acaso, dentro da janela de retentativa do navegador; numa carga fria,
 * não. É por isso que o defeito aparece de forma intermitente.
 *
 * A saída é assumir o trabalho: `manual` desliga a tentativa do navegador — que
 * além de falhar, brigaria com a nossa —, e a posição é reposta assim que o
 * documento cresce o bastante para comportá-la.
 */
const CHAVE = 'destrava:rolagem'

/* sessionStorage lança em modo restrito de privacidade. Perder a posição é
   aceitável; derrubar o carregamento da página por causa disso, não. */
function ler(): number {
  try {
    return Number(sessionStorage.getItem(CHAVE)) || 0
  } catch {
    return 0
  }
}

function gravar(y: number) {
  try {
    sessionStorage.setItem(CHAVE, String(Math.round(y)))
  } catch {
    /* sem onde guardar: segue sem preservar */
  }
}

export function preservarRolagem() {
  if (!('scrollRestoration' in history)) return
  history.scrollRestoration = 'manual'

  /*
   * Guarda por tempo e não por quadro: `requestAnimationFrame` não corre em aba
   * de fundo nem em navegador sem compositor, e é justamente ao sair da aba que
   * a última posição precisa estar salva.
   */
  let agendado: number | undefined
  addEventListener(
    'scroll',
    () => {
      if (agendado !== undefined) return
      agendado = window.setTimeout(() => {
        agendado = undefined
        gravar(window.scrollY)
      }, 200)
    },
    { passive: true },
  )

  /* Rede para o que o `scroll` atrasado pode não ter pego: `pagehide` dispara
     antes de recarregar e de navegar para fora. */
  addEventListener('pagehide', () => gravar(window.scrollY))

  const alvo = ler()
  /* Âncora na URL manda mais que a posição antiga: quem chega em `#comprar`
     pediu para ir ao bloco de compra, não para voltar de onde parou. */
  if (alvo <= 0 || location.hash) return

  const cabe = () => document.documentElement.scrollHeight - window.innerHeight >= alvo

  const repor = () => {
    /* `instant` é obrigatório: `scroll-behavior: smooth` está no `<html>`, e sem
       isso a reposição vira uma animação de sete mil pixels na cara de quem
       recarregou. */
    window.scrollTo({ top: alvo, behavior: 'instant' })
  }

  if (cabe()) {
    repor()
    return
  }

  /*
   * O documento ainda não tem altura. Em vez de chutar um atraso, observa o
   * tamanho e repõe no momento em que couber — o que acontece no primeiro
   * quadro em que o React já montou a página.
   */
  const observador = new ResizeObserver(() => {
    if (!cabe()) return
    repor()
    observador.disconnect()
    window.clearTimeout(desistir)
  })
  observador.observe(document.documentElement)

  /* Desiste depois de um tempo: se a página encolheu de verdade entre uma visita
     e outra, ficar observando para sempre só deixaria o observador vivo à toa. */
  const desistir = window.setTimeout(() => observador.disconnect(), 4000)
}
