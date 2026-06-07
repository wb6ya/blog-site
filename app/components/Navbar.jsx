"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

const Navbar = ({ lang, dict }) => {
  const navRef = useRef(null);
  const pathname = usePathname();

  // Function to switch language keeping the rest of the path
  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    if (!pathname) return '/';
    // Replace the current language in the path with the new language
    const pathParts = pathname.split('/');
    pathParts[1] = newLang; // Because path starts with /, index 1 is the language
    return pathParts.join('/');
  };

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -20,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.1
    });
  }, { scope: navRef });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none">
      <nav ref={navRef} className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3 rounded-2xl bg-surface/80 backdrop-blur-md border border-glass-border shadow-sm pointer-events-auto opacity-0 translate-y-[-20px]" style={{ opacity: 1, transform: 'none' }}>
        <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Link href={`/${lang}`} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                  <span className="text-background font-bold text-sm">WB</span>
                </div>
                <span className="text-foreground font-bold tracking-wider hidden sm:block">Blogs</span>
            </Link>
        </div>
        <div className="flex gap-8 items-center text-sm font-medium tracking-wide">
          <Link href={`/${lang}`} className="text-muted-foreground hover:text-foreground transition-colors">{dict?.home || 'Home'}</Link>
          <Link href="https://wb6ya.com" target="_blank" className="relative group">
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{dict?.personalSite || 'Site'}</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href={toggleLang()} className="px-3 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs font-bold uppercase">
            {lang === 'ar' ? 'EN' : 'AR'}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;