const ITEMS = ['+500 jovens já usam o Destrava', 'Prêmio 1000 Startups Sebrae']

function Strip({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <span aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-7 font-display text-[0.95rem] font-medium text-white">{item}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-sun" aria-hidden="true" />
        </span>
      ))}
    </span>
  )
}

export default function Marquee() {
  return (
    <div className="overflow-hidden bg-forest py-3.5">
      <div className="flex w-max animate-marquee">
        <Strip />
        <Strip ariaHidden />
      </div>
    </div>
  )
}
