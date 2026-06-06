import Link from "next/link";
import Image from "next/image";

function Blogs({ blogs }) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 font-light">
        <p>لا توجد مقالات حالياً.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
      {blogs.map((blog) => (
        <Link key={blog._id} href={`/blog/${blog._id}`} className="group block h-full">
          <article className="glass-panel glass-panel-hover flex flex-col h-full rounded-3xl overflow-hidden p-3 pb-6 relative z-10">
            
            {/* Image Container */}
            <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-5 bg-black/40">
              {blog.image ? (
                <>
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                  />
                  {/* Subtle vignette for premium dark look */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-900/40">
                   <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="text-sm font-light">مقالة نصية</span>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="px-4 flex flex-col flex-grow">
              <div className="text-xs text-brand-light mb-3 font-mono tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                {new Date(blog.createdAt).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              
              <h2 className="text-xl font-bold text-gray-100 mb-3 line-clamp-2 leading-snug group-hover:text-brand-light transition-colors duration-300">
                {blog.title}
              </h2>
              
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                {blog.description}
              </p>
              
              <div className="mt-auto flex items-center text-brand-light font-medium text-sm">
                <span className="relative overflow-hidden flex items-center">
                  اقرأ المقال
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand group-hover:w-full transition-all duration-300"></span>
                </span>
                <svg className="w-4 h-4 mr-2 -rotate-45 group-hover:rotate-0 group-hover:translate-x-1 transition-all duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}

export default Blogs;