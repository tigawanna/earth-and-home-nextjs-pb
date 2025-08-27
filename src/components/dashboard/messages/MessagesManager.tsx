"use client";
import { Card, CardContent } from "@/components/ui/card";
import { browserPB } from "@/lib/pocketbase/clients/browser-client";
import { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AllPropertiesMessages from "./AllPropertiesMessages";
import PropertyMessagesView from "./PropertyMessagesView";

interface MessagesManagerProps {}

export default function MessagesManager({}: MessagesManagerProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  
  // Fetch property details when one is selected
  const { data: selectedProperty } = useQuery({
    queryKey: ["property", selectedPropertyId],
    queryFn: async () => {
      if (!selectedPropertyId) return null;
      try {
        const property = await browserPB.from("properties").getOne(selectedPropertyId);
        return property as PropertiesResponse;
      } catch (error) {
        console.error("Error fetching property:", error);
        return null;
      }
    },
    enabled: !!selectedPropertyId,
  });

  const handleViewPropertyMessages = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const handleBackToList = () => {
    setSelectedPropertyId(null);
  };

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        {selectedPropertyId ? (
          <PropertyMessagesView
            propertyId={selectedPropertyId}
            property={selectedProperty || undefined}
            onBack={handleBackToList}
          />
        ) : (
          <div className="p-6">
            <AllPropertiesMessages onViewPropertyMessages={handleViewPropertyMessages} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
