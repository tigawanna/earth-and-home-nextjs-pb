"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, LayoutDashboard, Loader2 } from "lucide-react"
import { authClient } from "@/lib/client-side-auth"

interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
}

interface DashboardOrAuthProps {
  className?: string
}

export function DashboardOrAuth({ className }: DashboardOrAuthProps) {


  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();



  const handleSignOut = async () => {
    try {
      await authClient.signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out failed:", error)
    }
  }

  if (isPending) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button asChild variant="outline" size="sm">
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (!session?.user) {
    // Not authenticated - show login button
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button asChild variant="outline" size="sm">
          <Link href="/auth/signin">
            Sign In
          </Link>
        </Button>
      </div>
    )
  }

  // Authenticated - show user avatar with dropdown
    const user = session.user
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
              <AvatarImage src={user.image||"/user-fallback.png"} alt={user.name || "User"} />
              <AvatarFallback>
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.name}</p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
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
  )
}
