"use client";

import { signoutMutationOptions } from "@/data-access-layer/pocketbase/auth";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

interface LogoutButtonProps {}

export function LogoutButton({}: LogoutButtonProps) {
  const { mutate, isPending: isLoggingOut } = useMutation(signoutMutationOptions());
  return (
    <Button onClick={() => mutate()} disabled={isLoggingOut} >
      Logout {isLoggingOut && <Loader className="h-4 w-4 animate-spin ml-2" />}
    </Button>
  );
}
