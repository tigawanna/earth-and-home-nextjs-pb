"use client";

import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { 
  TextFieldComponent, 
  TextareaFieldComponent, 
  SelectFieldComponent 
} from "../form-fields";


interface BasicInfoSectionProps {
  control: Control<PropertyFormData>;
}

const propertyTypeOptions = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "duplex", label: "Duplex" },
  { value: "studio", label: "Studio" },
  { value: "villa", label: "Villa" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
  { value: "industrial", label: "Industrial" },
  { value: "farm", label: "Farm" },
];

const listingTypeOptions = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "sold", label: "Sold" },
  { value: "rented", label: "Rented" },
  { value: "off_market", label: "Off Market" },
];

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">1</span>
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">Basic Information</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Start by selecting your property type - this will determine which fields are available
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Property Type Selection - Most Important */}
        <div className="relative p-6 rounded-xl bg-muted/50">
          <div className="absolute -top-3 left-4 bg-card px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">Essential Details</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <SelectFieldComponent
                control={control}
                name="property_type"
                label="Property Type"
                placeholder="Select property type"
                options={propertyTypeOptions}
                required
                description="Choose whether you're listing land or a building"
              />
            </div>

            <div className="space-y-2">
              <SelectFieldComponent
                control={control}
                name="listing_type"
                label="Listing Type"
                placeholder="Select listing type"
                options={listingTypeOptions}
                required
                description="Are you selling or renting?"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-xl p-6">
            <TextFieldComponent
              control={control}
              name="title"
              label="Property Title"
              placeholder="Enter a descriptive title for your property"
              description="This will be the main headline for your property listing"
              required
            />
          </div>

          <div className="bg-muted/50 rounded-xl p-6">
            <TextareaFieldComponent
              control={control}
              name="description"
              label="Property Description"
              placeholder="Describe your property in detail..."
              description="Provide details about the property's features, condition, and highlights"
            />
          </div>

          <div className="bg-muted/50 rounded-xl p-6">
            <SelectFieldComponent
              control={control}
              name="status"
              label="Listing Status"
              placeholder="Select status"
              options={statusOptions}
              required
              description="Current status of your property listing"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
