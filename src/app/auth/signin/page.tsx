import { AuthSideview } from "@/components/auth/AuthSideview";
import { SigninForm } from "@/components/auth/SigninForm";

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
