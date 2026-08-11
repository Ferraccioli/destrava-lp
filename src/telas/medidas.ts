/* Medidas do aparelho simulado. Comuns às três telas do "Como funciona". */

export const LARGURA = 390
export const ALTURA = 800
export const FPS = 30

/*
 * Altura da barra de status, sob a qual a interface do app começa. Cinquenta é
 * a proporção do aparelho real (54 de 852) nestes 800, e cobre com folga a ilha
 * dinâmica que o mock desenha por cima da tela — ela ocupa de 1,25% a 4,05% da
 * altura, 10px a 32px aqui.
 */
export const TOPO_SEGURO = 50
