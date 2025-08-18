"use client";

import { Control, useWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { 
  NumberFieldComponent, 
  CurrencyFieldComponent,
  DateFieldComponent,
  SelectFieldComponent
} from "../form-fields";

// Common currencies with their symbols and names
const CURRENCIES = [
  { value: "KES", label: "KES - Kenyan Shilling (KSh)" },
  { value: "USD", label: "USD - US Dollar ($)" },
  { value: "EUR", label: "EUR - Euro (€)" },
  { value: "GBP", label: "GBP - British Pound (£)" },
  { value: "CAD", label: "CAD - Canadian Dollar (C$)" },
  { value: "AUD", label: "AUD - Australian Dollar (A$)" },
  { value: "JPY", label: "JPY - Japanese Yen (¥)" },
  { value: "CHF", label: "CHF - Swiss Franc (CHF)" },
  { value: "CNY", label: "CNY - Chinese Yuan (¥)" },
  { value: "INR", label: "INR - Indian Rupee (₹)" },
  { value: "ZAR", label: "ZAR - South African Rand (R)" },
  { value: "NGN", label: "NGN - Nigerian Naira (₦)" },
  { value: "GHS", label: "GHS - Ghanaian Cedi (₵)" },
  { value: "TZS", label: "TZS - Tanzanian Shilling (TSh)" },
  { value: "UGX", label: "UGX - Ugandan Shilling (USh)" },
];



interface PricingSectionProps {
  control: Control<PropertyFormData>;
}

export function PricingSection({ control }: PricingSectionProps) {
  const listingType = useWatch({ control, name: "listing_type" });
  const selectedCurrency = useWatch({ control, name: "currency" });
  const isSale = listingType === "sale";
  const isRent = listingType === "rent";

  return (
    <Card className="shadow-md shadow-primary/15">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-lg">💰</span>
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">Pricing & Fees</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Set competitive pricing to attract potential {isSale ? "buyers" : "tenants"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Currency and Main Price */}
        <div className="relative p-6 rounded-xl bg-muted/50 ">
          <div className="absolute -top-3 left-4  px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-accent-foreground">Primary Pricing</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectFieldComponent
              control={control}
              name="currency"
              label="Currency"
              placeholder="Select currency"
              description="Choose the currency for all pricing"
              options={CURRENCIES}
              required
            />

            {isSale && (
              <CurrencyFieldComponent
                control={control}
                name="sale_price"
                label="Sale Price"
                placeholder="Enter sale price"
                currency={selectedCurrency || "KES"}
                required
              />
            )}

            {isRent && (
              <CurrencyFieldComponent
                control={control}
                name="rental_price"
                label="Monthly Rent"
                placeholder="Enter monthly rental price"
                currency={selectedCurrency || "KES"}
                required
              />
            )}
          </div>
        </div>

        {/* Secondary Price Fields for Rent */}
        {isRent && (
          <div className="bg-muted/50 rounded-xl p-6">
            <h4 className="font-medium text-foreground mb-4">Rental Requirements</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CurrencyFieldComponent
                control={control}
                name="security_deposit"
                label="Security Deposit"
                placeholder="Enter security deposit amount"
                description="Typically 1-2 months rent"
                currency={selectedCurrency || "KES"}
              />

              <DateFieldComponent
                control={control}
                name="available_from"
                label="Available From"
                placeholder="Select availability date"
                description="When will the property be available for rent?"
              />
            </div>
          </div>
        )}

        {/* Additional Fees */}
        <div className="bg-muted/50 rounded-xl p-6">
          <h4 className="font-medium text-foreground mb-4">Additional Fees (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CurrencyFieldComponent
              control={control}
              name="hoa_fee"
              label="HOA Fee"
              placeholder="Monthly HOA fee"
              description="Homeowners Association fee (if applicable)"
              currency={selectedCurrency || "KES"}
            />

            <CurrencyFieldComponent
              control={control}
              name="annual_taxes"
              label="Annual Property Taxes"
              placeholder="Annual tax amount"
              description="Yearly property tax amount"
              currency={selectedCurrency || "KES"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
