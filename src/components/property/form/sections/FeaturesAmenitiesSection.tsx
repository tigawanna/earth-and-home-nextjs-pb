"use client";

import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { MultiSelectFieldComponent, SwitchFieldComponent } from "../form-fields";
import { COMMON_AMENITIES, COMMON_FEATURES, isLandProperty } from "@/utils/forms";

interface FeaturesAmenitiesSectionProps {
  control: Control<PropertyFormData>;
}

// Convert readonly arrays to regular arrays for the component
const amenityOptions = COMMON_AMENITIES.map((amenity) => ({
  value: amenity,
  label: amenity,
}));

const featureOptions = COMMON_FEATURES.map((feature) => ({
  value: feature,
  label: feature,
}));

const landFeatures = [
  "Flat Terrain",
  "Sloped",
  "Wooded",
  "Cleared",
  "Fenced",
  "Well Water",
  "Septic System",
  "Utilities Available",
  "Road Access",
  "Stream/Creek",
  "Pond",
  "Mountain View",
  "Corner Lot",
  "Cul-de-sac",
  "Agricultural Use",
  "Buildable",
  "Subdivided",
  "Conservation Area",
].map((feature) => ({ value: feature, label: feature }));

const commonUtilities = [
  { key: "electricity", label: "Electricity" },
  { key: "water", label: "Water" },
  { key: "sewer", label: "Sewer" },
  { key: "gas", label: "Natural Gas" },
  { key: "internet", label: "Internet/Cable Ready" },
  { key: "trash", label: "Trash Collection" },
];

export function FeaturesAmenitiesSection({ control }: FeaturesAmenitiesSectionProps) {
  const propertyType = useWatch({ control, name: "property_type" });
  const isLand = isLandProperty(propertyType);

  return (
    <Card className="shadow-md shadow-primary/15">
      <CardHeader>
        <CardTitle>Features & Amenities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-[10%] flex-wrap bg-muted/50 p-2 ">
          {/* Features */}
          <div>
            <MultiSelectFieldComponent
              control={control}
              name="features"
              label={isLand ? "Land Features" : "Property Features"}
              placeholder={isLand ? "Select land features..." : "Select property features..."}
              options={isLand ? landFeatures : featureOptions}
              description={
                isLand ? "Special characteristics of the land" : "Interior and exterior features"
              }
            />
          </div>

          {/* Amenities (not for land) */}
          {!isLand && (
            <div>
              <MultiSelectFieldComponent
                control={control}
                name="amenities"
                label="Amenities"
                placeholder="Select amenities..."
                options={amenityOptions}
                description="Available amenities and facilities"
              />
            </div>
          )}
        </div>
        {/* Utilities */}
        <div className="bg-muted/50 p-2">
          <h4 className="text-sm font-medium mb-3">Available Utilities</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {commonUtilities.map((utility) => (
              <SwitchFieldComponent
                key={utility.key}
                control={control}
                name={`utilities.${utility.key}` as keyof PropertyFormData}
                label={utility.label}
                description=""
              />
            ))}
          </div>
        </div>

        {/* Property Flags */}
        <div className="bg-muted/50 p-2">
          <h4 className="text-sm font-medium mb-3">Listing Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SwitchFieldComponent
              control={control}
              name="is_featured"
              label="Featured Listing"
              description="Highlight this property in search results"
            />

            <SwitchFieldComponent
              control={control}
              name="is_new"
              label="New Listing"
              description="Mark as a new property listing"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
