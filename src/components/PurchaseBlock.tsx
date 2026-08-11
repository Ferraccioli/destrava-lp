import LeadForm from './LeadForm'
import { useInView } from '../hooks/useInView'
import presenteFuturo from '../assets/presente-futuro.webp'

export default function PurchaseBlock() {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section id="comprar" className="scroll-mt-4 bg-mint-soft">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 md:px-8 md:py-20">
        {/* Selo de oferta sobre a régua da seção. Campo escuro com a coroa em
            amarelo é o mesmo par do selo "Não é um curso" no hero. */}
        <div className="flex items-center gap-4">
          <p className="inline-flex shrink-0 items-center gap-2 rounded-full bg-forest-deep py-2 pl-3 pr-4 font-display text-sm font-semibold text-white">
            <Coroa />
            Oferta por tempo limitado
          </p>
          <span className="h-0.5 flex-1 bg-mint" aria-hidden="true" />
        </div>

        {/*
          O preço vive no card, não aqui: é lá que ele tem o riscado, o brilho e
          as condições. O título anuncia o que é, o card diz quanto custa.
        */}
        <h2 className="mt-6 max-w-[16ch] font-display text-[2.25rem] font-semibold leading-[1.03] tracking-display text-forest md:text-[3.25rem]">
          Três meses de acesso completo.
        </h2>

        {/*
          Preço e formulário são um card só: quem decidiu vê o valor e o campo
          de e-mail na mesma superfície, sem atravessar o card escuro da objeção,
          que fica embaixo. A divisão entre os dois é uma régua — horizontal no
          celular, vertical no md — e não uma segunda moldura.
        */}
        <div className="mt-10 space-y-6">
          <div className="grid gap-8 rounded-3xl border-2 border-mint bg-white p-6 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:p-8">
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

              {/*
                Medalhão à esquerda e as duas falas empilhadas à direita, em vez
                da nota amarela cruzando a largura inteira por baixo. Como o
                medalhão passa a responder pelas duas linhas, ele cresce sem
                deixar buraco ao lado.

                Tudo isso só vale do lg para cima, e a razão é medida: no md a
                coluna esquerda do card tem 305px, então o medalhão maior deixa
                189px para a frase e ela quebra em cinco linhas. Abaixo do lg
                fica o arranjo antigo — medalhão de 64px ao lado da frase e a
                nota cruzando a largura por baixo.
              */}
              <div className="mt-6 grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-4 border-t-2 border-mint pt-6 lg:gap-x-5">
                {/* No lg ele para de ser um selo ao lado da primeira linha e
                    passa a ser o painel da coluna: `h-full` sobre a área das
                    duas linhas, então topo e base fecham com os textos sozinhos,
                    sem valor escolhido a dedo. Tem que ser altura esticada e não
                    um quadrado maior — a pilha de texto muda de altura em
                    degraus conforme quebra (132px, 155px), e quadrado nenhum
                    acompanha degrau. */}
                <Medalhao
                  src={presenteFuturo}
                  className="h-16 w-16 self-start lg:row-span-2 lg:h-full lg:w-32 lg:self-stretch"
                />
                <p className="text-[1.05rem] font-semibold leading-snug text-ink">
                  Não é mais uma mensalidade que você assume. É um presente pensado pro futuro dele.
                </p>

                {/* raio menor que o do card que a contém, para não competir com ele */}
                <p className="col-span-2 rounded-xl bg-sun-soft px-4 py-3 text-sm font-medium leading-relaxed text-ink lg:col-span-1 lg:col-start-2">
                  Você já investiu mais que isso em coisa que ele não terminou.
                </p>
              </div>
            </div>

            {/* A régua troca de eixo por breakpoint em vez de virar moldura */}
            <div className="border-t-2 border-mint pt-8 md:border-l-2 md:border-t-0 md:pl-10 md:pt-0">
              <h3 className="font-display text-2xl font-semibold tracking-display text-forest">
                Garanta o acesso do seu filho
              </h3>
              <div className="mt-6">
                <LeadForm />
              </div>
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

/**
 * Ilustração sobre campo mint. O `isolate` prende o mix-blend-multiply ao fundo
 * do próprio medalhão: sem ele, o blend pega a superfície escura atrás e a
 * ilustração fecha em preto.
 *
 * Muda de forma no lg junto com o arranjo do bloco: círculo pequeno ao lado da
 * primeira linha, painel arredondado quando ocupa a coluna inteira. O zoom de
 * 124% acompanha essa troca porque existe por causa do círculo — canto de
 * círculo come a arte, então a imagem entra maior para não deixar vazio nas
 * bordas. No painel não há canto comendo nada, e manter o zoom só cortaria as
 * mãos do desenho.
 *
 * Tem um único ponto de uso, e é por isso que a decisão de forma mora aqui
 * dentro em vez de virar prop.
 */
function Medalhao({
  src,
  alt = '',
  className = '',
}: {
  src: string
  alt?: string
  className?: string
}) {
  return (
    <span
      className={`isolate flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-mint lg:rounded-3xl ${className}`}
    >
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : true}
        className="h-[124%] w-[124%] max-w-none object-contain mix-blend-multiply lg:h-full lg:w-full"
        width={1024}
        height={1024}
        loading="lazy"
      />
    </span>
  )
}
