"use client";

import dynamic from "next/dynamic";
import { SiteIcon } from "../icons/SiteIcon";
import { ModeToggle } from "../theme/theme-toggle";
import { DashboardOrAuthLoader } from "./DashboardOrAuth";

import { Header } from "./Header";

const DashboardOrAuth = dynamic(() => import("./DashboardOrAuth"), {
  ssr: false,
  loading: () => <DashboardOrAuthLoader />,
});


interface ResponsiveDrawerProps {
  children: React.ReactNode;
  isLandingPage?: boolean; // Optional prop to indicate if this is the landing page
}

export function ResponsiveDrawer({ children, isLandingPage }: ResponsiveDrawerProps) {
  return (
    <div className="drawer">
      <input id="header-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col ">
        {/* Site Header */}
        <Header isLandingPage={isLandingPage} />
        {/* Main Content */}
        {children}
      </div>

      {/* Mobile Sidebar */}
      <div className="drawer-side z-20 ">
        <label
          htmlFor="header-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {/* Logo in sidebar */}
          <label
            htmlFor="header-drawer"
            aria-label="close sidebar"
            className="flex items-center space-x-3 mb-8">
            <div className="flex items-center space-x-3">
              <SiteIcon />
              <div>
                <h1 className="text-2xl font-playfair font-bold text-primary">Earth & Home</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Real Estate Excellence
                </p>
              </div>
            </div>
          </label>

          {/* Mobile Navigation Links */}
          {isLandingPage && (
            <div className="flex flex-col space-y-4 ">
              <li>
                <label htmlFor="header-drawer" aria-label="close sidebar">
                  <a
                    href="#home"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    <label htmlFor="header-drawer" aria-label="close sidebar">
                      Home
                    </label>
                  </a>
                </label>
              </li>
              <li>
                <label htmlFor="header-drawer" aria-label="close sidebar">
                  <a
                    href="#properties"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    <label htmlFor="header-drawer" aria-label="close sidebar">
                      Properties
                    </label>
                  </a>
                </label>
              </li>
              <li>
                <label htmlFor="header-drawer" aria-label="close sidebar">
                  <a
                    href="#buy"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    <label htmlFor="header-drawer" aria-label="close sidebar">
                      Buy
                    </label>
                  </a>
                </label>
              </li>
              <li>
                <label htmlFor="header-drawer" aria-label="close sidebar">
                  <a
                    href="#sell"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    <label htmlFor="header-drawer" aria-label="close sidebar">
                      Sell
                    </label>
                  </a>
                </label>
              </li>
              <li>
                <label htmlFor="header-drawer" aria-label="close sidebar">
                  <a
                    href="#about"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    <label htmlFor="header-drawer" aria-label="close sidebar">
                      About
                    </label>
                  </a>
                </label>
              </li>
              <li>
                <label htmlFor="header-drawer" aria-label="close sidebar">
                  <a
                    href="#contact"
                    className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    <label htmlFor="header-drawer" aria-label="close sidebar">
                      Contact
                    </label>
                  </a>
                </label>
              </li>
            </div>
          )}
          {/* CTA Buttons */}
          <div className="mt-6">
            <div className="flex flex-wrap  gap-4">
              <DashboardOrAuth />
              <ModeToggle />
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
