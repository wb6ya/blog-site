import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// جلب بيانات مقال واحد
async function getBlog(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/blog/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch blog");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export default async function BlogPage({ params }) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen relative pb-32" dir="rtl">
      {/* Background Gradient overlay specifically for blog post */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-brand/10 via-brand/5 to-transparent pointer-events-none -z-10"></div>
      
      {/* Header Section */}
      <section className="pt-32 pb-10 px-4 flex flex-col items-center text-center relative z-10">
        <div className="container max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-10 transition-colors text-sm tracking-wide group">
            <svg className="w-5 h-5 ml-2 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            العودة للمقالات
          </Link>
          
          <div className="inline-flex items-center gap-2 text-brand-light font-mono text-sm tracking-wider mb-6">
            <span className="w-8 h-[1px] bg-brand-light/50 inline-block"></span>
            {new Date(blog.createdAt).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span className="w-8 h-[1px] bg-brand-light/50 inline-block"></span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 leading-tight mb-8 drop-shadow-xl">
            {blog.title}
          </h1>
        </div>
      </section>

      {/* Hero Image */}
      {blog.image && (
        <section className="container max-w-5xl mx-auto px-4 mb-16 relative z-10">
          <div className="relative w-full h-[50vh] md:h-[65vh] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="container max-w-3xl mx-auto px-6 relative z-10">
        <article className="glass-panel p-8 md:p-14 rounded-3xl">
          <div className="text-lg md:text-xl text-gray-300 leading-relaxed font-light whitespace-pre-wrap [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>a]:text-brand-light [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-white">
            {blog.content}
          </div>
        </article>
      </section>
    </main>
  );
}
