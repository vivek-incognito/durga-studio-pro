import { Check, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime, ORDER_FLOW, STATUS_META, type OrderStatus } from "@/lib/format";

type HistoryEntry = { status: OrderStatus; note: string; created_at: string };

export function StatusTracker({ status, history }: { status: OrderStatus; history: HistoryEntry[] }) {
  const latestByStatus = new Map<OrderStatus, HistoryEntry>();
  for (const h of history) latestByStatus.set(h.status, h);
  const cancelled = status === "cancelled";
  const currentIndex = cancelled
    ? Math.max(-1, ...history.filter((h) => h.status !== "cancelled").map((h) => ORDER_FLOW.indexOf(h.status)))
    : ORDER_FLOW.indexOf(status);
  const steps: OrderStatus[] = cancelled ? [...ORDER_FLOW.slice(0, currentIndex + 1), "cancelled"] : ORDER_FLOW;

  return (
    <ol className="relative space-y-0">
      {steps.map((s, i) => {
        const isCancelStep = s === "cancelled";
        const done = isCancelStep || i <= currentIndex;
        const current = isCancelStep || (!cancelled && i === currentIndex);
        const entry = latestByStatus.get(s);
        const last = i === steps.length - 1;
        return (
          <li key={s} className="relative flex gap-4 pb-7 last:pb-0">
            {!last && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-0.5",
                  i < currentIndex ? "bg-turquoise" : "bg-border",
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isCancelStep
                  ? "border-destructive bg-destructive text-destructive-foreground"
                  : done
                    ? "border-turquoise bg-turquoise text-turquoise-foreground"
                    : "border-border bg-card text-muted-foreground",
                current && !isCancelStep && "ring-4 ring-turquoise/25",
              )}
            >
              {isCancelStep ? <CircleX className="size-4" /> : done ? <Check className="size-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={cn("font-semibold", done ? "text-foreground" : "text-muted-foreground")}>
                {STATUS_META[s].label}
                {current && <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-[11px] font-bold text-gold-foreground">Current</span>}
              </p>
              <p className="text-sm text-muted-foreground">{entry?.note || STATUS_META[s].description}</p>
              {entry && <p className="mt-0.5 text-xs font-medium text-turquoise">{formatDateTime(entry.created_at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
