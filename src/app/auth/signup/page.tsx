import { AuthSideview } from "@/components/auth/AuthSideview";
import { SignupForm } from "@/components/auth/SignupForm";

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
