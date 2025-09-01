"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { updatePropertyMutationOptions } from "@/data-access-layer/properties/property-mutations";
import { PropertiesResponse } from "@/lib/pocketbase/types/pb-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Edit,
    Eye,
    EyeOff,
    MapPin,
    MoreVertical,
    Settings,
    Sparkles,
    Star
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface PropertyAdminActionsProps {
  property: PropertiesResponse;
}

export function PropertyAdminActions({ property }: PropertyAdminActionsProps) {
  const queryClient = useQueryClient();

  const updatePropertyMutation = useMutation({
    ...updatePropertyMutationOptions,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["properties"] });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Failed to update property");
    },
  });

  const handleToggle = async (field: keyof PropertiesResponse, value: any) => {
    await updatePropertyMutation.mutateAsync({
      id: property.id,
      [field]: value,
    });
  };

  const handleStatusChange = async (status: string) => {
    await handleToggle("status", status);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "sold":
        return "destructive";
      case "rented":
        return "outline";
      case "draft":
        return "secondary";
      case "off_market":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Eye className="w-3 h-3" />;
      case "pending":
        return <Sparkles className="w-3 h-3" />;
      case "sold":
      case "rented":
        return <Star className="w-3 h-3" />;
      case "draft":
        return <Edit className="w-3 h-3" />;
      case "off_market":
        return <EyeOff className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Admin Controls
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Property Admin Controls
          </DialogTitle>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 px-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Quick Actions
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Link
                      className="mr-2 h-4 w-4"
                      href={`/dashboard/properties/${property.id}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Property
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(property.id)}>
                    <MapPin className="mr-2 h-4 w-4" />
                    Copy ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 px-0">
            {/* Status Quick Change */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between h-8">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(property.status)}
                      <span className="capitalize">{property.status.replace("_", " ")}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(property.status)} className="h-5 text-xs">
                      {property.status}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {["draft", "active", "pending", "sold", "rented", "off_market"].map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="capitalize">{status.replace("_", " ")}</span>
                      </div>
                      {property.status === status && (
                        <Badge variant={getStatusBadgeVariant(status)} className="h-4 text-xs">
                          Current
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Quick Toggles */}
            <div className="space-y-3">
              <TooltipProvider>
                {/* Featured Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    <label className="text-sm font-medium">Featured</label>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch
                        checked={property.is_featured}
                        onCheckedChange={(checked) => handleToggle("is_featured", checked)}
                        disabled={updatePropertyMutation.isPending}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Show property in featured listings</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* New Property Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-500" />
                    <label className="text-sm font-medium">New</label>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch
                        checked={property.is_new}
                        onCheckedChange={(checked) => handleToggle("is_new", checked)}
                        disabled={updatePropertyMutation.isPending}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as new property listing</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>

            {/* Property Type Quick Change */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Property Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start h-8">
                    <span className="capitalize">{property.property_type.replace("_", " ")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {[
                    "house",
                    "apartment",
                    "condo",
                    "townhouse",
                    "duplex",
                    "studio",
                    "villa",
                    "land",
                    "commercial",
                    "industrial",
                    "farm",
                  ].map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => handleToggle("property_type", type)}
                      className="flex items-center justify-between">
                      <span className="capitalize">{type.replace("_", " ")}</span>
                      {property.property_type === type && (
                        <Badge variant="secondary" className="h-4 text-xs">
                          Current
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Listing Type Quick Change */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Listing Type</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-start h-8">
                    <span className="capitalize">{property.listing_type}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {["sale", "rent"].map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => handleToggle("listing_type", type)}
                      className="flex items-center justify-between">
                      <span className="capitalize">{type}</span>
                      {property.listing_type === type && (
                        <Badge variant="secondary" className="h-4 text-xs">
                          Current
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {updatePropertyMutation.isPending && (
              <div className="text-xs text-muted-foreground text-center py-2">
                Updating property...
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
