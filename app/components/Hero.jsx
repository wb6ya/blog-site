"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero({ dict }) {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".hero-badge", {
      y: 20,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    .from(".hero-title > span", {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power3.out"
    }, "-=0.8")
    .from(".hero-desc", {
      y: 15,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8");
  }, { scope: container });

  return (
    <section ref={container} className="relative pt-40 pb-20 px-4 overflow-hidden flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-[-1]"></div>
      
      <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-glass-border text-xs text-brand font-medium tracking-wide mb-8 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
        </span>
        {dict.badge}
      </div>

      <h1 className="hero-title text-5xl md:text-7xl font-extrabold mb-6 tracking-tight max-w-4xl leading-tight text-foreground flex flex-col items-center">
        <span className="pb-2">{dict.title1}</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">{dict.title2}</span>
      </h1>
      
      <p className="hero-desc text-muted-foreground max-w-2xl text-lg md:text-xl font-light leading-relaxed mb-12">
        {dict.desc}
      </p>
    </section>
  );
}
