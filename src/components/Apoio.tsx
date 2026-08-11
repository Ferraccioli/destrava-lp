import faetec from '../assets/apoio-faetec.webp'
import faperj from '../assets/apoio-faperj.webp'
import noiz from '../assets/apoio-noiz.webp'
import sebrae from '../assets/apoio-sebrae.webp'

/*
 * Tarja de apoiadores, no lugar da tarja móvel que rodava aqui.
 *
 * O desenho é o da LP de pagamento que já está no ar, reproduzido a partir dela:
 * rótulo em versalete, logos achatados em branco e o reconhecimento do Sebrae
 * separado por uma régua vertical. As alturas são diferentes por logo de
 * propósito — cada marca tem proporção própria, e igualar altura de caixa faz a
 * de traço fino sumir ao lado da de traço grosso.
 *
 * O campo é `forest-deep`, e não o quase-preto do original: preto chapado é cor
 * que esta página não tem mais em lugar nenhum desde que o card da objeção
 * clareou, e a tarja que rodava aqui antes já era verde.
 *
 * `brightness(0) invert(1)` achata cada logo em branco puro, seja qual for a cor
 * do arquivo. É o que permite marcas de cores diferentes conviverem na mesma
 * tarja sem virar um mostruário; e é por isso que os arquivos servidos podem ser
 * pequenos, já que só a silhueta sobrevive.
 */
const LOGOS = [
  { src: faetec, alt: 'FAETEC', altura: 'h-6' },
  { src: faperj, alt: 'FAPERJ', altura: 'h-8' },
  { src: noiz, alt: 'ONG Noiz', altura: 'h-8' },
]

export default function Apoio() {
  return (
    <section aria-label="Apoiadores e reconhecimento" className="bg-forest-deep px-5 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Rotulo>Com o apoio:</Rotulo>
          {LOGOS.map(({ src, alt, altura }) => (
            <img
              key={alt}
              src={src}
              alt={alt}
              className={`w-auto opacity-70 brightness-0 invert ${altura}`}
              loading="lazy"
            />
          ))}
        </div>

        {/* A régua some no empilhado: separador vertical entre blocos que
            passaram a ficar um embaixo do outro vira um traço no meio do nada. */}
        <span className="hidden h-12 w-px shrink-0 bg-white/20 lg:block" aria-hidden="true" />

        <div className="flex items-center gap-5">
          <p className="max-w-[22ch] text-[0.8125rem] leading-snug text-white/80">
            DiMaior no Top 1.000 do Prêmio Sebrae Startups 2026.
          </p>
          <img
            src={sebrae}
            alt="Sebrae Startups"
            className="h-11 w-auto opacity-95 brightness-0 invert"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

function Rotulo({ children }: { children: string }) {
  return (
    <p className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/60">
      {children}
    </p>
  )
}
