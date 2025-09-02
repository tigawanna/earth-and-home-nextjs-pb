export const siteinfo = {
  // Basic Site Info
  title: "Earth & Home",
  tagline: "Real Estate Excellence",
  description: "Find your perfect home with Earth & Home Real Estate. Browse luxury properties, family homes, and rental listings. Expert real estate services, local market knowledge, and personalized property search assistance.",
  author: "Dennis",
  url: "https://earthandhome.com",
  
  // Contact Information
  contact: {
    email: "info@earthandhome.com",
    phone: "(555) 123-4567",
    address: {
      street: "123 Real Estate Blvd",
      suite: "Suite 100",
      city: "City",
      state: "ST",
      zip: "12345",
      full: "123 Real Estate Blvd,\nSuite 100, City, ST 12345"
    }
  },

  // Social Media
  social: {
    twitter: "@earthandhome",
    facebook: "earthandhome",
    instagram: "earthandhome",
    linkedin: "earthandhome"
  },

  // Hero Section
  hero: {
    title: "Find Your Perfect",
    subtitle: "Dream Home",
    description: "Discover exceptional properties with Earth & Home. From luxury estates to cozy family homes, we connect you with the perfect place to call home."
  },

  // Company Stats
  stats: {
    support: {
      value: "24/7",
      label: "Support Available",
      description: "Available Support"
    },
    satisfaction: {
      value: "100%",
      label: "Satisfaction Focus",
      description: "Client Focused"
    },
    expertise: {
      value: "Local",
      label: "Market Expertise",
      description: "Market Expert"
    },
    service: {
      value: "Personal",
      label: "Service Touch",
      description: "Service Touch"
    }
  },

  // About Section
  about: {
    title: "Why Choose Earth & Home?",
    description: "With a passion for real estate and commitment to exceptional service, Earth & Home specializes in helping clients find their perfect property. Our focus is on building lasting relationships and providing personalized guidance throughout your home buying journey.",
    features: [
      {
        title: "Local Knowledge",
        description: "Deep understanding of neighborhood markets and community insights.",
        icon: "Shield"
      },
      {
        title: "Dedicated Service",
        description: "Committed to providing exceptional support throughout your property search.",
        icon: "Award"
      },
      {
        title: "Personalized Approach",
        description: "Tailored solutions that match your unique needs and preferences.",
        icon: "Users"
      },
      {
        title: "Client-First Approach",
        description: "Growing network and focus on building strong client relationships.",
        icon: "TrendingUp"
      }
    ]
  },

  // Services
  services: [
    "Property Search",
    "Rental Properties", 
    "Property Viewing",
    "Market Research",
    "Property Consultation",
    "Neighborhood Insights"
  ],

  // Navigation Links
  navigation: {
    quickLinks: [
      { label: "Home", href: "#home" },
      { label: "Properties", href: "#properties" },
    //   { label: "Buy", href: "#buy" },
      { label: "About Us", href: "#about" },
      { label: "Contact", href: "#contact" }
    ]
  },

  // Testimonials
  testimonials: [
    {
      rating: 5,
      text: "Earth & Home helped us find the perfect property for our family. Their knowledge of the local market and personal attention made all the difference!",
      author: "Sarah & Mike Johnson"
    }
  ],

  // Newsletter
  newsletter: {
    title: "Newsletter",
    description: "Get the latest property updates and market insights."
  },

  // Footer
  footer: {
    companyDescription: "Your trusted partner in finding the perfect home. We connect dreams with reality through exceptional real estate services.",
    copyright: "© 2024 Earth & Home Real Estate. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" }
    ]
  }
} as const;
