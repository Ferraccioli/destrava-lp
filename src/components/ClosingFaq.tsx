import SeloGarantia from './SeloGarantia'

const FAQ = [
  {
    q: 'Preciso pagar para o meu filho usar o Destrava?',
    a: 'Sim. O download é gratuito, mas é uma versão de teste. As trilhas e a Simulação, que é onde ele treina de verdade, estão no acesso completo.',
  },
  {
    q: 'E se eu comprar e meu filho não usar?',
    a: 'Você tem 7 dias de garantia. Se você ou seu filho não gostar, é só pedir o reembolso.\nE o Destrava foi pensado pra entrar quando ele tem um problema real na frente. A Simulação se ajusta ao que ele está vivendo: nada genérico. Minutos por dia, no celular, no ritmo dele.',
  },
  {
    q: 'Como meu filho começa a usar?',
    a: 'O acesso chega no seu e-mail em até 5 minutos. Ele baixa o app, entra e escolhe por onde começar. Sem aula pra assistir: ele já começa fazendo.',
  },
  {
    q: 'Por que só três meses?',
    a: 'Porque não é pra virar mais uma assinatura que você esquece que está pagando. Três meses é o tempo do que ele tem pela frente agora. Depois, não tem cobrança nova, e o que ele treinou fica com ele.',
  },
  {
    q: 'Meu filho tem 15 anos. Já serve?',
    a: 'Serve, e nessa idade ele usa por outro motivo. Aos 18 a pressão é resolver; aos 15 é decidir que caminho seguir. As trilhas de Carreira e Bem-estar foram escritas pra essa fase.',
  },
]

export default function ClosingFaq() {
  return (
    <>
      <section className="bg-mint-soft">
        <div className="mx-auto w-full max-w-4xl px-5 py-16 md:px-8 md:py-24">
          {/*
            Fechamento. Os quatro blocos são irmãos na mesma grade para que o
            arranjo mude por breakpoint sem duplicar a imagem: no mobile o selo
            fica ao lado do texto da garantia, com oferta e botão em largura
            cheia; no sm+ ele sobe para a coluna da esquerda e acompanha os
            três de uma vez.
          */}
          <div className="grid grid-cols-[1fr_2fr] gap-x-5 gap-y-7 sm:gap-x-12">
            <div className="col-span-2 border-b-2 border-mint pb-7 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:border-b-0 sm:pb-0">
              <h2 className="font-display text-[2.25rem] font-semibold leading-[1.03] tracking-display text-forest md:text-[2.75rem]">
                Três meses de acesso completo por R$ 59,90.
              </h2>
              <p className="mt-3 text-base font-medium text-ink-soft">
                <span className="line-through">R$ 67,90</span>&ensp;·&ensp;sem renovação automática
              </p>
            </div>

            {/*
              Vetorizado e desenhado inline, para as faíscas poderem flutuar em
              ritmo próprio — dentro de <img> o SVG é opaco para o CSS da
              página. Duas coisas caíram junto com o raster: o
              `mix-blend-multiply`, que existia só para dissolver o fundo branco
              do webp no mint da seção, e o `loading="lazy"`, que num desenho
              que já vem no HTML não tem o que adiar.

              Largura vem da coluna, não do asset: com a grade em frações,
              largura fixa maior que a fração transborda a célula.
            */}
            <SeloGarantia className="col-start-1 row-start-2 h-auto w-full self-center sm:row-span-3 sm:row-start-1" />

            <div className="col-start-2 row-start-2 self-center sm:self-start sm:border-t-2 sm:border-mint sm:pt-7">
              <p className="flex items-center gap-2 font-display text-xl font-semibold tracking-display text-forest">
                <Verificado />
                Garantia de 7 dias
              </p>
              <p className="mt-2 text-[1.05rem] leading-relaxed text-ink">
                Se o Destrava não for pro seu filho por algum motivo, você pode pedir o reembolso em
                até 7 dias.
              </p>
            </div>

            <a
              href="#comprar"
              className="col-span-2 row-start-3 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-10 py-4 font-display text-lg font-semibold text-white transition-[background-color,transform] duration-200 ease-out hover:bg-brand-dark active:scale-[0.99] sm:col-span-1 sm:col-start-2 sm:justify-self-start"
            >
              Comprar com garantia
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          {/* FAQ */}
          <h2 className="mt-16 font-display text-3xl font-semibold tracking-display text-forest md:text-4xl">
            Perguntas frequentes
          </h2>
          <div className="mt-6 border-t-2 border-mint">
            {FAQ.map(({ q, a }) => (
              /* name compartilhado: abrir uma pergunta fecha a anterior (acordeão nativo) */
              <details key={q} name="faq" className="border-b-2 border-mint">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 font-display text-lg font-medium text-forest transition-colors duration-150 hover:text-brand md:text-xl">
                  {q}
                  <svg
                    viewBox="0 0 24 24"
                    className="faq-chevron h-5 w-5 shrink-0 transition-transform duration-300 ease-out"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="space-y-3 pb-6 pr-8 text-[1.02rem] leading-relaxed text-ink-soft">
                  {a.split('\n').map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Última linha da página */}
      <section className="bg-forest">
        <p className="mx-auto max-w-4xl px-5 py-16 text-center font-display text-[1.75rem] font-medium leading-[1.2] tracking-display text-white md:px-8 md:py-24 md:text-[2.75rem]">
          Ele vai ter que tomar essas decisões de qualquer jeito.{' '}
          <span className="text-sun">A única escolha aqui é se ele vai se preparar antes.</span>
        </p>
      </section>
    </>
  )
}

/**
 * Selo de verificado ao lado da garantia.
 *
 * A roseta é gerada, não copiada: doze lóbulos, cada um uma curva quadrática
 * cujo ponto de controle fica no raio externo, no ângulo que divide o par de
 * vértices ao meio. Isso importa porque o desenho de verificado das redes é
 * marca registrada delas, e o que a página precisa aqui é da convenção visual,
 * não do mark de ninguém.
 *
 * O azul é o único da página, e é deliberado: verificado que não é azul não lê
 * como verificado. Fica em #1478d0 e não no #1d9bf0 de costume por causa do
 * cheque branco por dentro — assim o par dá 4,5:1, e no tom claro daria 2,7:1.
 */
function Verificado() {
  return (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] shrink-0" aria-hidden="true">
      <path
        fill="#1478d0"
        d="M12 2.5 Q15.11 0.41 16.75 3.77 Q20.49 3.51 20.23 7.25 Q23.59 8.89 21.5 12 Q23.59 15.11 20.23 16.75 Q20.49 20.49 16.75 20.23 Q15.11 23.59 12 21.5 Q8.89 23.59 7.25 20.23 Q3.51 20.49 3.77 16.75 Q0.41 15.11 2.5 12 Q0.41 8.89 3.77 7.25 Q3.51 3.51 7.25 3.77 Q8.89 0.41 12 2.5 Z"
      />
      <path
        d="M8.2 12.2l2.6 2.6 5-5.4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
