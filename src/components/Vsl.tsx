export default function Vsl() {
  return (
    <section className="on-dark bg-forest-deep">
      <div className="mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <h2 className="mx-auto max-w-[20ch] text-center font-display text-[2.25rem] font-semibold leading-[1.03] tracking-display text-white md:text-[3.25rem]">
          O que está em jogo enquanto ele decide sozinho.
        </h2>

        {/* Moldura 16:9 no lugar do player, com o botão de play desenhado por
            cima: reserva a proporção final para a troca pelo vídeo não mexer
            no comprimento da seção. */}
        <figure className="mt-10">
          <div className="flex aspect-video w-full items-center justify-center rounded-3xl border-2 border-dashed border-mint/25 bg-forest/50">
            <div className="text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sun">
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="#0F3D25" aria-hidden="true">
                  <path d="M8 5l12 7-12 7z" />
                </svg>
              </span>
              <figcaption className="mt-4 font-display text-base font-medium text-white">
                VSL horizontal
              </figcaption>
              <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.14em] text-mint/80">
                Asset pendente
              </span>
            </div>
          </div>
        </figure>
      </div>
    </section>
  )
}
