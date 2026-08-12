import faetec from '../assets/apoio-faetec.webp'
import faperj from '../assets/apoio-faperj.webp'
import noiz from '../assets/apoio-noiz.webp'
import sebrae from '../assets/apoio-sebrae.webp'

/* Alturas diferentes por logo: cada marca tem proporção própria, e igualar
   altura de caixa faz a de traço fino sumir ao lado da de traço grosso.
   `brightness(0) invert(1)` achata qualquer cor de arquivo em branco puro. */
const LOGOS = [
  { src: faetec, alt: 'FAETEC', altura: 'h-5', w: 232, h: 48 },
  { src: faperj, alt: 'FAPERJ', altura: 'h-6', w: 205, h: 64 },
  { src: noiz, alt: 'ONG Noiz', altura: 'h-6', w: 165, h: 64 },
]

/* Anda junto com o deslocamento do keyframe `tarja-apoio` em `index.css`, que é
   -100% dividido por este número. Mudar um sem mudar o outro quebra a emenda.
   São seis porque o laço desliza a largura de um bloco (818px) e os que sobram
   precisam cobrir a tela inteira enquanto ele sai. */
const COPIAS = 6

export default function Apoio() {
  return (
    <section
      aria-label="Apoiadores e reconhecimento"
      className="tarja-apoio-campo bg-forest-deep py-5"
    >
      <div className="tarja-apoio">
        {Array.from({ length: COPIAS }, (_, i) => (
          <Conteudo key={i} clone={i > 0} />
        ))}
      </div>
    </section>
  )
}

function Conteudo({ clone = false }: { clone?: boolean }) {
  return (
    /* Todos os blocos precisam ter largura idêntica, incluindo o respiro do fim
       (`pr-8`, dentro do bloco e não entre eles), senão a emenda aparece. */
    <div
      data-clone={clone}
      aria-hidden={clone || undefined}
      className="flex shrink-0 items-center gap-x-8 pr-8"
    >
      <p className="shrink-0 font-display text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white/60">
        Com o apoio:
      </p>

      {/* Dimensão declarada e sem `loading="lazy"`: a largura do bloco é a régua
          do laço, e imagem que ainda não carregou mede zero. */}
      {LOGOS.map(({ src, alt, altura, w, h }) => (
        <img
          key={alt}
          src={src}
          alt={clone ? '' : alt}
          className={`w-auto shrink-0 opacity-70 brightness-0 invert ${altura}`}
          width={w}
          height={h}
        />
      ))}

      <Ponto />

      <div className="flex shrink-0 items-center gap-3">
        <p className="max-w-[24ch] text-[0.75rem] leading-snug text-white/75">
          DiMaior no Top 1.000 do Prêmio Sebrae Startups 2026.
        </p>
        <img
          src={sebrae}
          alt={clone ? '' : 'Sebrae Startups'}
          className="h-8 w-auto shrink-0 opacity-95 brightness-0 invert"
          width={128}
          height={88}
        />
      </div>

      {/* Fecha o bloco: no laço, sem ele o prêmio encosta no "Com o apoio:" da
          volta seguinte. */}
      <Ponto />
    </div>
  )
}

function Ponto() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sun" aria-hidden="true" />
}
