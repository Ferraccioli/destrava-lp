import type { CSSProperties } from 'react'
import { useInView } from '../hooks/useInView'
import celularSimulacao from '../assets/hero-celular-3d.webp'
import placaAlerta from '../assets/placa-alerta.webp'
import temaEmprego from '../assets/tema-emprego.webp'
import temaEstudo from '../assets/tema-estudo.webp'
import temaBemEstar from '../assets/tema-bem-estar.webp'
import temaFinancas from '../assets/tema-financas.webp'

/*
 * A cena mostra o produto em vez de uma metáfora dele: um aparelho em três
 * quartos com a Simulação rodando na tela, e os quatro temas orbitando como
 * ícones soltos nas colunas vazias dos lados, cada um num ritmo próprio.
 *
 * O aparelho ocupa metade da largura do quadro de 1024, e é esse vazio lateral
 * que os ícones habitam — as posições abaixo estão em porcentagem justamente
 * para acompanharem o desenho, e não a caixa.
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
            <span className="text-brand">A gente criou um pro seu filho.</span>
          </p>

          {/* Ilustração — até o lg entra aqui, entre a promessa e o selo */}
          <HeroArt className="order-1 mt-10 lg:hidden" />

          {/* Selo de diferenciação, alerta à esquerda. Já foi campo preto com o
              título em 2rem, e era o segundo maior contraste do hero: puxava o
              olho antes da headline e antes do CTA. Baixado a pedido para
              amarelo pastel, texto escuro e tipo menor — deixa de ser um bloco
              e passa a ser uma nota ao pé da promessa.

              O `sun-soft` é o mesmo campo do fecho da seção de preço, então a
              nota e a objeção falam com a mesma voz nas duas pontas da página.

              A margem curta até o lg é de propósito: a base da ilustração está
              dissolvida pelo `fade-bottom` e não precisa de respiro próprio. */}
          <div
            ref={seloRef}
            data-landed={seloLanded}
            className="alert-badge order-2 mt-2 flex items-center gap-4 rounded-xl bg-sun-soft px-5 py-4 lg:mt-8"
          >
            {/* O arquivo veio com fundo preto chapado, feito para o campo preto
                que havia aqui, e sobre amarelo virava um quadrado preto. O
                fundo foi recortado no próprio asset, e não com blend:
                `multiply` mantinha o preto, e `screen` e `lighten` lavavam o
                desenho. O contorno verde saiu na mesma passada, a pedido.

                Serve em 392px de largura para sete vezes o tamanho de render:
                a placa tem 48px de altura aqui, então mais que isso é peso sem
                imagem. */}
            <img
              src={placaAlerta}
              alt=""
              aria-hidden="true"
              className="h-12 w-auto shrink-0 md:h-14"
              width={392}
              height={320}
              loading="lazy"
            />
            <div>
              {/* Preto a pedido. É o único preto chapado que sobrou na página,
                  e aqui ele funciona porque o campo é claro: sobre `sun-soft`
                  mede 19,2:1, contra 7,1:1 do forest que estava. */}
              <p className="font-display text-[1.25rem] font-semibold leading-none tracking-display text-black md:text-[1.375rem]">
                Não é um curso.
              </p>
              <p className="mt-1.5 text-[0.875rem] font-medium leading-snug text-ink-soft">
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

/**
 * Campo chapado atrás da composição, no lugar de um fundo retangular.
 *
 * É desenho, e não imagem gerada, por três razões práticas: forma de uma cor só
 * cabe em algumas centenas de bytes contra dezenas de KB de raster, a cor sai
 * do token em vez de ficar cozida no arquivo, e a borda continua limpa em
 * qualquer densidade de tela.
 *
 * O contorno saiu de doze raios por ângulo suavizados com Catmull-Rom
 * convertido em cúbicas — é a curva contínua que dá a leitura de líquido; com
 * quadráticas soltas o mesmo conjunto de pontos sai como polígono arredondado.
 * As gotas em volta são o que faz ler como respingo e não como mancha.
 *
 * Fica atrás de tudo (`z-0` contra o `z-[1]` do aparelho e o `z-10` dos
 * ícones), e `overflow-visible` porque as gotas moram fora da caixa do miolo.
 */
function Splash() {
  return (
    <svg
      viewBox="0 0 500 500"
      className="absolute left-1/2 top-1/2 z-0 h-auto w-[96%] -translate-x-1/2 -translate-y-1/2 text-mint"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M250 60 C277.4 62.5 301.3 98.8 327.9 115.1 C354.5 131.4 399.2 135.4 409.6 157.9 C420.1 180.3 389.2 218.5 390.6 250 C392 281.5 427.7 323.3 417.8 346.9 C408 370.5 359.7 385.5 331.7 391.5 C303.7 397.5 278.7 380.5 250 383 C221.3 385.5 181.4 416 159.7 406.3 C138.1 396.7 136.6 351.1 120 325.1 C103.4 299 61.4 275.8 60 250 C58.6 224.2 94.5 195.2 111.8 170.2 C129 145.2 140.5 118.6 163.5 100.3 C186.6 81.9 222.6 57.5 250 60 Z" />
      <circle cx="353.3" cy="38.2" r="15" />
      <circle cx="459.6" cy="334.7" r="21" />
      <circle cx="225" cy="488.1" r="12" />
      <circle cx="36.8" cy="336.1" r="17" />
      <circle cx="40.5" cy="119.1" r="10" />
      <circle cx="311.3" cy="36.3" r="13" />
    </svg>
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
      <Splash />

      {/* Sem `mix-blend-multiply` e sem `fade-bottom`, ao contrário da
          ilustração que saiu daqui: o recorte tem alfa de verdade, então não
          precisa do truque de blend para dissolver fundo branco, e uma máscara
          na base cortaria o aparelho no meio em vez de dissolver uma cena.

          O aparelho cresce por `scale`, e não por largura, e é isso que deixa o
          resto da composição parado: `transform` não entra no layout, então a
          caixa continua do mesmo tamanho e os ícones — posicionados em
          porcentagem dela — e o splash ficam exatamente onde estavam.

          O fator saiu de medida, não de gosto. A silhueta do aparelho ocupa de
          27,8% a 71,1% da caixa, e o ícone mais próximo, Emprego, termina em
          23,1%. Crescendo pelo centro, 1,14 leva a borda esquerda a 24,7% e
          mantém folga; a partir de 1,17 o aparelho encosta no ícone. */}
      <img
        src={celularSimulacao}
        alt="Um celular inclinado mostrando a Simulação do Destrava: uma entrevista de emprego em andamento, com a entrevistadora no topo e a conversa embaixo"
        className="relative z-[1] w-full scale-[1.14]"
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
