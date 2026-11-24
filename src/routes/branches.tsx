import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/site/SectionHeading";
import { branchesQuery } from "@/lib/queries";
import { waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Branches and Contact | Durga Studio" },
      { name: "description", content: "Find Durga Studio branches, opening hours, phone, WhatsApp and Google Maps directions." },
      { property: "og:title", content: "Branches and Contact | Durga Studio" },
      { property: "og:description", content: "Durga Studio branch addresses, hours and WhatsApp contact." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(branchesQuery()),
  component: BranchesPage,
});

function BranchesPage() {
  const { data: branches } = useSuspenseQuery(branchesQuery());
  return (
    <>
      <PageHero eyebrow="Visit us" title="Our branches" intro="Collect your orders, get your passport photos taken, or plan your next function with us." />
      <div className="container-page mt-10 grid gap-6 md:grid-cols-2">
        {branches.map((b) => (
          <article key={b.id} className="animate-fade-up rounded-2xl border bg-card p-6 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-3xl font-semibold">{b.name}</h2>
              {b.is_main && <Badge variant="gold">Main branch</Badge>}
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-turquoise" aria-hidden />{b.address}</li>
              {b.hours && <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-turquoise" aria-hidden />{b.hours}</li>}
              {b.phone && <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-turquoise" aria-hidden /><a className="hover:text-primary" href={`tel:${b.phone}`}>{b.phone}</a></li>}
              {b.whatsapp && <li className="flex gap-2.5"><MessageCircle className="mt-0.5 size-4 shrink-0 text-turquoise" aria-hidden />{[b.whatsapp, b.whatsapp_alt].filter(Boolean).join(" / ")}</li>}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {b.whatsapp && (
                <Button asChild variant="whatsapp">
                  <a href={waLink(b.whatsapp, "Hello Durga Studio, I have a question.")} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
                </Button>
              )}
              {b.whatsapp_alt && (
                <Button asChild variant="outline">
                  <a href={waLink(b.whatsapp_alt, "Hello Durga Studio, I have a question.")} target="_blank" rel="noreferrer"><MessageCircle /> Alternate WhatsApp</a>
                </Button>
              )}
              {b.maps_url && (
                <Button asChild variant="outline">
                  <a href={b.maps_url} target="_blank" rel="noreferrer"><Navigation /> Directions</a>
                </Button>
              )}
            </div>
          </article>
        ))}
        {branches.length < 2 && (
          <article className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center text-muted-foreground">
            <MapPin className="mb-2 size-6 text-turquoise" aria-hidden />
            <p className="font-semibold text-foreground">Second branch coming soon</p>
            <p className="text-sm">Details will be announced here.</p>
          </article>
        )}
      </div>
    </>
  );
}
