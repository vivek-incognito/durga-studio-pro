import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Camera, Frame, IdCard, MapPin, PackageSearch, Presentation, ShoppingBag, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { branchesQuery, galleryQuery, productsQuery } from "@/lib/queries";
import { PRODUCT_CATEGORY_META, type ProductCategory } from "@/lib/format";
import { SectionHeading } from "@/components/site/SectionHeading";

const HERO = "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1800&q=80";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Durga Studio | Photography, Frames and Banners in Rentachintala" },
      { name: "description", content: "Order passport photos, photo frames, custom banners and wedding or function photography from Durga Studio. Upload your photos and track your order online." },
      { property: "og:title", content: "Durga Studio | Photography, Frames and Banners" },
      { property: "og:description", content: "Passport photos, frames, banners and function photography. Upload online, pick up at your branch." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: HERO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery()),
      context.queryClient.ensureQueryData(galleryQuery()),
      context.queryClient.ensureQueryData(branchesQuery()),
    ]),
  component: Home,
});

const CATEGORY_ICONS: Record<ProductCategory, typeof Camera> = {
  passport: IdCard,
  frames: Frame,
  banners: Presentation,
  events: Camera,
};

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { data: gallery } = useSuspenseQuery(galleryQuery());
  const featured = ["passport-photo-prints", "a4-photo-frame", "flex-banner", "wedding-photography"]
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const strip = gallery.slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden bg-hero text-navy-foreground">
        <img src={HERO} alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-25 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" aria-hidden />
        <div className="container-page relative grid min-h-[78vh] items-center py-20">
          <div className="max-w-2xl animate-fade-up space-y-7">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Durga Studio · Rentachintala</p>
            <h1 className="text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              Every portrait, print and celebration,{" "}
              <span className="text-gold-gradient italic">beautifully kept.</span>
            </h1>
            <p className="max-w-lg text-lg text-navy-muted">
              Passport photos, photo frames, custom banners and function photography. Upload your photos online, choose your branch, and track your order.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg">
                <Link to="/shop"><ShoppingBag /> Start an order</Link>
              </Button>
              <Button asChild variant="outline-light" size="lg">
                <Link to="/gallery">View gallery <ArrowRight /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page -mt-14 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PRODUCT_CATEGORY_META) as ProductCategory[]).map((c, i) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <Link
                key={c}
                to="/shop"
                search={{ category: c }}
                className="group animate-fade-up rounded-2xl border bg-card p-6 shadow-elegant transition-all hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-turquoise-soft text-turquoise">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="text-2xl font-semibold">{PRODUCT_CATEGORY_META[c].label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{PRODUCT_CATEGORY_META[c].description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Browse <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page mt-24">
        <SectionHeading eyebrow="Popular" title="Order in a few clicks" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="grid gap-6 rounded-3xl bg-secondary/60 p-8 md:grid-cols-3 md:p-12">
          {[
            { icon: Upload, title: "Upload your photos", text: "Add your passport photo, the picture to frame, or your banner design right on the product page." },
            { icon: MapPin, title: "Choose your branch", text: "Pick the branch you want to collect from and confirm your order on WhatsApp." },
            { icon: PackageSearch, title: "Track every step", text: "Use your Order ID and mobile number to follow your order from received to ready." },
          ].map((s, i) => (
            <div key={s.title} className="space-y-2">
              <span className="font-display text-4xl font-semibold text-gold">0{i + 1}</span>
              <h3 className="flex items-center gap-2 text-2xl font-semibold"><s.icon className="size-5 text-turquoise" aria-hidden />{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {strip.length > 0 && (
        <section className="container-page mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Gallery" title="Moments we love to capture" />
            <Button asChild variant="outline"><Link to="/gallery">Open full gallery <ArrowRight /></Link></Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
            {strip.map((g, i) => (
              <Link key={g.id} to="/gallery" className={`group relative overflow-hidden rounded-2xl bg-muted ${i === 0 ? "row-span-2" : ""}`}>
                <img src={g.url} alt={g.title} loading="lazy" className="size-full min-h-40 object-cover transition-transform duration-700 group-hover:scale-105" />
                {g.is_sample && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-navy/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-foreground">Sample</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
