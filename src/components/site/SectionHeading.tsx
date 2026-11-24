export function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-turquoise">{eyebrow}</p>
      <h2 className="text-4xl font-semibold sm:text-5xl">{title}</h2>
      <div className="gold-rule" />
      {intro && <p className="max-w-2xl pt-2 text-muted-foreground">{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="bg-hero text-navy-foreground">
      <div className="container-page animate-fade-up py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 text-5xl font-semibold sm:text-6xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg text-navy-muted">{intro}</p>}
      </div>
    </section>
  );
}
