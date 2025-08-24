"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Ban, Filter, Search, Shield, UserCheck, Users, X } from "lucide-react";
import { useQueryState } from "nuqs";

interface UsersHeaderProps {
  totalUsers: number;
  verifiedUsers: number;
  adminUsers: number;
  bannedUsers: number;
}

export function UsersHeader({ 
  totalUsers, 
  verifiedUsers, 
  adminUsers, 
  bannedUsers 
}: UsersHeaderProps) {
  const [q, setQ] = useQueryState("q", { defaultValue: "" });
  const [sortBy, setSortBy] = useQueryState("sortBy", { defaultValue: "created" });
  const [sortOrder, setSortOrder] = useQueryState("sortOrder", { defaultValue: "desc" });

  const clearFilters = () => {
    setQ("");
    setSortBy("created");
    setSortOrder("desc");
  };

  const hasActiveFilters = q || sortBy !== "created" || sortOrder !== "desc";

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts, permissions, and verification status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <Users className="h-3 w-3" />
            {totalUsers} Total
          </Badge>
          <Badge variant="default" className="gap-2">
            <UserCheck className="h-3 w-3" />
            {verifiedUsers} Verified
          </Badge>
          <Badge variant="destructive" className="gap-2">
            <Shield className="h-3 w-3" />
            {adminUsers} Admins
          </Badge>
          {bannedUsers > 0 && (
            <Badge variant="secondary" className="gap-2">
              <Ban className="h-3 w-3" />
              {bannedUsers} Banned
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Date Joined</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="updated">Last Updated</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest</SelectItem>
            <SelectItem value="asc">Oldest</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>
            {q && `Search: "${q}"`}
            {q && (sortBy !== "created" || sortOrder !== "desc") && " • "}
            {sortBy !== "created" && `Sort: ${sortBy}`}
            {sortOrder !== "desc" && ` (${sortOrder})`}
          </span>
        </div>
      )}
    </div>
  );
}
