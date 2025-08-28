import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageWithProperty } from "@/data-access-layer/messages/properties-messages-collection";
import { getImageThumbnailUrl } from "@/lib/pocketbase/utils/files";
import { formatDistanceToNow } from "date-fns";
import { Clock, Home, User } from "lucide-react";
import Image from "next/image";

// ====================================================
// PROPERTY MESSAGE CARDS WITH LATEST MESSAGE PREVIEW
// ====================================================

interface PropertyMessageCardProps {
  message: MessageWithProperty;
  onViewMessages?: () => void;
}

export function PropertyMessageCard({ message, onViewMessages }: PropertyMessageCardProps) {
const property = message.expand?.property_id;
const user = message.expand?.user_id;

  const primaryImage =
    property?.image_url ||
    (Array.isArray(property?.images) && property?.images.length > 0 ? property?.images[0] : null);
  const imageUrl =
    primaryImage && typeof primaryImage === "string" && property
      ? getImageThumbnailUrl(property, primaryImage, "48x48")
      : null;
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onViewMessages}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Property Information */}
          <div className="flex items-start gap-3 flex-1">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {property && imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={property?.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1">{property?.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                {property?.city}, {property?.state}
              </CardDescription>
            </div>
          </div>

          {/* User Information */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right min-w-0">
              <div className="flex items-center justify-end gap-2">
                <h4 className="font-medium text-sm truncate">
                  {user?.name || "Anonymous User"}
                </h4>
                {message.admin_id && (
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "No email provided"}
              </p>
            </div>
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(message.created), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">{message.body}</p>
        </div>
      </CardContent>
    </Card>
  );
}

