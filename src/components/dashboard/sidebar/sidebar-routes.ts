import {
  Building2,
  Heart,
  Home,
  MessageSquare,
  Plus,
  User,
  Users,
} from "lucide-react";
import type { SidebarNavItem } from "./sidebar-nav-links";

export const navigationRoutes: SidebarNavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Properties", href: "/dashboard/properties", icon: Building2 },
  { title: "Agents", href: "/dashboard/agents", icon: User },
  { title: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
];

export const adminRoutes: SidebarNavItem[] = [
  { title: "User Management", href: "/dashboard/users", icon: Users },
  { title: "Add Property", href: "/dashboard/properties/add", icon: Plus },
];

export const quickLinks: SidebarNavItem[] = [
  { title: "Landing Page", href: "/", icon: Home },
];
