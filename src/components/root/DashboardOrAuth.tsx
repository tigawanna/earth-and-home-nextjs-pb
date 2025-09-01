"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    signoutMutationOptions,
    useLocalViewer
} from "@/data-access-layer/user/auth";
import { useMutation } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface DashboardOrAuthProps {
  className?: string;
}

export default function DashboardOrAuth({ className }: DashboardOrAuthProps) {
  const router = useRouter();
  const { data, isPending } = useLocalViewer()
  const { mutate, isPending: isLoggingOut } = useMutation(signoutMutationOptions());
  const user = data?.viewer
  const handleSignOut = async () => {
    try {
      await mutate();
      router.push("/");
    } catch (error) {
      console.log("error happende = =>\n","Sign out failed:", error);
    }
  };

  if (isPending) {
    return <DashboardOrAuthLoader />;
  }

  if (!user) {
    // Not authenticated - show login button
    return <DashboardOrAuthLoader />;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button asChild variant="outline" size="sm">
        <Link href="/dashboard">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/user-fallback.png"} alt={user.name || "User"} />
              <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.name}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


export function DashboardOrAuthLoader(){
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    </div>
  );
}
