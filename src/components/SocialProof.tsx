import { useInView } from '../hooks/useInView'
import maeDepoimento from '../assets/mae-depoimento.webp'

/* Assinatura de cada depoimento, na ordem em que eles aparecem. */
const ASSINATURAS = ['Débora M., Osasco (SP)', 'Cláudia R., Belford Roxo (RJ)', 'Wagner T., Camaçari (BA)']

const DEPOIMENTOS = [
  {
    quote:
      'Ele treinou a semana toda para uma entrevista. Chegou em casa falando que se sentiu muito mais confiante do que nas outras vezes.',
    /* Grifo declarado à parte para a citação seguir sendo uma string só: a fala
       do depoente é a fonte, e o destaque é marcação nossa por cima dela. */
    destaque: 'se sentiu muito mais confiante',
    author: ASSINATURAS[0],
  },
  {
    quote:
      'Minha filha sempre se sentiu insegura pra escolher um curso, achava que não se encaixava em nada. Há alguns dias me falou que já está cogitando dois cursos pro vestibular.',
    author: ASSINATURAS[1],
  },
  {
    quote:
      'Acho que todo pai tem aquela insegurança de ‘meu filho vai conseguir ser alguém na vida?’, e isso é normal. Mas ter um direcionamento está fazendo toda a diferença pra nós dois. Obrigado, time Destrava.',
    author: ASSINATURAS[2],
  },
]

/*
 * Estrela cheia de cantos arredondados, no desenho do Figma. O arredondamento
 * vem de um contorno grosso da própria cor com junção redonda, em vez de um
 * path com cada canto curvado à mão.
 */
function Estrela({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4.2l2.83 5.73 6.32.92-4.57 4.46 1.08 6.3L12 18.63l-5.66 2.98 1.08-6.3-4.57-4.46 6.32-.92z" />
    </svg>
  )
}

/* Um `role="img"` com rótulo único, e não cinco ícones soltos: o leitor de tela
   recebe a nota de uma vez. */
function CincoEstrelas({ tamanho = 'h-4 w-4' }: { tamanho?: string }) {
  return (
    <div className="flex gap-1 text-sun" role="img" aria-label="Avaliação: cinco de cinco estrelas">
      {Array.from({ length: 5 }, (_, i) => (
        <Estrela key={i} className={tamanho} />
      ))}
    </div>
  )
}

/** Aplica o grifo ao trecho pedido. Trecho ausente na citação devolve o texto inteiro. */
function Citacao({ texto, grifo, pintado }: { texto: string; grifo?: string; pintado?: boolean }) {
  if (!grifo || !texto.includes(grifo)) return <>{texto}</>
  const [antes, ...resto] = texto.split(grifo)
  return (
    <>
      {antes}
      <mark className="grifo" data-pintado={pintado}>
        {grifo}
      </mark>
      {resto.join(grifo)}
    </>
  )
}

export default function SocialProof() {
  const [destaque, ...restantes] = DEPOIMENTOS
  const { ref: citacaoRef, inView: citacaoEmCena } = useInView<HTMLElement>()

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
      {/* A ilustração ancora a coluna inteira: mesma altura do conjunto
          título + depoimento em destaque. */}
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-stretch md:gap-14">
        <div>
          <h2 className="max-w-[12ch] font-display text-[2.25rem] font-semibold leading-[1.03] tracking-display text-forest md:text-[3.25rem]">
            O que os pais estão contando.
          </h2>

          <figure ref={citacaoRef} className="mt-10 border-t-2 border-mint pt-10">
            <CincoEstrelas tamanho="h-5 w-5" />
            <blockquote className="mt-5 max-w-[26ch] font-display text-[1.75rem] font-medium leading-[1.25] tracking-display text-forest md:text-[2.25rem]">
              “
              <Citacao
                texto={destaque.quote}
                grifo={destaque.destaque}
                pintado={citacaoEmCena}
              />
              ”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <Avatar />
              <span className="text-sm font-semibold text-ink-soft">{destaque.author}</span>
            </figcaption>
          </figure>
        </div>
        <img
          src={maeDepoimento}
          alt=""
          aria-hidden="true"
          className="mx-auto w-52 mix-blend-multiply md:h-full md:w-[21rem] md:self-stretch md:object-contain"
          width={1024}
          height={1024}
          loading="lazy"
        />
      </div>

      {/* Os outros dois, em peso menor */}
      <div className="mt-4 grid gap-y-10 md:grid-cols-2 md:gap-x-14">
        {restantes.map(({ quote, author }) => (
          <figure key={quote} className="border-t-2 border-mint pt-8">
            <CincoEstrelas />
            <blockquote className="mt-4 text-[1.05rem] leading-relaxed text-ink">“{quote}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <Avatar />
              <span className="text-sm font-semibold text-ink-soft">{author}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/* Avatar genérico do depoente: silhueta dentro de um círculo tracejado. */
function Avatar() {
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-forest/25 bg-mint-soft"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="#5F7168"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="9" r="3.4" />
        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
      </svg>
    </span>
  )
}
