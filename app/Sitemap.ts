// app/sitemap.ts
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogs = [];
  
  try {
    const res = await fetch("https://blogs-lime-eight.vercel.app/api/blogs", { 
      cache: "no-store" 
    });
    blogs = await res.json();
  } catch {
    blogs = [];
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://bishesh0.com.np",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://bishesh0.com.np/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog: { _id: string; updatedAt?: string }) => ({
    url: `https://bishesh0.com.np/blog/${blog._id}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}