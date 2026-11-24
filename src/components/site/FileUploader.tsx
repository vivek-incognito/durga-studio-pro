import { useEffect, useRef, useState } from "react";
import { FileText, ImageUp, Loader2, RefreshCw, Trash2, TriangleAlert, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatBytes, type UploadKind } from "@/lib/format";
import { getUploadRule, validateUpload } from "@/lib/upload-rules";
import { getPreview, setPreview, uploadOrderFile, type UploadedFile } from "@/lib/upload-client";

type Pending = { id: string; name: string; size: number; progress: number; error?: string | undefined; replaces?: string | undefined };

export function FileUploader({
  kind,
  files,
  onChange,
  required,
  onBusyChange,
}: {
  kind: UploadKind;
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  required?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const rule = getUploadRule(kind);
  const filesRef = useRef(files);
  filesRef.current = files;
  const [pending, setPending] = useState<Pending[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const replaceTarget = useRef<string | null>(null);

  const busy = pending.some((p) => !p.error);
  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  if (!rule) return null;

  async function startUpload(file: File, replaces?: string) {
    const id = crypto.randomUUID();
    setPending((p) => [...p, { id, name: file.name, size: file.size, progress: 0, replaces }]);
    try {
      const path = await uploadOrderFile(kind, file, (pct) =>
        setPending((p) => p.map((x) => (x.id === id ? { ...x, progress: pct } : x))),
      );
      if (file.type.startsWith("image/")) setPreview(path, URL.createObjectURL(file));
      const uploaded: UploadedFile = {
        path,
        name: file.name,
        size: file.size,
        mime: file.type,
        label: rule!.labels[0] ?? "",
      };
      const current = filesRef.current;
      if (replaces) {
        const old = current.find((f) => f.path === replaces);
        onChange(current.map((f) => (f.path === replaces ? { ...uploaded, label: old?.label ?? uploaded.label } : f)));
      } else {
        onChange([...current, uploaded]);
      }
      setPending((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload failed";
      setPending((p) => p.map((x) => (x.id === id ? { ...x, error: message } : x)));
    }
  }

  function handleFiles(list: FileList | null, replaces?: string) {
    if (!list || !rule) return;
    const errs: string[] = [];
    const incoming = Array.from(list);
    const room = replaces ? 1 : rule.maxFiles - filesRef.current.length - pending.filter((p) => !p.error).length;
    if (!replaces && incoming.length > room) {
      errs.push(`You can upload up to ${rule.maxFiles} file${rule.maxFiles > 1 ? "s" : ""} for this item.`);
    }
    incoming.slice(0, Math.max(0, room)).forEach((file) => {
      const problem = validateUpload(kind, file);
      if (problem) errs.push(problem);
      else void startUpload(file, replaces);
    });
    setErrors(errs);
  }

  const canAdd = files.length + pending.filter((p) => !p.error).length < rule.maxFiles;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-foreground">
          {rule.title}
          {required ? <span className="ml-1 text-destructive">*</span> : <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>}
        </p>
        <p className="text-xs text-muted-foreground">{rule.help}</p>
      </div>

      {canAdd && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
            dragOver ? "border-turquoise bg-turquoise-soft" : "border-input bg-muted/40 hover:border-turquoise hover:bg-turquoise-soft/60",
          )}
        >
          <ImageUp className="size-7 text-turquoise" aria-hidden />
          <span className="text-sm font-semibold text-foreground">Click to choose files or drag them here</span>
          <span className="text-xs text-muted-foreground">{rule.extensions.join(", ").toUpperCase()}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={[...rule.accept, ...rule.extensions].join(",")}
        multiple={rule.maxFiles > 1}
        aria-label={rule.title}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={replaceRef}
        type="file"
        className="hidden"
        accept={[...rule.accept, ...rule.extensions].join(",")}
        aria-label="Replace file"
        onChange={(e) => {
          handleFiles(e.target.files, replaceTarget.current ?? undefined);
          replaceTarget.current = null;
          e.target.value = "";
        }}
      />

      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
          {errors.map((e) => (
            <p key={e} className="flex items-start gap-1.5">
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden /> {e}
            </p>
          ))}
        </div>
      )}

      {(files.length > 0 || pending.length > 0) && (
        <ul className="space-y-2">
          {files.map((f) => {
            const preview = getPreview(f.path);
            const isReplacing = pending.some((p) => p.replaces === f.path && !p.error);
            return (
              <li key={f.path} className="flex items-center gap-3 rounded-lg border bg-card p-2.5">
                <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {preview ? (
                    <img src={preview} alt={`Preview of ${f.name}`} className="size-full object-cover" />
                  ) : (
                    <FileText className="size-6 text-muted-foreground" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(f.size)} · Uploaded
                  </p>
                  {rule.labels.length > 1 && (
                    <select
                      value={f.label}
                      onChange={(e) =>
                        onChange(filesRef.current.map((x) => (x.path === f.path ? { ...x, label: e.target.value } : x)))
                      }
                      className="mt-1 rounded-md border bg-background px-2 py-0.5 text-xs"
                      aria-label={`File type for ${f.name}`}
                    >
                      {rule.labels.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={isReplacing}
                    onClick={() => {
                      replaceTarget.current = f.path;
                      replaceRef.current?.click();
                    }}
                    aria-label={`Replace ${f.name}`}
                  >
                    {isReplacing ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                    <span className="hidden sm:inline">Replace</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onChange(filesRef.current.filter((x) => x.path !== f.path))}
                    aria-label={`Remove ${f.name}`}
                  >
                    <Trash2 />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                </div>
              </li>
            );
          })}
          {pending.map((p) => (
            <li key={p.id} className="rounded-lg border bg-card p-2.5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  {p.error ? (
                    <TriangleAlert className="size-5 text-destructive" aria-hidden />
                  ) : (
                    <Upload className="size-5 text-turquoise" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {p.replaces ? "Replacing with " : ""}
                    {p.name}
                  </p>
                  {p.error ? (
                    <p className="text-xs text-destructive">{p.error}</p>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={p.progress} className="h-1.5" />
                      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{p.progress}%</span>
                    </div>
                  )}
                </div>
                {p.error && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setPending((list) => list.filter((x) => x.id !== p.id))}
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-muted-foreground">
        Files are stored privately and are only visible to Durga Studio staff.
      </p>
    </div>
  );
}
