import { Button } from "@/components/ui/button";
import { PublicPropertyListings } from "@/components/property/PublicPropertyListings";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { Card, CardContent } from "../ui/card";

export function FeaturedProperties() {
  // Search params to get only featured properties
  const featuredSearchParams = {
    // featured: "true",
    // status: "active",
    // sortBy: "createdAt",
    // sortOrder: "desc",
  };

  return (
    <section id="properties" className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties available for sale
          </p>
        </div>

        {/* Use the PublicPropertyListings component with featured filter */}
        <Suspense fallback={<LoadingFallback />}>
          <PublicPropertyListings
            searchParams={featuredSearchParams}
            limit={6} // Show only 6 featured properties on homepage
          />
        </Suspense>

        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
            asChild>
            <Link href="/properties">View All Properties</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function LoadingFallback() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading properties...</span>
      </CardContent>
    </Card>
  );
}
