import { Button } from "@/components/ui/button";
import { siteinfo } from "@/config/siteinfo";
import { Search } from "lucide-react";
import Link from "next/link";
import { HeroSectionProperty } from "./HeroSectionProperty";

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
              {siteinfo.hero.title}
              <span className="text-primary block">{siteinfo.hero.subtitle}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {siteinfo.hero.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{siteinfo.stats.support.value}</div>
                <div className="text-sm text-muted-foreground">{siteinfo.stats.support.label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-foreground">{siteinfo.stats.satisfaction.value}</div>
                <div className="text-sm text-muted-foreground">{siteinfo.stats.satisfaction.label}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{siteinfo.stats.expertise.value}</div>
                <div className="text-sm text-muted-foreground">{siteinfo.stats.expertise.label}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/properties">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Properties
                </Button>
              </Link>
              {/* <Button
                size="lg"
                variant="outline"
                aria-label="Sell your home"
                className="border-accent text-foreground hover:bg-accent/10 dark:hover:bg-accent/20"
              >
                <Home className="mr-2 h-5 w-5" />
                Sell Your Home
              </Button> */}
            </div>
          </div>

          {/* Right content - Featured property card */}
          <div className="animate-scale-in">
            {/* <div className="bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden border boredr-base-200">
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
            </div> */}
            <HeroSectionProperty />
          </div>
        </div>
      </div>
    </section>
  );
}


