import { Button } from "@/components/ui/button";
import { Home, Sparkles, Shield, DollarSign, ArrowRight, Check } from "lucide-react";

export function SellYourHome() {
  return (
    <section id="sell" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: Value props */}
          <div>
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-4">
              Sell Your Home with Confidence
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Maximize your home’s value with our expert marketing, data-driven pricing, and concierge-level service.
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-foreground">Premium Marketing</p>
                  <p className="text-sm text-muted-foreground">Cinematic photography, video tours, and targeted campaigns.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
                  <DollarSign className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-foreground">Smart Pricing</p>
                  <p className="text-sm text-muted-foreground">We analyze local comps to position your home for top dollar.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Shield className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium text-foreground">Trusted Guidance</p>
                  <p className="text-sm text-muted-foreground">From prep to close, we handle the details with care.</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Home className="mr-2 h-5 w-5" /> Start Listing
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

          {/* Right: Simple checklist card with accessible contrast */}
          <div className="bg-card text-card-foreground rounded-2xl border boredr-base-200 shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Listing Checklist</div>
              <span className="rounded-full px-3 py-1 text-xs bg-background border boredr-base-200">2–3 weeks</span>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "In-home consultation and pricing strategy",
                "Professional media and staging guidance",
                "Launch to MLS + digital marketing",
                "Offer review and negotiation",
                "Smooth closing coordination",
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
