import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHero } from "@/components/site/SectionHeading";
import { StatusTracker } from "@/components/site/StatusTracker";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTime, formatINR, STATUS_META, type OrderStatus } from "@/lib/format";

type Tracked = {
  order_code: string;
  customer_name: string;
  created_at: string;
  branch_name: string;
  total_amount: number;
  status: OrderStatus;
  items: { name: string; quantity: number; line_total: number }[];
  history: { status: OrderStatus; note: string; created_at: string }[];
};

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order | Durga Studio" },
      { name: "description", content: "Track your Durga Studio order with your Order ID and registered mobile number." },
      { property: "og:title", content: "Track Your Order | Durga Studio" },
      { property: "og:description", content: "Follow your order from received to ready for pickup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const [code, setCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Tracked | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    const { data, error: err } = await supabase.rpc("track_order", { p_order_code: code, p_mobile: mobile });
    setLoading(false);
    if (err) return setError("Something went wrong. Please try again.");
    if (!data) return setError("No order matches this Order ID and mobile number.");
    setOrder(data as unknown as Tracked);
  }

  return (
    <>
      <PageHero eyebrow="Order tracking" title="Track your order" intro="Enter the Order ID you received and the mobile number used when ordering." />
      <div className="container-page mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
        <form onSubmit={onSubmit} className="h-fit space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
          <div className="space-y-1.5">
            <Label htmlFor="code">Order ID</Label>
            <Input id="code" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="DS261124-AB2CD" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mobile">Registered mobile number</Label>
            <Input id="mobile" required inputMode="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit mobile number" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Search />} Track order
          </Button>
        </form>
        {order && (
          <div className="animate-fade-up space-y-6 rounded-2xl border bg-card p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <Info label="Order ID" value={order.order_code} />
              <Info label="Customer" value={order.customer_name} />
              <Info label="Order date" value={formatDateTime(order.created_at)} />
              <Info label="Branch" value={order.branch_name} />
              <Info label="Estimated total" value={formatINR(order.total_amount)} />
              <Info label="Current status" value={STATUS_META[order.status].label} />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-semibold">Products ordered</h2>
              <ul className="divide-y text-sm">
                {order.items.map((i, n) => (
                  <li key={n} className="flex justify-between py-2"><span>{i.name} x {i.quantity}</span><span>{formatINR(i.line_total)}</span></li>
                ))}
              </ul>
            </div>
            <StatusTracker status={order.status} history={order.history} />
          </div>
        )}
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
