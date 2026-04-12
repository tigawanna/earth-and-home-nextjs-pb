"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isNodeEnvDevelopment } from "@/lib/env/dev-mode";
import { Control, useWatch } from "react-hook-form";
import { Copy, Fingerprint } from "lucide-react";
import { toast } from "sonner";
import { TextFieldComponent } from "../form-fields";
import type { PropertyFormData } from "../property-form-schema";

interface PropertyListingIdSectionProps {
  control: Control<PropertyFormData>;
}

export function PropertyListingIdSection({ control }: PropertyListingIdSectionProps) {
  const id = useWatch({ control, name: "id" }) as string | undefined;

  const copyId = () => {
    const v = id?.trim() ?? "";
    if (!v) return;
    void navigator.clipboard.writeText(v);
    toast.success("Listing ID copied");
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-muted to-muted/80 rounded-lg flex items-center justify-center">
            <Fingerprint className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg text-foreground">Listing ID</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Stable identifier used for this listing and for image paths in storage
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1 min-w-0">
            <TextFieldComponent
              control={control}
              name="id"
              label="ID"
              readOnly
              description="Read-only. New listings get an ID when you open this page."
            />
          </div>
          {isNodeEnvDevelopment() ? (
            <Button
              type="button"
              variant="outline"
              className="shrink-0"
              onClick={copyId}
              disabled={!id?.trim()}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
