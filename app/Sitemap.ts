import { MetadataRoute } from "next";

interface Blog {
  _id: string;
  updatedAt?: string;
  createdAt?: string;
}

async function getAllBlogs(): Promise<Blog[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
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

  // Dynamic blog post pages
  const blogs = await getAllBlogs();
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `https://bishesh0.com.np/blog/${blog._id}`,
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}