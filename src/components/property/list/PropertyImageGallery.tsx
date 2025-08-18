"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { getFileUrl, getImageThumbnailUrl } from "@/lib/pocketbase/files";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { Camera, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface PropertyImageGalleryProps {
  property: PropertiesResponse; // Pass the full property record for PocketBase file URLs
  videoUrl?: string | null;
  virtualTourUrl?: string | null;
}

/**
 * Process property images from PocketBase - handles both string filenames and File objects
 * For display, we only use string filenames that have been uploaded to PocketBase
 */
function processPropertyImages(property: PropertiesResponse): string[] {
  const imageFilenames: string[] = [];
  
  // Add primary image if it exists
  if (property.image_url && typeof property.image_url === 'string') {
    imageFilenames.push(property.image_url);
  }
  
  // Add gallery images if they exist
  if (property.images) {
    const images = Array.isArray(property.images) ? property.images : [property.images];
    
    images.forEach(image => {
      // Only include string filenames (uploaded files), skip File objects
      if (typeof image === 'string' && image.trim() && image !== property.image_url) {
        imageFilenames.push(image);
      }
    });
  }
  
  return imageFilenames;
}

export function PropertyImageGallery({
  property,
  videoUrl,
  virtualTourUrl,
}: PropertyImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [fullscreenApi, setFullscreenApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  // Process images from the property record
  const imageFilenames = processPropertyImages(property);
  
  // Generate PocketBase URLs for the images
  const imageUrls = imageFilenames.map(filename => 
    getFileUrl(property, filename)
  );
  
  const validImages = imageUrls.filter(url => Boolean(url));
  const validCount = validImages.length;
  const hasImages = validCount > 0;

  // Set up main carousel API to track current slide
  useEffect(() => {
    if (!mainApi) return;

    setCount(mainApi.scrollSnapList().length);
    setCurrent(mainApi.selectedScrollSnap() + 1);

    mainApi.on("select", () => {
      setCurrent(mainApi.selectedScrollSnap() + 1);
    });
  }, [mainApi]);

  // Set up fullscreen carousel API to track current slide when open
  useEffect(() => {
    if (!fullscreenApi || !isOpen) return;

    fullscreenApi.on("select", () => {
      setCurrent(fullscreenApi.selectedScrollSnap() + 1);
    });
  }, [fullscreenApi, isOpen]);

  // Sync fullscreen carousel with main carousel when dialog opens
  useEffect(() => {
    if (isOpen && mainApi && fullscreenApi) {
      const currentIndex = mainApi.selectedScrollSnap();
      fullscreenApi.scrollTo(currentIndex);
    }
  }, [isOpen, mainApi, fullscreenApi]);

  // Sync main carousel with fullscreen carousel when dialog closes
  useEffect(() => {
    if (!isOpen && mainApi && fullscreenApi) {
      const currentIndex = fullscreenApi.selectedScrollSnap();
      mainApi.scrollTo(currentIndex);
    }
  }, [isOpen, mainApi, fullscreenApi]);

  useHotkeys("right", () => mainApi?.scrollNext(), { scopes: ["property-gallery"] });
  useHotkeys("left", () => mainApi?.scrollPrev(), { scopes: ["property-gallery"] });

  return (
    <div className="w-full">
      {/* Main Image with Carousel */}
      <div className="relative w-full bg-muted group">
        {/* Property badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge variant={property.status === "active" ? "default" : "secondary"}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
          {property.is_featured && <Badge variant="destructive">⭐ Featured</Badge>}
          {property.is_new && <Badge className="bg-green-600 hover:bg-green-700">New</Badge>}
        </div>

        {/* Carousel for images */}
        <div className="h-full w-full">
          <Carousel setApi={setMainApi} className="w-full max-h-[70vh] h-full">
            <CarouselContent className="aspect-video max-h-[70vh] h-full w-full">
              {hasImages ? (
                validImages.map((imageUrl, index) => (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={imageUrl}
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem className="h-full">
                  <div className="relative h-full w-full bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No images available</p>
                    </div>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            {hasImages && (
              <>
                <CarouselPrevious className="left-10" />
                <CarouselNext className="right-10" />
              </>
            )}
          </Carousel>

          {hasImages && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <div className="absolute inset-y-0 inset-x-[50%] bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2 bg-black/60 backdrop-blur-sm px-6 py-4 rounded-lg border border-white/20">
                    <Maximize2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </DialogTrigger>

              {/* Full screen gallery */}
              <DialogContent className="w-full sm:max-w-screen h-full max-h-[95vh] p-0">
                <DialogTitle className="sr-only">{property.title} Image Gallery</DialogTitle>
                <DialogDescription className="sr-only">
                  View all images of {property.title}
                </DialogDescription>
                <div className="relative w-full h-full bg-black">
                  <Carousel
                    setApi={setFullscreenApi}
                    className="w-full max-h-[95vh] h-full">
                    <CarouselContent className="h-[95vh] w-full">
                      {validImages.map((imageUrl, index) => (
                        <CarouselItem key={index} className="h-full">
                          <div className="relative h-full w-full">
                            <Image
                              src={imageUrl}
                              alt={`${property.title} - Image ${index + 1}`}
                              fill
                              className="object-contain" // Use contain for fullscreen view
                              priority={index === 0}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-10" />
                    <CarouselNext className="right-10" />

                    {/* Image counter for fullscreen */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {current} of {count}
                      </Badge>
                    </div>

                    {/* Close button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => setIsOpen(false)}>
                      <X className="h-6 w-6" />
                    </Button>
                  </Carousel>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Image count indicator */}
        {hasImages && (
          <div className="absolute bottom-4 right-4 z-10">
            <Badge variant="secondary" className="bg-black/50 text-white border-0">
              {validCount} {validCount === 1 ? "Photo" : "Photos"}
            </Badge>
          </div>
        )}
      </div>

      {/* Image Thumbnails */}
      {hasImages && validCount > 1 && (
        <div className="px-4 py-4 bg-background">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full">
            <CarouselContent className="-ml-2">
              {imageFilenames.slice(0, 5).map((filename, index) => {
                const thumbnailUrl = getImageThumbnailUrl(property, filename, "80x80");
                
                return (
                  <CarouselItem key={index} className="pl-2 basis-auto">
                    <button
                      className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0 border-2 transition-all duration-200 hover:ring-2 hover:ring-primary/60 border-transparent"
                      onClick={() => {
                        // Set the main carousel to the clicked image
                        if (mainApi) {
                          mainApi.scrollTo(index);
                        }
                      }}>
                      <Image
                        src={thumbnailUrl}
                        alt={`${property.title} - Thumbnail ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-200 hover:scale-105"
                      />
                      {index === 4 && validCount > 5 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium text-xs">+{validCount - 4}</span>
                        </div>
                      )}
                    </button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}
