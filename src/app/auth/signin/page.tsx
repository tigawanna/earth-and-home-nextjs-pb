import { AuthSideview } from "@/components/auth/AuthSideview";
import { SigninForm } from "@/components/auth/SigninForm";
import { siteinfo } from "@/config/siteinfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to your ${siteinfo.title} account to access your property favorites, saved searches, and personalized real estate recommendations. Secure login for existing members.`,
  keywords: ["sign in", "login", "account access", "real estate account", "member login", siteinfo.title],
  openGraph: {
    title: `Sign In | ${siteinfo.title}`,
    description: `Access your ${siteinfo.title} account to manage your property searches and favorites.`,
    type: "website",
  },
  robots: {
    index: false, // Don't index auth pages
    follow: true,
  },
};

export default function SigninPage() {
  return (
    <section className="min-h-screen flex flex-col md:flex-row " aria-label="Sign In Page">
        <AuthSideview/>
        <div className="flex flex-1 items-center justify-center p-4 bg-background">
          <SigninForm />
        </div>
    </section>
  );
}
