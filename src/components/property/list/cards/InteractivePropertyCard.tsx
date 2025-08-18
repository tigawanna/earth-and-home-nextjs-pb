"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Edit, Eye, Heart, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BasePropertyCard } from "./BasePropertyCard";
import { LinkedPropertyCard } from "./LinkedPropertyCard";

type PropertiesResponseWithExpandedRelations = PropertiesResponse & {
  expand?: {
    owner_id?: UsersResponse[] | undefined;
    agent_id?: UsersResponse[] | undefined;
  } | undefined;
};

interface InteractivePropertyCardProps {
  property: PropertiesResponseWithExpandedRelations;
  className?: string;
  
  // Favorite functionality
  showFavoriteButton?: boolean;
  isFavorited?: boolean;
  onFavoriteToggle?: (propertyId: string, isFavorited: boolean) => Promise<void>;
  
  // Management actions (for dashboard)
  showManagementActions?: boolean;
  onEdit?: (propertyId: string) => void;
  onDelete?: (propertyId: string) => Promise<void>;
  onView?: (propertyId: string) => void;
  
  // Custom actions
  customActions?: React.ReactNode;
}

/**
 * Client-side interactive property card with favorite, edit, and other actions
 * Use this in client components, typically in dashboard areas
 */
export function InteractivePropertyCard({
  property,
  className,
  showFavoriteButton = false,
  isFavorited = false,
  onFavoriteToggle,
  showManagementActions = false,
  onEdit,
  onDelete,
  onView,
  customActions,
}: InteractivePropertyCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavoriteToggle = async () => {
    if (!onFavoriteToggle) return;
    
    setIsLoading(true);
    try {
      await onFavoriteToggle(property.id, favorited);
      setFavorited(!favorited);
      toast.success(favorited ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error("Failed to update favorite status");
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    // You might want to add a confirmation dialog here
    const confirmed = window.confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await onDelete(property.id);
      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
      console.error("Failed to delete property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Build footer actions
  const footerActions = (
    <div className="flex items-center gap-2">
      {/* Favorite button */}
      {showFavoriteButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          disabled={isLoading}
          className={favorited ? "text-red-500 hover:text-red-600" : ""}
        >
          <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
        </Button>
      )}

      {/* Management actions dropdown */}
      {showManagementActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(property.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(property.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Custom actions */}
      {customActions}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <LinkedPropertyCard
        href={`/dashboard/properties/${property.id}`}
        property={property}
        showFooterActions={true}
        footerActions={footerActions}
        className={isLoading ? "opacity-50 pointer-events-none" : ""}
      />
    </div>
  );
}

/**
 * Convenience component for dashboard property management
 */
export function DashboardPropertyCard({
  property,
  className,
  onFavoriteToggle,
  onEdit,
  onDelete,
  onView,
  isFavorited = false,
}: Omit<InteractivePropertyCardProps, 'showFavoriteButton' | 'showManagementActions'>) {
  return (
    <InteractivePropertyCard
      property={property}
      className={className}
      showFavoriteButton={true}
      showManagementActions={true}
      isFavorited={isFavorited}
      onFavoriteToggle={onFavoriteToggle}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
    />
  );
}

/**
 * Convenience component for public property listings with favorites
 */
export function FavoriteablePropertyCard({
  property,
  className,
  isFavorited = false,
  onFavoriteToggle,
}: Pick<InteractivePropertyCardProps, 'property' | 'className' | 'isFavorited' | 'onFavoriteToggle'>) {
  return (
    <InteractivePropertyCard
      property={property}
      className={className}
      showFavoriteButton={true}
      isFavorited={isFavorited}
      onFavoriteToggle={onFavoriteToggle}
    />
  );
}
