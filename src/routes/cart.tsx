import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/SectionHeading";
import { useCart } from "@/lib/cart";
import { branchesQuery } from "@/lib/queries";
import { formatINR, priceLabel } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Durga Studio" },
      { name: "description", content: "Review the services and uploads in your Durga Studio cart." },
      { property: "og:title", content: "Your Cart | Durga Studio" },
      { property: "og:description", content: "Review your Durga Studio order before sending it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, remove, ready } = useCart();
  const { data: branches } = useQuery(branchesQuery());
  const main = branches?.[0];
  const message = ["Hello Durga Studio, I would like to order:", ...items.map((i) => `- ${i.name} x ${i.quantity} (${formatINR(i.unitPrice * i.quantity)})`), `Estimated total: ${formatINR(total)}`].join("\n");

  return (
    <>
      <PageHero eyebrow="Cart" title="Your cart" />
      <div className="container-page mt-10">
        {ready && items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="gold" className="mt-4"><Link to="/shop">Browse services</Link></Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-3">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-soft">
                  <img src={i.imageUrl} alt="" className="size-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-sm text-muted-foreground">{priceLabel(i.unitPrice, i.priceUnit, i.priceIsStarting)} · Qty {i.quantity}</p>
                    {i.files.length > 0 && <p className="text-xs text-turquoise">{i.files.length} file(s) uploaded: {i.files.map((f) => f.name).join(", ")}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(i.key)} aria-label={`Remove ${i.name}`}><Trash2 /></Button>
                </li>
              ))}
            </ul>
            <aside className="h-fit space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
              <div className="flex justify-between text-lg font-bold"><span>Estimated total</span><span>{formatINR(total)}</span></div>
              {main?.whatsapp && (
                <Button asChild variant="whatsapp" className="w-full">
                  <a href={waLink(main.whatsapp, message)} target="_blank" rel="noreferrer"><MessageCircle /> Send order on WhatsApp</a>
                </Button>
              )}
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
