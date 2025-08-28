"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  createPropertyMutationOptions,
  updatePropertyMutationOptions,
} from "@/data-access-layer/properties/property-mutations";
import { PropertiesCreate, PropertiesUpdate } from "@/lib/pocketbase/types/pb-types";
import { PropertiesResponseZod } from "@/lib/pocketbase/types/pb-zod";
import { FormErrorDisplay, FormStateDebug } from "@/lib/react-hook-form";
import { isLandProperty } from "@/utils/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUploadSection } from "./files/ImagesUploadSection";
import { PropertyFormData, PropertyFormSchema } from "./property-form-schema";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { BuildingSection } from "./sections/BuildingSection";
import { FeaturesAmenitiesSection } from "./sections/FeaturesAmenitiesSection";
import { LandSection } from "./sections/LandSection";
import { LocationSection } from "./sections/LocationSection";
import { MediaSection } from "./sections/MediaSection";
import { ParkingSection } from "./sections/ParkingSection";
import { PricingSection } from "./sections/PricingSection";

// Convert Partial<T> (undefined) to nullable properties (null)
type Nullable<T> = {
  [K in keyof T]?: T[K] | null;
};

interface PropertyFormProps {
  initialData?: PropertiesResponseZod;
  isEdit?: boolean;
  propertyId?: string; // Add propertyId for editing
  user: UsersResponse | null;
}

export default function PropertyForm({
  initialData,
  isEdit = false,
  propertyId,
  user,
}: PropertyFormProps) {
  const router = useRouter();
  const [isSubmittingDraft, submitDraft] = useTransition();
  const form = useForm({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      // ...defaultPropertyFormValues,
      ...initialData
    },
  });

  // Watch property type for conditional rendering
  const propertyType = useWatch({ control: form.control, name: "property_type" });
  const isLand = isLandProperty(propertyType);

  const createPropertyMutation = useMutation({
    ...createPropertyMutationOptions,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        // Redirect to the property page or dashboard
        form.reset();
        if (data.record?.id) {
          router.push(`/properties/${data.record.id}`);
        } else {
          router.push("/dashboard/properties");
        }
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.error("Property mutation error:", error);
      toast.error("Failed to save property. Please try again.");
    },
  });

  const updatePropertyMutation = useMutation({
    ...updatePropertyMutationOptions,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        // Redirect to the property page or dashboard
        form.reset();
        if (data.record?.id) {
          router.push(`/properties/${data.record.id}`);
        } else {
          router.push("/dashboard/properties");
        }
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.error("Property mutation error:", error);
      toast.error("Failed to save property. Please try again.");
    },
  });

  const handleSubmit = async (values: PropertyFormData) => {
    try {
      if (isEdit && propertyId) {
        const payload = { ...values } as PropertiesUpdate;
        await updatePropertyMutation.mutateAsync(payload);
      } else {
        await createPropertyMutation.mutateAsync(values as PropertiesCreate);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save property. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    data.status = "draft";

    submitDraft(async () => {
      try {
        if (isEdit && propertyId) {
          const payload = {...data } as PropertiesUpdate;
          await updatePropertyMutation.mutateAsync(payload);
        } else {
          await createPropertyMutation.mutateAsync(data as PropertiesCreate);
        }
      } catch (error) {
        console.error("Save draft error:", error);
        toast.error("Failed to save draft. Please try again.");
      }
    });
  };

  const handlePublish = async () => {
    const data = form.getValues();
    data.status = "active";
    await handleSubmit(data);
  };

  // React Query v5 typing can make isLoading not directly visible on the result in some cases,
  // use `status === 'loading'` which is stable and typed.
  const isSubmitting = createPropertyMutation.isPending || updatePropertyMutation.isPending;

  const existingProperty = isEdit
    ? {
        id: initialData?.id || "",
        collectionId: initialData?.collectionId || "",
        collectionName: initialData?.collectionName || "",
        images: initialData?.images || [],
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl mb-4">
            <span className="text-2xl">🏠</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            {isEdit ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEdit
              ? "Update your property information with ease"
              : "Create a stunning property listing that attracts the right buyers"}
          </p>
          {propertyType && (
            <div className="flex justify-center">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 ${
                  isLand
                    ? "bg-earth-green-50 border-earth-green-200 text-earth-green-800 dark:bg-earth-green-950 dark:border-earth-green-800 dark:text-earth-green-200"
                    : "bg-accent border-accent-foreground/20 text-accent-foreground"
                }`}>
                <span className="text-lg">{isLand ? "🏞️" : "🏠"}</span>
                {isLand ? "Land Property" : "Building Property"}
              </div>
            </div>
          )}
        </div>

        {/* <FormPersist form={form} formKey="property-form" /> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePublish)} className="space-y-8">
            {/* Progress Indicator */}
            <div className="bg-card rounded-xl p-6 b shadow-md shadow-primary/15">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>Step by step</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                toast("Hello from button");
              }}>
              hello
            </Button>

            {/* Basic Information - Enhanced */}
            <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
              <BasicInfoSection control={form.control as any} />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Location Details - Enhanced */}
            <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
              <LocationSection control={form.control as any} />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Conditional Sections based on Property Type */}
            {!isLand && (
              <>
                {/* Building Information - Enhanced */}
                <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
                  <BuildingSection control={form.control as any} />
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Parking & Climate Control - Enhanced */}
                <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
                  <ParkingSection control={form.control as any} />
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </>
            )}

            {isLand && (
              <>
                {/* Land Information - Enhanced */}
                <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
                  <LandSection control={form.control as any} />
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </>
            )}

            {/* Pricing - Enhanced */}
            <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
              <PricingSection control={form.control as any} />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Features & Amenities - Enhanced */}
            <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
              <FeaturesAmenitiesSection control={form.control as any} />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Images Upload - Enhanced */}
            <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
              <ImagesUploadSection
                control={form.control as any}
                existingProperty={existingProperty}
              />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Media - Enhanced */}
            <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
              <MediaSection control={form.control as any} />
            </div>

            {/* Enhanced Form Actions */}
            <div className="bg-gradient-to-r from-card to-muted rounded-xl border border-border shadow-sm overflow-hidden">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSubmittingDraft}
                    size="lg"
                    className="flex ">
                    {isSubmittingDraft ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    Save as Draft
                  </Button>

                  <Button type="submit" disabled={isSubmitting} size="lg" className="flex">
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    {isEdit ? "Update Property" : "Publish Property"}
                  </Button>
                </div>

                {/* Enhanced Error Display */}
                <FormErrorDisplay form={form} />

                {/* Form State Debug (dev only) */}
                <FormStateDebug form={form} />
              </CardContent>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
