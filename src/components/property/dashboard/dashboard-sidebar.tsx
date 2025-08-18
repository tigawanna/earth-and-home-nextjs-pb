"use client";

import {
  BarChart3,
  Building2,
  ChevronDown,
  Heart,
  Home,
  LogOut,
  Plus,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  signoutMutationOptions,
  useLocalViewer
} from "@/data-access-layer/pocketbase/auth";
import { useMutation } from "@tanstack/react-query";

// Menu items for regular users
const userMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "My Properties",
    url: "/dashboard/properties",
    icon: Building2,
  },
  {
    title: "Saved Properties",
    url: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Add Property",
    url: "/dashboard/properties/add",
    icon: Plus,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

// Additional menu items for admins
const adminMenuItems = [
  {
    title: "All Properties",
    url: "/dashboard/admin/properties",
    icon: Building2,
  },
  {
    title: "All Users",
    url: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
];

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export function DashboardSidebar() {
  const pathname = usePathname();

  const router = useRouter();
  const { data, isPending } = useLocalViewer();
  const { mutate, isPending: isLoggingOut } = useMutation(signoutMutationOptions());
  const user = data?.viewer;
  const handleSignOut = async () => {
    try {
      await mutate();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const isAdmin = user?.is_admin;
  const allMenuItems = isAdmin ? [...userMenuItems, ...adminMenuItems] : userMenuItems;
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
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          {/*  go to landing page */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                <span>Landing Page</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>

        {/* Admin Section */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>
              Admin Panel
              <Badge variant="secondary" className="ml-2">
                <Shield className="size-3 mr-1" />
                Admin
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
