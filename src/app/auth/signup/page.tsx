import { AuthSideview } from "@/components/auth/AuthSideview";
import { SignupForm } from "@/components/auth/SignupForm";
import { siteinfo } from "@/config/siteinfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: `Create your free ${siteinfo.title} account to save property favorites, set up custom search alerts, and get personalized real estate recommendations. Join thousands of users finding their perfect home.`,
  keywords: ["sign up", "create account", "register", "free account", "real estate account", "property alerts", siteinfo.title],
  openGraph: {
    title: `Sign Up | ${siteinfo.title}`,
    description: `Join ${siteinfo.title} to access exclusive property features and personalized real estate services.`,
    type: "website",
  },
  robots: {
    index: false, // Don't index auth pages
    follow: true,
  },
};

export default function SignupPage() {
  return (
    <section className="min-h-screen flex flex-col md:flex-row" aria-label="Sign Up Page">
        <AuthSideview/>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <SignupForm />
      </div>
    </section>
  );
}
