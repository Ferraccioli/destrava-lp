import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'
import portaDestrava from '../assets/porta-destrava.webp'
import placaAlerta from '../assets/placa-alerta.webp'
import temaEmprego from '../assets/tema-emprego.webp'
import temaEstudo from '../assets/tema-estudo.webp'
import temaBemEstar from '../assets/tema-bem-estar.webp'
import temaFinancas from '../assets/tema-financas.webp'

/*
 * A cena conta a história do nome: a porta da vida adulta se abre atrás da
 * dupla, e os quatro temas orbitam como ícones soltos nas colunas brancas
 * dos lados, cada um flutuando num ritmo próprio.
 */
const TEMAS = [
  { img: temaEmprego, nome: 'Emprego', pos: 'top-[9%] left-[5%]', size: 'h-16 md:h-24', dur: '5.2s', delay: '0s' },
  { img: temaEstudo, nome: 'Estudo', pos: 'top-[5%] right-[4%]', size: 'h-16 md:h-24', dur: '6.1s', delay: '0.9s' },
  { img: temaFinancas, nome: 'Finanças', pos: 'top-[52%] left-[3%]', size: 'h-14 md:h-20', dur: '5.6s', delay: '1.5s' },
  { img: temaBemEstar, nome: 'Bem-estar', pos: 'top-[44%] right-[3%]', size: 'h-16 md:h-24', dur: '4.9s', delay: '0.5s' },
]

export default function Hero() {
  // No desktop o selo já está em cena no carregamento; no mobile ele fica
  // depois da ilustração, e o observador guarda o movimento para a chegada.
  const { ref: seloRef, inView: seloLanded } = useInView<HTMLDivElement>()

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-14 pt-2 md:px-8 md:pb-20 md:pt-6">
      {/* Duas colunas só no lg: entre 768 e 1024 a coluna de texto fica estreita
          demais para o display de 4.25rem e a headline sai uma palavra por linha */}
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.08fr]">
        {/* Coluna de texto */}
        <div className="flex flex-col">
          <h1 className="font-display font-semibold text-forest">
            {/* tracking fica no elemento que carrega o tamanho: em resolve contra a própria fonte */}
            <span className="block text-[2.75rem] leading-[0.98] tracking-display md:text-[4.25rem]">
              Seu filho sabe se virar sozinho?
            </span>
          </h1>
          {/* A medida acompanha a coluna: headline, selo e CTA ocupam a largura
              toda, e em 24ch o subtítulo parava em dois terços dela. */}
          <p className="mt-5 max-w-[36ch] font-display text-xl font-medium leading-snug text-balance text-ink md:text-2xl">
            Aposto que ninguém te deu um manual pra isso.{' '}
            <span className="text-brand">A gente escreveu um pro seu filho.</span>
          </p>

          {/* Ilustração — até o lg entra aqui, entre a promessa e o selo */}
          <HeroArt className="order-1 mt-10 lg:hidden" />

          {/* Selo de diferenciação: único campo preto da página, alerta à esquerda.
              A margem curta até o lg é de propósito: a base da ilustração está
              dissolvida pelo `fade-bottom` e não precisa de respiro próprio. */}
          <div
            ref={seloRef}
            data-landed={seloLanded}
            className="alert-badge order-2 mt-2 flex items-center gap-5 rounded-2xl bg-black px-6 py-5 lg:mt-9"
          >
            {/* A placa nasce sobre preto puro, então senta direto no campo */}
            <img
              src={placaAlerta}
              alt=""
              aria-hidden="true"
              className="h-16 w-auto shrink-0 md:h-20"
              width={784}
              height={639}
              loading="lazy"
            />
            <div>
              <p className="font-display text-[1.75rem] font-semibold leading-none tracking-display text-sun md:text-[2rem]">
                Não é um curso.
              </p>
              <p className="mt-2 text-[0.95rem] font-medium leading-snug text-white/85">
                Assistir conteúdo não é o mesmo que se preparar.
              </p>
            </div>
          </div>

          <a
            href="#comprar"
            className="order-3 mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-9 py-4.5 text-center font-display text-lg font-semibold text-white transition-[background-color,transform] duration-200 ease-out hover:bg-brand-dark active:scale-[0.98] md:self-start"
          >
            Quero preparar meu filho
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

        {/* Ilustração — desktop */}
        <HeroArt className="hidden lg:block" />
      </div>
    </section>
  )
}

function HeroArt({ className = '' }: { className?: string }) {
  return (
    /*
     * Dois regimes, e misturar os dois quebra: no celular a cena sangra até as
     * bordas (a coluna de texto tem respiro, a ilustração não precisa dele), e
     * aí `w-auto` é obrigatório, porque com `w-full` a largura continua sendo a
     * do container e a margem negativa só desloca a caixa em vez de alargá-la.
     * Do `sm` em diante quem manda é o teto de largura, e aí a cena volta a ser
     * centrada — sangria com teto deixaria a arte encostada num lado só.
     */
    <div
      className={`relative -mx-5 w-auto sm:mx-auto sm:w-full sm:max-w-[34rem] lg:mr-[-3.5rem] lg:max-w-none ${className}`}
    >
      <img
        src={portaDestrava}
        alt="Dois jovens olham um celular que brilha, com a porta da vida adulta se abrindo em luz atrás deles"
        className="fade-bottom w-full mix-blend-multiply"
        width={1024}
        height={1024}
        fetchPriority="high"
      />

      {/* Os quatro temas da vida adulta orbitando a trilha */}
      {TEMAS.map(({ img, nome, pos, size, dur, delay }) => (
        <img
          key={nome}
          src={img}
          alt=""
          aria-hidden="true"
          title={nome}
          className={`float-badge absolute z-10 w-auto ${pos} ${size}`}
          style={{ '--float-dur': dur, '--float-delay': delay } as CSSProperties}
        />
      ))}
    </div>
  )
}
