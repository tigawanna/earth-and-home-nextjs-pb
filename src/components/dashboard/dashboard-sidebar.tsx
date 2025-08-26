"use client";

import {
    Building2,
    ChevronDown,
    Heart,
    Home,
    LogOut,
    MessageSquare,
    Plus,
    Settings,
    User,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ModeToggle } from "@/components/theme/theme-toggle";
import { signoutMutationOptions } from "@/data-access-layer/pocketbase/user/auth";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { useMutation } from "@tanstack/react-query";

// Menu items for regular users
const userMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Properties",
    url: "/dashboard/properties",
    icon: Building2,
  },
  {
    title: "Favorites",
    url: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "My Messages",
    url: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

const adminRoutes = [
  {
    title: "User Management",
    url: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Add Property",
    url: "/dashboard/properties/add",
    icon: Plus,
  }
];

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export function DashboardSidebar({ user }: { user: UsersResponse }) {
  const pathname = usePathname();
  const router = useRouter();

  const { mutate, isPending: isLoggingOut } = useMutation(signoutMutationOptions());

  const handleSignOut = async () => {
    try {
      await mutate();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Earth & Home</span>
                  <span className="truncate text-xs">Property Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userMenuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    data-active={isActive}
                    className="data-[active=true]:bg-accent/50 data-[active=true]:text-sidebar-accent-foreground">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {/* Landing page now matches structure */}
              {(() => {
                const landingIsActive = pathname === "/";
                return (
                  <SidebarMenuItem
                    data-active={landingIsActive}
                    className="data-[active=true]:bg-accent/50 data-[active=true]:text-sidebar-accent-foreground">
                    <SidebarMenuButton asChild isActive={landingIsActive}>
                      <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Landing Page</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })()}
            </SidebarMenu>
            {/* Admin section segmented */}
            {user.is_admin && (
              <div className="mt-4 space-y-2">
                <SidebarGroupLabel className="text-xs font-semibold tracking-wide opacity-70">Admin</SidebarGroupLabel>
                <SidebarMenu>
                  {adminRoutes.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                      <SidebarMenuItem
                        key={item.title}
                        data-active={isActive}
                        className="data-[active=true]:bg-accent/50 data-[active=true]:text-sidebar-accent-foreground">
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "User"}</span>
                    <span className="truncate text-xs">{user?.email || "user@example.com"}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}>
                <DropdownMenuItem asChild>
                  <ModeToggle  />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <User className="mr-2 h-4 w-4" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
