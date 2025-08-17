"use client";

import React, { useTransition } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { useUploadFiles } from "better-upload/client";
import { UploadDropzoneProgress } from "@/components/ui/upload-dropzone-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, MoveUp, MoveDown, Star } from "lucide-react";
import { useState } from "react";
import { PropertyFormData } from "../property-form-schema";
import { toast } from "sonner";
import Image from "next/image";
import { deleteObject } from "@/DAL/r2/delete-object-action";


interface ImagesUploadSectionProps {
  control: Control<PropertyFormData>;
  propertyTitle:string
}

export function ImagesUploadSection({ control,propertyTitle }: ImagesUploadSectionProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "images",

  });

  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);



  const uploadControl = useUploadFiles({
    route: "propertyImages",
  });
  // Watch for upload progress and completion
  const { progresses } = uploadControl;
  
  // Check if any uploads just completed
  React.useEffect(() => {
    const completedUploads = progresses.filter(p => p.progress === 1 && p.status !== 'failed');
    
    if (completedUploads.length > 0) {
      // Only add if not already added
      const existingKeys = fields.map(f => f.key);
      const newResults = completedUploads
        .filter(p => !existingKeys.includes(p.objectKey))
        .map(p => ({
          url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${p.objectKey}`,
          key: p.objectKey,
          name: p.name,
          size: p.size,
          type: p.type,
        }));
      
      if (newResults.length > 0) {
        newResults.forEach((image) => append(image));
        toast.success(`${newResults.length} image(s) uploaded successfully!`);
      }
    }
  }, [progresses, fields, append]);
  const [isPending, startTransition] = useTransition();


  const handleRemoveImage = (index: number, objectKey: string) => {
    remove(index);
    // Adjust featured image index if needed
    if (featuredImageIndex === index) {
      setFeaturedImageIndex(0);
    } else if (featuredImageIndex > index) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
    startTransition(async () => {
      const result = await deleteObject(objectKey);

      if (result.success) {
        toast.success(result.message);
        // Optionally trigger a refresh or update state
      } else {
        toast.error(result.message);
      }
    });
    toast.success("Image removed");
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
      // Update featured image index
      if (featuredImageIndex === index) {
        setFeaturedImageIndex(index - 1);
      } else if (featuredImageIndex === index - 1) {
        setFeaturedImageIndex(index);
      }
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
      // Update featured image index
      if (featuredImageIndex === index) {
        setFeaturedImageIndex(index + 1);
      } else if (featuredImageIndex === index + 1) {
        setFeaturedImageIndex(index);
      }
    }
  };

  const handleSetFeatured = (index: number) => {
    setFeaturedImageIndex(index);
    toast.success("Featured image updated");
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📸 Property Images
          {fields.length > 0 && (
            <Badge variant="secondary">
              {fields.length} image{fields.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Upload high-quality images of your property. The first image will be used as the featured
          image. Drag and drop to reorder images.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Dropzone */}
        <div className="space-y-2">
          <UploadDropzoneProgress
            control={uploadControl}
            accept="image/*"
            description={{
              maxFiles: 10,
              maxFileSize: "5MB",
              fileTypes: "JPEG, PNG, WebP, GIF",
            }}
            metadata={{
              propertytitle: propertyTitle?.replace(/\s+/g, '-').toLowerCase(), // Use property title as ID
              // You can add property ID here when editing existing property
              // propertyId: propertyId
            }}
          />
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Upload high-resolution images (at least 1200px wide) for best
            results. The first image will be used as the main property photo.
          </p>
        </div>

        {/* Image Gallery */}
        {fields.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Uploaded Images</h4>
              <div className="text-xs text-muted-foreground">
                Click the star to set as featured image
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={`group relative overflow-hidden rounded-lg border transition-all hover:shadow-md ${
                    index === featuredImageIndex ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}>
                  {/* Image */}
                  <div className="aspect-video relative bg-muted">
                    <Image
                      src={field.url}
                      alt={field.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                      <p className="text-sm font-medium truncate">{field.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(field.size / 1024 / 1024).toFixed(2)} MB
                      </p>
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
                        className="h-7 px-2"
                        onClick={() => window.open(field.url, "_blank")}>
                        <Eye className="h-3 w-3" />
                      </Button>

                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 rounded-r-none border-r-0"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}>
                          <MoveUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 rounded-l-none"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === fields.length - 1}>
                          <MoveDown className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 hover:bg-destructive hover:text-destructive-foreground ml-auto"
                        onClick={() => handleRemoveImage(index, field.url)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Status/Tips */}
        {fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No images uploaded yet</p>
            <p className="text-xs mt-1">Upload at least one image to showcase your property</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



