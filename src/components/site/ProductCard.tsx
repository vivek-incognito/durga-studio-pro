import { Link } from "@tanstack/react-router";
import { ArrowRight, Upload } from "lucide-react";
import { priceLabel } from "@/lib/format";
import type { PublicProduct } from "@/lib/queries";

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.upload_kind !== "none" && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur">
            <Upload className="size-3" aria-hidden /> Upload your files
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short_description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-bold text-primary">
            {priceLabel(product.price, product.price_unit, product.price_is_starting)}
          </span>
          <ArrowRight className="size-4 text-turquoise transition-transform group-hover:translate-x-1" aria-hidden />
        </div>
      </div>
    </Link>
  );
}
