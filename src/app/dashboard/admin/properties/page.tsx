import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Filter } from "lucide-react"
import Link from "next/link"

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Properties</h2>
          <p className="text-muted-foreground">
            Manage all properties across the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/properties/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Badge variant="secondary">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Currently listed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Badge variant="outline">Pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Badge variant="default">New</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Properties added</p>
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
          <CardDescription>
            All properties registered on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <div className="text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm">Properties will appear here once they are added to the platform.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
