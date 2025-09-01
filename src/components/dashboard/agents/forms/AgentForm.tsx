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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { AgentsCreate, AgentsResponse, AgentsUpdate, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Building2, CheckCircle, FileText, Loader2, MapPin, Star, Trash2, User, Users } from "lucide-react";
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
        agency_name: data.agency_name,
        license_number: data.license_number || undefined,
        specialization: data.specialization || undefined,
        service_areas: data.service_areas || undefined,
        years_experience: data.years_experience || undefined,
        is_verified: data.is_verified,
      });
    } else {
      createMutation.mutate({
        user_id: currentUser.id,
        agency_name: data.agency_name,
        license_number: data.license_number || undefined,
        specialization: data.specialization || undefined,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <SelectItem value="">No specialization</SelectItem>
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
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Agency Name
                </label>
                <p className="text-lg font-medium">{initialAgent.agency_name || "Not provided"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Agent Name
                </label>
                <p className="text-lg font-medium">
                  {initialAgent.expand?.user_id?.name || initialAgent.expand?.user_id?.email || currentUser.name || currentUser.email}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  License Number
                </label>
                <p className="text-lg">{initialAgent.license_number || "Not provided"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Experience
                </label>
                <p className="text-lg">
                  {initialAgent.years_experience ? `${initialAgent.years_experience} years` : "Not provided"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Specialization
                </label>
                <p className="text-lg capitalize">
                  {initialAgent.specialization || "Not specified"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Service Areas
                </label>
                <p className="text-lg">{initialAgent.service_areas || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Agent Profile</Badge>
                {initialAgent.is_verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
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
