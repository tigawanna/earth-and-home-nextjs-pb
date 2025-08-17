"use client";

import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { TextFieldComponent, NumberFieldComponent } from "../form-fields";

interface LocationSectionProps {
  control: Control<PropertyFormData>;
}

export function LocationSection({ control }: LocationSectionProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-earth-green-500 to-earth-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-lg">2</span>
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">Location Details</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Provide precise location information to help buyers find your property
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Primary Location */}
        <div className="relative p-6 rounded-xl shadow-md shadow-primary/15" >
          <div className="absolute -top-3 left-4 bg-card px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-earth-green-600">Primary Location</span>
          </div>
          <TextFieldComponent
            control={control}
            name="location"
            label="Location Description"
            placeholder="e.g., Westlands, Nairobi"
            description="General area or neighborhood description"
            required
          />
        </div>

        {/* Address Details */}
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-xl p-6">
            <TextFieldComponent
              control={control}
              name="streetAddress"
              label="Street Address"
              placeholder="Enter street address"
              description="Specific street address or plot number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/50 rounded-xl p-6">
              <TextFieldComponent
                control={control}
                name="city"
                label="City"
                placeholder="Enter city"
              />
            </div>
            
            <div className="bg-muted/50 rounded-xl p-6">
              <TextFieldComponent
                control={control}
                name="state"
                label="County/State"
                placeholder="Enter county"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/50 rounded-xl p-6">
              <TextFieldComponent
                control={control}
                name="postalCode"
                label="Postal Code"
                placeholder="Enter postal code"
              />
            </div>
            
            <div className="bg-muted/50 rounded-xl p-6">
              <TextFieldComponent
                control={control}
                name="country"
                label="Country"
                placeholder="Kenya"
              />
            </div>
          </div>
        </div>

        {/* GPS Coordinates */}
        <div className="relative p-6 rounded-xl bg-muted/30 shadow-md shadow-primary/15">
          <div className="absolute -top-3 left-4 bg-card px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-muted-foreground">📍 GPS Coordinates (Optional)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
            <NumberFieldComponent
              control={control}
              name="latitude"
              label="Latitude"
              placeholder="e.g., -1.2921"
              description="Decimal degrees (optional)"
            />
            
            <NumberFieldComponent
              control={control}
              name="longitude"
              label="Longitude"
              placeholder="e.g., 36.8219"
              description="Decimal degrees (optional)"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
