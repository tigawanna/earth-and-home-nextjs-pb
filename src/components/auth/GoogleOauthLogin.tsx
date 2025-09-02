"use client"
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { useMutation } from "@tanstack/react-query";
import { FaGoogle } from "react-icons/fa"
import { Button } from "../ui/button";
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

interface GoogleOauthLoginProps {

}

export function GoogleOauthLogin({ }: GoogleOauthLoginProps) {
    const router = useRouter();
    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            return browserPB.from("users").authWithOAuth2({ provider: "google" });
        },
        onSuccess: () => {
            toast.success("Signed in successfully!");
            router.push("/dashboard");
        },
        onError: (error) => {
            toast.error("Failed to sign in. Please check your credentials and try again.");
        },
    });
    return (
        <Button onClick={() => mutate()} disabled={isPending}>
            <FaGoogle className="mr-2" />
            Sign in with Google
            {isPending && <Loader />}
        </Button>
    );
}
