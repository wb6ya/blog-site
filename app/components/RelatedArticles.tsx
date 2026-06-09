import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/dictionaries";

async function getRelatedBlogs(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/blog/${id}/related`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("Error fetching related blogs:", err);
    return [];
  }
}

export default async function RelatedArticles({ id, lang }: { id: string, lang: string }) {
  const relatedBlogs = await getRelatedBlogs(id);
  const dict = await getDictionary(lang as "ar" | "en");

  if (!relatedBlogs || relatedBlogs.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-12 border-t border-glass-border relative z-10 w-full">
      <h3 className="text-2xl font-bold text-foreground mb-8">{dict.blogs.relatedArticles}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedBlogs.map((blog: any) => {
          const title = lang === 'en' && blog.titleEn ? blog.titleEn : blog.title;
          const imgSrc = blog.image ? (blog.image.startsWith('http') || blog.image.startsWith('/') ? blog.image : `/${blog.image}`) : null;
          
          return (
            <Link 
              key={blog._id} 
              href={`/${lang}/blog/${blog._id}`}
              className="group block rounded-2xl bg-surface/30 border border-white/5 overflow-hidden hover:border-brand/40 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(var(--brand),0.15)] flex flex-col h-full"
            >
              {imgSrc ? (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image 
                    src={imgSrc} 
                    alt={title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-brand/20 to-surface flex items-center justify-center">
                  <svg className="w-10 h-10 text-brand-light/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              <div className="p-5 flex flex-col flex-1">
                <h4 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-brand-light transition-colors leading-tight">
                  {title}
                </h4>
                
                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-black/40 border border-white/10 relative">
                      <Image src={blog.author?.avatar || "/images/logo.png"} alt="Author" fill sizes="20px" className="object-cover p-0.5 rounded-full" />
                    </div>
                    <span>{blog.author?.username || 'Dego'}</span>
                  </div>
                  <span>{new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? "ar-SA" : "en-US", { month: "short", day: "numeric" })}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  );
}
