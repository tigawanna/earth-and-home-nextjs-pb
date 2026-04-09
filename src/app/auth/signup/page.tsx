import { AuthSideview } from "@/components/auth/AuthSideview";
import { GoogleOauthLogin } from "@/components/auth/GoogleOauthLogin";
import { SignupForm } from "@/components/auth/SignupForm";
import { siteinfo } from "@/config/siteinfo";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import LinkLoadingIndicator from "@/lib/next/LinkLoadingIndicator";

export const metadata: Metadata = {
  title: "Sign Up",
  description: `Create your free ${siteinfo.title} account to save property favorites, set up custom search alerts, and get personalized real estate recommendations. Join thousands of users finding their perfect home.`,
  keywords: [
    "sign up",
    "create account",
    "register",
    "free account",
    "real estate account",
    "property alerts",
    siteinfo.title,
  ],
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
    <section
      className="min-h-[100dvh] flex flex-col md:flex-row md:min-h-screen"
      aria-label="Sign Up Page"
    >
      <AuthSideview />
      <div className="flex-1 flex items-start justify-center px-4 py-8 pb-16 md:items-center md:py-12 md:pb-12">
        <Card className="w-full max-w-md shadow-sm">
          <CardContent className="flex flex-col gap-4">
            <h2 className="sr-only">Create your Earth & Home account</h2>
            <span
              className="block mb-6 text-3xl font-extrabold text-primary"
              aria-label="Sign Up Label"
            >
              Sign Up
            </span>
            <SignupForm />
            <GoogleOauthLogin />
            <div className="mt-6 text-center text-sm flex flex-col justify-center items-center gap-2">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/signin" className="text-primary hover:underline flex gap-2">
                Sign in
                <LinkLoadingIndicator />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
