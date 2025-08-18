"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageThumbnailUrl } from "@/lib/pocketbase/files";
import { Image as ImageIcon, Plus, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { PropertyFormData } from "../property-form-schema";

interface ImagesUploadSectionProps {
  control: Control<PropertyFormData>;
  existingProperty?: {
    id: string;
    collectionId: string;
    collectionName: string;
    images?: string[];
  };
}

// Type for images field - can be File[] for new uploads or string[] for existing
type ImageItem = File | string;

export function ImagesUploadSection({ control, existingProperty }: ImagesUploadSectionProps) {
  const { append, remove } = useFieldArray({
    control,
    name: "images" as any, // Cast to any since PropertyFormData type might not have images defined yet
  });

  const { images } = useWatch({ control });
  const fields: ImageItem[] = images || [];

 


  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported image format`);
        continue;
      }

      if (file.size > maxFileSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      validFiles.forEach((file) => append(file as any));
      toast.success(`${validFiles.length} image(s) added`);
    }
  };

  const handleRemoveImage = (index: number) => {
    remove(index);
    // Adjust featured image index if needed
    if (featuredImageIndex === index) {
      setFeaturedImageIndex(0);
    } else if (featuredImageIndex > index) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
    toast.success("Image removed");
  };

  const handleSetFeatured = (index: number) => {
    setFeaturedImageIndex(index);
    toast.success("Featured image updated");
  };

  const getImagePreview = (item: ImageItem, index: number): string => {
    if (!item) return "/apple-icon.png";
    if (item instanceof File) {
      return URL.createObjectURL(item);
    }

    if (typeof item === "string") {
      // For existing images, use PocketBase helper
      if (existingProperty) {
        return getImageThumbnailUrl(existingProperty, item, "400x300");
      }
    }

    return "/apple-icon.png";
  };

  const getImageName = (item: ImageItem): string => {
    if (!item) return "Unknown file";

    if (item instanceof File) {
      return item.name;
    }

    if (typeof item === "string") {
      return item; // filename string
    }

    return "Unknown file";
  };

  const getImageSize = (item: ImageItem): string => {
    if (!item) return "—";

    if (item instanceof File) {
      return `${(item.size / 1024 / 1024).toFixed(2)} MB`;
    }

    return "—"; // Unknown size for existing files
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Property Images
          {fields?.length > 0 && (
            <Badge variant="secondary">
              {fields?.length} image{fields?.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Upload high-quality images of your property. The first image will be used as the featured
          image.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Upload Section */}
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
            onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Click to upload images</p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF up to 5MB each</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Images
          </Button>
        </div>

        {/* Image Gallery */}
        {fields?.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Selected Images</h4>
              <div className="text-xs text-muted-foreground">
                Click the star to set as featured image
              </div>
            </div>

            {/* Debug info - remove this later */}
            {process.env.NODE_ENV === "development" && (
              <pre className="text-xs  p-2 rounded">{JSON.stringify(
                fields.map((field) => {
                  if (typeof field === "string") {
                    return { name: field, type: "string" };
                  }
                  return { name: field.name, type: "file" };
                }), null, 2)}</pre>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field, index) => {
                // Safely extract the actual value from the field
                const imageItem = field;

                if (typeof imageItem === "string") {
                  return;
                }
                return (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                      index === featuredImageIndex ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}>
                    {/* Image */}
                    <div className="aspect-video relative bg-muted">
                      <Image
                        src={getImagePreview(imageItem, index)}
                        alt={getImageName(imageItem)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/apple-icon.png";
                        }}
                      />

                      {/* Featured Badge */}
                      {index === featuredImageIndex && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Image Info */}
                    <div className="p-3 space-y-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate">{getImageName(imageItem)}</p>
                        <p className="text-xs text-muted-foreground">{getImageSize(imageItem)}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleSetFeatured(index)}
                          disabled={index === featuredImageIndex}>
                          <Star className="h-3 w-3" />
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 hover:bg-destructive hover:text-destructive-foreground ml-auto"
                          onClick={() => handleRemoveImage(index)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload Tips */}
        {fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No images uploaded yet</p>
            <p className="text-xs mt-1">Upload at least one image to showcase your property</p>
          </div>
        )}

        {/* Tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            💡 <strong>Tips:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Upload high-resolution images (at least 1200px wide) for best results</li>
            <li>The first image will be used as the main property photo</li>
            <li>Supported formats: JPEG, PNG, WebP, GIF</li>
            <li>Maximum file size: 5MB per image</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
