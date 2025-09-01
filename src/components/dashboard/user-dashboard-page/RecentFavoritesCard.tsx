import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecentFavorite {
  id: string;
  property: PropertiesResponse
  created: string;
}

interface RecentFavoritesCardProps {
  favorites: RecentFavorite[];
}

function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  } catch {
    return 'recently';
  }
}

export function RecentFavoritesCard({ favorites }: RecentFavoritesCardProps) {
  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No favorites yet. Start exploring properties!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Favorites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {favorites.map((favorite) => {
          const primaryImage = favorite.property.image_url || (Array.isArray(favorite.property.images) && favorite.property.images.length > 0 ? favorite.property.images[0] : null);
          const imageUrl = primaryImage && typeof primaryImage === 'string' 
            ? getImageThumbnailUrl(favorite.property, primaryImage, "64x64")
            : null;
          
          return (
            <div key={favorite.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={favorite.property.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            <div className="flex-1 min-w-0">
              <Link href={`/properties/${favorite.property.id}`} className="block">
                <h3 className="font-medium text-sm truncate hover:text-primary">
                  {favorite.property.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {favorite.property.location}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {favorite.property.property_type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {favorite.property.listing_type}
                  </Badge>
                </div>
              </Link>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="font-medium text-sm">
                ${favorite.property.price?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(favorite.created)}
              </p>
            </div>
          </div>
        );
        })}
        <div className="pt-2">
          <Link 
            href="/dashboard/favorites" 
            className="text-sm text-primary hover:underline"
          >
            View all favorites →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
