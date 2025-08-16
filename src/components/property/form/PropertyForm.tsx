"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  PropertyFormData,
  propertyFormSchema,
  defaultPropertyFormValues,
} from "./property-form-schema";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { LocationSection } from "./sections/LocationSection";
import { BuildingSection } from "./sections/BuildingSection";
import { LandSection } from "./sections/LandSection";
import { ParkingSection } from "./sections/ParkingSection";
import { PricingSection } from "./sections/PricingSection";
import { FeaturesAmenitiesSection } from "./sections/FeaturesAmenitiesSection";
import { MediaSection } from "./sections/MediaSection";
import { ImagesUploadSection } from "./files/ImagesUploadSection";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Save, Eye, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useWatch } from "react-hook-form";
import { isLandProperty } from "@/utils/forms";
import { FormPersist } from "@/lib/react-hook-form/FormPersist";
import { createProperty, updateProperty } from "@/DAL/drizzle/property-mutations";
import { useRouter } from "next/navigation";

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
  const errors = form.formState.errors;
  const isSubmitted = form.formState.isSubmitted;


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

  // Get all error messages for user display
  const getErrorMessages = () => {
    const errorMessages: string[] = [];

    const extractErrors = (obj: any, prefix = "") => {
      Object.keys(obj).forEach((key) => {
        if (obj[key]?.message) {
          errorMessages.push(`${prefix}${key}: ${obj[key].message}`);
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          extractErrors(obj[key], `${prefix}${key}.`);
        }
      });
    };

    extractErrors(errors);
    return errorMessages;
  };

  const errorMessages = getErrorMessages();
  const hasErrors = errorMessages.length > 0 && isSubmitted;

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
                {hasErrors && (
                  <div className="mt-6 p-6 bg-destructive/10 border-2 border-destructive/20 rounded-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-destructive/20 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <h4 className="font-semibold text-destructive text-lg">
                          Please fix the following errors:
                        </h4>
                        <ul className="text-sm text-destructive/80 space-y-2">
                          {errorMessages.slice(0, 5).map((error, index) => (
                            <li key={index} className="flex items-start gap-3 p-2 bg-destructive/5 rounded-lg">
                              <span className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                              <span className="font-medium">{error}</span>
                            </li>
                          ))}
                          {errorMessages.length > 5 && (
                            <li className="text-destructive/70 italic text-center py-2">
                              ... and {errorMessages.length - 5} more errors
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form State Debug (dev only) */}
                {process.env.NODE_ENV === "development" && (
                  <details className="mt-6 p-4 bg-muted rounded-xl border border-border">
                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      🔧 Form State (Development)
                    </summary>
                    <pre className="mt-3 text-xs overflow-auto text-muted-foreground bg-card p-3 rounded border">
                      {JSON.stringify(form.formState.errors, null, 2)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
