import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://explore.smilewithsithar.com";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/thank-you" }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
