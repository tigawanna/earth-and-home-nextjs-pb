import { AuthSideview } from "@/components/auth/AuthSideview";
import { GoogleOauthLogin } from "@/components/auth/GoogleOauthLogin";
import { SigninForm } from "@/components/auth/SigninForm";
import { siteinfo } from "@/config/siteinfo";
import LinkLoadingIndicator from "@/lib/next/LinkLoadingIndicator";
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

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
      <AuthSideview />
      <div className="flex flex-1 items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md gap-2">
          <CardContent className="flex flex-col gap-4">
            <span
              className="block mb-6 text-5xl font-extrabold text-primary"
              aria-label="Sign In Label">
              Sign In
            </span>
            {process.env.NODE_ENV === "development" && <SigninForm />}
            <GoogleOauthLogin />
            <div className="mt-6 text-center text-sm flex flex-col justify-center items-center gap-2">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/auth/signup" className="text-primary hover:underline flex gap-2">
                Sign up
                <LinkLoadingIndicator />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
