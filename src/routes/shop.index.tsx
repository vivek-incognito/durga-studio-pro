import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHero } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQuery } from "@/lib/queries";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_META, type ProductCategory } from "@/lib/format";
import { cn } from "@/lib/utils";

type ShopSearch = { category?: ProductCategory };

export const Route = createFileRoute("/shop/")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => {
    const c = s["category"];
    return PRODUCT_CATEGORIES.includes(c as ProductCategory) ? { category: c as ProductCategory } : {};
  },
  head: () => ({
    meta: [
      { title: "Shop Services | Durga Studio" },
      { name: "description", content: "Order passport photos, photo frames, custom banners and function photography online from Durga Studio." },
      { property: "og:title", content: "Shop Services | Durga Studio" },
      { property: "og:description", content: "Passport photos, frames, banners and event photography with online photo upload." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Shop,
});

function Shop() {
  const { category } = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQuery());
  const cats = category ? [category] : PRODUCT_CATEGORIES;

  return (
    <>
      <PageHero eyebrow="Shop" title="Studio services" intro="Choose a service, upload your photos or designs, and collect from your nearest branch." />
      <div className="container-page mt-10">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
          <FilterLink active={!category} label="All services" />
          {PRODUCT_CATEGORIES.map((c) => (
            <FilterLink key={c} active={category === c} label={PRODUCT_CATEGORY_META[c].label} category={c} />
          ))}
        </div>
        <div className="mt-10 space-y-16">
          {cats.map((c) => {
            const list = products.filter((p) => p.category === c);
            if (!list.length) return null;
            return (
              <section key={c} className="animate-fade-up">
                <h2 className="text-3xl font-semibold">{PRODUCT_CATEGORY_META[c].label}</h2>
                <p className="text-sm text-muted-foreground">{PRODUCT_CATEGORY_META[c].description}</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

function FilterLink({ active, label, category }: { active: boolean; label: string; category?: ProductCategory }) {
  return (
    <Link
      to="/shop"
      search={category ? { category } : {}}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-turquoise hover:text-primary",
      )}
    >
      {label}
    </Link>
  );
}
