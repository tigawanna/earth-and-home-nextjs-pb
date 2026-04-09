"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarNavLinksProps {
  links: SidebarNavItem[];
}

export function SidebarNavLinks({ links }: SidebarNavLinksProps) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const showTooltips = state === "collapsed";

  if (links.length === 0) return null;

  return (
    <SidebarMenu>
      {links.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        const button = (
          <SidebarMenuButton asChild isActive={isActive}>
            <Link href={item.href}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        );

        return (
          <SidebarMenuItem key={item.title}>
            {showTooltips ? (
              <TooltipProvider>
                <Tooltip delayDuration={200}>
                  <TooltipTrigger asChild>{button}</TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              button
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
