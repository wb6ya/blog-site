"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";

interface NavbarProps {
  lang: string;
  dict: any;
}

const Navbar = ({ lang, dict }: NavbarProps) => {
  const navRef = useRef(null);
  const pathname = usePathname();

  // Function to switch language keeping the rest of the path
  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    if (!pathname) return '/';
    const pathParts = pathname.split('/');
    pathParts[1] = newLang; 
    return pathParts.join('/');
  };

  useGSAP(() => {
    // Basic GSAP animation that guarantees visibility
    gsap.fromTo(navRef.current, 
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 }
    );
  }, { scope: navRef });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 pointer-events-none">
      <nav ref={navRef} className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2 rounded-full bg-surface/60 backdrop-blur-xl border border-glass-border shadow-lg pointer-events-auto">
        
        {/* Logo (Home Link) */}
        <div className="nav-item flex items-center hover:opacity-80 transition-opacity">
            <Link href={`/${lang}`} className="flex items-center gap-3 group px-2">
                <div className="relative w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shadow-lg shadow-brand/20 overflow-hidden group-hover:shadow-brand/40 group-hover:border-brand/40 transition-all duration-500">
                  <Image src="/images/logo.png" alt="logo" width={26} height={26} className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 rounded-full" priority />
                </div>
                <span className="font-extrabold tracking-widest hidden sm:block text-lg bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 drop-shadow-sm group-hover:from-brand-light group-hover:to-white transition-all duration-300">Blogs</span>
            </Link>
        </div>

        {/* Links & Actions */}
        <div className="flex gap-4 md:gap-6 items-center pr-2 pl-2">
          
          {/* Portfolio Button */}
          <Link href="https://wb6ya.com" target="_blank" className="nav-item group flex items-center gap-2 px-4 py-2 rounded-full border border-transparent hover:border-glass-border hover:bg-white/5 transition-all duration-300">
            <span className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors">{dict?.personalSite || 'My Portfolio'}</span>
            <svg className="w-3.5 h-3.5 text-muted-foreground group-hover:text-brand-light transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          
          {/* Divider */}
          <div className="nav-item w-px h-4 bg-glass-border"></div>

          {/* Language Switcher */}
          <Link href={toggleLang()} className="nav-item group relative flex items-center justify-center w-9 h-9 rounded-full border border-glass-border bg-black/20 hover:bg-brand/20 hover:border-brand/40 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all duration-300">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-hover:text-brand-light transition-colors">
              {lang === 'ar' ? 'EN' : 'AR'}
            </span>
          </Link>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;