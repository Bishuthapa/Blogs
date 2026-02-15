// import UnderDevelopment from "@/components/under-construction";
// import axios from "axios";

// export default  async function Home(){

//   const isLive = true;
//   const res = await axios.get("http://localhost:3000/api/blogs");

//   console.log("res", res);

//   return isLive ?  (
//     <>
//     <p>This is a home page</p>
//     <div className="">
//     {
//       res.data.map((blog: any) => (
//         <div key={blog._id} className="">
//           <h2>Title:{blog.title}</h2>
//           <p>Author:{blog.author._id}</p>
//           <p>Content:{blog.content}</p>
//         </div>
//       ))
//     }
//     </div>
//     </>
//   ) : (
//     <UnderDevelopment />
//   )
// }
import UnderDevelopment from "@/components/under-construction";
import axios from "axios";

export default async function Home() {
  const isLive = true;
  const res = await axios.get("http://localhost:3000/api/blogs");

  return isLive ? (
    <div className="min-h-screen  from-gray-50 to-white">
      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      
      </header>

      {/* Blog Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {res.data.map((blog: any) => (
            <article
              key={blog._id}
              className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Optional: Add a colored top border */}
              <div className="absolute top-0 left-0 right-0 h-1  from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-6">
                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {blog.title}
                </h2>

                {/* Author */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {blog.author.name?.[0] || 'A'}
                  </div>
                  <span className="text-sm text-gray-600">
                    {blog.author.name || blog.author._id}
                  </span>
                </div>
                {/* Add inside the article card, after author */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <time>{new Date(blog.createdAt).toLocaleDateString()}</time>
                  <span>•</span>
                  <span>5 min read</span>
                </div>

                {/* For tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {blog.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content Preview */}
                <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {blog.content}
                </p>

                {/* Read More Link */}
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                  Read more
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