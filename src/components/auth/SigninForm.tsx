"use client"
import LinkLoadingIndicator from "@/lib/next/LinkLoadingIndicator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinMutationOptions } from "@/data-access-layer/user/auth";
import { FormErrorDisplay, FormStateDebug } from "@/lib/react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signinSchema, type SigninFormData } from "./auth-schemas";

interface SigninFormProps {}

export function SigninForm({}: SigninFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({...signinMutationOptions(),
    onSuccess: () => {
      toast.success("Signed in successfully!");
      router.push("/dashboard");
    },
    onError: (error) => {
     toast.error("Failed to sign in. Please check your credentials and try again.");
    },
  
  });

  const onSubmit = (data: SigninFormData) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="gap-4">
        <span
          className="block mb-6 text-5xl font-extrabold text-primary"
          aria-label="Sign In Label">
          Sign In
        </span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            role="form"
            aria-label="Sign in form">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-muted rounded hover:bg-accent focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((v) => !v)}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <FormErrorDisplay
            form={form}
            title="Please fix the following errors:"
            maxErrors={5}
            className="my-custom-class"
          />

          {/* Development Debug Info - Just pass the form! */}
          <FormStateDebug
            form={form}
            title="🔧 Debug Form Errors"
            showFullState={false} // false = errors only, true = full form state
          />
        </Form>

        <div className="mt-6 text-center text-sm flex flex-col justify-center items-center gap-2">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/auth/signup" className="text-primary hover:underline flex gap-2">
            Sign up
            <LinkLoadingIndicator />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
