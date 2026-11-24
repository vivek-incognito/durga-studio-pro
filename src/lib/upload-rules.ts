import type { UploadKind } from "./format";

export type UploadRule = {
  title: string;
  help: string;
  accept: string[]; // mime types
  extensions: string[];
  maxBytes: number;
  maxFiles: number;
  labels: string[];
};

const MB = 1024 * 1024;
const IMAGES = ["image/jpeg", "image/png"];
const IMAGES_PDF = [...IMAGES, "application/pdf"];

export const UPLOAD_RULES: Record<Exclude<UploadKind, "none">, UploadRule> = {
  passport: {
    title: "Upload your passport photograph",
    help: "A clear, front-facing photo on a plain light background. JPG or PNG, up to 10 MB.",
    accept: IMAGES,
    extensions: [".jpg", ".jpeg", ".png"],
    maxBytes: 10 * MB,
    maxFiles: 2,
    labels: ["Passport photo"],
  },
  frame: {
    title: "Upload the photo to print and frame",
    help: "Use the highest resolution you have. JPG or PNG, up to 25 MB each.",
    accept: IMAGES,
    extensions: [".jpg", ".jpeg", ".png"],
    maxBytes: 25 * MB,
    maxFiles: 6,
    labels: ["Photo to frame"],
  },
  banner: {
    title: "Upload banner designs, logos or reference photos",
    help: "JPG, PNG or PDF, up to 25 MB each. Up to 8 files.",
    accept: IMAGES_PDF,
    extensions: [".jpg", ".jpeg", ".png", ".pdf"],
    maxBytes: 25 * MB,
    maxFiles: 8,
    labels: ["Banner design", "Logo", "Reference photo"],
  },
  event: {
    title: "Upload reference photos or event requirements",
    help: "JPG, PNG or PDF, up to 15 MB each. Up to 8 files.",
    accept: IMAGES_PDF,
    extensions: [".jpg", ".jpeg", ".png", ".pdf"],
    maxBytes: 15 * MB,
    maxFiles: 8,
    labels: ["Reference photo", "Event requirements"],
  },
};

export function getUploadRule(kind: UploadKind): UploadRule | null {
  return kind === "none" ? null : UPLOAD_RULES[kind];
}

/** Returns an error message, or null when the file is acceptable for this upload kind. */
export function validateUpload(
  kind: UploadKind,
  file: { name: string; type: string; size: number },
): string | null {
  const rule = getUploadRule(kind);
  if (!rule) return "This product does not accept uploads.";
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!rule.accept.includes(file.type) || !rule.extensions.includes(ext)) {
    return `${file.name}: unsupported file type. Allowed: ${rule.extensions.join(", ").toUpperCase()}.`;
  }
  if (file.size <= 0) return `${file.name}: the file is empty.`;
  if (file.size > rule.maxBytes) {
    return `${file.name}: file is larger than ${Math.round(rule.maxBytes / (1024 * 1024))} MB.`;
  }
  return null;
}

export function safeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFKD")
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const ext = dot > 0 ? name.slice(dot).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
  return `${base || "file"}${ext}`;
}
