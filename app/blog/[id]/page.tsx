import { Blog } from "@/core/models/Blog.model";
import "@/core/models/User.model"; 
import connectDB from "@/lib/db";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock } from "lucide-react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) return notFound();

  try {
    await connectDB();
    const blog = await Blog.findById(id).populate("author", "username").lean();

    if (!blog) return notFound();

    return (
      <div className="min-h-screen font-sans">
        {/* Navigation */}
        <nav className="sticky top-0 z-10 border-b backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
            <Link href="/" className="flex items-center text-sm font-medium transition-all hover:opacity-70">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Link>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-6 py-16">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-[1.1]">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4">
              {/* Avatar Placeholder */}
              <div className="h-12 w-12 rounded-full border flex items-center justify-center text-lg font-bold shadow-sm border-amber-600">
                {typeof blog.author !== 'string' && blog.author?.username ? blog.author.username[0].toUpperCase() : 'A'}
              </div>
              
              <div>
                <Link href={`profile/${blog.author?._id}`} className="text-sm font-bold">
                  {typeof blog.author !== 'string' ? blog.author?.username : "Anonymous"}
                </Link>
                <div className="flex items-center gap-3 text-xs opacity-60 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 
                    6 min read
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Body Content */}
          <section className="prose prose-lg max-w-none">
            {blog.content.split('\n').map((paragraph: string, index: number) => (
              paragraph ? (
                <p key={index} className="mb-6 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ) : <br key={index} />
            ))}
          </section>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm opacity-70">
              <span className="w-2 h-2 rounded-full bg-current opacity-50 animate-pulse"></span>
              Published in Article Feed
            </div>
          </footer>
        </article>
      </div>
    );
  } catch (e) {
    console.error("Render Error:", e);
    return notFound();
  }
}