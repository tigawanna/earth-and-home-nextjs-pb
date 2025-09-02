import { About } from "@/components/root/About";
import { FeaturedProperties } from "@/components/root/FeaturedProperties";
import { Hero } from "@/components/root/Hero";
import { PropertySearch } from "@/components/root/PropertySearch";
import { ResponsiveDrawer } from "@/components/root/ResponsiveDrawer";
import { SellYourHome } from "@/components/root/SellYourHome";
import { Footer } from "react-day-picker";

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
