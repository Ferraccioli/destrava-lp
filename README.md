# Destrava · Landing page para pais — Variante A

Landing page de venda do Destrava (produto da Di Maior que prepara jovens para a vida adulta), falando com o pai/mãe. Esta é a **Variante A**: bloco de compra (preço, formulário e CTA) na seção 2, logo depois do hero.

---

## Como rodar

```bash
npm install
```

```bash
npm run dev
```

Outros comandos: `npm run build` (roda `tsc -b` antes do Vite), `npm run lint` (oxlint), `npm run preview`.

Estado atual: build e lint passam limpos.

---

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS v4.

Tailwind v4 é usado **sem arquivo de config**: o plugin `@tailwindcss/vite` está em `vite.config.ts` e todos os tokens vivem no bloco `@theme` de `src/index.css`. Não crie `tailwind.config.js`.

`sharp` está em devDependencies apenas para o pós-processamento de imagens descrito mais abaixo.

---

## Estrutura

```
remotion/                    projeto isolado que gera o vídeo da Simulação
src/
  App.tsx                    ordem das seções (a variável do teste A/B)
  index.css                  tokens @theme + todo o CSS autoral
  hooks/useInView.ts         IntersectionObserver de disparo único
  components/
    Header.tsx               logo + botão "Ver a oferta"
    Hero.tsx                 headline, selo preto, CTA, ilustração da porta
    Marquee.tsx              tarja em movimento infinito
    PurchaseBlock.tsx        preço, LeadForm, card de objeção
    LeadForm.tsx             formulário com 4 estados simulados
    HowItWorks.tsx           scrollytelling de 3 passos, com as trilhas orbitando o aparelho
    Vsl.tsx                  player 16:9 (placeholder)
    SocialProof.tsx          3 depoimentos + ilustração da mãe
    ClosingFaq.tsx           fechamento em 2 colunas + FAQ + última linha
    Footer.tsx
  assets/                    WebP otimizados (o que a página importa)
assets-originais/            PNGs originais do Higgsfield, fora do bundle
public/favicon.png           cadeado do Destrava
```

### Para gerar a Variante B

Duplique o projeto e **troque apenas a ordem em `App.tsx`**: `Vsl` na segunda posição e `PurchaseBlock` no fim. Todo o resto tem que ficar idêntico, senão o teste perde validade.

---

## Copy

A copy é fixa e veio de um documento fechado. **Nunca parafraseie.** Alteração de texto é decisão de conteúdo, não de implementação: confirme antes de mexer.

**O kicker "Já decidiu? Comece aqui" virou um selo de oferta:** pílula em `forest-deep` com coroa em `sun` e rótulo "Oferta por tempo limitado", que é o mesmo par de cores do selo "Não é um curso" no hero. A coroa é SVG autoral no traço dos outros ícones da página (caixa de 24, contorno de 2, pontas arredondadas), não emoji.

**A linha de apoio do hero foi removida**, a pedido dele: "Ele treina as decisões que vai ter que tomar sozinho, antes de precisar tomar." O hero passou a ir direto da headline para o subtítulo, o selo preto e o CTA.

**A legenda "Como funciona, em três passos." foi removida** do `HowItWorks`, a pedido dele, por não existir na referência do Figma. Ela era o rótulo acessível do tablist via `aria-labelledby`; o mesmo texto virou `aria-label` na lista, então a lista de abas continua nomeada para leitor de tela.

**Dois trechos foram removidos do bloco de compra**, a pedido dele, por repetição na mesma tela: o título dizia "Três meses de acesso completo **por R$ 59,90**" com o preço logo abaixo em corpo maior, e a linha de condições abria com "**Acesso completo por 3 meses** ·", que o próprio título já afirmava. Nada foi reescrito — só cortado —, e o preço com o riscado de R$ 67,90 segue intacto no card, que é onde ele trabalha. O fechamento (`ClosingFaq.tsx`) mantém a frase inteira com o preço, porque lá é a única vez que ele aparece na seção.

Regras de conteúdo já embutidas: a página nunca menciona monitoramento ou acompanhamento pelos pais; a versão de teste gratuita só aparece no FAQ.

---

## Sistema visual

Tipografia: **Fredoka** (display) e **Plus Jakarta Sans** (corpo), carregadas por `@import` do Google Fonts na primeira linha de `src/index.css`.

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

Fundo da página é branco. Mobile-first, base 375px, ponto de virada em `md:`. Exceção: o hero
só abre em duas colunas no `lg:` — entre 768 e 1024 a coluna de texto ficava estreita demais
para o display de 4.25rem e a headline saía uma palavra por linha.

---

## Decisões que não devem ser desfeitas sem motivo

Cada uma destas custou uma rodada de correção. O porquê importa mais que a regra.

**`tracking-display` vai no elemento que carrega o tamanho da fonte.** `em` resolve contra a própria font-size do elemento. Colocar o tracking no `<h1>` cujo tamanho é 16px produz `-0.48px` em vez dos `-2.04px` pretendidos para o `<span>` de 4.25rem.

**O foco de teclado é declarado fora de `@layer`.** Precisa vencer as utilitárias do Tailwind, senão qualquer `outline-none` local apaga o anel. Verde sobre superfície clara, amarelo dentro de `.on-dark`. Não adicione `focus:outline-none` em lugar nenhum.

**Ilustração flat sobre superfície escura precisa de `isolate` no pai.** O `mix-blend-multiply` come o fundo branco da arte, mas sem isolamento ele pega a superfície escura atrás e fecha tudo em preto. Ver o helper `Medalhao` em `PurchaseBlock.tsx`.

**A ilustração do hero sangra no celular e centraliza do `sm` em diante, e os dois regimes não se misturam.** Abaixo do `sm` ela usa `-mx-5 w-auto` para ocupar a tela inteira: `w-auto` é obrigatório, porque com `w-full` a largura continua sendo a do container e a margem negativa só desloca a caixa em vez de alargá-la. Do `sm` para cima volta `mx-auto w-full max-w-[34rem]`, porque sangria com teto de largura encosta a arte num lado só — foi exatamente o que aconteceu em 768 antes da correção. O desktop segue com `lg:max-w-none` e a sangria de 56px à direita.

**O selo tem margem curta até o `lg` (`mt-2`).** A base da ilustração está dissolvida pelo `fade-bottom`, então ela não precisa de respiro próprio: a margem curta é o que permitiu a arte crescer 40px sem empurrar o CTA junto (ele desceu 8px).

**A animação do selo parte de um estado já visível.** O estado de espera do `.alert-badge` não pode ser `opacity: 0`: isso faz o selo depender do `IntersectionObserver` para existir, e se o observador não entregar (aba em segundo plano, quadro não composto) o selo some da página de venda. A entrada é escala 0.94 → 1, e o pior caso possível é a animação não acontecer. Vale para qualquer momento novo que for adicionado aqui.

**O selo "Não é um curso" é preto, não amarelo.** Fundo preto puro, título em `text-sun`, apoio em `text-white/85`, com a placa de alerta ilustrada à esquerda. A versão amarela foi descartada.

**O card de objeção usa a ilustração como fundo de seção, sem recorte e sem blend.** Três abordagens foram testadas e rejeitadas nesta ordem: véu em gradiente, `mix-blend-multiply` (tingia tudo de verde) e recorte do fundo branco no alfa. O que ficou: imagem original inteira em `object-cover` cobrindo o card, espelhada com `-scale-x-100`, e um véu **preto chapado** (`bg-black/80`) por cima. Não reintroduza nenhuma das três.

**O wrapper de cada aparelho carrega `w-full min-w-0`, e isso não é enfeite.** Ele é item de grid, e a track de um grid tem mínimo `auto`: sem esse par, o wrapper estica até a largura que a figura pede, e o `max-w-full` da figura passa a medir contra o wrapper esticado em vez da coluna — ou seja, não limita nada. Em 375 × 950 a figura ia a 352px num espaço de 335 e o `overflow-hidden` da cena comia 17px **em silêncio**, sem gerar rolagem horizontal para denunciar. Ao mexer nas larguras dessa seção, confirme a borda direita da figura contra a borda útil da cena, não o `scrollWidth` do documento.

**As trilhas ficam dentro da figura do aparelho, nunca vazando dela.** Em `HowItWorks.tsx` a figura reserva a largura da composição inteira e o aparelho ocupa `w-[62%]` do miolo; as quatro trilhas se posicionam nas bordas dessa figura com `z-0`, passando por trás do aparelho, que é `z-10`. Empurrar as trilhas para fora com valores negativos parecia mais simples e é frágil: a cena presa tem `overflow-hidden`, então em tela menor elas seriam cortadas. Como são filhas da figura, também somem junto com o aparelho em tela baixa, em vez de sobrar flutuando.

**A ilustração da mãe tem largura travada e encaixa, não preenche.** Em `SocialProof.tsx` ela usa `md:h-full md:w-[21rem] md:self-stretch md:object-contain`. A largura fixa é obrigatória: sem ela, altura livre com imagem quadrada vira ciclo de grid — a imagem cresce, esmaga a citação, e cresce de novo. O `object-contain` também é obrigatório, e substituiu um `object-cover` que **recortava a ilustração em função da altura do texto ao lado**: em 1280 comia 97px de largura (22% do desenho) e em 768, com a citação mais alta, comia 331px (quase metade). Corte que muda sozinho quando a copy muda é defeito, não enquadramento. A caixa segue esticada para o grid não mudar; sobra vertical é esperada.

**O fechamento são quatro irmãos na mesma grade, em proporção 1:2.** Oferta, selo, texto da garantia e CTA são irmãos diretos de um `grid-cols-[1fr_2fr]`, para que o arranjo mude por breakpoint sem duplicar a imagem do selo. A grade era `[auto_1fr]`, com o selo mandando na largura da coluna por tamanho fixo (`w-36 sm:w-64 md:w-[22rem]`); agora **a coluna manda e o selo é `w-full`**. Com grade em frações, largura fixa maior que a fração transborda a célula, então o selo não pode voltar a ter medida própria. No mobile o selo fica ao lado do texto da garantia; no `sm:` ele sobe para a coluna da esquerda com `row-span-3`. A régua troca de dono por breakpoint (`border-b` na oferta no mobile, `border-t` na garantia no `sm:`), senão ela cortaria só metade da largura.

**Preço e formulário são um card só, e a divisão entre eles é uma régua, nunca uma segunda moldura.** O bloco de compra tem dois cards: o branco (preço + formulário) e o escuro da objeção embaixo. Dentro do branco, o formulário se separa do preço por `border-t-2` no celular e `md:border-l-2` no desktop — a régua troca de eixo por breakpoint. O formulário já teve moldura verde própria e `md:sticky`; as duas saíram quando os cards viraram um, porque moldura dentro de moldura ficava pesada e o sticky não tem o que percorrer dentro de um card único. **Ao mexer aqui, verifique os quatro estados do `LeadForm`** — a estrutura em volta dele mudou uma vez e a validação precisa continuar passando.

**O FAQ é acordeão exclusivo por `name="faq"` nativo dos `<details>`.** Abrir uma pergunta fecha
a anterior, sem JavaScript.

**A linha de condições do preço quebra por item.** Cada condição é um `span` com
`whitespace-nowrap` (separador junto do item): a linha nunca corta no meio de "garantia de
7 dias".

**A nota de cinco estrelas é um `role="img"` só, não cinco ícones.** A estrela é SVG autoral no desenho do Figma (nó `2348:2444`), com o arredondamento vindo de um contorno grosso da própria cor com junção redonda em vez de curvas à mão. O grupo carrega o rótulo "Avaliação: cinco de cinco estrelas", para o leitor de tela receber a nota de uma vez em vez de cinco ícones soltos.

**A medida do subtítulo do hero acompanha a coluna.** Em `24ch` ele parava em 334px enquanto headline, selo e CTA ocupavam 504 no desktop — dois terços da largura, e o degrau aparecia. Agora é `36ch`.

**O destaque amarelo é grifo por trás, nunca letra amarela.** No depoimento em destaque, "se sentiu muito mais confiante" recebe `.grifo`: o `sun-soft` passa como faixa atrás e o texto continua `forest`, fechando em 7,07:1. Pintar a letra de amarelo sobre branco daria ~1,6:1 e reprovaria — é o mesmo motivo do aviso do preço, mais abaixo. O grifo é **pintado da esquerda para a direita** quando a citação entra em cena, animando `background-size` de 0 a 100% da largura; com o trecho quebrando em duas linhas, cada linha pinta a sua a partir da própria esquerda. O trecho grifado é declarado no campo `destaque` do depoimento, separado da citação, para a fala seguir sendo uma string única: **a fala é do depoente, o grifo é marcação nossa por cima dela.**

**A faixa do brilho do preço tem que ser fina.** `.price-shine` recorta uma faixa branca pela própria letra com `background-clip: text`. Larga demais, o branco sobre o card branco apaga os dígitos em vez de brilhar. O valor atual é ~1,2% de um `background-size` de 300%.

---

## CSS autoral em `src/index.css`

| Classe | O que faz |
| --- | --- |
| `.fade-bottom` | dissolve a base da ilustração do hero no branco da página, com `mask-image` em 4 paradas |
| `.float-badge` | flutuação dos 4 ícones temáticos do hero, com duração e atraso próprios por ícone |
| `.alert-badge` | entrada e vibração do selo "Não é um curso", com a placa ilustrada balançando defasada |
| `.spark` | cintilação de faíscas |
| `.price-strike` | régua do preço antigo traçada quando o bloco de compra entra em cena |
| `.price-shine` | brilho branco de borda dura varrendo o R$ 59,90 a cada 5s |
| `.scrolly-phone` | esconde o mockup do scrollytelling em telas com menos de 700px de altura |
| `.faq-chevron` | rotação do chevron no `<details>` aberto |
| `.grifo` | marca-texto amarelo por trás de um trecho, com arremate por linha |

Todas as animações têm queda para `prefers-reduced-motion: reduce`.

---

## Scrollytelling ("Como funciona")

`HowItWorks.tsx` usa um wrapper alto de `(TABS.length + 1) * 100svh` com uma cena `sticky top-0 h-svh` dentro. O progresso vem de `-getBoundingClientRect().top / scrollable`. As abas continuam clicáveis (rolam até o passo) e acessíveis por teclado. Com `prefers-reduced-motion`, volta ao layout de abas estáticas.

**A composição é de duas colunas a partir do `lg`:** título, abas e texto do passo empilhados à esquerda, aparelho à direita centrado no conjunto. O texto vive no fluxo da coluna, logo abaixo das abas — antes ele dividia a célula do grid com o aparelho e herdava a altura dele, o que abria um vão morto de centenas de pixels entre as abas e a frase. Textos e aparelhos são duas pilhas independentes, cada uma alternando por opacidade na sua própria célula.

**No mobile o aparelho é medido em `svh`, não em `rem`.** O que limita o aparelho ali é a altura da tela, não a largura: com tamanho fixo é preciso escolher pelo pior caso — 701px de altura, o mais baixo em que ele ainda aparece — e a sobra de um aparelho alto vai fora. `w-[clamp(10rem,25svh,14rem)]` faz ele acompanhar a tela (160px no piso, 203px em 812, 224px no teto), com o clamp segurando os extremos.

**As tags dos passos encolhem no mobile (`text-sm`, disco de 24px), e o `py-2.5` fica.** A altura resultante é exatamente 44px, o mínimo de alvo de toque; reduzir o padding junto derruba abaixo disso. Elas continuam em **duas linhas** em 375px: as três somam 372px de conteúdo para 320px de espaço, e caber numa linha só exigiria fonte de 12px ou tirar o disco numerado. Nenhum dos dois foi feito.

**O aparelho é desenhado em camadas, e o vídeo vai colado no vidro.** Aro fino de `forest-deep` com `p-1.5`, tela sem padding interno (o vídeo já traz a interface inteira), ilha dinâmica sobreposta e três botões físicos nas laterais. A sombra é dupla de propósito — uma longa e difusa para elevação, uma curta para contato —, porque sombra única faz o aparelho flutuar sem peso. **A proporção da tela é `390/800` (2,05), não 9:16 (1,78):** cada rem de largura custa mais altura, e foi por isso que os degraus de `larguraDaFigura()` precisaram ser remedidos nos dois piores casos (768 × 800 e 375 × 701) quando o mock cresceu.

**Duas colunas só no `lg`, e o aparelho encolhe no `md`.** Em 768 as duas colunas espremiam o texto do passo em 305px (sete linhas). Empilhado, o aparelho passa a dividir a altura da cena presa com o texto, e a versão grande estourava 768 × 800 em 21px — que o `overflow-hidden` cortaria. Os tamanhos do `larguraDaFigura()` foram medidos para deixar 44px de folga no pior caso. **Ao mexer em qualquer coisa dessa seção, meça a altura do bloco contra a altura da cena antes de dar por pronto.**

**Efeito colateral conhecido:** isso adiciona cerca de 300svh de rolagem entre o bloco de compra e a VSL, alongando a distância entre as duas seções. É uma decisão tomada, não um defeito.

---

## As telas do app nos mocks (`src/telas/`)

As três abas do "Como funciona" mostram telas do app rodando dentro do aparelho. **Elas são DOM, não vídeo** — a página não carrega vídeo nenhum.

| Aba | Tela | Origem no Figma | Duração |
| --- | --- | --- | --- |
| A Simulação | `src/telas/Simulacao.tsx` | `878:469` | 14,3s (430 quadros) |
| As trilhas | `src/telas/Trilhas.tsx` | `2966:15527` + `1315:1281` + `887:12714` | 16,5s (496 quadros) |
| Sem limite | `src/telas/Relatorio.tsx` | `1902:1691` | 17,3s (520 quadros) |

### Por que DOM e não vídeo

O vídeo saía borrado, e a causa **medida** não era o codec: era ampliação. A fonte tinha 390px de largura e o mock exibe 276px de CSS, que num monitor retina são 552px de dispositivo — **1,42× de ampliação** (1,26× na aba das trilhas, mais estreita). Renderizar em 2× resolveria e levaria os três de 1,3MB para perto de 3MB; comprimir mais não tinha ganho a colher (`--crf=20` contra o padrão do VP8 saiu **maior**, 417KB contra 415KB).

Em DOM, texto é texto: **nítido em qualquer densidade e em qualquer zoom** — conferido ampliando a figura a 250%, onde a tipografia dentro do aparelho fica tão limpa quanto a da própria página. E o peso trocado foi este:

| | Antes | Depois |
| --- | --- | --- |
| Vídeo | 1,3MB (três `.webm`, os três baixados no carregamento) | zero |
| Imagem e SVG das telas | — | 97KB |
| JavaScript | — | +54KB cru, +19KB com gzip |
| Fonte | — | +71KB (Lexend Deca e Nunito Sans) |

Sobra de ganho perto de **1,1MB**, mais três benefícios que não estavam na conta: a interface responde a zoom, o texto existe para quem inspeciona a página, e `prefers-reduced-motion` deixa de precisar de controles de vídeo — a tela simplesmente para num quadro escolhido.

**Framer Motion não entrou.** O forte dela é animação de layout, gesto e variante; aqui a peça é uma linha do tempo determinística, e usá-la seria ~50KB gzip para reimplementar o que já existia. As duas únicas funções que vinham do Remotion (`interpolate` e `spring`) foram reescritas em `src/telas/tempo.ts`, em 60 linhas, com a `mola` resolvida analiticamente nos três regimes de amortecimento — a configuração de `damping: 20` é levemente **superamortecida** e sem esse ramo ela devolveria oscilação onde não existe.

### Como se monta

- `medidas.ts` — 390 × 800, 30 quadros por segundo e o topo seguro de 50.
- `tempo.ts` — o contexto do quadro, `interpolar`, `mola`, `suave` e `useEntrada`. Nenhuma tela sabe de onde vem o número do quadro.
- `relogio.ts` — o relógio do navegador. **Só a aba visível anima**; ao sair de cena a tela congela no último quadro (voltar a zero pisca durante a transição de saída) e ao voltar recomeça do início. Um `requestAnimationFrame` roda a 60Hz ou mais e a peça é de 30, então há uma guarda para não disparar render de quadro repetido.
- `aparelho.tsx` — `Palco` (fornece o quadro), `Camada`, `Tela` (a caixa que reduz 390 × 800 para a largura disponível), `BarraDeStatus` e `Toque`.

**A escala vem medida do container por `ResizeObserver`**, e não de CSS: `scale()` quer um número, e `calc()` com unidade de container devolve comprimento. É o único ponto que precisa de JavaScript para o layout.

### O vídeo continua saindo, quando alguém precisar

`remotion/` deixou de alimentar a página e virou só o gerador de peça solta — anúncio, social, apresentação. **Há uma cópia só de cada tela:** `remotion/src/composicoes.tsx` importa de `src/telas/` e troca o relógio do navegador pelo `useCurrentFrame()`. É por isso que as telas foram escritas sem depender do Remotion.

```bash
cd remotion && npm install
```

```bash
cd remotion && npm run studio
```

`npm run render`, `npm run render:trilhas` e `npm run render:relatorio` escrevem em `remotion/out/`, que é ignorado pelo git.

---

### A Simulação

**A tela é codada, não uma imagem recortada.** Só a cena da entrevistadora no topo é bitmap (`app-cena-entrevista.webp`, o nó `878:471` exportado limpo); o X e a barra de dez passos são desenhados por cima, e todo o resto da interface — cartão do desafio, bolhas, status, feedback e botão — é markup. Foi assim que os elementos ganharam animação própria: **a Helena mostra três pontos "digitando" antes de cada fala**, e a resposta do jovem se revela **palavra a palavra** dentro da bolha, o que uma imagem recortada nunca permitiria.

A conversa inteira vive em `FALAS` — texto, tipo e os quadros de `digita`/`entra`. Reordenar ou re-cronometrar é mexer nessa lista.

**A paleta foi medida da exportação do Figma, não tirada de memória:** texto `#272727`, apoio `#a0a0a1`, verde do app `#33cc99`, botão `#1e7a5b`, feedback `#4d62b6` sobre `#f0f1f8`, X do desafio `#f02e2e`. **Nota:** no Figma a terceira fala da Helena aparece duplicada (nós `878:480` e `1603:715`, texto idêntico); aqui ela entra uma vez só.

**A rolagem acompanha a conversa como um chat de verdade**, subindo quando a próxima fala não caberia na janela — os marcos estão em `ROLAGEM` e foram calibrados por quadros renderizados, não no olho. **O botão "Próximo turno" é barra fixa de rodapé**, que é o que ele é num app.

**O véu escuro no topo da cena é correção de um defeito, não enfeite.** A cena é clara ali — luminância medida em **178 de 255** —, então o X branco e a barra de progresso branca estavam praticamente invisíveis sobre a parede verde clara desde que a tela nasceu. O véu resolve os dois e ainda sustenta a barra de status do aparelho, que entrou depois.

**A barra de status inverte com a rolagem, não com um quadro escolhido.** Ela é branca enquanto a cena escura está atrás e vira escura quando a conversa branca sobe. O gatilho é a própria posição de rolagem comparada à altura da cena, para não sair do lugar se o roteiro mudar de ritmo.

⚠️ **A Simulação usa só Lexend Deca em título e rótulo e Plus Jakarta Sans em corpo** — o correto. Antes de as três telas virarem DOM ela usava Lexend Deca em tudo, incluindo corpo, o que era infidelidade herdada; a migração corrigiu.

---

### As trilhas

`remotion/src/Trilhas.tsx` encadeia três telas do Figma no percurso que o produto realmente tem: a **trilha** (`2966:15527`) abre, a atividade atual é tocada, entra a **leitura** (`1315:1281`) e ela passa para o **exercício** (`887:12714`) em formato de stories, com a resposta sendo dada na tela.

**Também é codada em React.** São bitmap só as ilustrações: o Didi (`trilha-didi.png`), os quatro ícones de atividade (`trilha-icone-*.svg`, exportados como vetor) e a barra de abas (`trilha-menu.png`). Os ícones de traço — X, cadeado, check, chave, joinha, seta, raio — são SVG inline com os **paths exportados dos nós**, não redesenhados: assim cor e tamanho viram parâmetro sem perder a forma do arquivo.

**Um desenho por tipo de atividade, não dois.** O estado travado é o mesmo SVG com `filter: grayscale(1)`, o que foi **medido** comparando as duas exportações: `#fed380` vira `#d6d6d6`, exatamente a luminância dele. Guardar sete PNGs onde bastam quatro SVGs seria peso e desencontro na próxima vez que um ícone mudar.

**Tipografia lida do arquivo, e uma correção junto:** o app usa **duas** famílias — Lexend Deca em título e rótulo, Plus Jakarta Sans em corpo. O vídeo da Simulação usa só a primeira, o que é uma infidelidade herdada, pequena e ainda não corrigida. Este usa as duas.

Paleta medida: verde da marca `#28a37a`, verde claro `#33cc99`, verde escuro `#1e7a5b`, cartão da atividade atual `#d6f4ea`, pílula preta `#131313`, chave `#fba71e`, raio `#ffb833`, texto `#272727`, apoio `#4e4e4f`, travado `#a0a0a1`, borda `#dfdfdf`.

**As alturas das atividades são fixas de propósito** (64 para descrição de uma linha, 74 para duas, 90 para a atual). É delas que sai a posição da atividade atual, e é essa posição que a rolagem e a marca de toque precisam saber — com altura fluida, seria preciso calibrar em still a cada mudança de copy.

**Cartão de stories entra composto.** Na primeira versão o exercício deslizava para dentro em branco e só depois montava o conteúdo, o que denuncia a montagem na hora: stories real entrega a tela pronta e só o gesto anima. As entradas de leitura e exercício foram puxadas para junto da transição.

**A barra de status é do aparelho, não do app.** Hora, sinal, wi-fi e bateria ficam fora das telas, não acompanham nem a rolagem nem a passagem de cartão, e **invertem para branco enquanto a leitura (que é escura) está na frente** — que é o que o aparelho faz. São duas cópias sobrepostas com opacidade cruzada, em vez de interpolar canal a canal, para cada estado ter a cor exata.

A altura dela (`TOPO_SEGURO`, 50) tem duas razões: é a proporção do aparelho real (54 de 852) nestes 800, e **cobre a ilha dinâmica que o mock desenha por cima do vídeo**. Isso era um defeito de verdade: a ilha tinha `top-2.5` (fixo) com `h-[2.8%]` (proporcional), então em tela pequena ela mantinha os 10px enquanto a altura encolhia e **descia dentro do vídeo** — media fundo em `y≈49` num aparelho de 375px, cobrindo a barra de stories. Virou `top-[1.25%]`, e o fundo dela passou a ficar em **32,3** em qualquer viewport (medido em 1440 e em 375). **Isso também protegia a Simulação sem que ninguém tivesse visto:** os controles dela estão em `y=44` e estavam sendo cobertos no mobile.

Duas notas de fidelidade, que são decisão de produto e não defeito:

1. **A atividade atual da trilha aqui é "Leitura"; no Figma é "Simulação".** Trocada porque é a Leitura que abre as duas telas seguintes, e porque a Simulação já tem o vídeo da aba 1. Rótulo, medida e descrição de cada tipo estão verbatim do arquivo; o que mudou foi a ordem, que é gerada por usuário de qualquer forma.
2. **A leitura fala de LinkedIn e o exercício fala de dinheiro.** São sessões de trilhas diferentes no arquivo de design: as duas telas abrem com o segmento 1 de 10 preenchido, ou seja, cada uma é o primeiro cartão da própria sessão. Encadeadas como stories, o exercício não testa a leitura. As duas telas foram reproduzidas como estão no arquivo, sem reescrever copy de produto.

---

### Sem limite

`remotion/src/Relatorio.tsx` percorre o Relatório da Simulação (`1902:1691`), a tela que fecha com **"Refazer simulação"** — que é literalmente o que a aba promete. O medidor varre de zero até 6,2 e o número conta junto; depois a rolagem passa pelas três barras de rubrica, pelo que ele acertou, pelo que dá para melhorar, pela Prontidão, e para no botão de refazer, que afunda os 6px da própria sombra ao ser tocado.

**O medidor é desenhado com `strokeDasharray`, não com o arco exportado**, porque ele precisa varrer — é o momento principal da peça e um SVG estático não varre. A geometria vem da descrição do componente no arquivo (188 × 188, traço de 10, arco proporcional ao valor).

**As barras de rubrica têm largura calculada da própria nota** (3,7/6,0 → 62%, 1,3/2,0 → 65%, 1,2/2,0 → 60%). No Figma as três instâncias estão com o **mesmo** preenchimento, embora a descrição do componente mande ajustar por instância. É o mesmo defeito de `Barra de Progresso` que a wiki já registrou em 29/07 (o preenchimento não aceita override de largura), aparecendo de novo aqui.

⚠️ **Terceira família tipográfica.** Além de Lexend Deca (título/rótulo) e Plus Jakarta Sans (corpo), esta tela usa **Nunito Sans** nos apoios cinza, nos números e nas citações. Não está no sistema declarado do app, que é Lexend Deca + Plus Jakarta Sans. Foi reproduzido como está no arquivo. Se for deriva e não decisão, o conserto é trocar `nunito` por `jakarta` em um lugar só, no topo de `Relatorio.tsx`.

As posições das seções são constantes tiradas das coordenadas do arquivo, pelo mesmo motivo das alturas fixas da trilha: é delas que sai a rolagem, e com elas fluidas cada mudança de copy exigiria recalibrar em still.

**As entradas caem durante a rolagem que traz a seção, não depois.** Na primeira versão elas vinham atrasadas e a rolagem chegava numa área vazia, com o conteúdo pipocando de tela parada — lê como carregamento, não como leitura.

---

## Pipeline de assets

As ilustrações foram geradas no Higgsfield com **GPT Image 2** (o id do modelo é `gpt_image_2`, com underscore) usando as referências de estilo do projeto. Fluxo: gerar → baixar o PNG para `assets-originais/` → pós-processar com `sharp` → exportar WebP para `src/assets/`.

Três tratamentos, conforme o destino:

1. **Recorte com canal alfa** (os quatro `tema-*.webp` do hero e os quatro `trilha-*.webp`): o PNG original passa pelo `images_remove_background` do Magnific (MCP), volta como PNG transparente para `assets-originais/` com sufixo `-alpha`, e vira WebP com `trim()` e `quality: 80`. **Não usa blend nenhum.** É o tratamento preferido para qualquer arte nova: o alfa é de verdade, então o asset funciona sobre qualquer fundo, e não sobra o vínculo com o branco da página. Medido: 75 a 90% de pixels transparentes com 0,4% em meio-tom (borda antisserrilhada limpa), proporção preservada dentro de 0,5% e 57KB nos quatro.
2. **Arte sobre fundo branco** (as demais): forçar os pixels quase-brancos (todos os canais acima de 244) a branco puro, aparar as margens com `trim()`, e usar `mix-blend-multiply` no CSS para o fundo sumir na página. Sem o passo do branco puro, sobra uma borda cinza visível. **Limitação conhecida, e a razão do tratamento 1 existir:** multiply amarra a arte ao fundo branco. Sobre superfície escura ela fecha em preto.
3. **Arte sobre fundo preto** (`placa-alerta.webp`): gerada já com fundo preto puro no prompt, quase-preto forçado a `#000`, aparada, e usada **sem blend** direto sobre o campo preto do selo.

**`porta-destrava` e `mae-depoimento` foram regeneradas para os personagens terem esclera branca** (os olhos eram formas escuras sólidas). Originais novos: `porta-v3-olhos.png` e `mae-depoimento-v2-olhos.png`; os anteriores (`porta-v2.png`, `mae-depoimento.png`) continuam em `assets-originais/` e reconstroem a versão antiga se precisar. **Elas não passam por `trim`**, ao contrário do resto do pipeline: aparar mudaria a proporção do quadro e, com largura fixa no CSS, mexeria na altura do hero inteiro — o pedido era só os olhos. Ficam em 1024 × 1024 como antes, então os atributos `width`/`height` do JSX seguem válidos. ⚠️ **Regeneração não é edição pontual:** o modelo redesenha a cena toda, então há microdiferenças além dos olhos (linhas de dobra na roupa, fios no cabelo, expressão um fio mais aberta). Foram geradas duas variantes de cada e escolhida a mais fiel ao original.

**Moldura vazia dentro do asset é tamanho jogado fora.** O `selo-garantia` vinha com o desenho ocupando só **60,2% da largura** do quadro de 1024 — quase 220px de branco de cada lado. Numa célula de largura fixa isso faz o escudo parecer pequeno, e a correção não é mexer no layout: é aparar o asset, o que fez o desenho crescer **67% na mesma caixa**. Ao trocar um asset por uma versão aparada, **atualize `width`/`height` no JSX junto**, senão o navegador reserva espaço na proporção antiga e a página pula quando a imagem chega. Medição atual dos que ainda têm sobra: `presente-futuro` ocupa 80% (já compensado no CSS pelo truque do `Medalhao`, que desenha a 124%) e `mae-depoimento` 90%. O `porta-destrava` ocupa 64% da largura **de propósito** — o vazio lateral é onde os quatro ícones temáticos flutuam.

**As quatro trilhas nasceram de uma folha só.** `icones-trilhas.png` é um grid 2×2 com os quatro ícones. Em vez de recortar quatro vezes, a folha inteira passou uma vez pelo `images_remove_background` (3 créditos em vez de 12) e foi fatiada localmente **por projeção do canal alfa**, não por quadrantes chutados: soma-se o alfa por linha para achar as duas faixas, depois por coluna dentro de cada faixa. A ordem das caixas lidas em Z é a ordem da copy — Carreira, Finanças, Cidadania, Bem-estar. O script vive fora do repo; o que importa é o método, caso a folha precise ser refeita.

Variantes geradas e não usadas continuam em `assets-originais/`: `cena-arco`, `cena-corrente`, `dupla-magica`, `hero-jovem`, `porta-v1`, `porta-v2`.

---

## O que ainda não está ligado

- **Formulário.** `LeadForm.tsx` é só front, com os 4 estados simulados (campo vazio, e-mail inválido, enviando, confirmação). O ponto de integração está comentado no arquivo, esperando o POST.
- **VSL.** O player está em placeholder; o vídeo ainda não existe.

---

## Referência de design

O Figma [Destrava v.0](https://www.figma.com/design/uyidHtrgyVkYQPwwtqkJuG/Destrava-v.0) tem telas na section "Nova LP" (nós `3238:6491` e `3238:6492`) que foram construídas **antes** do scrollytelling, do hero da porta e da versão atual dos blocos de compra e fechamento. Não use como fonte da verdade; o código é a referência.

Se for mexer no arquivo: ignorar o design system Assemble, **não criar variáveis** (valores puros apenas), usar auto layout e as escalas de espaçamento do Tailwind. Duas armadilhas da API: `resize()` reseta `primaryAxisSizingMode` para `FIXED` (reponha `"AUTO"` depois), e o seletor de `node.query()` rejeita caracteres não-ASCII (busque com JS puro sobre `children`).

---

## Verificação antes de entregar

- `npm run build` e `npm run lint` limpos.
- Layout íntegro em 375px e 1280px, sem rolagem horizontal.
- Formulário passa pelos 4 estados.
- Abas do scrollytelling funcionam por clique e por teclado.
- Foco de teclado visível em todos os controles.
- Nada de copy parafraseada.
