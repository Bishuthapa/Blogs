import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/auth/",
    },
    sitemap: "https://bishesh0.com.np/sitemap.xml",
  };
}