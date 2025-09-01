"use client";

import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
    Building2,
    ChevronDown,
    Heart,
    Home,
    LogOut,
    Plus,
    Settings,
    User,
    Users,
} from "lucide-react";

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
import { signoutMutationOptions } from "@/data-access-layer/pocketbase/auth";
import { UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { useMutation } from "@tanstack/react-query";

// Menu items for regular users
const userMenuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Properties",
    url: "/properties",
    icon: Building2,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const adminRoutes = [
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Add Property",
    url: "/properties/add",
    icon: Plus,
  },
];

export function TanStackDashboardSidebar({ user }: { user: UsersResponse }) {
  const location = useLocation();
  const router = useRouter();

  const { mutate, isPending: isLoggingOut } = useMutation(signoutMutationOptions());

  const handleSignOut = async () => {
    try {
      await mutate();
      // Navigate to home page using Next.js router for server navigation
      window.location.href = "/";
    } catch (error) {
      console.log("error happende = =>\n","Sign out failed:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
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
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem
                    key={item.title}
                    data-active={isActive}
                    className="data-[active=true]:bg-accent/50 data-[active=true]:text-sidebar-accent-foreground">
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {/* Landing page now matches structure */}
              {(() => {
                const landingIsActive = false; // Never active since we're in client router
                return (
                  <SidebarMenuItem
                    data-active={landingIsActive}
                    className="data-[active=true]:bg-accent/50 data-[active=true]:text-sidebar-accent-foreground">
                    <SidebarMenuButton asChild isActive={landingIsActive}>
                      <a href="/">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Landing Page</span>
                      </a>
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
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem
                        key={item.title}
                        data-active={isActive}
                        className="data-[active=true]:bg-accent/50 data-[active=true]:text-sidebar-accent-foreground">
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.url}>
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
                  <ModeToggle compact />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
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
