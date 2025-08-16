import { Button } from "@/components/ui/button";
import { Shield, Award, Users, TrendingUp } from "lucide-react";

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
              With over 15 years of experience in the real estate industry, Earth & Home has been
              connecting families with their dream properties. Our commitment to excellence and
              personalized service sets us apart.
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Trusted Expertise</h3>
                  <p className="text-muted-foreground">Licensed professionals with deep market knowledge and proven track record.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Award-Winning Service</h3>
                  <p className="text-muted-foreground">Recognized for outstanding customer service and successful transactions.</p>
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
                  <h3 className="font-semibold text-foreground mb-2">Market Leadership</h3>
                  <p className="text-muted-foreground">Consistent top performer in local market with innovative strategies.</p>
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
                <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
                <div className="text-muted-foreground">Properties Sold</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-foreground mb-2">500+</div>
                <div className="text-muted-foreground">Happy Families</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-foreground mb-2">98%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
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
                "Earth & Home made our home buying journey seamless and stress-free.
                Their expertise and dedication are unmatched!"
              </p>
              <div className="font-semibold text-foreground">- Sarah & Mike Johnson</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


