import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explore.smilewithsithar.com";
  return [{ url: baseUrl, changeFrequency: "monthly", priority: 1 }];
}
