"use client";
import PropertyForm from "@/components/-oldproperty/form/PropertyForm";
import { createBrowserClient } from "@/lib/pocketbase/browser-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SinglePropertyNotFound } from "../query-states";

interface EditPropertyProps {
  id: string;
}

export function EditProperty({ id }: EditPropertyProps) {
  const { data } = useSuspenseQuery({
    queryKey: ["properties", id],
    queryFn: async () => {
      try {
        const client = createBrowserClient();
        const property = await client.from("properties").getOne(id);
        return {
          property,
          success: true,
          message: "Successfully fetched",
        };
      } catch (error: unknown) {
        return {
          property: null,
          success: false,
          message: error instanceof Error ? error.message : String(error),
        };
      }
    },
  });

  const result = data

  if (!result.success || !result.property) {
    return <SinglePropertyNotFound />;
  }

  const property = result.property;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <PropertyForm
        initialData={{
          ...property,
          images: property.images as string[] || [],
        }}
        propertyId={id}
        isEdit
      />
    </div>
  );
}
