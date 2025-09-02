"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import {
  Ban,
  CheckCircle,
  Copy,
  Mail,
  MoreHorizontal,
  Shield,
  ShieldOff,
  Trash2,
  UserCheck,
  UserX
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserActionsProps {
  user: UsersResponse;
  currentUserId?: string;
  onUserUpdate?: () => void;
}

export function UserActions({ user, currentUserId, onUserUpdate }: UserActionsProps) {
  const router = useRouter();
  const isCurrentUser = currentUserId === user.id;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleUserAction = async (action: string, value?: boolean) => {
    toast.success("this feature is coming soon");
  };

  const handleDeleteUser = async () => {
    toast.success("this feature is coming soon");

  };

  return (
    <div className="flex items-center gap-2">
      {/* Status Badges */}
      <div className="flex gap-1">
        {user.verified && (
          <Badge variant="default" className="text-xs">
            <UserCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        {user.is_admin && (
          <Badge variant="destructive" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )}
        {user.is_banned && (
          <Badge variant="secondary" className="text-xs">
            <Ban className="h-3 w-3 mr-1" />
            Banned
          </Badge>
        )}
      </div>

      {/* Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Copy Actions */}
          <DropdownMenuItem onClick={() => copyToClipboard(user.email, "Email")}>
            <Mail className="h-4 w-4 mr-2" />
            Copy Email
          </DropdownMenuItem>
          {user.name && (
            <DropdownMenuItem onClick={() => copyToClipboard(user.name, "Name")}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Name
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Admin Actions */}
          {!isCurrentUser && (
            <>
              {!user.verified && (
                <DropdownMenuItem onClick={() => handleUserAction("verify", true)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify User
                </DropdownMenuItem>
              )}

              {user.verified && (
                <DropdownMenuItem onClick={() => handleUserAction("verify", false)}>
                  <UserX className="h-4 w-4 mr-2" />
                  Unverify User
                </DropdownMenuItem>
              )}

              {!user.is_admin && (
                <DropdownMenuItem onClick={() => handleUserAction("admin", true)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Make Admin
                </DropdownMenuItem>
              )}

              {user.is_admin && (
                <DropdownMenuItem onClick={() => handleUserAction("admin", false)}>
                  <ShieldOff className="h-4 w-4 mr-2" />
                  Remove Admin
                </DropdownMenuItem>
              )}

              {!user.is_banned && (
                <DropdownMenuItem onClick={() => handleUserAction("ban", true)}>
                  <Ban className="h-4 w-4 mr-2" />
                  Ban User
                </DropdownMenuItem>
              )}

              {user.is_banned && (
                <DropdownMenuItem onClick={() => handleUserAction("ban", false)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Unban User
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleDeleteUser}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            </>
          )}

          {isCurrentUser && (
            <DropdownMenuItem disabled>
              <Shield className="h-4 w-4 mr-2" />
              Cannot modify own account
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
