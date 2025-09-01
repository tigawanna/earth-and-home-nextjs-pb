"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { AgentsResponse, AgentsUpdate, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader, Pencil } from "lucide-react";
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
      agency_name: agent.agency_name || "",
      license_number: agent.license_number || "",
      specialization: agent.specialization || "",
      service_areas: agent.service_areas || "",
      years_experience: agent.years_experience || undefined,
      is_verified: agent.is_verified || false,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AgentsUpdate & { id: string }) => {
      console.log("Updating agent:", data);
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
      console.log(error);
    },
  });

  const onSubmit = async (data: EditAgentFormData) => {
    updateMutation.mutate({
      id: agent.id,
      agency_name: data.agency_name,
      license_number: data.license_number || undefined,
      specialization: data.specialization || undefined,
      service_areas: data.service_areas || undefined,
      years_experience: data.years_experience || undefined,
      is_verified: data.is_verified,
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

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Agent Profile</DialogTitle>
          <DialogDescription>
            Update agency information and details. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agency_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter agency name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter license number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Years" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="service_areas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Areas</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Nairobi, Kiambu, Machakos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentUser.is_admin && (
              <FormField
                control={form.control}
                name="is_verified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Verified Agent
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

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
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
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
