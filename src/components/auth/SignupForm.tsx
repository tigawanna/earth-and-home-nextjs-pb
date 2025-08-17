"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signupMutationOptions } from "@/data-access-layer/pocketbase/auth";
import LinkLoadingIndicator from "@/lib/next/LinkLoadingIndicator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signupSchema, type SignupFormData } from "./auth-schemas";

interface SignupFormProps {}

export function SignupForm({}: SignupFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { isPending, mutate } = useMutation({
    ...signupMutationOptions(),
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/auth/signin");
    },
    onError: (error) => {
      toast.error("Failed to create account. Please try again.");
    },
  });

  const onSubmit = (data: SignupFormData) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardContent className="gap-4">
        <h2 className="sr-only">Create your Earth & Home account</h2>
        <span
          className="block mb-6 text-3xl font-extrabold text-primary"
          aria-label="Sign Up Label">
          Sign Up
        </span>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            role="form"
            aria-label="Sign up form">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        placeholder="Create a password"
                        autoComplete="new-password"
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
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-muted rounded hover:bg-accent focus:outline-none"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowConfirmPassword((v) => !v)}>
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm flex flex-col justify-center items-center gap-2">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/auth/signin" className="text-primary hover:underline flex gap-2">
            Sign in
            <LinkLoadingIndicator />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
