"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/data-access-layer/pocketbase/favorite-mutations";
import { deleteProperty } from "@/data-access-layer/pocketbase/property-mutations";
import { PropertyWithAgent } from "@/data-access-layer/pocketbase/property-types";
import { Edit, Heart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PropertyCard } from "./PropertyCard";

interface ClientPropertyCardProps {
  property: PropertyWithAgent;
  showActions?: boolean;
  showFavorite?: boolean;
}

export function ClientPropertyCard({ 
  property, 
  showActions = true, 
  showFavorite = true
}: ClientPropertyCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    setIsDeleting(true);
    startTransition(async () => {
      const result = await deleteProperty(property.id);
      
      if (result.success) {
        toast.success(result.message);
        router.refresh(); // This will trigger a re-render of the server component
      } else {
        toast.error(result.message);
      }
      setIsDeleting(false);
    });
  };

  const handleFavorite = () => {
    startTransition(async () => {
      // TODO: Get current user ID from auth context or session
      // For now, we'll need to pass userId as a prop or get it from auth
      const userId = ""; // This needs to be implemented
      
      if (!userId) {
        toast.error("Please sign in to favorite properties");
        return;
      }
      
      const result = await toggleFavorite(property.id, userId);
      
      if (result.success) {
        toast.success(result.message);
        // Force a refresh to update favorite status
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const clientActions = (
    <div className="flex gap-2 pt-2">
      <Button asChild variant="outline" size="sm" className="flex-1">
        <Link href={`/properties/${property.id}`}>
          View Details
        </Link>
      </Button>

      {showFavorite && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleFavorite}
          disabled={isPending}
        >
          <Heart 
            className={`h-4 w-4 ${
              property.isFavorited 
                ? "fill-red-500 text-red-500" 
                : ""
            }`} 
          />
        </Button>
      )}

      {showActions && (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/properties/${property.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="hover:bg-destructive hover:text-destructive-foreground"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Property</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{property.title}"? 
                  This will also delete all associated images and documents. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Property
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );

  return (
    <PropertyCard
      property={property}
      customActions={clientActions}
    />
  );
}
