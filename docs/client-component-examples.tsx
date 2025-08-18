"use client";

import {
    DashboardPropertyCard,
    FavoriteablePropertyCard,
    InteractivePropertyCard
} from "@/components/property/list";
import { Button } from "@/components/ui/button";
import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Example property data type with expanded relations
type PropertyWithRelations = PropertiesResponse & {
  expand?: {
    owner_id?: UsersResponse[] | undefined;
    agent_id?: UsersResponse[] | undefined;
  } | undefined;
  isFavorited?: boolean;
};

interface ClientPropertyListingProps {
  properties: PropertyWithRelations[];
}

/**
 * Client Component Example: User's favorite properties dashboard
 */
export function FavoritePropertiesDashboard({ properties }: ClientPropertyListingProps) {
  const [favoriteProperties, setFavoriteProperties] = useState(properties);

  const handleFavoriteToggle = async (propertyId: string, isFavorited: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isFavorited) {
      // Remove from favorites
      setFavoriteProperties(prev => prev.filter(p => p.id !== propertyId));
    } else {
      // This shouldn't happen in a favorites list, but handle it
      setFavoriteProperties(prev => 
        prev.map(p => p.id === propertyId ? { ...p, isFavorited: false } : p)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteProperties.length} saved propert{favoriteProperties.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
      </div>

      {favoriteProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No favorite properties yet.</p>
          <Button asChild>
            <a href="/properties">Browse Properties</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <FavoriteablePropertyCard
              key={property.id}
              property={property}
              isFavorited={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Client Component Example: Property management dashboard for agents/owners
 */
export function PropertyManagementDashboard({ properties }: ClientPropertyListingProps) {
  const [managedProperties, setManagedProperties] = useState(properties);
  const router = useRouter();

  const handleEdit = (propertyId: string) => {
    router.push(`/dashboard/properties/${propertyId}/edit`);
  };

  const handleView = (propertyId: string) => {
    router.push(`/dashboard/properties/${propertyId}`);
  };

  const handleDelete = async (propertyId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setManagedProperties(prev => prev.filter(p => p.id !== propertyId));
    toast.success("Property deleted successfully");
  };

  const handleFavoriteToggle = async (propertyId: string, isFavorited: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setManagedProperties(prev =>
      prev.map(p => 
        p.id === propertyId ? { ...p, isFavorited: !isFavorited } : p
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Property Management</h1>
          <p className="text-muted-foreground">
            Manage your {managedProperties.length} propert{managedProperties.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/properties/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managedProperties.map((property) => (
          <DashboardPropertyCard
            key={property.id}
            property={property}
            isFavorited={property.isFavorited}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Client Component Example: Public property listing with favorites
 */
export function PublicPropertyListingWithFavorites({ properties }: ClientPropertyListingProps) {
  const [propertyList, setPropertyList] = useState(properties);

  const handleFavoriteToggle = async (propertyId: string, isFavorited: boolean) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setPropertyList(prev =>
      prev.map(p => 
        p.id === propertyId ? { ...p, isFavorited: !isFavorited } : p
      )
    );
    
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
        <p className="text-muted-foreground">Discover your dream home from our curated selection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {propertyList.map((property) => (
          <FavoriteablePropertyCard
            key={property.id}
            property={property}
            isFavorited={property.isFavorited}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Client Component Example: Custom interactive card with additional actions
 */
export function CustomInteractivePropertyGrid({ properties }: ClientPropertyListingProps) {
  const [propertyList, setPropertyList] = useState(properties);

  const handleShare = (propertyId: string) => {
    const property = propertyList.find(p => p.id === propertyId);
    if (property) {
      navigator.clipboard.writeText(`${window.location.origin}/properties/${propertyId}`);
      toast.success("Property link copied to clipboard");
    }
  };

  const handleCompare = (propertyId: string) => {
    // Add to comparison list logic
    toast.success("Added to comparison");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Property Listings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propertyList.map((property) => (
          <InteractivePropertyCard
            key={property.id}
            property={property}
            showFavoriteButton={true}
            isFavorited={property.isFavorited}
            onFavoriteToggle={async (id, favorited) => {
              await new Promise(resolve => setTimeout(resolve, 300));
              setPropertyList(prev =>
                prev.map(p => p.id === id ? { ...p, isFavorited: !favorited } : p)
              );
            }}
            customActions={
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShare(property.id);
                  }}
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCompare(property.id);
                  }}
                >
                  Compare
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
