# Destrava · Landing page para pais — Variante A

Landing page de venda do Destrava (produto da Di Maior que prepara jovens para a vida adulta), falando com o pai/mãe. Esta é a **Variante A**: bloco de compra na seção 2, logo depois do hero.

---

## Como rodar

```bash
npm install
```

```bash
npm run dev
```

Outros comandos: `npm run build` (roda `tsc -b` antes do Vite), `npm run lint` (oxlint), `npm run preview`.

---

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS v4.

Tailwind v4 é usado **sem arquivo de config**: o plugin `@tailwindcss/vite` está em `vite.config.ts` e todos os tokens vivem no bloco `@theme` de `src/index.css`. Não crie `tailwind.config.js`.

---

## Estrutura

```
src/
  App.tsx                    ordem das seções (a variável do teste A/B)
  index.css                  tokens @theme + CSS autoral
  rolagem.ts                 preserva a posição de rolagem entre recarregamentos
  hooks/useInView.ts         IntersectionObserver de disparo único
  components/
    Header.tsx               logo + botão "Ver a oferta"
    Hero.tsx                 headline, nota "Não é um curso", CTA, celular 3D
    Apoio.tsx                tarja de apoiadores em laço lateral
    PurchaseBlock.tsx        preço, botão de checkout, card de objeção
    HowItWorks.tsx           carrossel de 3 passos, com as telas do app nos mocks
    Vsl.tsx                  moldura 16:9 (o vídeo ainda não existe)
    SocialProof.tsx          3 depoimentos + ilustração da mãe
    ClosingFaq.tsx           fechamento em 2 colunas + FAQ + última linha
    SeloGarantia.tsx         selo de garantia em SVG inline
    Footer.tsx
  telas/                     as três telas do app que rodam dentro dos mocks
  assets/                    WebP e SVG que a página importa
assets-originais/            PNGs de origem, fora do bundle
remotion/                    projeto isolado que gera vídeo a partir de src/telas/
public/favicon.png           cadeado do Destrava
```

`LeadForm.tsx` está no repositório sem ponto de montagem: o bloco de compra hoje leva direto ao checkout.

### Para gerar a Variante B

Duplique o projeto e **troque apenas a ordem em `App.tsx`**: `Vsl` na segunda posição e `PurchaseBlock` no fim. Todo o resto tem que ficar idêntico, senão o teste perde validade.

---

## Copy

A copy é fixa e veio de um documento fechado. **Nunca parafraseie.** Alteração de texto é decisão de conteúdo, não de implementação: confirme antes de mexer.

Regras de conteúdo embutidas: a página nunca menciona monitoramento ou acompanhamento pelos pais; a versão de teste gratuita só aparece no FAQ.

---

## Sistema visual

Tipografia: **Fredoka** (display) e **Plus Jakarta Sans** (corpo) na página; **Lexend Deca** e **Nunito Sans** entram por causa das telas do app. Todas por `@import` do Google Fonts na primeira linha de `src/index.css`.

Paleta (tokens em `@theme`):

| Token | Hex | Uso |
| --- | --- | --- |
| `forest` | `#1B5E3B` | títulos |
| `forest-deep` | `#0F3D25` | superfícies escuras |
| `brand` / `brand-dark` | `#00A870` / `#00875A` | ações |
| `mint` / `mint-soft` | `#E8F5EE` / `#F4FAF7` | fundos suaves, réguas |
| `sun` / `sun-soft` | `#FFC93C` / `#FFF4D6` | acento |
| `ink` / `ink-soft` / `ink-faint` | `#24382E` / `#4D6156` / `#5F7168` | texto corrido |
| `alert` | `#D23B2E` | erro de formulário |

Fundo da página é branco. Mobile-first, base 375px, ponto de virada em `md:`. Exceção: hero e card de objeção só abrem em duas colunas no `lg:`, porque entre 768 e 1024 a coluna de texto fica estreita demais.

### CSS autoral em `src/index.css`

| Classe | O que faz |
| --- | --- |
| `.float-badge` | flutuação dos 4 ícones temáticos do hero, com ritmo próprio por ícone |
| `.float-svg` | mesma flutuação para nós dentro de um SVG |
| `.alert-badge` | entrada da nota "Não é um curso" e tremor periódico da placa |
| `.tarja-apoio` | laço lateral da tarja de apoiadores |
| `.price-strike` | régua do preço antigo, traçada quando o bloco de compra entra em cena |
| `.price-shine` | brilho branco varrendo o R$ 59,90 |
| `.grifo` | marca-texto amarelo por trás de um trecho, com arremate por linha |
| `.faq-chevron` | rotação do chevron no `<details>` aberto |

Todas as animações têm queda para `prefers-reduced-motion: reduce`.

---

## Decisões que não devem ser desfeitas sem motivo

**`tracking-display` vai no elemento que carrega o tamanho da fonte.** `em` resolve contra a própria font-size do elemento: no `<h1>` de 16px produz `-0.48px` em vez dos `-2.04px` pretendidos para o `<span>` de 4.25rem.

**O foco de teclado é declarado fora de `@layer`.** Precisa vencer as utilitárias do Tailwind, senão qualquer `outline-none` local apaga o anel. Verde sobre superfície clara, amarelo dentro de `.on-dark`. Não adicione `focus:outline-none` em lugar nenhum.

**As animações de entrada partem de um estado já visível.** `.alert-badge` e `.price-strike` não podem esperar em `opacity: 0`: isso as faz depender do `IntersectionObserver` para existir, e se ele não entregar o elemento some de uma página de venda. O pior caso possível tem que ser a animação não acontecer.

**O laço da tarja desloca exatamente um bloco.** O keyframe `tarja-apoio` usa `-100%/6` e a tarja tem seis cópias (`COPIAS`, em `Apoio.tsx`): os dois números andam juntos, senão a emenda aparece a cada volta. Os logos não podem voltar a ter `loading="lazy"` nem perder `width`/`height` — imagem que ainda não carregou mede zero, e a largura do bloco é a régua do laço.

**O celular do hero cresce por `scale`, não por largura.** `transform` não entra no layout, então a caixa continua do mesmo tamanho e os ícones e o splash ficam onde estão. A partir de 1,17 ele encosta no ícone da esquerda.

**Ilustração flat sobre superfície escura precisa de `isolate` no pai.** O `mix-blend-multiply` come o fundo branco da arte, mas sem isolamento ele pega a superfície escura atrás e fecha tudo em preto.

**A ilustração do hero sangra no celular e centraliza do `sm` em diante, e os dois regimes não se misturam.** Abaixo do `sm`, `-mx-5 w-auto`: com `w-full` a largura continua sendo a do container e a margem negativa só desloca a caixa. Do `sm` para cima, `mx-auto w-full max-w-[34rem]`, porque sangria com teto de largura encosta a arte num lado só.

**O wrapper de cada aparelho carrega `w-full min-w-0`.** Ele é item de grid, e a track de um grid tem mínimo `auto`: sem esse par, o wrapper estica até a largura que a figura pede e o `max-w-full` da figura mede contra o wrapper em vez da coluna. O `overflow-hidden` da cena come a diferença **em silêncio**, sem gerar rolagem horizontal. Ao mexer nas larguras dessa seção, confira a borda direita da figura contra a borda útil da cena, não o `scrollWidth` do documento.

**As trilhas ficam dentro da figura do aparelho, nunca vazando dela.** Em `HowItWorks.tsx` a figura reserva a largura da composição inteira e o aparelho ocupa `w-[62%]` do miolo; as quatro trilhas se posicionam nas bordas dessa figura com `z-0`, passando por trás do aparelho, que é `z-10`.

**A ilustração da mãe tem largura travada e encaixa, não preenche.** Em `SocialProof.tsx`, `md:h-full md:w-[21rem] md:self-stretch md:object-contain`. A largura fixa evita o ciclo de grid (imagem cresce, esmaga a citação, cresce de novo) e o `object-contain` evita recorte que muda sozinho quando a copy muda.

**O fechamento são quatro irmãos na mesma grade, em proporção 1:2.** Oferta, selo, texto da garantia e CTA são irmãos diretos de um `grid-cols-[1fr_2fr]`, para o arranjo mudar por breakpoint sem duplicar a imagem. Com grade em frações, largura fixa maior que a fração transborda a célula: o selo é `w-full` e quem manda é a coluna.

**O FAQ é acordeão exclusivo por `name="faq"` nativo dos `<details>`.** Abrir uma pergunta fecha a anterior, sem JavaScript.

**A linha de condições do preço quebra por item.** Cada condição é um `span` com `whitespace-nowrap`: a linha nunca corta no meio de "garantia de 7 dias".

**A nota de cinco estrelas é um `role="img"` só, não cinco ícones.** O grupo carrega o rótulo "Avaliação: cinco de cinco estrelas", para o leitor de tela receber a nota de uma vez.

**O destaque amarelo é grifo por trás, nunca letra amarela.** `sun` sobre branco dá ~1,6:1 e reprova; o `.grifo` passa `sun-soft` atrás e mantém o texto em `forest`, fechando em 7,07:1. Mesmo motivo pelo qual o card de objeção não usa amarelo sobre `mint`.

**A faixa do brilho do preço tem que ser fina.** `.price-shine` recorta uma faixa branca pela própria letra com `background-clip: text`; larga demais, o branco apaga os dígitos em vez de brilhar.

**A posição de rolagem é preservada por `src/rolagem.ts`.** O HTML servido é um `<div id="root">` vazio, então a restauração do navegador cai para zero antes de o React montar. `scrollRestoration` fica em `manual` e a reposição é disparada por um `ResizeObserver` quando o documento cresce o bastante.

---

## As telas do app nos mocks (`src/telas/`)

As três abas do "Como funciona" mostram telas do app rodando dentro do aparelho. **Elas são DOM, não vídeo** — a página não carrega vídeo nenhum, e o texto fica nítido em qualquer densidade e em qualquer zoom.

| Aba | Tela | Origem no Figma | Duração |
| --- | --- | --- | --- |
| A Simulação | `src/telas/Simulacao.tsx` | `878:469` | 430 quadros (14,3s) |
| As trilhas | `src/telas/Trilhas.tsx` | `2966:15527` + `1315:1281` + `887:12714` | 496 quadros (16,5s) |
| Sem limite | `src/telas/Relatorio.tsx` | `1902:1691` | 520 quadros (17,3s) |

### Como se monta

- `medidas.ts` — 390 × 800, 30 quadros por segundo e o topo seguro de 50.
- `tempo.ts` — o contexto do quadro, `interpolar`, `mola`, `suave` e `useEntrada`. Nenhuma tela sabe de onde vem o número do quadro.
- `relogio.ts` — o relógio do navegador. **Só a aba visível anima**; ao sair de cena a tela congela no último quadro e ao voltar recomeça do início.
- `aparelho.tsx` — `Palco` (fornece o quadro), `Camada`, `Tela` (a caixa que reduz 390 × 800 para a largura disponível), `BarraDeStatus` e `Toque`.

**A escala vem medida do container por `ResizeObserver`**, e não de CSS: `scale()` quer um número, e `calc()` com unidade de container devolve comprimento. É o único ponto que precisa de JavaScript para o layout.

As telas são codadas, não imagens recortadas: bitmap só as ilustrações. Os ícones de traço têm os paths exportados dos nós do Figma. Paletas, alturas de lista e marcos de rolagem estão medidos e comentados dentro de cada arquivo — as posições fixas são o que permite a rolagem ser calculada sem calibrar em still a cada mudança de copy.

**Duas diferenças deliberadas em relação ao Figma**, ambas em `Trilhas.tsx`: a atividade atual aqui é "Leitura" e não "Simulação", porque é ela que abre as duas telas seguintes; e a leitura fala de LinkedIn enquanto o exercício fala de dinheiro, porque são sessões de trilhas diferentes no arquivo. Nada de copy de produto foi reescrito.

`Relatorio.tsx` usa **Nunito Sans** nos apoios cinza, nos números e nas citações, além de Lexend Deca e Plus Jakarta Sans. Está assim por fidelidade ao arquivo de design; se for tratada como deriva, o conserto é trocar `nunito` por `jakarta` no topo do arquivo.

### O vídeo continua saindo, quando alguém precisar

`remotion/` não alimenta a página: é o gerador de peça solta (anúncio, social, apresentação). **Há uma cópia só de cada tela** — o Remotion importa de `src/telas/` e troca o relógio do navegador pelo `useCurrentFrame()`.

```bash
cd remotion && npm install
```

```bash
cd remotion && npm run studio
```

Os scripts `render:*` escrevem em `remotion/out/`, que é ignorado pelo git.

---

## Pipeline de assets

As ilustrações foram geradas no Higgsfield com **GPT Image 2** (id `gpt_image_2`, com underscore). Fluxo: gerar → baixar o PNG para `assets-originais/` → pós-processar com `sharp` (por isso ele está em devDependencies) → exportar WebP para `src/assets/`.

Dois tratamentos, conforme o destino:

1. **Recorte com canal alfa** (os quatro `tema-*.webp` do hero, os quatro `trilha-*.webp` e a `placa-alerta.webp`): o PNG passa pelo `images_remove_background` do Magnific, volta transparente e vira WebP com `trim()` e `quality: 80`. **É o tratamento preferido para qualquer arte nova**, porque o alfa é de verdade e o asset funciona sobre qualquer fundo.
2. **Arte sobre fundo branco** (as demais): forçar os pixels quase-brancos (todos os canais acima de 244) a branco puro, aparar as margens com `trim()`, e usar `mix-blend-multiply` no CSS. Sem o passo do branco puro sobra uma borda cinza visível. **Limitação:** multiply amarra a arte ao fundo claro; sobre superfície escura ela fecha em preto.

**Moldura vazia dentro do asset é tamanho jogado fora.** Ao trocar um asset por uma versão aparada, **atualize `width`/`height` no JSX junto**, senão o navegador reserva espaço na proporção antiga e a página pula quando a imagem chega.

---

## Estado atual

- **Checkout.** `URL_CHECKOUT`, em `PurchaseBlock.tsx`, está em `#`. É o único ponto de saída da página: todos os CTAs desembocam nele.
- **VSL.** A moldura 16:9 está no lugar do player; o vídeo ainda não existe.

---

## Referência de design

O Figma [Destrava v.0](https://www.figma.com/design/uyidHtrgyVkYQPwwtqkJuG/Destrava-v.0) tem telas na section "Nova LP" (nós `3238:6491` e `3238:6492`) construídas antes da versão atual da página. Não use como fonte da verdade; o código é a referência.

Se for mexer no arquivo: ignorar o design system Assemble, **não criar variáveis** (valores puros apenas), usar auto layout e as escalas de espaçamento do Tailwind. Duas armadilhas da API: `resize()` reseta `primaryAxisSizingMode` para `FIXED` (reponha `"AUTO"` depois), e o seletor de `node.query()` rejeita caracteres não-ASCII (busque com JS puro sobre `children`).

---

## Verificação antes de entregar

- `npm run build` e `npm run lint` limpos.
- Layout íntegro em 375px e 1280px, sem rolagem horizontal.
- Carrossel do "Como funciona" funciona por clique, por seta e por teclado.
- Foco de teclado visível em todos os controles.
- Nada de copy parafraseada.
