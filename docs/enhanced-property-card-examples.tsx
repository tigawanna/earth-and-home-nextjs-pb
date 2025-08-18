/**
 * Enhanced BasePropertyCard Examples
 * 
 * This file demonstrates the new enhanced BasePropertyCard component
 * with various styling options and configurations.
 * 
 * Note: This is a documentation file with simplified mock data.
 * In a real application, use actual PocketBase data.
 */

import { BasePropertyCard } from "@/components/property/list/cards/BasePropertyCard";
import { LinkedPropertyCard } from "@/components/property/list/cards/LinkedPropertyCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Edit, Eye, Heart, Share2, Trash2 } from "lucide-react";

// Type-safe mock property for examples
const createMockProperty = (overrides: Partial<PropertiesResponse> = {}): PropertiesResponse => ({
  // Base PocketBase fields
  id: "sample-1",
  collectionId: "properties",
  collectionName: "properties",
  created: "2024-01-15T10:30:00Z",
  updated: "2024-01-15T10:30:00Z",

  // Property details
  title: "Modern Luxury Villa with Ocean Views",
  description: "Stunning oceanfront villa with premium finishes and breathtaking views",
  listing_type: "sale",
  property_type: "villa",
  status: "active",

  // Location
  location: "123 Ocean Drive, Malibu, CA",
  street_address: "123 Ocean Drive",
  city: "Malibu",
  state: "California",
  postal_code: "90265",
  country: "USA",
  
  // Dimensions
  dimensions: "3500 sq ft",
  building_size_sqft: 3500,
  lot_size_sqft: 8000,
  lot_size_acres: 0.18,
  year_built: 2020,
  floors: 2,
  beds: 4,
  baths: 3,
  parking_spaces: 2,
  parking_type: "garage",
  
  // Systems
  heating: "central",
  cooling: "central", 
  zoning: "residential",
  
  // Pricing
  currency: "USD",
  price: 2850000,
  sale_price: 2850000,
  rental_price: 0,
  security_deposit: 0,
  hoa_fee: 0,
  annual_taxes: 28500,
  available_from: "",
  
  // Media
  image_url: "luxury-villa-main.jpg",
  images: ["luxury-villa-main.jpg", "villa-interior.jpg", "villa-pool.jpg"],
  video_url: "",
  virtual_tour_url: "",
  
  // Features & amenities (properly typed)
  amenities: [],
  features: ["Hardwood Floors", "Central AC", "Fireplace", "Ocean View"],
  utilities: ["Electric", "Gas", "Water", "Sewer"],
  
  // Status flags
  is_featured: true,
  is_new: false,
  
  // Relations
  agent_id: "agent-1",
  owner_id: "owner-1",
  
  // Location data
  location_point: null,
  
  // Apply any overrides
  ...overrides,
} as PropertiesResponse);

// Sample properties with proper typing
const sampleProperty = createMockProperty();

const rentalPropertyExample = createMockProperty({
  id: "sample-2",
  title: "Downtown Luxury Apartment",
  listing_type: "rent",
  property_type: "apartment",
  rental_price: 4500,
  price: 4500,
  sale_price: 0,
  is_featured: false,
  is_new: true,
  beds: 2,
  baths: 2,
  building_size_sqft: 1200,
  city: "San Francisco",
  state: "California",
});

// Mock expanded data for agent display
const mockProperty = {
  ...sampleProperty,
  expand: {
    agent_id: [{
      id: "agent-1",
      collectionId: "users",
      collectionName: "users",
      created: "2024-01-01T00:00:00Z",
      updated: "2024-01-01T00:00:00Z",
      name: "Sarah Johnson",
      email: "sarah@luxuryrealty.com",
      avatar: "agent-sarah.jpg",
      username: "sarah_johnson",
      verified: true,
      emailVisibility: false,
    } as UsersResponse]
  }
};

const rentalPropertyBasic = {
  ...sampleProperty,
  id: "sample-2",
  title: "Downtown Luxury Apartment",
  listing_type: "rent" as const,
  rental_price: 4500,
  price: 4500,
  is_featured: false,
  is_new: true,
  beds: 2,
  baths: 2,
  building_size_sqft: 1200,
  city: "San Francisco",
  state: "California"
};

/**
 * Basic Enhanced Property Card
 * Shows the new modern styling with gradients and improved layout
 */
export function BasicEnhancedCard() {
  return (
    <div className="p-6 bg-muted/30">
      <h2 className="text-2xl font-bold mb-6">Enhanced Property Card</h2>
      <div className="max-w-sm">
        <BasePropertyCard property={sampleProperty} />
      </div>
    </div>
  );
}

/**
 * Property Grid Layout
 * Shows multiple enhanced cards in a responsive grid
 */
export function PropertyGridExample() {
  const properties = [sampleProperty, rentalPropertyBasic, 
    { ...sampleProperty, id: "sample-3", is_featured: false, is_new: false, status: "pending" as const }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Enhanced Property Grid</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <LinkedPropertyCard 
            key={property.id} 
            property={property}
            className="transform transition-all duration-300 hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Card with Custom Footer Actions
 * Shows the enhanced footer styling with multiple action buttons
 */
export function CardWithFooterActions() {
  const footerActions = (
    <div className="flex gap-2 w-full">
      <Button size="sm" variant="outline" className="flex-1">
        <Heart className="h-4 w-4 mr-2" />
        Save
      </Button>
      <Button size="sm" variant="outline">
        <Share2 className="h-4 w-4" />
      </Button>
      <Button size="sm" className="flex-1">
        <Eye className="h-4 w-4 mr-2" />
        View Details
      </Button>
    </div>
  );

  return (
    <div className="p-6 bg-muted/30">
      <h2 className="text-2xl font-bold mb-6">Card with Footer Actions</h2>
      <div className="max-w-sm">
        <BasePropertyCard 
          property={sampleProperty}
          showFooterActions={true}
          footerActions={footerActions}
        />
      </div>
    </div>
  );
}

/**
 * Dashboard Management Card
 * Shows management actions for property owners/agents
 */
export function DashboardManagementCard() {
  const managementActions = (
    <div className="flex gap-2 w-full">
      <Button size="sm" variant="outline" className="flex-1">
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <Button size="sm" variant="outline">
        <Eye className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Management Card</h2>
      <div className="max-w-sm">
        <BasePropertyCard 
          property={sampleProperty}
          showFooterActions={true}
          footerActions={managementActions}
          className="border-2 border-primary/20"
        />
      </div>
    </div>
  );
}

/**
 * Comparison of Different Property States
 * Shows various badge combinations and status indicators
 */
export function PropertyStatesComparison() {
  const properties = [
    { 
      ...sampleProperty, 
      id: "featured", 
      title: "Featured Luxury Property",
      is_featured: true, 
      is_new: false 
    },
    { 
      ...sampleProperty, 
      id: "new", 
      title: "New Modern Apartment",
      is_featured: false, 
      is_new: true 
    },
    { 
      ...sampleProperty, 
      id: "pending", 
      title: "Pending Sale Property",
      is_featured: false, 
      is_new: false, 
      status: "pending" as const 
    },
    { 
      ...sampleProperty, 
      id: "inactive", 
      title: "Off-Market Property",
      is_featured: false, 
      is_new: false, 
      status: "off_market" as const 
    }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-background to-muted/30">
      <h2 className="text-2xl font-bold mb-6">Property Status Variations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <BasePropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

/**
 * Responsive Layout Demo
 * Shows how cards adapt to different screen sizes
 */
export function ResponsiveLayoutDemo() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Responsive Layout</h2>
      
      {/* Mobile: 1 column */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Mobile Layout (1 column)</h3>
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto md:hidden">
          <BasePropertyCard property={sampleProperty} />
          <BasePropertyCard property={rentalPropertyBasic} />
        </div>
      </div>

      {/* Tablet: 2 columns */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Tablet Layout (2 columns)</h3>
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 max-w-4xl mx-auto">
          <BasePropertyCard property={sampleProperty} />
          <BasePropertyCard property={rentalPropertyBasic} />
        </div>
      </div>

      {/* Desktop: 3+ columns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Desktop Layout (3+ columns)</h3>
        <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-6">
          <BasePropertyCard property={sampleProperty} />
          <BasePropertyCard property={rentalPropertyBasic} />
          <BasePropertyCard property={{ ...sampleProperty, id: "sample-3" }} />
          <BasePropertyCard property={{ ...rentalPropertyBasic, id: "sample-4" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Complete Showcase Page
 * Combines all examples into a comprehensive demo
 */
export function EnhancedPropertyCardShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto py-12 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Enhanced Property Cards</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern, sophisticated property card design with premium styling, 
            smooth animations, and professional layout.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-sm">Server-Safe</Badge>
            <Badge variant="outline" className="text-sm">Responsive</Badge>
            <Badge variant="outline" className="text-sm">Accessible</Badge>
            <Badge variant="outline" className="text-sm">Performance Optimized</Badge>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="text-3xl">🎨</div>
            <h3 className="text-lg font-semibold">Premium Design</h3>
            <p className="text-muted-foreground">Gradient overlays, modern typography, and sophisticated styling</p>
          </div>
          <div className="space-y-3">
            <div className="text-3xl">⚡</div>
            <h3 className="text-lg font-semibold">Performance</h3>
            <p className="text-muted-foreground">Optimized images, efficient rendering, smooth animations</p>
          </div>
          <div className="space-y-3">
            <div className="text-3xl">📱</div>
            <h3 className="text-lg font-semibold">Responsive</h3>
            <p className="text-muted-foreground">Mobile-first design that looks great on all devices</p>
          </div>
        </div>

        {/* Examples */}
        <BasicEnhancedCard />
        <PropertyStatesComparison />
        <CardWithFooterActions />
        <PropertyGridExample />
        
      </div>
    </div>
  );
}
