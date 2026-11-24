import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { branchesQuery } from "@/lib/queries";
import { Logo } from "./Logo";

export function SiteFooter() {
  const { data: branches } = useQuery(branchesQuery());
  const main = branches?.[0];
  return (
    <footer className="mt-24 bg-navy-gradient text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-sm text-sm text-navy-muted">
            Passport photos, frames, custom banners and function photography, crafted with care in Rentachintala.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gold">Explore</h3>
          <ul className="space-y-2 text-sm text-navy-muted">
            <li><Link to="/shop" className="hover:text-navy-foreground">Shop services</Link></li>
            <li><Link to="/gallery" className="hover:text-navy-foreground">Gallery</Link></li>
            <li><Link to="/track" className="hover:text-navy-foreground">Track your order</Link></li>
            <li><Link to="/branches" className="hover:text-navy-foreground">Branches</Link></li>
          </ul>
        </div>
        {main && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gold">Visit us</h3>
            <ul className="space-y-2.5 text-sm text-navy-muted">
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-turquoise" aria-hidden />{main.address}</li>
              {main.phone && <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0 text-turquoise" aria-hidden /><a href={`tel:${main.phone}`} className="hover:text-navy-foreground">{main.phone}</a></li>}
              {main.whatsapp && <li className="flex gap-2"><MessageCircle className="mt-0.5 size-4 shrink-0 text-turquoise" aria-hidden />{[main.whatsapp, main.whatsapp_alt].filter(Boolean).join(" / ")}</li>}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Durga Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
