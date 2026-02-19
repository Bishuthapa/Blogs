// app/sitemap.ts
import { MetadataRoute } from "next";
import connectDB from "@/lib/db"; // your existing db connection
import {Blog} from "@/core/models/Blog.model"; // your existing Blog model

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();
  const blogs = await Blog.find({}, "_id updatedAt").lean();

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

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `https://bishesh0.com.np/blog/${blog._id}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}