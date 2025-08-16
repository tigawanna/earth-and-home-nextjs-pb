"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Camera, X, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { emptyStringasNull } from "@/utils/values";
import { useHotkeys } from "react-hotkeys-hook";

export interface ImagePayload {
  url: string;
  key: string;
  name: string;
  size: number;
  type: string;
}

interface PropertyImageGalleryProps {
  images: ImagePayload[];
  title: string;
  videoUrl?: string | null;
  virtualTourUrl?: string | null;
  status: string;
  isFeatured: boolean;
  isNew: boolean;
}

export function PropertyImageGallery({
  images,
  title,
  videoUrl,
  virtualTourUrl,
  status,
  isFeatured,
  isNew,
}: PropertyImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [fullscreenApi, setFullscreenApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  // Extract URLs from ImagePayload objects and sanitize them
  const imageUrls = images.map((img) => img.url);
  const sanitizedImages = imageUrls.map(emptyStringasNull); // (string | null)[]
  const validImages = sanitizedImages.filter((img): img is string => Boolean(img));
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
  ``;
  return (
    <div className="w-full">
      {/* Main Image with Carousel */}
      <div className="relative  w-full bg-muted group">
        {/* Property badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          {isFeatured && <Badge variant="destructive">⭐ Featured</Badge>}
          {isNew && <Badge className="bg-green-600 hover:bg-green-700">New</Badge>}
        </div>

        {/* Carousel for images */}
        <div className="h-full  w-full  ">
          <Carousel setApi={setMainApi} className="w-full max-h-[70vh] h-full ">
            <CarouselContent className="aspect-video max-h-[70vh] h-full w-full ">
              {validImages.map((image, index) => {
                return (
                  <CarouselItem key={index} className="h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={image}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover "
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-10" />
            <CarouselNext className="right-10" />
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
                <DialogTitle className="sr-only">{title} Image Gallery</DialogTitle>
                <DialogDescription className="sr-only">
                  View all images of {title}
                </DialogDescription>
                <div className="relative w-full h-full bg-black">
                  {hasImages ? (
                    <Carousel
                      setApi={setFullscreenApi}
                      className="w-full max-h-[95vh] h-full">
                      <CarouselContent className="h-[95vh] w-full">
                        {validImages.map((image, index) => {
                          return (
                            <CarouselItem key={index} className="h-full">
                              <div className="relative h-full w-full ">
                                <Image
                                  src={image}
                                  alt={`${title} - Image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  priority={index === 0}
                                />
                              </div>
                            </CarouselItem>
                          );
                        })}
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
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="">No images available</p>
                    </div>
                  )}
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
              {validImages.slice(0, 5).map((image, index) => (
                <CarouselItem key={index} className="pl-2 basis-auto">
                  <button
                    className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0 border-2 transition-all duration-200 hover:ring-2 hover:ring-primary/60 border-transparent"
                    onClick={() => {
                      // Set the main carousel to the clicked image
                      if (mainApi) {
                        mainApi.scrollTo(index);
                      }

                      // setIsOpen(true);
                    }}>
                    <Image
                      src={image}
                      alt={`${title} - Thumbnail ${index + 1}`}
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
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}
