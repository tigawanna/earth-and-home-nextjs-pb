"use client";

import { Control } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyFormData } from "../property-form-schema";
import { TextFieldComponent } from "../form-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface MediaSectionProps {
  control: Control<PropertyFormData>;
}

export function MediaSection({ control }: MediaSectionProps) {
  return (
    <Card className="shadow-md shadow-primary/15">
      <CardHeader>
        <CardTitle>Media & Virtual Tours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Image upload functionality will be implemented later. For now, you can provide URLs to existing images.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <TextFieldComponent
            control={control}
            name="image_url"
            label="Primary Image URL"
            placeholder="https://example.com/image.jpg"
            description="URL to the main property image"
          />
          
          <TextFieldComponent
            control={control}
            name="video_url"
            label="Video URL"
            placeholder="https://youtube.com/watch?v=..."
            description="YouTube, Vimeo, or other video platform URL"
          />
          
          <TextFieldComponent
            control={control}
            name="virtual_tour_url"
            label="Virtual Tour URL"
            placeholder="https://matterport.com/..."
            description="360° virtual tour or walkthrough URL"
          />
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Coming Soon</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Drag & drop image upload</li>
            <li>• Image gallery management</li>
            <li>• Automatic image resizing</li>
            <li>• Video thumbnail generation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
