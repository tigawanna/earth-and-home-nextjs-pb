import { Button } from "@/components/ui/button";
import { Award, Shield, TrendingUp, Users } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-6">
              Why Choose Earth & Home?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              With a passion for real estate and commitment to exceptional service, Earth & Home 
              specializes in helping clients find their perfect property. Our focus is on building 
              lasting relationships and providing personalized guidance throughout your home buying journey.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Local Knowledge</h3>
                  <p className="text-muted-foreground">Deep understanding of neighborhood markets and community insights.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Dedicated Service</h3>
                  <p className="text-muted-foreground">Committed to providing exceptional support throughout your property search.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personalized Approach</h3>
                  <p className="text-muted-foreground">Tailored solutions that match your unique needs and preferences.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Client-First Approach</h3>
                  <p className="text-muted-foreground">Growing network and focus on building strong client relationships.</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Learn More About Us
            </Button>
          </div>

          {/* Right content - Stats */}
          <div className="bg-linear-to-br from-primary/5 to-accent/10 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Available Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-foreground mb-2">100%</div>
                <div className="text-muted-foreground">Client Focused</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">Local</div>
                <div className="text-muted-foreground">Market Expert</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-foreground mb-2">Personal</div>
                <div className="text-muted-foreground">Service Touch</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-8 p-6 bg-card text-card-foreground rounded-xl shadow-xs">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-muted-foreground italic mb-4">
                "Earth & Home helped us find the perfect property for our family.
                Their knowledge of the local market and personal attention made all the difference!"
              </p>
              <div className="font-semibold text-foreground">- Sarah & Mike Johnson</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


