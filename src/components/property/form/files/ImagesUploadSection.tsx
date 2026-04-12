"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
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

function computeBulkRemoval(
  urlImages: string[],
  featuredImageIndex: number,
  removeUrls: Set<string>,
): { nextImages: string[]; nextFeatured: number } {
  const nextImages = urlImages.filter((u) => !removeUrls.has(u));
  const featuredUrl = urlImages[featuredImageIndex];
  let nextFeatured = 0;
  if (nextImages.length > 0) {
    if (featuredUrl && !removeUrls.has(featuredUrl)) {
      const idx = nextImages.indexOf(featuredUrl);
      nextFeatured = idx >= 0 ? idx : 0;
    } else {
      nextFeatured = 0;
    }
  }
  return { nextImages, nextFeatured };
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
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(() => new Set());
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

  useEffect(() => {
    const allowed = new Set(urlImages);
    setSelectedUrls((prev) => {
      for (const u of prev) {
        if (!allowed.has(u)) {
          const next = new Set<string>();
          for (const x of prev) {
            if (allowed.has(x)) next.add(x);
          }
          return next;
        }
      }
      return prev;
    });
  }, [urlImages]);

  const toggleUrlSelected = useCallback((url: string) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }, []);

  const allUrlsSelected =
    urlImages.length > 0 && urlImages.every((u) => selectedUrls.has(u));

  const toggleSelectAll = useCallback(() => {
    if (allUrlsSelected) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(urlImages));
    }
  }, [allUrlsSelected, urlImages]);

  const handleBulkRemove = () => {
    if (selectedUrls.size === 0) return;
    startDeleteTransition(async () => {
      const toRemove = [...selectedUrls];
      const removeSet = new Set(toRemove);
      const prevImages = [...urlImages];
      const prevFeatured = featuredImageIndex;
      const { nextImages, nextFeatured } = computeBulkRemoval(
        urlImages,
        featuredImageIndex,
        removeSet,
      );
      setImages(nextImages);
      setValue("featured_image_index", nextFeatured);
      setSelectedUrls(new Set());
      try {
        if (isExisting) {
          try {
            await persistImagesToProperty();
          } catch {
            toast.error("Could not update the listing. Click Update Property.");
            setImages(prevImages);
            setValue("featured_image_index", prevFeatured);
            setSelectedUrls(removeSet);
            return;
          }
        }
        const results = await Promise.allSettled(
          toRemove.map((path) => deletePropertyImage(propertyId, path)),
        );
        const failed: string[] = [];
        for (let i = 0; i < results.length; i++) {
          const r = results[i];
          const path = toRemove[i];
          if (r.status === "rejected") {
            failed.push(path);
          } else if (!r.value.success) {
            failed.push(r.value.message);
          }
        }
        if (failed.length > 0) {
          toast.error(
            failed.length === results.length
              ? "Could not remove selected images from storage"
              : `Some images could not be removed from storage (${failed.length} failed)`,
          );
          if (!isExisting) {
            setImages(prevImages);
            setValue("featured_image_index", prevFeatured);
            setSelectedUrls(removeSet);
          }
        } else {
          toast.success(`Removed ${toRemove.length} image(s)`);
        }
      } catch {
        toast.error("Delete failed");
        if (!isExisting) {
          setImages(prevImages);
          setValue("featured_image_index", prevFeatured);
          setSelectedUrls(removeSet);
        }
      }
    });
  };

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

  const handleRemove = (index: number) => {
    const removed = urlImages[index];
    if (!removed) return;
    setDeletingIndex(index);
    startDeleteTransition(async () => {
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
      } catch {
        toast.error("Delete failed");
        if (!isExisting) {
          setImages(prevImages);
          setValue("featured_image_index", prevFeatured);
        }
      } finally {
        setDeletingIndex(null);
      }
    });
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
  const isBusy = isUploading || isDeletePending;
  const selectedCount = selectedUrls.size;

  useEffect(() => {
    onUploadingChange?.(uploadingCount > 0 || isDeletePending);
  }, [uploadingCount, isDeletePending, onUploadingChange]);

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
          {isDeletePending && (
            <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
              <Loader2 className="h-3 w-3 animate-spin" />
              Deleting…
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
            className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors hover:border-muted-foreground/50 ${isBusy ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
            onClick={() => !isBusy && fileInputRef.current?.click()}
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
            disabled={isBusy}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="text-sm font-medium">Uploaded Images</h4>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={toggleSelectAll}
                  disabled={isBusy}
                >
                  {allUrlsSelected ? "Clear selection" : "Select all"}
                </Button>
                {selectedCount > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={handleBulkRemove}
                    disabled={isBusy}
                  >
                    {isDeletePending ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Delete selected ({selectedCount})
                  </Button>
                )}
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  Star sets featured
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {urlImages.map((url, index) => (
                <div
                  key={`img-${index}-${url.slice(-32)}`}
                  className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                    index === featuredImageIndex ? "ring-2 ring-primary ring-offset-2" : ""
                  } ${deletingIndex === index ? "opacity-70 pointer-events-none" : ""}`}
                >
                  <div className="aspect-video relative bg-muted">
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-background/90 p-1 shadow-sm border border-border/50">
                      <Checkbox
                        checked={selectedUrls.has(url)}
                        onCheckedChange={() => toggleUrlSelected(url)}
                        disabled={isBusy}
                        aria-label={`Select ${getDisplayName(url)} for bulk delete`}
                      />
                    </div>
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
                        disabled={index === featuredImageIndex || isBusy}
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 hover:bg-destructive hover:text-destructive-foreground ml-auto"
                        onClick={() => handleRemove(index)}
                        disabled={isDeletePending}
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

        {urlImages.length === 0 && !isUploading && !isDeletePending && (
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
