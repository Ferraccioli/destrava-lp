import faetec from '../assets/apoio-faetec.webp'
import faperj from '../assets/apoio-faperj.webp'
import noiz from '../assets/apoio-noiz.webp'
import sebrae from '../assets/apoio-sebrae.webp'

/*
 * Tarja de apoiadores, correndo em laço lateral.
 *
 * É uma tarja de credencial, e não uma seção: ela existe para o pai reconhecer
 * as marcas de relance e seguir. Por isso é baixa, com logos e texto pequenos.
 * Quanto menos ela pede, melhor cumpre o papel.
 *
 * Correndo, ela resolve sozinha o problema que a versão parada tinha: em linha
 * o conteúdo mede perto de oitocentos pixels, o que não cabe em tela de celular
 * e obrigava a empilhar em coluna alta. No laço, a mesma linha serve em
 * qualquer largura.
 *
 * As alturas continuam diferentes por logo de propósito: cada marca tem
 * proporção própria, e igualar altura de caixa faz a de traço fino sumir ao
 * lado da de traço grosso.
 *
 * `brightness(0) invert(1)` achata cada logo em branco puro, seja qual for a cor
 * do arquivo. É o que permite marcas de cores diferentes conviverem na mesma
 * tarja sem virar um mostruário; e é por isso que os arquivos servidos podem ser
 * pequenos, já que só a silhueta sobrevive.
 */
const LOGOS = [
  { src: faetec, alt: 'FAETEC', altura: 'h-5' },
  { src: faperj, alt: 'FAPERJ', altura: 'h-6' },
  { src: noiz, alt: 'ONG Noiz', altura: 'h-6' },
]

/* Anda junto com o deslocamento do keyframe `tarja-apoio` em `index.css`, que é
   -100% dividido por este número. Mudar um sem mudar o outro quebra a emenda. */
const COPIAS = 6

export default function Apoio() {
  return (
    <section
      aria-label="Apoiadores e reconhecimento"
      className="tarja-apoio-campo bg-forest-deep py-5"
    >
      {/*
       * O laço desliza exatamente a largura de um bloco: ao chegar lá, o bloco
       * seguinte está onde o primeiro começou, e a volta ao zero não tem
       * costura. Por isso todos os blocos precisam ter largura idêntica,
       * inclusive o respiro do fim — ele está dentro do bloco, e não como
       * espaço entre eles.
       *
       * Seis, e não dois, porque duas cópias não bastam: o bloco mede 818px, e
       * enquanto ele sai de cena os que sobram precisam cobrir a tela inteira.
       * Com dois blocos, qualquer tela acima de 818px veria o vazio chegando
       * pela direita. Cinco blocos atrás do que sai cobrem 4092px.
       *
       * As cópias são decorativas e saem da árvore de acessibilidade: para quem
       * lê por leitor de tela, a tarja tem uma lista de apoiadores, não seis.
       */}
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
    <div
      data-clone={clone}
      aria-hidden={clone || undefined}
      className="flex shrink-0 items-center gap-x-8 pr-8"
    >
      <p className="shrink-0 font-display text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-white/60">
        Com o apoio:
      </p>

      {LOGOS.map(({ src, alt, altura }) => (
        <img
          key={alt}
          src={src}
          alt={clone ? '' : alt}
          className={`w-auto shrink-0 opacity-70 brightness-0 invert ${altura}`}
          loading="lazy"
        />
      ))}

      {/* Os pontos separam as duas metades da tarja: de um lado quem apoia o
          projeto, do outro o reconhecimento do prêmio. Ponto, e não régua: a
          régua vertical era um traço de doze pixels ao lado de logos de vinte e
          lia como divisão de blocos.

          São dois, e o segundo não é enfeite: num laço, o fim de um bloco
          encosta no começo do seguinte, então sem ele o prêmio ficaria colado
          no "Com o apoio:" da volta seguinte — a única emenda da tarja que
          ficaria sem separador. O respiro do fim é `pr-8`, igual ao `gap-x-8`
          de dentro, para o ponto ficar centrado entre as duas metades também
          na emenda. */}
      <Ponto />

      <div className="flex shrink-0 items-center gap-3">
        <p className="max-w-[24ch] text-[0.75rem] leading-snug text-white/75">
          DiMaior no Top 1.000 do Prêmio Sebrae Startups 2026.
        </p>
        <img
          src={sebrae}
          alt={clone ? '' : 'Sebrae Startups'}
          className="h-8 w-auto shrink-0 opacity-95 brightness-0 invert"
          loading="lazy"
        />
      </div>

      <Ponto />
    </div>
  )
}

function Ponto() {
  return <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sun" aria-hidden="true" />
}
