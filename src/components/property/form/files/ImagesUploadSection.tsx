"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePropertyImage, uploadPropertyImage } from "@/data-access-layer/actions/media-actions";
import { updatePropertyImages } from "@/data-access-layer/actions/property-actions";
import { revalidatePropertyById } from "@/data-access-layer/actions/revalidate-actions";
import { storedPathToPublicUrl } from "@/data-access-layer/media/image-url";
import { propertyImageNeedsUnoptimized } from "@/lib/property/property-image-unoptimized";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

async function uploadFile(file: File, propertyId: string): Promise<string> {
  const fd = new FormData();
  fd.append("propertyId", propertyId);
  fd.append("file", file);
  const result = await uploadPropertyImage(fd);
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.url;
}

function getDisplayName(item: string): string {
  if (!item) return "Unknown";
  const segments = item.split("/");
  const last = segments[segments.length - 1];
  return decodeURIComponent(last);
}

function getPreviewUrl(item: string): string {
  if (!item) return "/apple-icon.png";
  return storedPathToPublicUrl(item) || "/apple-icon.png";
}

interface ImagesUploadSectionProps {
  propertyId: string;
  isExisting?: boolean;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImagesUploadSection({ propertyId, isExisting = false, onUploadingChange }: ImagesUploadSectionProps) {
  const { control, setValue, getValues } = useFormContext<PropertyFormData>();
  const images = (useWatch({ control, name: "images" }) ?? []) as (string | File)[];
  const featuredImageIndex = useWatch({ control, name: "featured_image_index" }) ?? 0;
  const [uploadingCount, setUploadingCount] = useState(0);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urlImages = images.filter((i): i is string => typeof i === "string");

  const setImages = useCallback(
    (next: string[]) => {
      setValue("images", next as (string | File)[], { shouldDirty: true });
    },
    [setValue],
  );

  const persistImagesToProperty = useCallback(async () => {
    if (!isExisting) return;
    const currentImages = (getValues("images") ?? []).filter(
      (i): i is string => typeof i === "string",
    );
    const featuredIdx = Math.min(
      Math.max(0, getValues("featured_image_index") ?? 0),
      Math.max(0, currentImages.length - 1),
    );
    const imageUrl = currentImages[featuredIdx] ?? "";
    const result = await updatePropertyImages(propertyId, currentImages, imageUrl);
    if (!result.success) {
      throw new Error(result.message);
    }
    await revalidatePropertyById(propertyId);
  }, [isExisting, propertyId, getValues]);

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
          const url = await uploadFile(f, propertyId);
          return url;
        }),
      );

      setUploadingCount((c) => c - validFiles.length);

      const newUrls: string[] = [];
      const errors: string[] = [];
      for (let idx = 0; idx < results.length; idx++) {
        const r = results[idx];
        if (r.status === "fulfilled") {
          newUrls.push(r.value);
        } else {
          const msg = r.reason instanceof Error ? r.reason.message : "Upload failed";
          errors.push(`${validFiles[idx].name}: ${msg}`);
        }
      }

      if (newUrls.length > 0) {
        const current = (getValues("images") ?? []).filter(
          (i): i is string => typeof i === "string",
        );
        setImages([...current, ...newUrls]);
        toast.success(`${newUrls.length} image(s) uploaded`);
        if (isExisting) {
          try {
            await persistImagesToProperty();
          } catch {
            toast.error("Images uploaded but not saved to the listing. Click Update Property.");
          }
        }
      }
      for (const err of errors) {
        toast.error(err);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [getValues, persistImagesToProperty, propertyId, setImages, isExisting],
  );

  const handleRemove = async (index: number) => {
    const removed = urlImages[index];
    if (!removed) return;
    setDeletingIndex(index);
    const prevImages = [...urlImages];
    const prevFeatured = featuredImageIndex;
    const next = [...urlImages];
    next.splice(index, 1);
    setImages(next);
    if (featuredImageIndex === index) {
      setValue("featured_image_index", 0);
    } else if (featuredImageIndex > index) {
      setValue("featured_image_index", featuredImageIndex - 1);
    }
    try {
      if (isExisting) {
        try {
          await persistImagesToProperty();
        } catch {
          toast.error("Could not remove image from the listing. Click Update Property.");
          setImages(prevImages);
          setValue("featured_image_index", prevFeatured);
          return;
        }
      }
      const del = await deletePropertyImage(propertyId, removed);
      if (!del.success) {
        toast.error(del.message);
        if (!isExisting) {
          setImages(prevImages);
          setValue("featured_image_index", prevFeatured);
        }
      }
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleSetFeatured = async (index: number) => {
    setValue("featured_image_index", index);
    toast.success("Featured image updated");
    if (isExisting) {
      try {
        await persistImagesToProperty();
      } catch {
        toast.error("Could not save featured image. Click Update Property.");
      }
    }
  };

  const isUploading = uploadingCount > 0;
  const isBusy = isUploading || deletingIndex !== null;

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
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors hover:border-muted-foreground/50 cursor-pointer"
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
                        disabled={deletingIndex !== null}
                      >
                        {deletingIndex === index ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
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
