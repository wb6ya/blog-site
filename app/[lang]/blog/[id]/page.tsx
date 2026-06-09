import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { getDictionary } from "@/dictionaries";
import ShareButton from "@/app/components/ShareButton";
import RelatedArticles from "@/app/components/RelatedArticles";
import TableOfContents, { Heading } from "@/app/components/TableOfContents";
import EngagementBar from "@/app/components/EngagementBar";
import Comments from "@/app/components/Comments";
import Newsletter from "@/app/components/Newsletter";

export async function generateMetadata(props: { params: Promise<{ id: string; lang: string }> }): Promise<Metadata> {
  const { id, lang } = await props.params;
  const blog = await getBlog(id);
  if (!blog) {
    return { title: lang === 'ar' ? 'غير موجود' : 'Not Found' };
  }
  const title = lang === 'en' && blog.titleEn ? blog.titleEn : blog.title;
  const desc = lang === 'en' && blog.descriptionEn ? blog.descriptionEn : blog.description;
  
  return {
    title: title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: blog.image ? [blog.image.startsWith('http') || blog.image.startsWith('/') ? blog.image : `/${blog.image}`] : [],
    }
  };
}

// جلب بيانات مقال واحد
async function getBlog(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${apiUrl}/blog/${id}`, { next: { revalidate: 60 } });
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

function calculateReadTime(content: string) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  const wpm = 225; // average adult reading speed
  return Math.ceil(words / wpm);
}

// Format content fallback: If AI strips HTML, wrap plain text newlines into <p> tags
function formatContent(htmlStr: string) {
  if (!htmlStr) return "";
  if (/<(p|br|h[1-6]|div|ul|li|blockquote)[>\s]/i.test(htmlStr)) {
    return htmlStr;
  }
  return htmlStr
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => `<p>${line}</p>`)
    .join('');
}

function processContentWithTOC(htmlStr: string): { html: string, headings: Heading[] } {
  const headings: Heading[] = [];
  let counter = 0;
  
  const htmlWithIds = htmlStr.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
    const level = tag.toLowerCase() === 'h2' ? 2 : 3;
    const plainText = text.replace(/<[^>]+>/g, '').trim();
    if (!plainText) return match; // skip empty headers
    
    // Check if the tag already has an id attribute
    if (/id=/i.test(attrs)) {
       // if it does, we could try to extract it, but it's simpler to just not inject a new one. 
       // However, we still want it in the TOC.
       const matchId = attrs.match(/id=["']([^"']+)["']/i);
       if (matchId && matchId[1]) {
           headings.push({ id: matchId[1], text: plainText, level });
           return match;
       }
    }

    const id = `section-${counter++}`;
    headings.push({ id, text: plainText, level });
    return `<${tag} id="${id}"${attrs} class="scroll-mt-32 ${attrs.replace(/class=["']([^"']*)["']/, '$1')}">${text}</${tag}>`;
  });
  
  return { html: htmlWithIds, headings };
}

export default async function BlogPage(props: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await props.params;
  const blog = await getBlog(id);
  const dict = await getDictionary(lang as "ar" | "en");

  if (!blog) {
    notFound();
  }

  const title = lang === 'en' && blog.titleEn ? blog.titleEn : blog.title;
  let content = lang === 'en' && blog.contentEn ? blog.contentEn : blog.content;
  content = formatContent(content);
  
  const { html: finalContent, headings } = processContentWithTOC(content);
  
  const imgSrc = blog.image ? (blog.image.startsWith('http') || blog.image.startsWith('/') ? blog.image : `/${blog.image}`) : null;
  const readTime = calculateReadTime(finalContent);
  
  const formattedDate = new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen relative pb-32" dir={lang === 'en' ? 'ltr' : 'rtl'}>


      {/* Cinematic Header */}
      <section className="relative w-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-center py-20 md:py-32 overflow-hidden">
        {/* Full-width Background Image */}
        {imgSrc && (
          <>
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-cover scale-105"
              priority
              sizes="100vw"
            />
            {/* Blur & Overlay */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/80 to-background pointer-events-none"></div>
          </>
        )}
        {!imgSrc && (
           <div className="absolute inset-0 bg-linear-to-b from-brand/10 to-background pointer-events-none"></div>
        )}

        {/* Header Content in Glass Box */}
        <div className="relative z-10 container max-w-4xl mx-auto px-4 w-full mb-16 md:mb-32">
          <div className="flex mb-6 md:mb-8">
            <Link href={`/${lang}`} className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide group font-medium bg-surface/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-glass-border shadow-md">
              <svg className={`w-4 h-4 transition-transform mx-2 ${lang === 'en' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              {dict.blogs.backToBlogs}
            </Link>
          </div>

          <div className="bg-surface/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center flex flex-col items-center mx-auto w-full max-w-[95vw]">
            
            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-brand-light font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-4 sm:mb-6">
              <span>{formattedDate}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              <span>{readTime} {dict.blogs.readTime}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {blog.views || 0}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.3] md:leading-[1.2] mb-6 md:mb-8 drop-shadow-md break-words max-w-full">
              {title}
            </h1>

            <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-glass-border w-full justify-center">
               {/* Author */}
               <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 overflow-hidden relative shrink-0">
                 <Image src={blog.author?.avatar || "/images/logo.png"} alt="Author" fill sizes="40px" className="object-cover p-1 rounded-full" />
               </div>
               <div className="text-start">
                 <p className="text-sm font-bold text-foreground">{blog.author?.username || 'Dego'}</p>
                 <p className="text-xs text-brand-light/80">{dict.blogs.author}</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Hero Image (Crisp) */}
      {imgSrc && (
        <section className="container max-w-5xl mx-auto px-4 relative z-20 -mt-20 md:-mt-32 mb-10 md:mb-16">
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </section>
      )}

      {/* Article Content with Sidebar */}
      <section className={`container ${imgSrc ? 'mt-8' : 'mt-16'} max-w-6xl mx-auto px-4 md:px-6 relative z-10`}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* Main Article */}
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            
            {/* Mobile TOC */}
            <div className="block lg:hidden mb-8">
              <TableOfContents headings={headings} dict={dict} lang={lang} />
            </div>

            <article className="prose-container max-w-none">
          <div className="rich-content whitespace-pre-wrap text-lg text-foreground/80 leading-relaxed font-light
            [&>p]:mb-8 [&>p:first-child]:text-xl [&>p:first-child]:leading-loose [&>p:first-child]:font-normal [&>p:first-child]:text-foreground
            [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-foreground [&>h2]:mt-16 [&>h2]:mb-6 
            [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-foreground/90 [&>h3]:mt-10 [&>h3]:mb-4
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-3 [&>ul>li]:pl-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:mb-3 [&>ol>li]:pl-2
            [&>blockquote]:border-s-4 [&>blockquote]:border-brand [&>blockquote]:px-6 [&>blockquote]:py-4 [&>blockquote]:my-10 [&>blockquote]:bg-brand/5 [&>blockquote]:text-xl [&>blockquote]:font-medium [&>blockquote]:italic [&>blockquote]:rounded-e-xl [&>blockquote]:shadow-sm
            [&>hr]:border-white/10 [&>hr]:my-12
          "
            dangerouslySetInnerHTML={{ __html: finalContent }}
          />
        </article>

        {/* Article Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 mb-8 flex flex-wrap gap-2">
            {blog.tags.map((tag: string, index: number) => (
              <span key={index} className="px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer / Share */}
        <div className="mt-20 pt-10 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
             {dict.blogs.thanks}
          </div>
          <div className="flex gap-4 items-center">
            <ShareButton lang={lang} title={title} />
          </div>
        </div>
        
        {/* Engagement Bar */}
        <div className="mt-8 mb-12 flex justify-center">
          <EngagementBar id={blog._id} initialViews={blog.views || 0} initialLikes={blog.likes || 0} lang={lang} />
        </div>

        {/* Comments Section */}
        <Comments blogId={blog._id} lang={lang} />
        
        {/* Newsletter Section */}
        <Newsletter lang={lang} />

        {/* Related Articles */}
          <RelatedArticles id={id} lang={lang} />

          </div> {/* End Main Article */}

          {/* Desktop TOC Sidebar */}
          <aside className="hidden lg:block lg:w-[35%] xl:w-[30%] sticky top-32">
            <TableOfContents headings={headings} dict={dict} lang={lang} />
          </aside>

        </div>
      </section>
    </main>
  );
}
