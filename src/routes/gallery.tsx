import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Expand, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/SectionHeading";
import { Lightbox, type LightboxImage } from "@/components/site/Lightbox";
import { galleryQuery } from "@/lib/queries";
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_META, type GalleryCategory } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Durga Studio" },
      { name: "description", content: "Browse wedding, engagement, birthday, passport, frame, banner, videography and album work by Durga Studio." },
      { property: "og:title", content: "Gallery | Durga Studio" },
      { property: "og:description", content: "Wedding, engagement, birthday, portrait, frame, banner and album photography." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery()),
  component: GalleryPage,
});

function GalleryPage() {
  const { data } = useSuspenseQuery(galleryQuery());
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [open, setOpen] = useState<number | null>(null);

  const images: LightboxImage[] = useMemo(
    () =>
      data
        .filter((g) => filter === "all" || g.category === filter)
        .map((g) => ({ ...g, categoryLabel: GALLERY_CATEGORY_META[g.category] })),
    [data, filter],
  );
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    data.forEach((g) => m.set(g.category, (m.get(g.category) ?? 0) + 1));
    return m;
  }, [data]);
  const hasSamples = images.some((i) => i.is_sample);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Our studio gallery" intro="Portraits, prints, celebrations and films. Tap any photo to view it full screen." />
      <div className="container-page mt-10">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="All" count={data.length} />
          {GALLERY_CATEGORIES.map((c) => (
            <FilterButton key={c} active={filter === c} onClick={() => setFilter(c)} label={GALLERY_CATEGORY_META[c]} count={counts.get(c) ?? 0} />
          ))}
        </div>

        {hasSamples && (
          <p className="mt-6 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 text-sm text-gold-foreground">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            Photos marked <strong className="mx-1">Sample</strong> are licensed stock photography used to illustrate our services. Photos marked
            <strong className="mx-1">Durga Studio work</strong> are by our own team.
          </p>
        )}

        {images.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">No photos in this category yet.</p>
        ) : (
          <div key={filter} className="masonry mt-8">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setOpen(i)}
                className="group relative mb-4 block w-full animate-fade-up break-inside-avoid overflow-hidden rounded-2xl bg-muted text-left shadow-soft"
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                aria-label={`Open ${img.title || "photo"}`}
              >
                <img src={img.url} alt={img.title} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-navy/80 via-transparent to-transparent p-3 opacity-90 transition-opacity group-hover:opacity-100">
                  <div className="flex justify-between">
                    <Badge variant={img.is_sample ? "sample" : "studio"}>{img.is_sample ? "Sample" : "Durga Studio work"}</Badge>
                    <Expand className="size-4 text-navy-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </div>
                  <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="font-display text-lg leading-tight text-navy-foreground">{img.title}</p>
                    <p className="text-[11px] uppercase tracking-widest text-gold">{img.categoryLabel}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}

function FilterButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-turquoise hover:text-primary",
      )}
    >
      {label} <span className={cn("ml-1 text-xs", active ? "text-gold" : "text-muted-foreground/70")}>{count}</span>
    </button>
  );
}
