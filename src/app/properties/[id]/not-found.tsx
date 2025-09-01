import { Button } from "@/components/ui/button";
import { siteinfo } from "@/config/siteinfo";
import { Home, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Property Not Found",
  description: `The property you're looking for could not be found. Browse our other available properties with ${siteinfo.title}.`,
  robots: {
    index: false,
    follow: true,
  },
};

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Property Not Found</h1>
          <p className="text-xl text-muted-foreground">
            Sorry, the property you're looking for doesn't exist or has been removed.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This property may have been sold, rented, or is no longer available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/properties">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="mr-2 h-5 w-5" />
                Browse All Properties
              </Button>
            </Link>
            
            <Link href="/">
              <Button size="lg" variant="outline">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Looking for something specific?</h3>
          <p className="text-sm text-muted-foreground">
            Use our property search to find homes that match your criteria, or contact us directly for personalized assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
