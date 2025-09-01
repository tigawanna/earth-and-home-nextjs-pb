import { siteinfo } from "@/config/siteinfo";
import { getProperties } from "@/data-access-layer/properties/server-side-property-queries";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteinfo.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Get active properties for dynamic sitemap
    const propertiesResponse = await getProperties({
      filters: { status: 'active' },
      limit: 1000, // Get a large number of properties for sitemap
    });

    if (propertiesResponse.success && propertiesResponse.properties) {
      const propertyPages: MetadataRoute.Sitemap = propertiesResponse.properties.map((property) => ({
        url: `${baseUrl}/properties/${property.id}`,
        lastModified: new Date(property.updated),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));

      return [...staticPages, ...propertyPages];
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return staticPages;
}
