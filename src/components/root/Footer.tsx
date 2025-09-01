import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="contact" className="bg-muted text-muted-foreground">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/lovable-uploads/85c65874-37e2-449d-b9ec-29ccbf629d79.png"
                alt="Earth & Home Logo"
                width={40}
                height={40}
                className="h-10 w-10 object-contain" />
              <div>
                <h3 className="text-xl font-playfair font-bold text-foreground">
                  Earth & Home
                </h3>
                <p className="text-sm text-muted-foreground">Real Estate Excellence</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted partner in finding the perfect home. We connect dreams with reality
              through exceptional real estate services.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="outline" className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="boredr-base-200 text-muted-foreground hover:bg-primary hover:text-primary-foreground">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-foreground">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#properties" className="hover:text-primary transition-colors">Properties</a></li>
              <li><a href="#buy" className="hover:text-primary transition-colors">Buy</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-foreground">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Property Search</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rental Properties</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Property Viewing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Market Research</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Property Consultation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Neighborhood Insights</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-foreground">Contact Info</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>info@earthandhome.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <span>123 Real Estate Blvd,<br />Suite 100, City, ST 12345</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="font-semibold mb-3 text-foreground">Newsletter</h5>
              <p className="text-sm mb-4">Get the latest property updates and market insights.</p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your email"
                  className="bg-background border-input text-foreground placeholder:text-muted-foreground" />
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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
              © 2024 Earth & Home Real Estate. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary text-sm transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


