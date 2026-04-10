import {
  Building2,
  ClipboardList,
  Heart,
  Home,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  User,
  UserPlus,
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

export const becomeAgentRoute: SidebarNavItem = {
  title: "Become an agent",
  href: `/dashboard/agents/new?returnTo=${encodeURIComponent("/dashboard")}`,
  icon: UserPlus,
};

export const addPropertyRoute: SidebarNavItem = {
  title: "Add Property",
  href: "/dashboard/properties/add",
  icon: Plus,
};

export const adminRoutes: SidebarNavItem[] = [
  { title: "User Management", href: "/dashboard/users", icon: Users },
  { title: "Agent review", href: "/dashboard/admin/agent-review", icon: ClipboardList },
  { title: "Image upload test", href: "/dashboard/admin/image-upload-test", icon: ImageIcon },
];

export const quickLinks: SidebarNavItem[] = [
  { title: "Landing Page", href: "/", icon: Home },
];
