"use client";

import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { NumberFieldComponent, SelectFieldComponent } from "../form-fields";
import { isLandProperty } from "@/utils/forms";

interface BuildingSectionProps {
  control: Control<PropertyFormData>;
}

const parkingTypeOptions = [
  { value: "garage", label: "Garage" },
  { value: "carport", label: "Carport" },
  { value: "street", label: "Street Parking" },
  { value: "covered", label: "Covered Parking" },
  { value: "assigned", label: "Assigned Parking" },
  { value: "none", label: "No Parking" },
];

const heatingOptions = [
  { value: "none", label: "None" },
  { value: "electric", label: "Electric" },
  { value: "gas", label: "Gas" },
  { value: "oil", label: "Oil" },
  { value: "heat_pump", label: "Heat Pump" },
  { value: "solar", label: "Solar" },
  { value: "geothermal", label: "Geothermal" },
];

const coolingOptions = [
  { value: "none", label: "None" },
  { value: "central", label: "Central AC" },
  { value: "wall_unit", label: "Wall Unit" },
  { value: "evaporative", label: "Evaporative" },
  { value: "geothermal", label: "Geothermal" },
];

export function BuildingSection({ control }: BuildingSectionProps) {
  const propertyType = useWatch({ control, name: "propertyType" });
  
  // Hide for land properties
  if (isLandProperty(propertyType)) {
    return null;
  }

  return (
    <Card className="shadow-md shadow-primary/15">
      <CardHeader>
        <CardTitle>Building Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberFieldComponent
            control={control}
            name="buildingSizeSqft"
            label="Building Size (sq ft)"
            placeholder="Enter building size"
            description="Total interior floor area"
          />
          
          <NumberFieldComponent
            control={control}
            name="yearBuilt"
            label="Year Built"
            placeholder="Enter year"
            description="Year construction was completed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NumberFieldComponent
            control={control}
            name="floors"
            label="Number of Floors"
            placeholder="Enter floors"
          />
          
          <NumberFieldComponent
            control={control}
            name="beds"
            label="Bedrooms"
            placeholder="Enter bedrooms"
            required
          />
          
          <NumberFieldComponent
            control={control}
            name="baths"
            label="Bathrooms"
            placeholder="Enter bathrooms"
            required
          />
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NumberFieldComponent
            control={control}
            name="parkingSpaces"
            label="Parking Spaces"
            placeholder="Enter number of spaces"
            description="Number of parking spaces available"
          />
          
          <SelectFieldComponent
            control={control}
            name="parkingType"
            label="Parking Type"
            placeholder="Select parking type"
            options={parkingTypeOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectFieldComponent
            control={control}
            name="heating"
            label="Heating System"
            placeholder="Select heating system"
            options={heatingOptions}
          />
          
          <SelectFieldComponent
            control={control}
            name="cooling"
            label="Cooling System"
            placeholder="Select cooling system"
            options={coolingOptions}
          />
        </div> */}
      </CardContent>
    </Card>
  );
}
