import { createServerFn } from "@tanstack/react-start";
import { createPublicServerClient } from "./supabase-public";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = createPublicServerClient();
  const { data, error } = await sb
    .from("products")
    .select("id, slug, name, category, short_description, description, price, price_unit, price_is_starting, image_url, upload_kind, upload_required, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug).slice(0, 120) }))
  .handler(async ({ data }) => {
    const sb = createPublicServerClient();
    const { data: product, error } = await sb
      .from("products")
      .select("id, slug, name, category, short_description, description, price, price_unit, price_is_starting, image_url, upload_kind, upload_required, sort_order")
      .eq("is_active", true)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return product;
  });

export const listBranches = createServerFn({ method: "GET" }).handler(async () => {
  const sb = createPublicServerClient();
  const { data, error } = await sb
    .from("branches")
    .select("id, name, address, city, phone, whatsapp, whatsapp_alt, email, maps_url, hours, is_main, sort_order")
    .eq("is_active", true)
    .order("is_main", { ascending: false })
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data;
});

export const listGallery = createServerFn({ method: "GET" }).handler(async () => {
  const sb = createPublicServerClient();
  const { data, error } = await sb
    .from("gallery_images")
    .select("id, category, title, description, image_url, storage_path, is_sample, sort_order, created_at")
    .order("is_sample")
    .order("sort_order")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const paths = data.filter((g) => g.storage_path).map((g) => g.storage_path as string);
  const signed = new Map<string, string>();
  if (paths.length) {
    const { data: urls } = await sb.storage.from("gallery").createSignedUrls(paths, 60 * 60 * 24 * 7);
    const publicBase = String(import.meta.env["VITE_SUPABASE_URL"] ?? "");
    for (const u of urls ?? []) {
      if (u.path && u.signedUrl) {
        // Signed URLs are built from the server URL; rewrite to the browser-facing URL.
        const idx = u.signedUrl.indexOf("/storage/v1/");
        signed.set(u.path, idx >= 0 ? `${publicBase.replace(/\/+$/, "")}${u.signedUrl.slice(idx)}` : u.signedUrl);
      }
    }
  }
  return data.map((g) => ({
    id: g.id,
    category: g.category,
    title: g.title,
    description: g.description,
    is_sample: g.is_sample,
    url: g.storage_path ? (signed.get(g.storage_path) ?? "") : g.image_url,
  })).filter((g) => g.url);
});
