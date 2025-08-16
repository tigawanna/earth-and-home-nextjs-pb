import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/lib/tanstack/query/tsq-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Earth & Home",
    template: "%s | Earth & Home",
  },
  description:
    "Earth & Home is a modern real estate platform for discovering, buying, and selling homes and premium properties.",
  applicationName: "Earth & Home",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Earth & Home",
    description:
      "Earth & Home is a modern real estate platform for discovering, buying, and selling homes and premium properties.",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Earth & Home",
    description:
      "Earth & Home is a modern real estate platform for discovering, buying, and selling homes and premium properties.",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ["real estate", "properties", "listings", "homes", "Earth & Home"],
  authors: [{ name: "Earth & Home Real Estate" }],
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbf9" },
    { media: "(prefers-color-scheme: dark)", color: "#121613" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NuqsAdapter>
          <TanstackQueryProvider>
            <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
              <div>
                <div className="fixed inset-0 bg-gradient-to-b from-background to-background/80 z-[-1]" />
                {children}
              </div>
              <Toaster />
            </ThemeProvider>
          </TanstackQueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
