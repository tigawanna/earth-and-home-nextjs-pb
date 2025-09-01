import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

import { AlertCircle, Home } from "lucide-react";
import Link from "next/link";


interface SinglePropertyLoadingFallbackProps {}

export function SinglePropertyLoadingFallback({}: SinglePropertyLoadingFallbackProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="lg:col-span-2 animate-pulse">
          <Skeleton className="w-full h-96 rounded-lg mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-pulse">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-px w-full my-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-pulse">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-12 animate-pulse">
        <div className="flex gap-2 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating loading indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="p-4 shadow-lg border-primary/20">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="relative">
              <Loader className="h-5 w-5 animate-spin text-primary" />
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Loading property...</p>
              <p className="text-xs">Fetching details and images</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface SinglePropertyNotFoundProps {
  tsr?: boolean;
}
export function SinglePropertyNotFound({ tsr }: SinglePropertyNotFoundProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Property Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The property you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This could happen if:</p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto">
              <li>• The property has been sold or rented</li>
              <li>• The listing has been removed by the owner</li>
              <li>• The URL was typed incorrectly</li>
              <li>• The property is no longer available</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild>
              {tsr ? (
                <Link href="/properties">
                  <Home className="h-4 w-4 mr-2" />
                  Browse All Properties
                </Link>
              ) : null}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
