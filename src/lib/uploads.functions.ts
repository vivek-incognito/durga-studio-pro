import { createServerFn } from "@tanstack/react-start";
import { safeFileName, validateUpload } from "./upload-rules";
import type { UploadKind } from "./format";

const KINDS: UploadKind[] = ["passport", "frame", "banner", "event"];

/**
 * Issues a one-time signed upload slot in the private order-uploads bucket.
 * Customers can write a file there but can never list or read stored files.
 */
export const createOrderUploadUrl = createServerFn({ method: "POST" })
  .inputValidator((input: { kind: UploadKind; name: string; type: string; size: number }) => {
    if (!KINDS.includes(input.kind)) throw new Error("Invalid upload type");
    return {
      kind: input.kind,
      name: String(input.name).slice(0, 200),
      type: String(input.type).slice(0, 100),
      size: Number(input.size),
    };
  })
  .handler(async ({ data }) => {
    const problem = validateUpload(data.kind, data);
    if (problem) throw new Error(problem);
    const path = `pending/${crypto.randomUUID()}/${safeFileName(data.name)}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("order-uploads")
      .createSignedUploadUrl(path);
    if (error || !signed) throw new Error("Could not prepare the upload. Please try again.");
    return { path: signed.path, token: signed.token };
  });
