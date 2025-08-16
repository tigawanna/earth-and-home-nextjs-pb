import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Eye, 
  Heart,
  DollarSign,
  Activity
} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Platform insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties Listed</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>
              New user registrations over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No data available</p>
                <p className="text-sm">User growth chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Listings</CardTitle>
            <CardDescription>
              Properties listed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No data available</p>
                <p className="text-sm">Property listing chart will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest platform activities and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <div className="text-center">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No recent activity</p>
                <p className="text-sm">Platform activities will appear here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Properties</CardTitle>
            <CardDescription>
              Properties with the highest view counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No properties to display</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Saved Properties</CardTitle>
            <CardDescription>
              Properties with the most saves/favorites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No properties to display</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
