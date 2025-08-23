"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toggleAdminMutationOptions, toggleBanUserMutationOptions } from "@/data-access-layer/pocketbase/user/admin-user-management";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { useMutation } from "@tanstack/react-query";
import { Ban, Eye, Loader, MoreHorizontal, Shield, Users as UsersIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface UsersTableProps {
  users: UsersResponse[];
}

export function UsersTable({ users = [] }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return (users || []).filter((u) => {
      const name = (u.name || "").toString().toLowerCase();
      const email = (u.email || "").toString().toLowerCase();
      return name.includes(q) || email.includes(q) || (u.id || "").includes(q);
    });
  }, [users, searchTerm]);

  const toggleAdminMutation = useMutation(toggleAdminMutationOptions);
  const toggleBanMutation = useMutation(toggleBanUserMutationOptions);

  async function handleToggleAdmin(user: UsersResponse) {
    try {
      await toggleAdminMutation.mutateAsync({ userId: user.id, is_admin: !!user.is_admin });
      toast.success(`Updated admin status for ${user.name || user.email}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update admin status");
    }
  }

  async function handleToggleBan(user: UsersResponse) {
    try {
      await toggleBanMutation.mutateAsync({ userId: user.id, is_banned: !!user.is_banned });
      toast.success(`${user.is_banned ? "Unbanned" : "Banned"} ${user.name || user.email}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update ban status");
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-3"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center"> 
                      <UsersIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{u.name || "-"}</div>
                      <div className="text-sm text-muted-foreground">{u.id}</div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="font-medium">{u.email || "-"}</div>
                  <div className="text-sm text-muted-foreground">{u.username || "-"}</div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={u.is_admin ? "bg-blue-100 text-blue-800" : "bg-muted/10 text-muted-foreground"}>
                      {u.is_admin ? "Admin" : "User"}
                    </Badge>
                    {u.is_banned ? (
                      <Badge className="bg-red-100 text-red-800">Banned</Badge>
                    ) : null}
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/admin/users/${u.id}`} className="inline-block">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleAdmin(u)}>
                          <Shield className="w-4 h-4 mr-2" />
                          {u.is_admin ? "Revoke admin" : "Make admin"}
                          {toggleAdminMutation.isPending && (
                            <Loader className="ml-2 h-4 w-4 animate-spin" />
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleToggleBan(u)} className={u.is_banned ? "text-green-600" : "text-red-600"}>
                          <Ban className="w-4 h-4 mr-2" />
                          {u.is_banned ? "Unban User" : "Ban User"}
                          {toggleBanMutation.isPending && (
                            <Loader className="ml-2 h-4 w-4 animate-spin" />
                          )}
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground">No users found.</div>}
    </div>
  );
}
