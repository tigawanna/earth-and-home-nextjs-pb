"use client";

import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { 
  NumberFieldComponent, 
  SelectFieldComponent 
} from "../form-fields";
import { isLandProperty } from "@/utils/forms";

interface ParkingSectionProps {
  control: Control<PropertyFormData>;
}

const parkingTypeOptions = [
  { value: "garage", label: "Garage" },
  { value: "carport", label: "Carport" },
  { value: "street", label: "Street Parking" },
  { value: "covered", label: "Covered Parking" },
  { value: "assigned", label: "Assigned Spot" },
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

export function ParkingSection({ control }: ParkingSectionProps) {
  const propertyType = useWatch({ control, name: "property_type" });
  
  // Hide for land properties
  if (isLandProperty(propertyType)) {
    return null;
  }

  return (
    <Card className="shadow-md shadow-primary/15">
      <CardHeader>
        <CardTitle>Parking & Utilities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberFieldComponent
            control={control}
            name="parking_spaces"
            label="Parking Spaces"
            placeholder="Number of parking spaces"
            description="Total number of parking spaces available"
          />
          
          <SelectFieldComponent
            control={control}
            name="parking_type"
            label="Parking Type"
            placeholder="Select parking type"
            options={parkingTypeOptions}
            description="Type of parking available"
          />
        </div>

        {/* HVAC Systems */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectFieldComponent
            control={control}
            name="heating"
            label="Heating System"
            placeholder="Select heating type"
            options={heatingOptions}
            description="Primary heating system"
          />
          
          <SelectFieldComponent
            control={control}
            name="cooling"
            label="Cooling System"
            placeholder="Select cooling type"
            options={coolingOptions}
            description="Primary cooling system"
          />
        </div>
      </CardContent>
    </Card>
  );
}
