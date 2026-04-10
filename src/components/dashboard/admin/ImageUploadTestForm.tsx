"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ImageUploadTestForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [proxyPath, setProxyPath] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onPick = () => inputRef.current?.click();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setPreviewUrl(null);
    setLastUrl(null);
    setProxyPath(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body: fd });
      const data = (await res.json()) as {
        success?: boolean;
        url?: string;
        proxyPath?: string;
        message?: string;
      };
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.message ?? "Upload failed");
      }
      setLastUrl(data.url);
      setProxyPath(data.proxyPath ?? null);
      setPreviewUrl(data.proxyPath ?? data.url);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Image upload test
        </CardTitle>
        <CardDescription>
          Preview uses the app proxy path (same R2 object as upload). The public URL is what you can
          store when it matches your bucket.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onChange}
        />
        <Button type="button" onClick={onPick} disabled={pending}>
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Choose image
        </Button>
        {lastUrl ? (
          <div className="space-y-1 text-xs break-all text-muted-foreground font-mono">
            <p>
              <span className="text-foreground/80">url</span> {lastUrl}
            </p>
            {proxyPath && proxyPath !== lastUrl ? (
              <p>
                <span className="text-foreground/80">proxyPath</span> {proxyPath}
              </p>
            ) : null}
          </div>
        ) : null}
        {previewUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
            <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            No preview yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
