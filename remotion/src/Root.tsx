import { Composition } from 'remotion'
import { ALTURA, FPS, LARGURA } from '../../src/telas/medidas'
import { DURACAO as DURACAO_SIMULACAO } from '../../src/telas/Simulacao'
import { DURACAO as DURACAO_TRILHAS } from '../../src/telas/Trilhas'
import { DURACAO as DURACAO_RELATORIO } from '../../src/telas/Relatorio'
import { RelatorioEmVideo, SimulacaoEmVideo, TrilhasEmVideo } from './composicoes'

export const Root = () => (
  <>
    <Composition
      id="Simulacao"
      component={SimulacaoEmVideo}
      durationInFrames={DURACAO_SIMULACAO}
      fps={FPS}
      width={LARGURA}
      height={ALTURA}
    />
    <Composition
      id="Trilhas"
      component={TrilhasEmVideo}
      durationInFrames={DURACAO_TRILHAS}
      fps={FPS}
      width={LARGURA}
      height={ALTURA}
    />
    <Composition
      id="Relatorio"
      component={RelatorioEmVideo}
      durationInFrames={DURACAO_RELATORIO}
      fps={FPS}
      width={LARGURA}
      height={ALTURA}
    />
  </>
)
