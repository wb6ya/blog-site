"use client";

import { useState, useEffect, useRef } from "react";
import { subscribeNewsletter } from "@/services/api";

interface NewsletterProps {
  lang: string;
}

export default function Newsletter({ lang }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem("subscribedToNewsletter") === "true") {
      setStatus("success");
      setMessage(lang === 'ar' ? 'أنت مشترك بالفعل في النشرة البريدية.' : 'You are already subscribed to the newsletter.');
    }
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage(lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني.' : 'Please enter an email address.');
      emailRef.current?.focus();
      emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("loading");
    setMessage("");

    const result = await subscribeNewsletter(email);
    if (result.success) {
      setStatus("success");
      setMessage(lang === 'ar' ? 'تم اشتراكك بنجاح! شكراً لك.' : 'Successfully subscribed! Thank you.');
      localStorage.setItem("subscribedToNewsletter", "true");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.message || (lang === 'ar' ? 'فشل الاشتراك، يرجى المحاولة لاحقاً.' : 'Subscription failed. Please try again.'));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-16 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      {/* Decorative Gradients */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Text Content */}
        <div className="flex-1 text-center md:text-start">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
            {lang === 'ar' ? 'انضم إلى النشرة البريدية' : 'Join our Newsletter'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto md:mx-0">
            {lang === 'ar' 
              ? 'اشترك الآن ليصلك تنبيه فور نشر أي مقال جديد. لا مزعجات، فقط محتوى قيم!' 
              : 'Subscribe to get notified when new articles are published. No spam, just value!'}
          </p>
        </div>

        {/* Form Content */}
        <div className="w-full md:w-[400px] shrink-0">
          {status === "success" ? (
            <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-2xl text-center flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <p className="text-green-400 font-bold text-lg">{message}</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder={lang === 'ar' ? 'البريد الإلكتروني...' : 'Email address...'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-black/40 border rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none transition-all shadow-inner ${status === "error" ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-brand/50 focus:ring-1 focus:ring-brand/50'}`}
                  />
                  <div className="absolute right-4 rtl:left-4 rtl:right-auto top-1/2 -translate-y-1/2 text-gray-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {status === "error" && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1.5 px-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-2xl font-bold text-white bg-linear-to-r from-brand to-blue-600 hover:from-brand-hover hover:to-blue-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>{lang === 'ar' ? 'اشتراك' : 'Subscribe'}</span>
                  )}
                </button>
              </form>

            </>
          )}
        </div>

      </div>
    </div>
  );
}
