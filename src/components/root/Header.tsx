import { Menu } from "lucide-react";
import { SiteIcon } from "../icons/SiteIcon";
import { ModeToggle } from "../theme/theme-toggle";

import Link from "next/link";
import dynamic from "next/dynamic";
import { DashboardOrAuthLoader } from "./DashboardOrAuth";

const DashboardOrAuth = dynamic(() => import("./DashboardOrAuth"), {
  ssr: false,
  loading: () => <DashboardOrAuthLoader />,
});

export function Header({ isLandingPage }: { isLandingPage?: boolean }) {
  return (
    <header className="navbar bg-background shadow-xs border-b boredr-base-200 sticky top-0 z-20 px-8">
      {/* Mobile menu button */}
      {/* Logo */}
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <SiteIcon />
          </Link>
          <Link href="/">
            <h1 className="text-2xl font-playfair font-bold text-primary">Earth & Home</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Real Estate Excellence</p>
          </Link>
        </div>
      </div>
      {/* Desktop Navigation */}
      {isLandingPage && (
        <div className="flex-none hidden lg:block">
          <nav className="menu menu-horizontal px-1">
            <li>
              <a
                href="#home"
                className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Home
              </a>
            </li>
            <li>
              <a
                href="#properties"
                className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Properties
              </a>
            </li>
            <li>
              <a
                href="#buy"
                className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Buy
              </a>
            </li>
            <li>
              <a
                href="#sell"
                className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Sell
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors font-medium">
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-primary transition-colors font-medium">
                Contact
              </a>
            </li>
          </nav>
        </div>
      )}
      <div className="flex-none md:hidden">
        <label
          htmlFor="header-drawer"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost">
          <Menu className="h-6 w-6" />
        </label>
      </div>
      {/* CTA Buttons */}
      <div className="flex-none hidden md:flex">
        <div className="flex items-center space-x-2">
          <DashboardOrAuth />
          <ModeToggle compact />
        </div>
      </div>
    </header>
  );
}
