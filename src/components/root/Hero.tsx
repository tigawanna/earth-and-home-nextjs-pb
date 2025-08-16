import { Button } from "@/components/ui/button";
import { Search, MapPin, Home } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-primary/5 to-accent/10 py-20 lg:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-playfair font-bold text-foreground leading-tight mb-6">
              Find Your Perfect
              <span className="text-primary block">Dream Home</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover exceptional properties with Earth & Home. From luxury estates to cozy family homes,
              we connect you with the perfect place to call home.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1,200+</div>
                <div className="text-sm text-muted-foreground">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="mr-2 h-5 w-5" />
                Browse Properties
              </Button>
              <Button
                size="lg"
                variant="outline"
                aria-label="Sell your home"
                className="border-accent text-foreground hover:bg-accent/10 dark:hover:bg-accent/20"
              >
                <Home className="mr-2 h-5 w-5" />
                Sell Your Home
              </Button>
            </div>
          </div>

          {/* Right content - Featured property card */}
          <div className="animate-scale-in">
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden border boredr-base-200">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop"
                  alt="Featured Property"
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-background text-foreground px-3 py-1 rounded-full text-sm font-medium border boredr-base-200">
                    $850,000
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Beverly Hills, CA</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Modern Luxury Villa
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Stunning 4-bedroom villa with panoramic city views, modern amenities, and elegant design.
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>🛏️ 4 Beds</div>
                  <div>🚿 3 Baths</div>
                  <div>📐 2,500 sq ft</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


