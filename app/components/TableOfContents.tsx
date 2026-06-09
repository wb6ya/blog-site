"use client";

import { useEffect, useState } from "react";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
  dict: any;
  lang: string;
}

export default function TableOfContents({ headings, dict, lang }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // offset for sticky headers
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:block bg-surface/50 backdrop-blur-xl border border-glass-border rounded-3xl p-6 shadow-lg">
        <h4 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-glass-border">
          {dict.blogs?.tableOfContents || (lang === 'ar' ? 'محتويات المقال' : 'Table of Contents')}
        </h4>
        <nav className="flex flex-col space-y-3">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`text-sm transition-all duration-300 ease-out border-s-2 ${
                  isActive 
                    ? "border-brand text-brand font-bold pl-3 pr-3" 
                    : "border-transparent text-muted-foreground hover:text-foreground pl-2 pr-2"
                } ${heading.level === 3 ? (lang === 'en' ? 'ml-4' : 'mr-4') : ''}`}
                dir={lang === 'en' ? 'ltr' : 'rtl'}
              >
                {heading.text}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden mb-12">
        <details className="group bg-surface/50 backdrop-blur-xl border border-glass-border rounded-2xl shadow-sm open:shadow-lg transition-all duration-300">
          <summary className="flex items-center justify-between cursor-pointer list-none p-4 font-bold text-foreground">
            <span>{dict.blogs?.tableOfContents || (lang === 'ar' ? 'محتويات المقال' : 'Table of Contents')}</span>
            <svg 
              className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-open:-rotate-180" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="p-4 pt-0 border-t border-glass-border/50">
            <nav className="flex flex-col space-y-3 mt-4">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      handleClick(e, heading.id);
                      // Optional: close details on click
                      const details = e.currentTarget.closest('details');
                      if (details) details.removeAttribute('open');
                    }}
                    className={`text-sm transition-all duration-300 border-s-2 ${
                      isActive 
                        ? "border-brand text-brand font-bold pl-3 pr-3" 
                        : "border-transparent text-muted-foreground hover:text-foreground pl-2 pr-2"
                    } ${heading.level === 3 ? (lang === 'en' ? 'ml-4' : 'mr-4') : ''}`}
                    dir={lang === 'en' ? 'ltr' : 'rtl'}
                  >
                    {heading.text}
                  </a>
                );
              })}
            </nav>
          </div>
        </details>
      </div>
    </div>
  );
}
