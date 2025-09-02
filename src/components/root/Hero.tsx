import { Button } from "@/components/ui/button";
import { siteinfo } from "@/config/siteinfo";
import { Search } from "lucide-react";
import Link from "next/link";
import { HeroSectionProperty, HeroSectionPropertyFallback } from "./HeroSectionProperty";
import { Suspense } from "react";

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
            <Suspense fallback={<HeroSectionPropertyFallback />}>
              <HeroSectionProperty />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}


