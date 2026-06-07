"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const getImageSrc = (src) => {
  if (!src) return null;
  return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
};

function BlogCard({ blog, dict, lang, featured = false }) {
  const title = lang === 'en' && blog.titleEn ? blog.titleEn : blog.title;
  const description = lang === 'en' && blog.descriptionEn ? blog.descriptionEn : blog.description;
  const dateStr = new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? "ar-SA" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const imgSrc = getImageSrc(blog.image);

  return (
    <Link href={`/${lang}/blog/${blog._id}`} className={`blog-card group block opacity-0 translate-y-[30px] ${featured ? 'h-full' : 'h-full'}`} style={{ opacity: 1, transform: 'none' }}>
      <article className={`flex flex-col h-full rounded-2xl overflow-hidden relative z-10 bg-surface border border-glass-border hover:border-glass-border-hover hover:shadow-md transition-all duration-300 ${featured ? 'p-6 md:p-8' : 'p-4'}`}>
        
        <div className={`relative w-full rounded-xl overflow-hidden mb-5 bg-muted ${featured ? 'h-64 md:h-96' : 'h-56'}`}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
               <svg className="w-8 h-8 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="text-sm font-light">{dict?.noImage || 'No image'}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-grow">
          <div className="text-xs text-muted-foreground mb-3 font-mono tracking-wider uppercase">
            {dateStr}
          </div>
          
          <h2 className={`${featured ? 'text-2xl md:text-4xl' : 'text-lg'} font-semibold text-foreground mb-3 leading-snug group-hover:text-brand transition-colors duration-300`}>
            {title}
          </h2>
          
          <p className={`text-muted-foreground text-sm leading-relaxed mb-6 font-light ${featured ? 'line-clamp-4 md:text-base' : 'line-clamp-3'}`}>
            {description}
          </p>
          
          <div className="mt-auto flex items-center text-brand font-medium text-sm">
            <span>{dict?.readArticle || 'Read Article'}</span>
            <svg className="w-4 h-4 mx-2 transition-transform duration-300 ease-out rotate-180 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

function Blogs({ blogs, dict, lang, currentPage, totalPages }) {
  const container = useRef(null);

  useGSAP(() => {
    if (!blogs || blogs.length === 0) return;
    
    gsap.from(".blog-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
      }
    });
  }, { scope: container, dependencies: [blogs] });

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground font-light">
        <p>{dict?.empty || 'No articles'}</p>
      </div>
    );
  }

  const isFirstPage = currentPage === 1;
  const heroBlog = isFirstPage && blogs.length > 0 ? blogs[0] : null;
  const featuredGrid = isFirstPage && blogs.length > 1 ? blogs.slice(1, 5) : [];
  const standardBlogs = isFirstPage ? blogs.slice(5) : blogs;

  return (
    <div ref={container} className="relative z-10 flex flex-col gap-12">
      
      {/* Featured Top 5 Section */}
      {isFirstPage && (
        <div className="flex flex-col gap-8">
          {heroBlog && (
            <div className="w-full">
              <BlogCard blog={heroBlog} dict={dict} lang={lang} featured={true} />
            </div>
          )}
          
          {featuredGrid.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredGrid.map(blog => (
                <BlogCard key={blog._id} blog={blog} dict={dict} lang={lang} featured={false} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Divider if we have standard blogs after featured */}
      {isFirstPage && standardBlogs.length > 0 && (
        <div className="w-full h-[1px] bg-glass-border my-4"></div>
      )}

      {/* Standard Grid Section */}
      {standardBlogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standardBlogs.map((blog) => (
             <BlogCard key={blog._id} blog={blog} dict={dict} lang={lang} featured={false} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-glass-border">
          {currentPage > 1 ? (
            <Link href={`/${lang}?page=${currentPage - 1}`} className="px-6 py-2 rounded-full border border-glass-border hover:bg-muted text-foreground transition-colors text-sm font-medium">
               {dict?.prevPage || (lang === 'ar' ? 'السابق' : 'Previous')}
            </Link>
          ) : (
            <span className="px-6 py-2 rounded-full border border-glass-border opacity-50 cursor-not-allowed text-muted-foreground text-sm font-medium">
               {dict?.prevPage || (lang === 'ar' ? 'السابق' : 'Previous')}
            </span>
          )}
          
          <span className="text-sm font-mono text-muted-foreground">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link href={`/${lang}?page=${currentPage + 1}`} className="px-6 py-2 rounded-full border border-glass-border hover:bg-muted text-foreground transition-colors text-sm font-medium">
               {dict?.nextPage || (lang === 'ar' ? 'التالي' : 'Next')}
            </Link>
          ) : (
            <span className="px-6 py-2 rounded-full border border-glass-border opacity-50 cursor-not-allowed text-muted-foreground text-sm font-medium">
               {dict?.nextPage || (lang === 'ar' ? 'التالي' : 'Next')}
            </span>
          )}
        </div>
      )}

    </div>
  );
}

export default Blogs;