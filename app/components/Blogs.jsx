"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

function BlogCard({ blog, dict, lang, featured = false, isBento = false, bentoIndex = 0 }) {
  const title = lang === 'en' && blog.titleEn ? blog.titleEn : blog.title;
  const description = lang === 'en' && blog.descriptionEn ? blog.descriptionEn : blog.description;
  const dateStr = new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? "ar-SA" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const imgSrc = getImageSrc(blog.image);

  // Dynamic heights based on Bento index or Featured status
  let imgHeightClass = "h-56";
  if (featured) imgHeightClass = "h-64 md:h-96";
  else if (isBento) {
    if (bentoIndex === 0) imgHeightClass = "h-64 md:h-80";
    else if (bentoIndex === 1) imgHeightClass = "h-56 md:h-96"; // tall
    else imgHeightClass = "h-56";
  }

  return (
    <Link href={`/${lang}/blog/${blog._id}`} className="blog-card group block opacity-0 translate-y-[30px] h-full" style={{ opacity: 1, transform: 'none' }}>
      <article className={`flex flex-col h-full rounded-3xl overflow-hidden relative z-10 bg-surface/50 backdrop-blur-xl border border-glass-border shadow-lg shadow-black/40 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] hover:-translate-y-1.5 transition-all duration-500 ${featured ? 'p-6 md:p-8' : 'p-5 md:p-6'}`}>
        
        <div className={`relative w-full rounded-xl overflow-hidden mb-5 bg-muted ${imgHeightClass}`}>
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        <div className="flex flex-col grow" dir={lang === 'en' ? 'ltr' : 'rtl'}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-brand-light/80 font-mono tracking-widest uppercase">
              {dateStr}
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex gap-1">
                {blog.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand-light">
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 2 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted-foreground border border-glass-border">+{blog.tags.length - 2}</span>}
              </div>
            )}
          </div>
          
          <h2 className={`${featured || (isBento && bentoIndex === 0) ? 'text-2xl md:text-4xl' : 'text-xl'} font-bold text-foreground mb-4 leading-tight line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-brand-light group-hover:to-brand transition-all duration-500`}>
            {title}
          </h2>
          
          <p className={`text-muted-foreground text-sm leading-relaxed mb-6 font-light ${featured || (isBento && bentoIndex === 0) ? 'line-clamp-4 md:text-base' : 'line-clamp-3'}`}>
            {description}
          </p>
          
          <div className="mt-auto flex items-center text-brand font-medium text-sm">
            <span>{dict?.readArticle || 'Read Article'}</span>
            <svg className={`w-4 h-4 mx-2 transition-transform duration-300 ease-out ${lang === 'en' ? 'group-hover:translate-x-1' : 'rotate-180 group-hover:-translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

function IntegratedHero({ heroBlog, heroDict, dict, lang }) {
  if (!heroDict) return null;
  
  if (!heroBlog) {
    return (
       <div className="flex flex-col items-center text-center py-20">
         <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
           <span className="text-white">{heroDict.title1}</span> <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-light to-brand">{heroDict.title2}</span>
         </h1>
         <p className="text-muted-foreground text-lg max-w-2xl">{heroDict.desc}</p>
       </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-16 pt-8">
      {/* Welcome Text Section */}
      <div className="flex-1 w-full flex flex-col items-start text-start" dir={lang === 'en' ? 'ltr' : 'rtl'}>
        <div className="hero-badge inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface/80 backdrop-blur-xl border border-glass-border mb-6 shadow-[0_0_15px_rgba(var(--brand),0.15)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
          </span>
          <span className="text-xs text-brand-light font-medium tracking-wide">{heroDict.badge}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-[1.1] text-foreground drop-shadow-lg break-words max-w-full">
          <span className="text-white block mb-2">{heroDict.title1}</span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-light via-brand to-purple-500 filter drop-shadow-md">{heroDict.title2}</span>
        </h1>
        
        <p className="text-muted-foreground max-w-xl text-lg font-light leading-relaxed mb-8">
          {heroDict.desc}
        </p>
      </div>
      
      {/* Latest Blog Section */}
      <div className="flex-1 w-full relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <BlogCard blog={heroBlog} dict={dict} lang={lang} featured={true} />
      </div>
    </div>
  );
}

function Blogs({ blogs, dict, heroDict, lang, currentPage, totalPages, currentSearch = "", currentTag = "" }) {
  const container = useRef(null);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(currentSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('search', searchInput.trim());
    if (currentTag) params.set('tag', currentTag);
    router.push(`/${lang}?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set('search', currentSearch);
    if (tag) params.set('tag', tag);
    router.push(`/${lang}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchInput("");
    router.push(`/${lang}`);
  };

  const buildPageUrl = (page) => {
    const params = new URLSearchParams();
    params.set('page', page);
    if (currentSearch) params.set('search', currentSearch);
    if (currentTag) params.set('tag', currentTag);
    return `/${lang}?${params.toString()}`;
  };

  const popularTags = lang === 'ar' 
    ? ['تكنولوجيا', 'برمجة', 'تصميم', 'الذكاء الاصطناعي', 'تطوير الويب']
    : ['Tech', 'Programming', 'Design', 'AI', 'Web Development'];

  useGSAP(() => {
    if (!blogs || blogs.length === 0) return;
    
    gsap.from(".blog-card", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 85%",
      }
    });
  }, { scope: container, dependencies: [blogs] });

  const isFirstPage = currentPage === 1;
  const hasFilters = Boolean(currentSearch || currentTag);
  const showHero = isFirstPage && !hasFilters;
  
  const hasBlogs = blogs && blogs.length > 0;
  const heroBlog = showHero && hasBlogs ? blogs[0] : null;
  const featuredGrid = showHero && blogs?.length > 1 ? blogs.slice(1, 5) : [];
  const standardBlogs = showHero && hasBlogs ? blogs.slice(5) : (blogs || []);

  return (
    <div ref={container} className="relative z-10 flex flex-col gap-12">
      
      {/* Search and Tags Section */}
      <div className="flex flex-col gap-6 my-4 w-full">
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={dict?.searchPlaceholder || "Search articles..."}
            className={`w-full py-4 rounded-2xl bg-surface/80 border border-glass-border text-foreground focus:outline-none focus:border-brand/50 transition-colors shadow-lg backdrop-blur-md ${lang === 'en' ? 'pl-14 pr-4' : 'pr-14 pl-4'}`}
            dir={lang === 'en' ? 'ltr' : 'rtl'}
          />
          <button type="submit" className={`absolute top-1/2 -translate-y-1/2 ${lang === 'ar' ? 'right-5' : 'left-5'} text-muted-foreground hover:text-brand transition-colors`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm font-medium text-muted-foreground mx-2">{dict?.popularTags || "Popular Topics"}:</span>
          <button
            onClick={() => handleTagClick("")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!currentTag ? 'bg-brand text-white shadow-[0_0_15px_rgba(var(--brand),0.3)]' : 'bg-surface border border-glass-border text-muted-foreground hover:text-foreground hover:border-brand/30'}`}
          >
            {dict?.allTopics || "All Topics"}
          </button>
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${currentTag === tag ? 'bg-brand text-white shadow-[0_0_15px_rgba(var(--brand),0.3)]' : 'bg-surface border border-glass-border text-muted-foreground hover:text-foreground hover:border-brand/30'}`}
            >
              {tag}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearFilters} className="px-4 py-1.5 rounded-full text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors mx-2">
              {dict?.clearSearch || "Clear filters"}
            </button>
          )}
        </div>
      </div>

      {/* Integrated Hero Section */}
      {showHero && (
        <IntegratedHero heroBlog={heroBlog} heroDict={heroDict} dict={dict} lang={lang} />
      )}

      {/* Bento Grid Section */}
      {showHero && featuredGrid.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGrid.map((blog, index) => {
            let spanClasses = "";
            if (index === 0) spanClasses = "md:col-span-2 md:row-span-2";
            else if (index === 1) spanClasses = "md:col-span-1 md:row-span-2";
            else if (index === 2) spanClasses = "md:col-span-1 md:row-span-1";
            else if (index === 3) spanClasses = "md:col-span-2 md:row-span-1";
            
            return (
              <div key={blog._id} className={spanClasses}>
                <BlogCard blog={blog} dict={dict} lang={lang} isBento={true} bentoIndex={index} />
              </div>
            );
          })}
        </div>
      )}

      {/* Divider if we have standard blogs after featured */}
      {showHero && standardBlogs.length > 0 && (
        <div className="w-full h-px bg-glass-border my-6"></div>
      )}

      {/* Standard Grid Section */}
      {standardBlogs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standardBlogs.map((blog) => (
             <BlogCard key={blog._id} blog={blog} dict={dict} lang={lang} />
          ))}
        </div>
      )}

      {!hasBlogs && (
        <div className="flex flex-col justify-center items-center h-64 text-muted-foreground font-light bg-surface/30 rounded-3xl border border-white/5 backdrop-blur-sm">
           <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
          <p className="text-lg mb-4">{dict?.empty || (lang === 'ar' ? 'لا توجد مقالات' : 'No articles found')}</p>
          {hasFilters && (
            <button onClick={clearFilters} className="px-6 py-2.5 rounded-full bg-brand text-white font-medium hover:bg-brand-light transition-colors shadow-lg border border-brand/50">
              {lang === 'ar' ? "العودة وتصفير البحث" : "Clear Filters & Go Back"}
            </button>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-glass-border">
          {currentPage > 1 ? (
            <Link href={buildPageUrl(currentPage - 1)} className="px-6 py-2 rounded-full border border-glass-border hover:bg-muted text-foreground transition-colors text-sm font-medium">
               {dict?.blogs?.prevPage || (lang === 'ar' ? 'السابق' : 'Previous')}
            </Link>
          ) : (
            <span className="px-6 py-2 rounded-full border border-glass-border opacity-50 cursor-not-allowed text-muted-foreground text-sm font-medium">
               {dict?.blogs?.prevPage || (lang === 'ar' ? 'السابق' : 'Previous')}
            </span>
          )}
          
          <span className="text-sm font-mono text-muted-foreground" dir="ltr">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link href={buildPageUrl(currentPage + 1)} className="px-6 py-2 rounded-full border border-glass-border hover:bg-muted text-foreground transition-colors text-sm font-medium">
               {dict?.blogs?.nextPage || (lang === 'ar' ? 'التالي' : 'Next')}
            </Link>
          ) : (
            <span className="px-6 py-2 rounded-full border border-glass-border opacity-50 cursor-not-allowed text-muted-foreground text-sm font-medium">
               {dict?.blogs?.nextPage || (lang === 'ar' ? 'التالي' : 'Next')}
            </span>
          )}
        </div>
      )}

    </div>
  );
}

export default Blogs;