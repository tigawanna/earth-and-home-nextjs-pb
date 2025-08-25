# User Dashboard

A comprehensive dashboard for non-admin users that provides an overview of their property interests and account activity.

## Features

### Dashboard Stats
- **Total Favorites**: Count of all saved properties
- **Recent Activity**: Number of favorites added this week
- **Account Type**: User membership level
- **Member Since**: Year the user joined

### Recent Favorites
- Displays the 5 most recently favorited properties
- Shows property image, title, location, type, and price
- Includes relative timestamps (e.g., "2h ago", "3d ago")
- Links to individual property pages
- "View all favorites" link to the favorites page

### Quick Actions
- **Search Properties**: Navigate to property listings
- **View Favorites**: Go to saved properties
- **Browse by Location**: Explore properties on map
- **Account Settings**: Manage user profile

## Components

### UserDashboardPage
Main dashboard component that:
- Fetches user authentication status
- Loads dashboard statistics
- Provides loading states and error handling
- Renders the complete dashboard layout

### StatCard
Reusable card component for displaying statistics:
- Title, value, description, and optional icon
- Support for trend indicators
- Consistent styling with shadcn/ui

### RecentFavoritesCard
Displays recent favorite properties:
- Property thumbnails with fallback for missing images
- Property details with badges for type and listing type
- Time-relative formatting for when favorites were added
- Navigation to individual properties and favorites list

### QuickActionsCard
Grid of action buttons for common user tasks:
- Search, favorites, map view, and settings
- Icon-based design with descriptions
- Responsive grid layout

## Data Layer

### getUserDashboardStats
Server-side function that fetches:
- Total favorites count
- Recent favorites with expanded property details
- Error handling and validation

### getUserFavoriteProperties
Paginated function for fetching user's favorite properties:
- Server-side only
- Includes property expansion
- Pagination support

## Usage

```tsx
import { UserDashboardPage } from "@/components/dashboard/user-dashboard-page";

export default function DashboardPage() {
  return <UserDashboardPage />;
}
```

## Authentication

The dashboard requires user authentication:
- Redirects to sign-in page if not authenticated
- Uses server-side user validation
- Shows personalized content based on user data

## Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Optimized for various screen sizes
- Touch-friendly interaction areas

## Performance

- Server-side data fetching
- Suspense boundaries for loading states
- Efficient data queries with PocketBase
- Skeleton loading states

## Error Handling

- Graceful fallbacks for missing data
- Error boundaries for component failures
- User-friendly error messages
- Fallback UI states
