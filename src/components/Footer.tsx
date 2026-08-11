import destravaCadeado from '../assets/destrava-cadeado.png'

export default function Footer() {
  return (
    <footer className="bg-forest-deep py-7">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-2.5 px-5 md:px-8">
        <img src={destravaCadeado} alt="" aria-hidden="true" className="h-6 w-6" width={512} height={512} />
        <p className="font-display text-sm font-medium text-mint">destrava · Di Maior</p>
      </div>
    </footer>
  )
}
