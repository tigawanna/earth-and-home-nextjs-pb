"use client";

import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { 
  NumberFieldComponent, 
  SelectFieldComponent,
  TextFieldComponent 
} from "../form-fields";
import { isLandProperty } from "@/utils/forms";

interface LandSectionProps {
  control: Control<PropertyFormData>;
}

const zoningOptions = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "agricultural", label: "Agricultural" },
  { value: "industrial", label: "Industrial" },
  { value: "mixed_use", label: "Mixed Use" },
  { value: "recreational", label: "Recreational" },
  { value: "other", label: "Other" },
];

export function LandSection({ control }: LandSectionProps) {
  const propertyType = useWatch({ control, name: "property_type" });
  
  // Only show for land properties
  if (!isLandProperty(propertyType)) {
    return null;
  }

  return (
    <Card className="shadow-md shadow-primary/15">
      <CardHeader>
        <CardTitle>Land Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberFieldComponent
            control={control}
            name="lot_size_sqft"
            label="Lot Size (sq ft)"
            placeholder="Enter lot size in square feet"
            required
          />
          
          <NumberFieldComponent
            control={control}
            name="lot_size_acres"
            label="Lot Size (acres)"
            placeholder="Enter lot size in acres"
            description="Optional - will be calculated from sq ft if not provided"
          />
        </div>

        <TextFieldComponent
          control={control}
          name="dimensions"
          label="Lot Dimensions"
          placeholder="e.g., 100ft x 150ft"
          description="Length x Width or other dimension description"
        />

        <SelectFieldComponent
          control={control}
          name="zoning"
          label="Zoning"
          placeholder="Select zoning type"
          options={zoningOptions}
          required={isLandProperty(propertyType)}
          description="Current zoning designation for this land"
        />
      </CardContent>
    </Card>
  );
}
