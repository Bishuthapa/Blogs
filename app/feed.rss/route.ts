import { NextResponse } from "next/server";

interface Blog {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
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

export async function GET() {
  const blogs = await getAllBlogs();
  const baseUrl = "https://bishesh0.com.np";

  const rssItems = blogs
    .map((blog) => {
      const postUrl = `${baseUrl}/blog/${blog._id}`;
      const pubDate = blog.createdAt
        ? new Date(blog.createdAt).toUTCString()
        : new Date().toUTCString();

      return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${blog.description || "Read this post on Blogs."}]]></description>
      <author>${blog.author || "Bishu Thapa"}</author>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blogs</title>
    <link>${baseUrl}</link>
    <description>A Blogging Platform — thoughts, ideas, and stories worth sharing.</description>
    <language>en-us</language>
    <managingEditor>Bishu Thapa</managingEditor>
    <webMaster>Bishu Thapa</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}