"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAvailableUsersAction, updateAgentAction } from "@/data-access-layer/admin/agents-actions";
import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EditAgentFormData, editAgentFormSchema } from "./agents-schemas";

interface EditAgentModalProps {
  agent: AgentsResponse & { expand?: { user_id?: UsersResponse } };
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function EditAgentModal({ agent, onSuccess, trigger }: EditAgentModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UsersResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const form = useForm<EditAgentFormData>({
    resolver: zodResolver(editAgentFormSchema),
    defaultValues: {
      name: agent.name || "",
      email: agent.email || "",
      phone: agent.phone || "",
      user_id: agent.user_id || "",
    },
  });

  useEffect(() => {
    if (open) {
      loadAvailableUsers();
    }
  }, [open]);

  const loadAvailableUsers = async () => {
    setLoadingUsers(true);
    try {
      const result = await getAvailableUsersAction();
      if (result.success) {
        // Include the current user in the list for editing
        const usersWithCurrent = [...result.result];
        if (agent.expand?.user_id && !usersWithCurrent.find(u => u.id === agent.user_id)) {
          usersWithCurrent.push(agent.expand.user_id);
        }
        setAvailableUsers(usersWithCurrent);
      } else {
        toast.error(result.message || "Failed to load users");
      }
    } catch (error) {
      toast.error("Failed to load users");
    }
    setLoadingUsers(false);
  };

  const onSubmit = async (data: EditAgentFormData) => {
    setIsLoading(true);
    try {
      const result = await updateAgentAction(agent.id, {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        user_id: data.user_id || undefined,
      });

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to update agent");
      }
    } catch (error) {
      toast.error("Failed to update agent");
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit agent</span>
        </Button>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Update the agent information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agent name" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={loadingUsers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingUsers ? (
                        <SelectItem value="" disabled>
                          Loading users...
                        </SelectItem>
                      ) : (
                        availableUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name || user.email} ({user.email})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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
