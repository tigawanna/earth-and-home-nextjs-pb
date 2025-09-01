import { Footer } from "@/components/root/Footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteinfo } from "@/config/siteinfo";
import "@/lib/react-responsive-pagination/pagination.css";
import { TanstackQueryProvider } from "@/lib/tanstack/query/tsq-provider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteinfo.url;

export const metadata: Metadata = {
  title: {
    default: siteinfo.title,
    template: `%s | ${siteinfo.title}`,
  },
  description: siteinfo.description,
  applicationName: siteinfo.title,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: siteinfo.title,
    description: siteinfo.description,
    type: "website",
    url: siteUrl,
    siteName: siteinfo.title,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteinfo.title,
    description: siteinfo.description,
    creator: siteinfo.social.twitter,
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ["real estate", "properties", "listings", "homes", siteinfo.title, "property search", "rental properties"],
  authors: [{ name: siteinfo.author }, { name: `${siteinfo.title} Real Estate` }],
  creator: siteinfo.author,
  publisher: `${siteinfo.title} Real Estate`,
  alternates: {
    canonical: "/",
  },
  other: {
    "contact:email": siteinfo.contact.email,
    "contact:phone": siteinfo.contact.phone,
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
                <Footer/>
              </div>
              <Toaster />
            </ThemeProvider>
          </TanstackQueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
