"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePropertyById } from "@/data-access-layer/actions/revalidate-actions";
import { preparePropertyFormForApi } from "@/lib/property/prepare-property-for-api";
import { propertyImageNeedsUnoptimized } from "@/lib/property/property-image-unoptimized";
import { resolvePropertyThumbnailUrl } from "@/lib/property/resolve-thumbnail-url";
import type { PropertiesResponse } from "@/types/domain-types";
import {
  Image as ImageIcon,
  Loader2,
  Plus,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { PropertyFormData } from "../property-form-schema";

const PLACEHOLDER_PROPERTY = {} as PropertiesResponse;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/media", { method: "POST", body: fd });
  const json = (await res.json()) as {
    success?: boolean;
    url?: string;
    proxyPath?: string;
    message?: string;
  };
  const stored = json.proxyPath ?? json.url;
  if (!res.ok || !json.success || !stored) {
    throw new Error(json.message ?? "Upload failed");
  }
  return stored;
}

function getDisplayName(item: string): string {
  if (!item) return "Unknown";
  const segments = item.split("/");
  const last = segments[segments.length - 1];
  return decodeURIComponent(last);
}

function getPreviewUrl(item: string): string {
  if (!item) return "/apple-icon.png";
  return resolvePropertyThumbnailUrl(PLACEHOLDER_PROPERTY, item);
}

interface ImagesUploadSectionProps {
  propertyId?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImagesUploadSection({ propertyId, onUploadingChange }: ImagesUploadSectionProps) {
  const { control, setValue, getValues } = useFormContext<PropertyFormData>();
  const images = (useWatch({ control, name: "images" }) ?? []) as (string | File)[];
  const featuredImageIndex = useWatch({ control, name: "featured_image_index" }) ?? 0;
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urlImages = images.filter((i): i is string => typeof i === "string");

  const setImages = useCallback(
    (next: string[]) => {
      setValue("images", next as (string | File)[], { shouldDirty: true });
    },
    [setValue],
  );

  const persistImagesToProperty = useCallback(async () => {
    if (!propertyId) return;
    const prepared = preparePropertyFormForApi(getValues());
    const res = await fetch(`/api/properties/${propertyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        images: prepared.images ?? [],
        image_url: prepared.image_url ?? "",
      }),
    });
    const json = (await res.json()) as { success?: boolean; message?: string };
    if (!res.ok || !json.success) {
      throw new Error(json.message ?? "Failed to save images");
    }
    await revalidatePropertyById(propertyId);
  }, [propertyId, getValues]);

  const handleFileSelect = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList) return;

      const validFiles: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i];
        if (!ALLOWED_TYPES.includes(f.type)) {
          toast.error(`${f.name}: unsupported format`);
          continue;
        }
        if (f.size > MAX_FILE_SIZE) {
          toast.error(`${f.name}: too large (max 5 MB)`);
          continue;
        }
        validFiles.push(f);
      }

      if (validFiles.length === 0) return;

      setUploadingCount((c) => c + validFiles.length);

      const results = await Promise.allSettled(
        validFiles.map(async (f) => {
          const url = await uploadFile(f);
          return url;
        }),
      );

      setUploadingCount((c) => c - validFiles.length);

      const newUrls: string[] = [];
      let failCount = 0;
      for (const r of results) {
        if (r.status === "fulfilled") {
          newUrls.push(r.value);
        } else {
          failCount++;
        }
      }

      if (newUrls.length > 0) {
        const current = (getValues("images") ?? []).filter(
          (i): i is string => typeof i === "string",
        );
        setImages([...current, ...newUrls]);
        toast.success(`${newUrls.length} image(s) uploaded`);
        if (propertyId) {
          try {
            await persistImagesToProperty();
          } catch {
            toast.error("Images uploaded but not saved to the listing. Click Update Property.");
          }
        }
      }
      if (failCount > 0) {
        toast.error(`${failCount} image(s) failed to upload`);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [getValues, persistImagesToProperty, propertyId, setImages],
  );

  const handleRemove = async (index: number) => {
    const next = [...urlImages];
    next.splice(index, 1);
    setImages(next);
    if (featuredImageIndex === index) {
      setValue("featured_image_index", 0);
    } else if (featuredImageIndex > index) {
      setValue("featured_image_index", featuredImageIndex - 1);
    }
    if (propertyId) {
      try {
        await persistImagesToProperty();
      } catch {
        toast.error("Could not remove image from the listing. Click Update Property.");
      }
    }
  };

  const handleSetFeatured = async (index: number) => {
    setValue("featured_image_index", index);
    toast.success("Featured image updated");
    if (propertyId) {
      try {
        await persistImagesToProperty();
      } catch {
        toast.error("Could not save featured image. Click Update Property.");
      }
    }
  };

  const isUploading = uploadingCount > 0;

  useEffect(() => {
    onUploadingChange?.(uploadingCount > 0);
  }, [uploadingCount, onUploadingChange]);

  useEffect(() => {
    return () => {
      onUploadingChange?.(false);
    };
  }, [onUploadingChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Property Images
          {urlImages.length > 0 && (
            <Badge variant="secondary">
              {urlImages.length} image{urlImages.length !== 1 ? "s" : ""}
            </Badge>
          )}
          {isUploading && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading {uploadingCount}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Upload high-quality images of your property. The starred image is used as the featured
          image. Images upload immediately.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Click to upload images</p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF up to 5MB each</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {isUploading ? `Uploading ${uploadingCount}...` : "Add Images"}
          </Button>
        </div>

        {urlImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Uploaded Images</h4>
              <div className="text-xs text-muted-foreground">
                Click the star to set as featured image
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {urlImages.map((url, index) => (
                <div
                  key={`img-${index}-${url.slice(-32)}`}
                  className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                    index === featuredImageIndex ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                >
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={getPreviewUrl(url)}
                      alt={getDisplayName(url)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={propertyImageNeedsUnoptimized(getPreviewUrl(url))}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/apple-icon.png";
                      }}
                    />
                    {index === featuredImageIndex && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-3 space-y-2">
                    <p className="text-sm font-medium truncate">{getDisplayName(url)}</p>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => handleSetFeatured(index)}
                        disabled={index === featuredImageIndex}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 hover:bg-destructive hover:text-destructive-foreground ml-auto"
                        onClick={() => handleRemove(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {urlImages.length === 0 && !isUploading && (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No images uploaded yet</p>
            <p className="text-xs mt-1">Upload at least one image to showcase your property</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            💡 <strong>Tips:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Upload high-resolution images (at least 1200px wide) for best results</li>
            <li>The starred image is used as the main property photo</li>
            <li>Supported formats: JPEG, PNG, WebP, GIF</li>
            <li>Maximum file size: 5MB per image</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
