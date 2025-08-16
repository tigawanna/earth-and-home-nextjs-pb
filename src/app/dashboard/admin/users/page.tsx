"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, MoreHorizontal, Shield, Ban, User } from "lucide-react"
import { authClient } from "@/lib/client-side-auth"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
  banned?: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await authClient.admin.listUsers({
        query: {
          limit: 100
        }
      })
      if (response.data?.users) {
        setUsers(response.data.users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image || undefined,
          role: user.role,
          banned: user.banned || false,
          createdAt: user.createdAt.toISOString()
        })))
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId: string, banned: boolean) => {
    try {
      if (banned) {
        await authClient.admin.banUser({ userId })
        toast.success("User banned successfully")
      } else {
        await authClient.admin.unbanUser({ userId })
        toast.success("User unbanned successfully")
      }
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error("Failed to update user ban status:", error)
      toast.error("Failed to update user status")
    }
  }

  const handleSetRole = async (userId: string, role: "user" | "admin") => {
    try {
      await authClient.admin.setRole({ userId, role })
      toast.success(`User role updated to ${role}`)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error("Failed to update user role:", error)
      toast.error("Failed to update user role")
    }
  }

  const handleImpersonate = async (userId: string) => {
    try {
      await authClient.admin.impersonateUser({ userId })
      toast.success("Now impersonating user")
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Failed to impersonate user:", error)
      toast.error("Failed to impersonate user")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Manage users, roles, and permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "admin").length}
            </div>
            <p className="text-xs text-muted-foreground">Admin users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Banned Users</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.banned).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently banned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => !u.banned).length}
            </div>
            <p className="text-xs text-muted-foreground">Active accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            All registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Users will appear here once they register.</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role || "User"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.banned ? "destructive" : "default"}>
                        {user.banned ? "Banned" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleImpersonate(user.id)}
                          >
                            Impersonate User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleSetRole(
                              user.id, 
                              user.role === "admin" ? "user" : "admin"
                            )}
                          >
                            {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBanUser(user.id, !user.banned)}
                            className={user.banned ? "text-green-600" : "text-red-600"}
                          >
                            {user.banned ? "Unban User" : "Ban User"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
