import { useInView } from '../hooks/useInView'
import presenteFuturo from '../assets/presente-futuro.webp'

/* Destino do botão de compra. Todos os outros CTAs da página apontam para
   `#comprar`, que é esta seção, e terminam neste botão. */
const URL_CHECKOUT = '#'

export default function PurchaseBlock() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section id="comprar" className="scroll-mt-4 bg-mint-soft">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-center gap-4">
          <span className="h-0.5 flex-1 bg-mint" aria-hidden="true" />
          <p className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-deep py-2 pl-3 pr-4 font-display text-sm font-semibold text-white">
            <Coroa />
            Oferta por tempo limitado
          </p>
          <span className="h-0.5 flex-1 bg-mint" aria-hidden="true" />
        </div>

        <h2 className="mt-6 text-center font-display text-[2.25rem] font-semibold leading-[1.03] tracking-display text-forest md:text-[3.25rem]">
          Três meses de acesso completo.
        </h2>

        <div className="mt-10 space-y-6">
          {/* Colunas medidas pelo conteúdo (`auto`) e centradas com
              `justify-center`: em fração elas esticam até preencher o container,
              e a sobra vira um buraco à direita. */}
          <div className="grid items-center justify-center gap-8 md:grid-cols-[auto_auto] md:gap-12 lg:gap-16">
            {/* `mix-blend-multiply` dissolve o fundo branco do asset no mint da
                seção. Largura declarada do md em diante: com a coluna medindo o
                conteúdo, `w-full` não teria contra o que medir. */}
            <img
              src={presenteFuturo}
              alt=""
              aria-hidden="true"
              className="mx-auto w-full max-w-[18rem] mix-blend-multiply md:w-[20rem] md:max-w-none lg:w-[24rem]"
              width={1024}
              height={1024}
              loading="lazy"
            />

            <div ref={ref} className="md:max-w-[30rem]">
              <p className="text-lg font-medium text-ink-faint">
                <span className="price-strike" data-struck={inView}>
                  R$ 67,90
                </span>
              </p>
              <p className="price-shine mt-1 font-display text-[3.5rem] font-semibold leading-none tracking-display md:text-[4rem]">
                R$ 59,90
              </p>
              <p className="mt-4 text-sm font-medium leading-relaxed text-ink-soft">
                <span className="whitespace-nowrap">Garantia de 7 dias&ensp;·&ensp;</span>
                <span className="whitespace-nowrap">sem renovação automática</span>
              </p>

              <p className="mt-6 border-t-2 border-mint pt-6 text-[1.05rem] font-semibold leading-snug text-ink">
                Não é mais uma mensalidade que você assume. É um presente pensado pro futuro dele.
              </p>

              <p className="mt-4 rounded-xl bg-sun-soft px-4 py-3 text-sm font-medium leading-relaxed text-ink">
                Invista em algo que realmente vai fazer diferença na vida dele.
              </p>

              <a
                href={URL_CHECKOUT}
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-10 py-4 font-display text-lg font-semibold text-white transition-[background-color,transform] duration-200 ease-out hover:bg-brand-dark active:scale-[0.99]"
              >
                Quero o Destrava
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
          </div>

          {/* Duas colunas só no lg, e não no md: no md a resposta cai para 26
              caracteres por linha. Empilhada, fica com 62. */}
          <div className="grid gap-6 rounded-3xl bg-mint p-6 md:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
            <p className="font-display text-[1.75rem] font-semibold leading-[1.05] tracking-display text-forest md:text-[2.25rem]">
              “E se ele não usar?”
            </p>

            <div className="max-w-[46ch] space-y-4 text-[1.02rem] leading-relaxed text-ink-soft lg:max-w-none lg:border-l-2 lg:border-forest/15 lg:pl-10">
              <p>
                Ele passa horas no celular e você sabe disso. O Destrava foi feito pra caber nesse
                mesmo lugar: linguagem fácil, atividades curtas e práticas, nada de aula gravada.
                Ele entende na primeira tela que não é curso, e abre porque é útil, não porque foi
                obrigado.
              </p>
              <p className="font-semibold text-forest">
                E é esse o presente que você está dando: preparo na hora em que ele precisa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Coroa() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[1.15rem] w-[1.15rem] shrink-0 text-sun"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.4 17.5 3 7.6l5.2 3.6L12 4.8l3.8 6.4L21 7.6l-1.4 9.9z" />
      <path d="M4.6 20.2h14.8" />
    </svg>
  )
}

