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
import { Checkbox } from "@/components/ui/checkbox";
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

import type {
  AgentsCreate,
  AgentsResponse,
  AgentsUpdate,
  UsersResponse,
} from "@/types/domain-types";
import {
  createAgent,
  updateAgent,
  deleteAgent,
} from "@/data-access-layer/actions/agent-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Building2,
  CheckCircle,
  FileText,
  Loader2,
  MapPin,
  Star,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getSafeDashboardReturnPath } from "@/lib/safe-return-path";
import { AgentFormData, agentFormSchema } from "./agents-schemas";

interface AgentFormProps {
  currentUser: UsersResponse;
  initialAgent?: AgentsResponse & { expand?: { user_id?: UsersResponse } };
}

export function AgentForm({ initialAgent, currentUser }: AgentFormProps) {
  const isEdit = !!initialAgent;
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      user_id: initialAgent?.user_id || currentUser.id,
      agency_name: initialAgent?.agency_name || "",
      license_number: initialAgent?.license_number || "",
      specialization: initialAgent?.specialization || "",
      service_areas: initialAgent?.service_areas || "",
      years_experience: initialAgent?.years_experience || undefined,
      is_verified: initialAgent?.is_verified || false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AgentsCreate) => {
      const result = await createAgent({ ...data, user_id: currentUser.id });
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Agent profile created successfully");
      form.reset();
      const next = getSafeDashboardReturnPath(searchParams.get("returnTo"));
      if (next) {
        router.push(next);
      } else {
        router.push("/dashboard/agents");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create agent profile");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: AgentsUpdate & { id: string }) => {
      const result = await updateAgent(data);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      toast.success("Agent profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update agent profile");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (data: { id: string }) => {
      const result = await deleteAgent(data.id);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      toast.success("Agent profile deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete agent profile");
    },
  });

  const onSubmit = async (data: AgentFormData) => {
    if (isEdit && initialAgent) {
      updateMutation.mutate({
        id: initialAgent.id,
        agency_name: data.agency_name,
        license_number: data.license_number || undefined,
        specialization: (data.specialization || undefined) as AgentsUpdate["specialization"],
        service_areas: data.service_areas || undefined,
        years_experience: data.years_experience || undefined,
        is_verified: data.is_verified,
        resubmit: initialAgent.approval_status === "rejected" ? true : undefined,
      });
    } else {
      createMutation.mutate({
        user_id: currentUser.id,
        agency_name: data.agency_name,
        license_number: data.license_number || undefined,
        specialization: (data.specialization || undefined) as AgentsCreate["specialization"],
        service_areas: data.service_areas || undefined,
        years_experience: data.years_experience || undefined,
        is_verified: data.is_verified || false,
      });
    }
  };

  const handleDelete = () => {
    if (initialAgent) {
      deleteMutation.mutate({ id: initialAgent.id });
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Agent Profile" : "Create Agent Profile"}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? "Update Agent Information" : "Create New Agent"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Update your agent profile information below."
              : "Create your agent profile to start listing properties."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="agency_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agency Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter agency name"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
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
                        <Input
                          placeholder="Enter license number"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                        />
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
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={
                            typeof field.value === "number" && !Number.isNaN(field.value)
                              ? field.value
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(e.target.value ? Number(e.target.value) : undefined)
                          }
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
                      <Input
                        placeholder="e.g., Nairobi, Kiambu, Machakos"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
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
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Verified Agent</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEdit ? "Updating..." : "Creating..."}
                    </>
                  ) : isEdit ? (
                    "Update Agent"
                  ) : (
                    "Create Agent"
                  )}
                </Button>

                {isEdit && initialAgent && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" disabled={isLoading}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Profile
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the agent
                          profile.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {initialAgent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Current Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Agency:</strong> {initialAgent.agency_name}
                </span>
              </div>
              {initialAgent.license_number && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>License:</strong> {initialAgent.license_number}
                  </span>
                </div>
              )}
              {initialAgent.specialization && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Specialization:</strong>{" "}
                    <Badge variant="secondary">{initialAgent.specialization}</Badge>
                  </span>
                </div>
              )}
              {initialAgent.service_areas && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Service Areas:</strong> {initialAgent.service_areas}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Verified:</strong>{" "}
                  <Badge variant={initialAgent.is_verified ? "default" : "secondary"}>
                    {initialAgent.is_verified ? "Yes" : "No"}
                  </Badge>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
