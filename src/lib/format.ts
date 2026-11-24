import type { Database } from "@/integrations/supabase/types";

export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type ProductCategory = Database["public"]["Enums"]["product_category"];
export type GalleryCategory = Database["public"]["Enums"]["gallery_category"];
export type UploadKind = Database["public"]["Enums"]["upload_kind"];

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(value: number | string | null | undefined): string {
  const n = typeof value === "string" ? Number(value) : (value ?? 0);
  return inrFormatter.format(Number.isFinite(n) ? n : 0);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Customer-facing progression; cancelled is shown separately. */
export const ORDER_FLOW: OrderStatus[] = [
  "received",
  "pending_confirmation",
  "confirmed",
  "in_production",
  "ready_for_pickup",
  "completed",
];

export const ALL_STATUSES: OrderStatus[] = [...ORDER_FLOW, "cancelled"];

export const STATUS_META: Record<OrderStatus, { label: string; description: string }> = {
  received: { label: "Order Received", description: "We have received your order and uploaded files." },
  pending_confirmation: {
    label: "Pending Confirmation",
    description: "Our team is reviewing your order and will confirm details with you shortly.",
  },
  confirmed: { label: "Confirmed", description: "Your order is confirmed and scheduled for production." },
  in_production: { label: "In Production", description: "Your prints, frames or designs are being prepared." },
  ready_for_pickup: {
    label: "Ready for Pickup",
    description: "Your order is ready. Please collect it from your selected branch.",
  },
  completed: { label: "Completed", description: "Your order has been delivered. Thank you for choosing Durga Studio." },
  cancelled: { label: "Cancelled", description: "This order has been cancelled. Contact the studio for help." },
};

export const PRODUCT_CATEGORY_META: Record<ProductCategory, { label: string; description: string }> = {
  passport: { label: "Passport Photos", description: "Passport, visa and ID photos printed to specification." },
  frames: { label: "Photo Frames", description: "Your favourite photographs printed and framed." },
  banners: { label: "Custom Banners", description: "Flex banners, birthday banners and shop signage." },
  events: { label: "Function Photography", description: "Weddings, birthdays, engagements, video and albums." },
};

export const PRODUCT_CATEGORIES: ProductCategory[] = ["passport", "frames", "banners", "events"];

export const GALLERY_CATEGORY_META: Record<GalleryCategory, string> = {
  passport: "Passport Photography",
  frames: "Photo Frames",
  banners: "Custom Banners",
  wedding: "Wedding Photography",
  birthday: "Birthday Functions",
  engagement: "Engagement Photography",
  videography: "Event Videography",
  albums: "Album Designs",
};

export const GALLERY_CATEGORIES = Object.keys(GALLERY_CATEGORY_META) as GalleryCategory[];

export function priceLabel(price: number | string, unit: string, isStarting: boolean): string {
  return `${isStarting ? "From " : ""}${formatINR(price)}${unit ? ` ${unit}` : ""}`;
}
