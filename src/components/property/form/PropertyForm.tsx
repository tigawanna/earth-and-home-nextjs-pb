"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createProperty, updateProperty } from "@/DAL/drizzle/property-mutations";
import { FormErrorDisplay, FormStateDebug } from "@/lib/react-hook-form";
import { isLandProperty } from "@/utils/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ImagesUploadSection } from "./files/ImagesUploadSection";
import {
  PropertyFormData,
  propertyFormSchema
} from "./property-form-schema";
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
  initialData?: Nullable<PropertyFormData>;
  isEdit?: boolean;
  propertyId?: string; // Add propertyId for editing
}

export default function PropertyForm({
  initialData,
  isEdit = false,
  propertyId,
}: PropertyFormProps) {

  
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema) as any,
    defaultValues: {
      // ...defaultPropertyFormValues,
      ...initialData,
    } as PropertyFormData,
  });

  // Watch property type for conditional rendering
  const propertyType = useWatch({ control: form.control, name: "propertyType" });
  const isLand = isLandProperty(propertyType);

  const handleSubmit = async (data: PropertyFormData) => {
    startTransition(async () => {
      try {
        let result;
        if (isEdit && propertyId) {
          result = await updateProperty(propertyId, data);
        } else {
          result = await createProperty(data);
        }

        if (result.success) {
          toast.success(result.message);
          // Redirect to the property page or dashboard
          form.reset();
          if (result.property?.slug) {
            router.push(`/properties/${result.property.slug}`);
          } else {
            router.push("/dashboard/properties");
          }
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("Failed to save property. Please try again.");
      }
    });
  };

  const handleSaveDraft = async () => {
    const data = form.getValues();
    data.status = "draft";
    await handleSubmit(data);
  };

  const handlePublish = async () => {
    const data = form.getValues();
    data.status = "active";
    await handleSubmit(data);
  };

  const isSubmitButtonDisabled = isPending;

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
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300" 
                     style={{ width: "70%" }} />
              </div>
            </div>
            <Button type="button" variant={"outline"} onClick={()=>{
              toast("Hello from button")
            }}>hello</Button>

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
              <ImagesUploadSection control={form.control as any} propertyTitle={form.watch("title")} />
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
                    disabled={isPending}
                    size="lg"
                    className="flex ">
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    Save as Draft
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitButtonDisabled}
                    size="lg"
                    className="flex">
                    {isPending ? (
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
