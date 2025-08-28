"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AgentsCreate, AgentsResponse, AgentsUpdate, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail, Phone, Trash2, User, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AgentFormData, agentFormSchema } from "./agents-schemas";

interface AgentFormProps {
  currentUser: UsersResponse;
  initialAgent?: AgentsResponse & { expand?: { user_id?: UsersResponse } };
}

export function AgentForm({ initialAgent, currentUser }: AgentFormProps) {
  const isEdit = !!initialAgent;
  
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: initialAgent?.name || "",
      email: initialAgent?.email || "",
      phone: initialAgent?.phone || "",
      user_id: initialAgent?.user_id || currentUser.id,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AgentsCreate) => {
      const result = await browserPB.from("agents").create({
        ...data,
        user_id: currentUser.id,
      });
      return result;
    },
    onSuccess: () => {
      toast.success("Agent profile created successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create agent profile");
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AgentsUpdate & { id: string }) => {
      const result = await browserPB.from("agents").update(data.id, data);
      return result;
    },
    onSuccess: () => {
      toast.success("Agent profile updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update agent profile");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: { id: string }) => {
      const result = await browserPB.from("agents").delete(data.id);
      return result;
    },
    onSuccess: () => {
      toast.success("Agent profile deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete agent profile");
      console.error(error);
    },
  });

  const onSubmit = async (data: AgentFormData) => {
    if (isEdit && initialAgent) {
      updateMutation.mutate({
        id: initialAgent.id,
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
      });
    } else {
      createMutation.mutate({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        user_id: currentUser.id,
      });
    }
  };

  const handleDelete = () => {
    if (initialAgent) {
      deleteMutation.mutate({ id: initialAgent.id });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Agent Profile" : "Create Agent Profile"}
          </h1>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Update Agent Information" : "Create New Agent"}</CardTitle>
          <CardDescription>
            {isEdit 
              ? "Update your agent profile information below."
              : "Create your agent profile to start listing properties."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEdit ? "Update Agent" : "Create Agent"
                  )}
                </Button>
                
                {isEdit && initialAgent && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={isLoading}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Profile
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your agent profile. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Profile
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Current Agent Info */}
      {isEdit && initialAgent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Agent Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-lg font-medium">{initialAgent.name || "Not provided"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Associated User</label>
                <p className="text-lg font-medium">
                  {initialAgent.expand?.user_id?.name || initialAgent.expand?.user_id?.email || currentUser.name || currentUser.email}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{initialAgent.email || "Not provided"}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg">{initialAgent.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <Badge variant="secondary">Agent Profile</Badge>
              <div className="text-sm text-muted-foreground">
                <p>Created: {new Date(initialAgent.created).toLocaleDateString()}</p>
                <p>Updated: {new Date(initialAgent.updated).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
