import { About } from "@/components/root/About";
import { FeaturedProperties } from "@/components/root/FeaturedProperties";
import { Hero } from "@/components/root/Hero";
import { PropertySearch } from "@/components/root/PropertySearch";
import { ResponsiveDrawer } from "@/components/root/ResponsiveDrawer";
import { SellYourHome } from "@/components/root/SellYourHome";
import { siteinfo } from "@/config/siteinfo";
import { Metadata } from "next";
import { Footer } from "react-day-picker";

export const metadata: Metadata = {
  title: siteinfo.title,
  description: "Find your perfect home with Earth & Home Real Estate. Browse luxury properties, family homes, and rental listings. Expert real estate services, local market knowledge, and personalized property search assistance.",
  keywords: ["real estate", "homes for sale", "property listings", "house rentals", "luxury properties", "family homes", "real estate agent", "property search", "home buying", "property rental"],
  openGraph: {
    title: `${siteinfo.title} - ${siteinfo.tagline}`,
    description: "Find your perfect home with Earth & Home Real Estate. Browse luxury properties, family homes, and rental listings.",
    type: "website",
  },
};

export default function Home() {
  return (
    <ResponsiveDrawer isLandingPage>
      <main className="min-h-screen ">
        <Hero />
        {/* Search */}
        <PropertySearch />
        {/* Featured */}
        <FeaturedProperties />
        {/* Sell */}
        <SellYourHome />

        {/* About */}
        <About />

        {/* Footer */}
        <Footer />
      </main>
    </ResponsiveDrawer>
  );
}
