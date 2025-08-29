"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { AgentsResponse, AgentsUpdate, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditAgentFormData, editAgentFormSchema } from "./agents-schemas";

interface EditAgentModalProps {
  agent: AgentsResponse & { expand?: { user_id?: UsersResponse } };
  currentUser: UsersResponse;
  trigger?: React.ReactNode;
}

export function EditAgentModal({ agent, currentUser, trigger }: EditAgentModalProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<EditAgentFormData>({
    resolver: zodResolver(editAgentFormSchema),
    defaultValues: {
      name: agent.name || "",
      email: agent.email || "",
      phone: agent.phone || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AgentsUpdate & { id: string }) => {
      const result = await browserPB.from("agents").update(data.id, data);
      return result;
    },
    onSuccess: () => {
      toast.success("Agent profile updated successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to update agent profile");
      console.error(error);
    },
  });

  const onSubmit = async (data: EditAgentFormData) => {
    updateMutation.mutate({
      id: agent.id,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
    });
  };

  const isLoading = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit agent</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Agent Profile</DialogTitle>
          <DialogDescription>
            Update your agent information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
