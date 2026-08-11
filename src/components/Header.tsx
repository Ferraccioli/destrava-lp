import destravaLogo from '../assets/destrava-logo.png'

export default function Header() {
  return (
    <header
      id="topo"
      className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8"
    >
      <a href="#topo" aria-label="Destrava — início">
        <img src={destravaLogo} alt="Destrava" className="h-8 w-auto md:h-9" width={269} height={60} />
      </a>

      <a
        href="#comprar"
        className="rounded-full border-2 border-mint px-5 py-2.5 font-display text-sm font-medium text-forest transition-colors duration-200 hover:border-forest hover:bg-forest hover:text-white"
      >
        Ver a oferta
      </a>
    </header>
  )
}
