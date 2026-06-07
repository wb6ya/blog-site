import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/dictionaries";

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
  const { id, lang } = await params;
  const blog = await getBlog(id);
  const dict = await getDictionary(lang as "ar" | "en");

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen relative pb-32">
      {/* Background overlay specifically for blog post */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-muted to-transparent pointer-events-none -z-10 opacity-30"></div>
      
      {/* Header Section */}
      <section className="pt-32 pb-10 px-4 flex flex-col items-center text-center relative z-10">
        <div className="container max-w-4xl mx-auto">
          <Link href={`/${lang}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-10 transition-colors text-sm tracking-wide group font-medium">
            <svg className="w-5 h-5 transition-transform ml-2 rotate-180 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {dict.blogs.backToBlogs}
          </Link>
          
          <div className="inline-flex items-center gap-4 text-muted-foreground font-mono text-sm tracking-wider mb-6">
            <span className="w-12 h-[1px] bg-glass-border inline-block"></span>
            {new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? "ar-SA" : "en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            <span className="w-12 h-[1px] bg-glass-border inline-block"></span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-8">
            {lang === 'en' && blog.titleEn ? blog.titleEn : blog.title}
          </h1>
        </div>
      </section>

      {/* Hero Image */}
      {blog.image && (
        <section className="container max-w-5xl mx-auto px-4 mb-16 relative z-10">
          <div className="relative w-full h-[50vh] md:h-[65vh] rounded-[2rem] overflow-hidden border border-glass-border">
            <Image
              src={blog.image.startsWith('http') || blog.image.startsWith('/') ? blog.image : `/${blog.image}`}
              alt={lang === 'en' && blog.titleEn ? blog.titleEn : blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="container max-w-3xl mx-auto px-6 relative z-10">
        <article className="max-w-none">
          <div className="text-lg md:text-xl text-foreground/80 leading-relaxed font-light whitespace-pre-wrap [&>p]:mb-8 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mt-12 [&>h2]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-3 [&>a]:text-brand [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-foreground">
            {lang === 'en' && blog.contentEn ? blog.contentEn : blog.content}
          </div>
        </article>
      </section>
    </main>
  );
}
