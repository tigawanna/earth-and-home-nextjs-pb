import { Button } from "@/components/ui/button";
import { siteinfo } from "@/config/siteinfo";
import { Award, Shield, TrendingUp, Users } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="text-4xl font-playfair font-bold text-foreground mb-6">
              {siteinfo.about.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {siteinfo.about.description}
            </p>

            {/* Features */}
            <div className="space-y-6 mb-8">
              {siteinfo.about.features.map((feature, index) => {
                const IconComponent = feature.icon === 'Shield' ? Shield :
                  feature.icon === 'Award' ? Award :
                    feature.icon === 'Users' ? Users : TrendingUp;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`${index % 2 === 0 ? 'bg-primary/10' : 'bg-accent/20'} p-3 rounded-lg`}>
                      <IconComponent className={`h-6 w-6 ${index % 2 === 0 ? 'text-primary' : 'text-accent-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Learn More About Us
            </Button>
          </div>

          {/* Right content - Stats */}
          <div className="bg-linear-to-br from-primary/5 to-accent/10 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{siteinfo.stats.support.value}</div>
                <div className="text-muted-foreground">{siteinfo.stats.support.description}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-foreground mb-2">{siteinfo.stats.satisfaction.value}</div>
                <div className="text-muted-foreground">{siteinfo.stats.satisfaction.description}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{siteinfo.stats.expertise.value}</div>
                <div className="text-muted-foreground">{siteinfo.stats.expertise.description}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-foreground mb-2">{siteinfo.stats.service.value}</div>
                <div className="text-muted-foreground">{siteinfo.stats.service.description}</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-8 p-6 bg-card text-card-foreground rounded-xl shadow-xs">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {"★".repeat(siteinfo.testimonials[0].rating)}
                </div>
              </div>
              <p className="text-muted-foreground italic mb-4">
                "{siteinfo.testimonials[0].text}"
              </p>
              <div className="font-semibold text-foreground">- {siteinfo.testimonials[0].author}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


