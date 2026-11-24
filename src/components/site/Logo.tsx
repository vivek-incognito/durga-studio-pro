import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-10 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-gold">
        <Aperture className="size-5" aria-hidden />
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-2xl font-semibold", light ? "text-navy-foreground" : "text-primary")}>
          Durga Studio
        </span>
        <span className={cn("block text-[10px] font-semibold uppercase tracking-[0.22em]", light ? "text-gold" : "text-turquoise")}>
          Photography &amp; Prints
        </span>
      </span>
    </span>
  );
}
