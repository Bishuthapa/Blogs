import UnderDevelopment from "@/components/under-construction";
import axios from "axios";
import Link from "next/link";

export default async function Home() {
  const isLive = true;
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`);

  return isLive ? (
    <div className="min-h-screen  ">
      <header className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {res.data.map((blog: any) => (
            <article
              key={blog._id}
              className="group relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border"
            >
              <div className="absolute top-0 left-0 right-0 h-1  opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-6">
                <h2 className="text-2xl font-bold  mb-3  line-clamp-2">
                  {blog.title}
                </h2>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-fullflex items-center justify-center text-sm font-semibold">
                    {blog.author.name?.[0] || 'A'}
                  </div>
                  <span className="text-sm ">
                    {blog.author.username || blog.author._id}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs  mb-4">
                  <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
                  <span>•</span>
                  <span>5 min read</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {blog.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="leading-relaxed line-clamp-3 mb-4">
                  {blog.content}
                </p>

                
                <div className="flex items-center font-medium text-sm group-hover:gap-2 transition-all">
                  <Link href={`/blog/${blog._id}`} className="hover:underline hover:text-amber-700">Read more </Link>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  ) : (
    <UnderDevelopment />
  );
}