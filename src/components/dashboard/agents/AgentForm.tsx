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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AgentsCreate, AgentsResponse, AgentsUpdate, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Phone, Plus, Trash2, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AgentFormData, agentFormSchema } from "./agents-schemas";
import { EditAgentModal } from "./EditAgentModal";
import { useMutation } from "@tanstack/react-query";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";

interface AgentFormProps {
  currentUser: UsersResponse;
  initialAgent?: AgentsResponse & { expand?: { user_id?: UsersResponse } };
}

export function AgentForm({ initialAgent, currentUser }: AgentFormProps) {
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: initialAgent?.name || "",
      email: initialAgent?.email || "",
      phone: initialAgent?.phone || "",
      user_id: initialAgent?.user_id || "",
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
  });
  const updateMutation = useMutation({
    mutationFn: async (data: AgentsUpdate & { id: string }) => {
      const result = await browserPB.from("agents").update(data.id, data);
      return result;
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (data: {id:string}) => {
      const result = await browserPB.from("agents").delete(data.id);
      return result;
    },
  });

  
  
  const onSubmit = async (data: AgentFormData) => {
    try {
      const result = await createAgentAction({
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        user_id: data.user_id,
      });

      if (result.success) {
        toast.success(result.message);
        form.reset();
        setShowCreateForm(false);
        // Refresh agents list - in a real app you'd refetch from server
        // For now, we'll add the new agent to the list
        if (result.result) {
          const selectedUser = availableUsers.find((u) => u.id === data.user_id);
          setAgents((prev) => [
            ...prev,
            {
              ...result.result!,
              expand: { user_id: selectedUser },
            },
          ]);
          loadAvailableUsers(); // Refresh available users
        }
      } else {
        toast.error(result.message || "Failed to create agent");
      }
    } catch (error) {
      toast.error("Failed to create agent");
    }
  };

  const handleDelete = async (agentId: string) => {
    try {
      const result = await deleteAgentAction(agentId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to delete agent");
      }
    } catch (error) {
      toast.error("Failed to delete agent");
    }
  };

  const handleEditSuccess = () => {
    // In a real app, you'd refetch the agents from server
    toast.success("Agent updated successfully");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Agents Management</h1>
        </div>

        {currentUser.is_admin && (
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Agent
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && currentUser.is_admin && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Agent</CardTitle>
            <CardDescription>
              Add a new agent to the system. Each user can only have one agent profile.
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
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Account *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={loadingUsers}>
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
                            ) : availableUsers.length === 0 ? (
                              <SelectItem value="" disabled>
                                No available users
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

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
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
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Agent"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Agents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Agents Found</h3>
              <p className="text-muted-foreground text-center">
                {currentUser.is_admin
                  ? "Get started by creating your first agent profile."
                  : "No agents have been created yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          agents.map((agent) => (
            <Card key={agent.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{agent.name || "Unnamed Agent"}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" />
                      {agent.expand?.user_id?.name ||
                        agent.expand?.user_id?.email ||
                        "Unknown User"}
                    </CardDescription>
                  </div>

                  {currentUser.is_admin && (
                    <div className="flex gap-1">
                      <EditAgentModal agent={agent} onSuccess={handleEditSuccess} />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete agent</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the agent profile. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(agent.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {agent.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{agent.email}</span>
                  </div>
                )}

                {agent.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{agent.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="secondary" className="text-xs">
                    Agent Profile
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Created {new Date(agent.created).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
