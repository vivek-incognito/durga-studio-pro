import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type LightboxImage = { id: string; url: string; title: string; description: string; is_sample: boolean; categoryLabel: string };

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null && images[index] !== undefined;
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index !== null) onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft" && index !== null) onIndex((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, index, images.length, onClose, onIndex]);

  if (!open || index === null) return null;
  const img = images[index]!;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={img.title || "Photo"}
      className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-navy/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-navy-foreground">
        <span className="text-sm text-navy-muted tabular-nums">{index + 1} / {images.length}</span>
        <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-navy-foreground/10" aria-label="Close">
          <X className="size-6" />
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => onIndex((index - 1 + images.length) % images.length)}
          className="absolute left-2 z-10 rounded-full bg-navy-foreground/10 p-3 text-navy-foreground hover:bg-navy-foreground/20 sm:left-6"
          aria-label="Previous photo"
        >
          <ChevronLeft className="size-6" />
        </button>
        <img key={img.id} src={img.url} alt={img.title} className="max-h-[78vh] max-w-full animate-fade-in rounded-lg object-contain shadow-elegant" />
        <button
          type="button"
          onClick={() => onIndex((index + 1) % images.length)}
          className="absolute right-2 z-10 rounded-full bg-navy-foreground/10 p-3 text-navy-foreground hover:bg-navy-foreground/20 sm:right-6"
          aria-label="Next photo"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>
      <div className="px-6 pb-6 text-center text-navy-foreground" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-center gap-2">
          <Badge variant={img.is_sample ? "sample" : "studio"}>{img.is_sample ? "Sample photography" : "Durga Studio work"}</Badge>
          <span className="text-xs uppercase tracking-widest text-gold">{img.categoryLabel}</span>
        </div>
        {img.title && <p className="font-display text-xl">{img.title}</p>}
        {img.description && <p className="mx-auto max-w-xl text-sm text-navy-muted">{img.description}</p>}
      </div>
    </div>
  );
}
