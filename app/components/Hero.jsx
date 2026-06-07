"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero({ dict, lang }) {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-badge", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out"
    })
    .from(".hero-title > span", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: "power4.out"
    }, "-=0.9")
    .from(".hero-desc", {
      y: 20,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    }, "-=0.8");
  }, { scope: container });

  return (
    <section ref={container} className="relative pt-32 pb-10 px-4 overflow-hidden flex flex-col items-center justify-center text-center" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      {/* Premium Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-brand/20 blur-[100px] rounded-full pointer-events-none z-[-2]"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-[-1]"></div>
      
      <div className="hero-badge inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-surface/80 backdrop-blur-xl border border-glass-border hover:border-brand/50 transition-colors text-xs text-brand-light font-medium tracking-wide mb-6 shadow-[0_0_15px_rgba(var(--brand),0.15)]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
        </span>
        {dict.badge}
      </div>

      <h1 className="hero-title text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight max-w-4xl leading-[1.2] text-foreground flex flex-col sm:flex-row items-center justify-center gap-2 drop-shadow-lg">
        <span className="text-white">{dict.title1}</span>
        <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-light via-brand to-purple-500 filter drop-shadow-md">{dict.title2}</span>
      </h1>
      
      <p className="hero-desc text-muted-foreground max-w-2xl text-base md:text-lg font-light leading-relaxed mb-4">
        {dict.desc}
      </p>
    </section>
  );
}
