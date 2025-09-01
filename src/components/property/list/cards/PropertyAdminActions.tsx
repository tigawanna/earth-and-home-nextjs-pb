"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PropertyAdminActionsProps {
  property: PropertiesResponse;
}

export function PropertyAdminActions({ property }: PropertyAdminActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const updatePropertyMutation = useMutation({
    ...updatePropertyMutationOptions,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["properties"] });
        router.refresh()
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
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 group shadow-sm"
        >
          <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
          <span className="font-medium">Quick toggles</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-0 shadow-2xl bg-gradient-to-br from-background via-background to-accent/5">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            Property Admin Controls
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Quick Actions Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 border-0 shadow-lg">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-border to-transparent" />
                <DropdownMenuItem className="hover:bg-accent/50 transition-colors group">
                  <Link
                    className="flex items-center w-full"
                    href={`/dashboard/properties/${property.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Edit className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                    <span>Edit Property</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    navigator.clipboard.writeText(property.id);
                    toast.success("Property ID copied to clipboard");
                  }}
                  className="hover:bg-accent/50 transition-colors group"
                >
                  <MapPin className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                  <span>Copy Property ID</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Quick Change */}
          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Status Management
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-between h-10 hover:bg-background/50 transition-all duration-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-md bg-background/80">
                      {getStatusIcon(property.status)}
                    </div>
                    <span className="capitalize font-medium">{property.status.replace("_", " ")}</span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(property.status)} className="h-6 px-3 font-medium shadow-sm">
                    {property.status}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 border-0 shadow-lg">
                {["draft", "active", "pending", "sold", "rented", "off_market"].map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="flex items-center justify-between hover:bg-accent/50 transition-colors py-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-md bg-accent/20 group-hover:bg-accent/40 transition-colors">
                        {getStatusIcon(status)}
                      </div>
                      <span className="capitalize font-medium">{status.replace("_", " ")}</span>
                    </div>
                    {property.status === status && (
                      <Badge variant={getStatusBadgeVariant(status)} className="h-5 text-xs font-medium shadow-sm">
                        Current
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick Toggles */}
          <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Feature Toggles
            </label>
            <TooltipProvider>
              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/50 hover:border-border transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Star className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Featured Property</label>
                    <p className="text-xs text-muted-foreground">Highlight in featured listings</p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch
                      checked={property.is_featured}
                      onCheckedChange={(checked) => handleToggle("is_featured", checked)}
                      disabled={updatePropertyMutation.isPending}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-48">
                    <p>Show property in featured listings section</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* New Property Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/50 hover:border-border transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">New Listing</label>
                    <p className="text-xs text-muted-foreground">Mark as recently added</p>
                  </div>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch
                      checked={property.is_new}
                      onCheckedChange={(checked) => handleToggle("is_new", checked)}
                      disabled={updatePropertyMutation.isPending}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-48">
                    <p>Mark as new property listing with "New" badge</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Property Type
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start h-10 hover:bg-background/50 transition-all duration-200 shadow-sm"
                  >
                    <span className="capitalize font-medium">{property.property_type.replace("_", " ")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 border-0 shadow-lg max-h-48 overflow-y-auto">
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
                      className="flex items-center justify-between hover:bg-accent/50 transition-colors py-2"
                    >
                      <span className="capitalize font-medium">{type.replace("_", " ")}</span>
                      {property.property_type === type && (
                        <Badge variant="secondary" className="h-4 text-xs font-medium">
                          Current
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Listing Type */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Listing Type
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start h-10 hover:bg-background/50 transition-all duration-200 shadow-sm"
                  >
                    <span className="capitalize font-medium">{property.listing_type}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32 border-0 shadow-lg">
                  {["sale", "rent"].map((type) => (
                    <DropdownMenuItem
                      key={type}
                      onClick={() => handleToggle("listing_type", type)}
                      className="flex items-center justify-between hover:bg-accent/50 transition-colors py-2"
                    >
                      <span className="capitalize font-medium">{type}</span>
                      {property.listing_type === type && (
                        <Badge variant="secondary" className="h-4 text-xs font-medium">
                          Current
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Loading State */}
          {updatePropertyMutation.isPending && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-primary">Updating property...</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
