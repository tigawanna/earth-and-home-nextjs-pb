"use client";

import { signoutMutationOptions } from "@/data-access-layer/pocketbase/auth";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface LogoutButtonProps {}

export function LogoutButton({}: LogoutButtonProps) {
  const router = useRouter();
  const { mutate, isPending: isLoggingOut } = useMutation({
    ...signoutMutationOptions(),
    onSuccess: () => {
      router.push("/");
    },
  });
  return (
    <Button onClick={() => mutate()} disabled={isLoggingOut}>
      Logout {isLoggingOut && <Loader className="h-4 w-4 animate-spin ml-2" />}
    </Button>
  );
}


