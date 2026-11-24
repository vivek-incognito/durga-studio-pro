import { createOrderUploadUrl } from "./uploads.functions";
import type { UploadKind } from "./format";

export type UploadedFile = {
  path: string;
  name: string;
  size: number;
  mime: string;
  label: string;
};

// Local previews live only in this browser tab; they are never uploaded anywhere else.
const previews = new Map<string, string>();
export function setPreview(path: string, url: string) {
  previews.set(path, url);
}
export function getPreview(path: string): string | undefined {
  return previews.get(path);
}

export async function uploadOrderFile(
  kind: UploadKind,
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal,
): Promise<string> {
  const { path, token } = await createOrderUploadUrl({
    data: { kind, name: file.name, type: file.type, size: file.size },
  });
  const base = (import.meta.env.VITE_SUPABASE_URL as string).replace(/\/+$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  const url = `${base}/storage/v1/object/upload/sign/order-uploads/${path}?token=${encodeURIComponent(token)}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status}). Please try again.`));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading. Please try again."));
    xhr.onabort = () => reject(new Error("Upload cancelled"));
    signal?.addEventListener("abort", () => xhr.abort());
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", file);
    xhr.send(body);
  });
  return path;
}
