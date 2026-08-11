import { useInView } from '../hooks/useInView'
import presenteFuturo from '../assets/presente-futuro.webp'

/*
 * ⚠️ DESTINO PENDENTE. O formulário de captura saiu daqui a pedido, e no lugar
 * dele ficou um botão que leva direto ao checkout — só que checkout não existe
 * ainda, e não há URL dele em lugar nenhum do projeto. Enquanto isto for `#`, o
 * CTA principal da seção de compra não leva a lugar nenhum.
 *
 * Trocar por um link real ANTES de tratar a página como no ar. Todos os outros
 * CTAs (topo, hero, fechamento) apontam para `#comprar`, que é esta seção, e
 * terminam neste botão: é o único ponto de saída da página.
 */
const URL_CHECKOUT = '#'

export default function PurchaseBlock() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section id="comprar" className="scroll-mt-4 bg-mint-soft">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
        {/* Selo de oferta sobre a régua da seção. Campo escuro com a coroa em
            amarelo é o mesmo par do selo "Não é um curso" no hero.

            A régua vai dos dois lados agora: com ele centrado e a régua só à
            direita, o selo ficaria pendurado numa linha que sai de lugar nenhum.
            Duas metades iguais é o que faz a régua ler como régua cortada pelo
            selo, e não como um traço solto. */}
        <div className="flex items-center gap-4">
          <span className="h-0.5 flex-1 bg-mint" aria-hidden="true" />
          <p className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-deep py-2 pl-3 pr-4 font-display text-sm font-semibold text-white">
            <Coroa />
            Oferta por tempo limitado
          </p>
          <span className="h-0.5 flex-1 bg-mint" aria-hidden="true" />
        </div>

        {/* Sem teto de medida: o `max-w-[16ch]` daqui era o que partia o título
            em duas linhas. Solto, ele cabe inteiro numa linha no desktop, e no
            celular quebra por largura de tela, como qualquer texto. */}
        <h2 className="mt-6 text-center font-display text-[2.25rem] font-semibold leading-[1.03] tracking-display text-forest md:text-[3.25rem]">
          Três meses de acesso completo.
        </h2>

        {/*
          Sem card branco. A moldura existia para juntar preço e formulário numa
          superfície só; sem formulário ela virava uma caixa em volta de uma
          coluna de texto, e a seção já tem fundo próprio para separá-la das
          vizinhas. O que era conteúdo do card passa a ser conteúdo da seção.

          Duas colunas: a ilustração do presente sozinha à esquerda, em tamanho
          de ilustração e não de selo, e todo o resto à direita. A imagem é o
          argumento da seção — "presente, não mensalidade" — então ela para de
          ser um ícone ao lado de uma frase e passa a carregar a coluna.
        */}
        <div className="mt-10 space-y-6">
          <div className="grid items-center gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12 lg:gap-16">
            {/* `mix-blend-multiply` sem `isolate` desta vez: o fundo branco do
                asset se dissolve direto no mint da seção, e não há mais campo
                escuro por perto para o blend pegar por engano. */}
            <img
              src={presenteFuturo}
              alt=""
              aria-hidden="true"
              className="mx-auto w-full max-w-[18rem] mix-blend-multiply md:max-w-none"
              width={1024}
              height={1024}
              loading="lazy"
            />

            <div ref={ref}>
              <p className="text-lg font-medium text-ink-faint">
                <span className="price-strike" data-struck={inView}>
                  R$ 67,90
                </span>
              </p>
              <p className="price-shine mt-1 font-display text-[3.5rem] font-semibold leading-none tracking-display md:text-[4rem]">
                R$ 59,90
              </p>
              {/* "Acesso completo por 3 meses" saiu: o título da seção já diz isso.
                  Cada condição quebra inteira, com o nowrap impedindo corte no meio. */}
              <p className="mt-4 text-sm font-medium leading-relaxed text-ink-soft">
                <span className="whitespace-nowrap">Garantia de 7 dias&ensp;·&ensp;</span>
                <span className="whitespace-nowrap">sem renovação automática</span>
              </p>

              <p className="mt-6 max-w-[38ch] border-t-2 border-mint pt-6 text-[1.05rem] font-semibold leading-snug text-ink">
                Não é mais uma mensalidade que você assume. É um presente pensado pro futuro dele.
              </p>

              <p className="mt-4 max-w-[38ch] rounded-xl bg-sun-soft px-4 py-3 text-sm font-medium leading-relaxed text-ink">
                Você já investiu mais que isso em coisa que ele não terminou.
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

          {/* Objeção: o peso máximo da página, em campo preto chapado.

              Já teve a cena do filho no sofá de fundo, com véu por cima. Saiu a
              pedido dele: o card é bem mais largo que alto, e nessa faixa só
              cabiam 31,5% da altura da ilustração — qualquer enquadramento
              cortava alguma coisa, e o véu que o texto exigia já deixava a cena
              quase invisível de qualquer forma.

              Sem a imagem, uma coluna só de texto deixava 60% da largura vazia.
              Pergunta e resposta viraram duas colunas separadas por régua, o
              mesmo arranjo do card de preço acima. A largura que sobrou foi
              toda pro título, que aqui é o pico emocional da página.

              A divisão só entra no lg, e não no md: a partir de duas colunas o
              card se estreita junto com a tela, e no md a resposta caía para
              230px, 26 caracteres por linha. Empilhado ela fica com 62. */}
          <div className="on-dark grid gap-6 rounded-3xl bg-black p-6 md:p-9 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
            <p className="font-display text-[2.25rem] font-semibold leading-[1.02] tracking-display text-white md:text-[2.75rem] lg:text-[3.5rem]">
              “E se ele não usar?”
            </p>

            {/* A medida se fecha pela coluna no lg+; o teto em ch só governa o
                empilhado, onde não há coluna para segurar a linha. */}
            <div className="max-w-[46ch] space-y-4 text-[1.02rem] leading-relaxed text-mint lg:max-w-none lg:border-l-2 lg:border-white/15 lg:pl-10">
              <p>
                Ele passa horas no celular e você sabe disso. O Destrava foi feito pra caber nesse
                mesmo lugar: linguagem fácil, atividades curtas e práticas, nada de aula gravada.
                Ele entende na primeira tela que não é curso, e abre porque é útil, não porque foi
                obrigado.
              </p>
              <p className="font-semibold text-sun">
                E é esse o presente que você está dando: preparo na hora em que ele precisa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* Desenhada no traço dos outros ícones da página: 24 de caixa, contorno de 2,
   pontas e junções arredondadas. */
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

