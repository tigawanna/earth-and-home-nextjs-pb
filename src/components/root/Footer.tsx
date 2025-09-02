import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteinfo } from "@/config/siteinfo";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { SiteIcon } from "../icons/SiteIcon";

export function Footer() {
  return (
    <footer id="contact" className="bg-muted text-muted-foreground">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
                <SiteIcon/>
              <div>
                <h3 className="text-xl font-playfair font-bold text-foreground">
                  {siteinfo.title}
                </h3>
                <p className="text-sm text-muted-foreground">{siteinfo.tagline}</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {siteinfo.footer.companyDescription}
            </p>
            <div className="flex space-x-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {siteinfo.navigation.quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-foreground">Services</h4>
            <ul className="space-y-3">
              {siteinfo.services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-foreground">Contact Info</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>{siteinfo.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>{siteinfo.contact.email}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <span>{siteinfo.contact.address.full}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-semibold mb-3 text-foreground">{siteinfo.newsletter.title}</h5>
              <p className="text-sm mb-4">{siteinfo.newsletter.description}</p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your email"
                  type="email"
                  aria-label="Email address for newsletter subscription"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t boredr-base-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              {siteinfo.footer.copyright}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {siteinfo.footer.legalLinks.map((link, index) => (
                <a key={index} href={link.href} className="hover:text-primary text-sm transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


