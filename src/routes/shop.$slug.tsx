import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/site/FileUploader";
import { productQuery } from "@/lib/queries";
import { formatINR, priceLabel, PRODUCT_CATEGORY_META } from "@/lib/format";
import { useCart } from "@/lib/cart";
import type { UploadedFile } from "@/lib/upload-client";

export const Route = createFileRoute("/shop/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return { name: product.name, description: product.short_description, image: product.image_url };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Service unavailable | Durga Studio" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.name} | Durga Studio`;
    const meta = [
      { title },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: title },
      { property: "og:description", content: loaderData.description },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.image.startsWith("https://")) {
      meta.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    }
    return { meta };
  },
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-semibold">Service not found</h1>
      <Button asChild className="mt-6"><Link to="/shop">Back to shop</Link></Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  if (!product) return null;

  const needsUpload = product.upload_required && files.length === 0;

  function addToCart(goToCart: boolean) {
    if (!product) return;
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      imageUrl: product.image_url,
      unitPrice: Number(product.price),
      priceUnit: product.price_unit,
      priceIsStarting: product.price_is_starting,
      quantity: qty,
      notes,
      uploadKind: product.upload_kind,
      uploadRequired: product.upload_required,
      files,
    });
    toast.success(`${product.name} added to your cart`);
    setFiles([]);
    setNotes("");
    setQty(1);
    if (goToCart) void navigate({ to: "/cart" });
  }

  return (
    <div className="container-page py-10">
      <Link to="/shop" search={{ category: product.category }} className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> {PRODUCT_CATEGORY_META[product.category].label}
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted shadow-elegant">
          <img src={product.image_url} alt={product.name} className="aspect-[4/3] size-full object-cover lg:aspect-square" />
        </div>
        <div className="animate-fade-up space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-turquoise">{PRODUCT_CATEGORY_META[product.category].label}</p>
            <h1 className="mt-2 text-5xl font-semibold">{product.name}</h1>
            <p className="mt-3 text-2xl font-bold text-primary">{priceLabel(product.price, product.price_unit, product.price_is_starting)}</p>
            {product.price_is_starting && (
              <p className="text-xs text-muted-foreground">Final price is confirmed by the studio after reviewing your requirements.</p>
            )}
          </div>
          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-5 rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Quantity</Label>
              <div className="flex items-center gap-1 rounded-lg border">
                <Button type="button" variant="ghost" size="icon" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus /></Button>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={qty}
                  onChange={(e) => setQty(Math.min(500, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-14 bg-transparent text-center text-sm font-semibold tabular-nums outline-none"
                  aria-label="Quantity"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => setQty((q) => Math.min(500, q + 1))} aria-label="Increase quantity"><Plus /></Button>
              </div>
            </div>

            {product.upload_kind !== "none" && (
              <FileUploader kind={product.upload_kind} files={files} onChange={setFiles} required={product.upload_required} onBusyChange={setUploading} />
            )}

            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-semibold">Notes for the studio <span className="font-normal text-muted-foreground">(optional)</span></Label>
              <Textarea id="notes" value={notes} maxLength={500} onChange={(e) => setNotes(e.target.value)} placeholder="Size, colour, frame style, event date, or any special requests" />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">Estimated total</span>
              <span className="text-xl font-bold">{formatINR(Number(product.price) * qty)}</span>
            </div>
            {needsUpload && <p className="text-xs text-destructive">Please upload the required photo to continue.</p>}
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" size="lg" disabled={needsUpload || uploading} onClick={() => addToCart(false)}>
                Add to cart
              </Button>
              <Button variant="gold" size="lg" disabled={needsUpload || uploading} onClick={() => addToCart(true)}>
                <ShoppingBag /> Add and checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
