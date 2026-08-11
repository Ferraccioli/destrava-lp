import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { loadFont as carregaLexend } from '@remotion/google-fonts/LexendDeca'
import { loadFont as carregaJakarta } from '@remotion/google-fonts/PlusJakartaSans'
import { loadFont as carregaNunito } from '@remotion/google-fonts/NunitoSans'
import { Palco } from '../../src/telas/aparelho'
import { Simulacao } from '../../src/telas/Simulacao'
import { Trilhas } from '../../src/telas/Trilhas'
import { Relatorio } from '../../src/telas/Relatorio'

/*
 * As telas moram na LP, em `src/telas/`, e rodam lá com o relógio do navegador.
 * Aqui elas recebem o quadro do Remotion e viram vídeo. **Uma cópia só de cada
 * tela**: o que muda entre os dois destinos é de onde vem o número do quadro.
 *
 * Serve para gerar `.webm` solto — anúncio, social, apresentação. A página não
 * usa mais vídeo nenhum.
 */

/* As telas pedem as famílias pelo nome; no navegador quem carrega é o CSS. */
carregaLexend()
carregaJakarta()
carregaNunito()

const comQuadro = (Tela: () => React.ReactNode) => () => (
  <AbsoluteFill>
    <Palco quadro={useCurrentFrame()}>
      <Tela />
    </Palco>
  </AbsoluteFill>
)

export const SimulacaoEmVideo = comQuadro(Simulacao)
export const TrilhasEmVideo = comQuadro(Trilhas)
export const RelatorioEmVideo = comQuadro(Relatorio)
