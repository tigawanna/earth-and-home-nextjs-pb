"use client";

import { Building2, ChevronDown, LogOut, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { signoutMutationOptions } from "@/data-access-layer/user/auth";
import { UsersResponse } from "@/types/domain-types";
import { useMutation } from "@tanstack/react-query";
import { SidebarNavLinks } from "./sidebar/sidebar-nav-links";
import {
  addPropertyRoute,
  adminRoutes,
  becomeAgentRoute,
  navigationRoutes,
  quickLinks,
} from "./sidebar/sidebar-routes";

export function DashboardSidebar({
  user,
  canCreateListings,
  showBecomeAgentSection,
}: {
  user: UsersResponse;
  canCreateListings: boolean;
  showBecomeAgentSection: boolean;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <DashboardSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
            Navigation
          </SidebarGroupLabel>
          <SidebarNavLinks links={navigationRoutes} />
        </SidebarGroup>

        {showBecomeAgentSection && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
              List properties
            </SidebarGroupLabel>
            <SidebarNavLinks links={[becomeAgentRoute]} />
          </SidebarGroup>
        )}

        {canCreateListings && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
              Listings
            </SidebarGroupLabel>
            <SidebarNavLinks links={[addPropertyRoute]} />
          </SidebarGroup>
        )}

        {user.is_admin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
              Admin
            </SidebarGroupLabel>
            <SidebarNavLinks links={adminRoutes} />
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold tracking-wide">
            Quick Links
          </SidebarGroupLabel>
          <SidebarNavLinks links={quickLinks} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-3">
        <ThemeToggleButton />
        <UserFooterMenu user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function DashboardSidebarHeader() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const showLabel = state === "expanded" || isMobile;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          onClick={() => setOpenMobile(false)}
        >
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </div>
            {showLabel && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Earth & Home</span>
                <span className="truncate text-xs text-muted-foreground">
                  Property Dashboard
                </span>
              </div>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  const { state, isMobile } = useSidebar();
  const showLabel = state === "expanded" || isMobile;

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      try {
        (
          document as unknown as { startViewTransition: (cb: () => void) => void }
        ).startViewTransition(() => setTheme(next));
        return;
      } catch {
        /* fallback */
      }
    }
    setTheme(next);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="size-4" />
          ) : (
            <Sun className="size-4" />
          )}
          {showLabel && (
            <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserFooterMenu({ user }: { user: UsersResponse }) {
  const router = useRouter();
  const { state, isMobile } = useSidebar();
  const { mutate } = useMutation(signoutMutationOptions());
  const showLabel = state === "expanded" || isMobile;

  const handleSignOut = async () => {
    try {
      await mutate();
      router.push("/");
    } catch {
      /* sign out failed */
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.avatar || undefined}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {showLabel && (
                <>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || "User"}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/agents/${user.id}`}>
                <User className="mr-2 h-4 w-4" />
                My Profile
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
  );
}
