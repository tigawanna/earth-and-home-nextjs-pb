import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Clock, Mail, User } from "lucide-react";
import { UserActions } from "./UserActions";

interface UsersTableProps {
  users: UsersResponse[];
  currentUserId?: string;
  onUserUpdate?: () => void;
}

export function UsersTable({ users, currentUserId, onUserUpdate }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <User className="h-12 w-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium">No users found</h3>
        <p className="text-sm">No users match the current search criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              {/* Avatar */}
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user.name?.charAt(0)?.toUpperCase() || 
                     user.email?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </TableCell>

              {/* User Info */}
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {user.name || "Unnamed User"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {user.id.slice(0, 8)}...
                  </div>
                </div>
              </TableCell>

              {/* Email */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <div className="flex flex-col gap-1">
                  {user.verified ? (
                    <Badge variant="default" className="text-xs w-fit">
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs w-fit">
                      Unverified
                    </Badge>
                  )}
                  
                  {user.is_admin && (
                    <Badge variant="destructive" className="text-xs w-fit">
                      Admin
                    </Badge>
                  )}
                  
                  {user.is_banned && (
                    <Badge variant="outline" className="text-xs w-fit border-red-500 text-red-500">
                      Banned
                    </Badge>
                  )}
                </div>
              </TableCell>

              {/* Joined Date */}
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(user.created).toLocaleDateString()}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <UserActions 
                  user={user} 
                  currentUserId={currentUserId}
                  onUserUpdate={onUserUpdate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
