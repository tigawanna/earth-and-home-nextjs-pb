"use client";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

interface GoogleOauthLoginProps {}

export function GoogleOauthLogin(_props: GoogleOauthLoginProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleGoogleSignIn() {
    setIsPending(true);
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${origin}/dashboard`,
      });
    } catch {
      toast.error("Failed to sign in. Please check your credentials and try again.");
      setIsPending(false);
    }
  }

  return (
    <Button type="button" onClick={() => void handleGoogleSignIn()} disabled={isPending}>
      <FaGoogle className="mr-2" />
      Sign in with Google
      {isPending ? <Loader className="ml-1 animate-spin" /> : null}
    </Button>
  );
}
