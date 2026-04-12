"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  revalidatePropertiesList,
  revalidatePropertyById,
} from "@/data-access-layer/actions/revalidate-actions";
import {
  createPropertyMutationOptions,
  updatePropertyMutationOptions,
} from "@/data-access-layer/properties/property-mutations";
import type {
  AgentsResponse,
  PropertiesCreate,
  PropertiesUpdate,
  UsersResponse,
} from "@/types/domain-types";
import { FormErrorDisplay, FormStateDebug } from "@/lib/react-hook-form";
import { isLandProperty } from "@/utils/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUploadSection } from "./files/ImagesUploadSection";
import { preparePropertyFormForApi } from "@/lib/property/prepare-property-for-api";
import { PropertyFormData, PropertyFormSchema } from "./property-form-schema";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { BuildingSection } from "./sections/BuildingSection";
import { FeaturesAmenitiesSection } from "./sections/FeaturesAmenitiesSection";
import { LandSection } from "./sections/LandSection";
import { LocationSection } from "./sections/LocationSection";
import { MediaSection } from "./sections/MediaSection";
import { ParkingSection } from "./sections/ParkingSection";
import { PricingSection } from "./sections/PricingSection";
import { DevRandomPropertyFillButton } from "./DevRandomPropertyFillButton";

interface PropertyFormProps {
  initialData?: PropertyFormData & { id?: string };
  isEdit?: boolean;
  propertyId?: string;
  user: UsersResponse;
  agent: AgentsResponse;
}

export default function PropertyForm({
  initialData,
  isEdit = false,
  propertyId,
  user: _user,
  agent,
}: PropertyFormProps) {
  const agentId = agent.id;
  const router = useRouter();
  const [isSubmittingDraft, submitDraft] = useTransition();
  const [imagesUploading, setImagesUploading] = useState(false);
  const draftPropertyId = useMemo(() => crypto.randomUUID(), []);
  const effectivePropertyId = propertyId ?? draftPropertyId;
  const initialFeaturedIndex = (() => {
    const images = initialData?.images as string[] | undefined;
    const main = initialData?.image_url;
    if (images?.length && main && typeof main === "string") {
      const i = images.indexOf(main);
      return i >= 0 ? i : 0;
    }
    return 0;
  })();

  const form = useForm({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      ...initialData,
      agent_id: agentId,
      featured_image_index: initialFeaturedIndex,
    },
  });

  // Watch property type for conditional rendering
  const propertyType = useWatch({ control: form.control, name: "property_type" });
  const isLand = isLandProperty(propertyType);

  const createPropertyMutation = useMutation({
    ...createPropertyMutationOptions,
    onSuccess: (data) => {
      if (data.success) {
        revalidatePropertiesList();
        toast.success(data.message);
        form.reset();
        const record = data.record as { id?: string } | null;
        if (record?.id) {
          router.push(`/properties/${record.id}`);
        } else {
          router.push("/dashboard/properties");
        }
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.log("error happende = =>\n", "Property mutation error:", error);
      toast.error("Failed to save property. Please try again.");
    },
  });

  const updatePropertyMutation = useMutation({
    ...updatePropertyMutationOptions,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        form.reset();
        revalidatePropertiesList();
        const record = data.record as { id?: string } | null;
        if (record?.id) {
          revalidatePropertyById(record.id);
          router.push(`/properties/${record.id}`);
        } else {
          router.push("/dashboard/properties");
        }
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.log("error happende = =>\n", "Property mutation error:", error);
      toast.error("Failed to save property. Please try again.");
    },
  });

  const submitProperty = async (values: PropertyFormData) => {
    const prepared = preparePropertyFormForApi(values);
    if (isEdit && propertyId) {
      await updatePropertyMutation.mutateAsync({
        ...(prepared as PropertiesUpdate),
        id: propertyId,
      });
    } else {
      await createPropertyMutation.mutateAsync({
        ...(prepared as PropertiesCreate),
        id: draftPropertyId,
      });
    }
  };

  const handleSaveDraft = () => {
    const data = form.getValues();
    data.status = "draft";

    submitDraft(async () => {
      try {
        await submitProperty(data);
      } catch (error) {
        console.error("Save draft error:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to save draft. Please try again.",
        );
      }
    });
  };

  const handlePublish = async () => {
    const data = form.getValues();
    data.status = "active";
    try {
      await submitProperty(data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save property. Please try again.",
      );
    }
  };

  const isBusy =
    createPropertyMutation.isPending ||
    updatePropertyMutation.isPending ||
    isSubmittingDraft ||
    imagesUploading;

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
                }`}
              >
                <span className="text-lg">{isLand ? "🏞️" : "🏠"}</span>
                {isLand ? "Land Property" : "Building Property"}
              </div>
            </div>
          )}
        </div>

        {/* <FormPersist form={form} formKey="property-form" /> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePublish)} className="space-y-8">
            {!isEdit && (
              <div className="flex justify-center">
                <DevRandomPropertyFillButton agentId={agentId} />
              </div>
            )}
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

            <div className="bg-card rounded-xl shadow-md shadow-primary/15 overflow-hidden">
              <ImagesUploadSection
                propertyId={effectivePropertyId}
                isExisting={isEdit}
                onUploadingChange={setImagesUploading}
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
                    disabled={isBusy}
                    size="lg"
                    title={
                      imagesUploading
                        ? "Wait until image uploads finish before saving"
                        : undefined
                    }
                  >
                    {isSubmittingDraft ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    {isSubmittingDraft ? "Saving..." : "Save as Draft"}
                  </Button>

                  <Button
                    type="submit"
                    disabled={isBusy}
                    size="lg"
                    title={
                      imagesUploading
                        ? "Wait until image uploads finish before publishing"
                        : undefined
                    }
                  >
                    {createPropertyMutation.isPending || updatePropertyMutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                    {createPropertyMutation.isPending || updatePropertyMutation.isPending
                      ? "Saving..."
                      : isEdit
                        ? "Update Property"
                        : "Publish Property"}
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
