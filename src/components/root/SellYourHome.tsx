import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Heart, Home, MapPin, Search } from "lucide-react";

export function SellYourHome() {
  return (
    <section id="services" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Value props */}
          <div>
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-4">
              Your Property Journey Starts Here
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              From finding your dream home to understanding the local market, we're here to guide you every step of the way.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Search className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-foreground">Property Search</p>
                  <p className="text-sm text-muted-foreground">Comprehensive search tools to find properties that match your criteria.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-foreground">Local Insights</p>
                  <p className="text-sm text-muted-foreground">Expert knowledge of neighborhoods, schools, and community amenities.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Heart className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-foreground">Personal Support</p>
                  <p className="text-sm text-muted-foreground">Dedicated assistance throughout your property search journey.</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Home className="mr-2 h-5 w-5" /> Start Searching
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-foreground hover:bg-primary/10 dark:hover:bg-primary/20"
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right: Simple service checklist */}
          <div className="bg-card text-card-foreground rounded-2xl border boredr-base-200 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Our Services</div>
              <span className="rounded-full px-3 py-1 text-xs bg-background border boredr-base-200">Always Available</span>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Property search and recommendations",
                "Neighborhood and market insights", 
                "Property viewing coordination",
                "Guidance through the buying process",
                "Ongoing support and consultation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-foreground/90 dark:text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
