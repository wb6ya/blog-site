"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  
  // Optional: Get lang from params if needed for links, fallback to 'ar'
  const lang = params?.lang || 'ar';
  const dict = lang === 'en' ? en : ar;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError("");

    let hasError = false;
    const newErrors: {[key: string]: string} = {};

    if (!email.trim()) {
      newErrors.email = lang === 'ar' ? 'الرجاء إدخال البريد الإلكتروني.' : 'Please enter your email.';
      hasError = true;
    }
    if (!password.trim()) {
      newErrors.password = lang === 'ar' ? 'الرجاء إدخال كلمة المرور.' : 'Please enter your password.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      setTimeout(() => {
        if (newErrors.email) {
          emailRef.current?.focus();
          emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (newErrors.password) {
          passwordRef.current?.focus();
          passwordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "فشل تسجيل الدخول");
      }

      // حفظ التوكن
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole", data.role);
      if (data.username) localStorage.setItem("adminUsername", data.username);
      if (data.avatar) localStorage.setItem("adminAvatar", data.avatar);
      
      // التوجيه للوحة التحكم
      router.push(`/${lang}/admin/dashboard`);
    } catch (err: any) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#050505]" dir="rtl">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Back to Home Link */}
        <div className="flex mb-6">
          <Link href={`/${lang}`} className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide group font-medium bg-surface/50 backdrop-blur-md px-5 py-2.5 rounded-full border border-glass-border shadow-md">
            <svg className={`w-4 h-4 transition-transform mx-2 ${lang === 'en' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            {dict.blogs.backToBlogs}
          </Link>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 border border-brand/20 mb-6 shadow-[0_0_15px_rgba(var(--brand),0.3)]">
              <svg className="w-8 h-8 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{lang === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back'}</h1>
            <p className="text-muted-foreground text-sm">{lang === 'ar' ? 'سجل دخولك للوصول إلى لوحة التحكم' : 'Sign in to access your dashboard'}</p>
          </div>

          {globalError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{globalError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300 px-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border text-white placeholder-gray-600 focus:outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500' : 'border-white/10 focus:ring-2 focus:ring-brand/50 focus:border-brand/50'}`}
                  placeholder="name@example.com"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 px-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300 px-1">{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <input
                  ref={passwordRef}
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-black/40 border text-white placeholder-gray-600 focus:outline-none transition-all ${errors.password ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500' : 'border-white/10 focus:ring-2 focus:ring-brand/50 focus:border-brand/50'}`}
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1.5 px-1">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative mt-4 bg-brand hover:bg-brand-light text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {lang === 'ar' ? 'جاري التحقق...' : 'Authenticating...'}
                  </>
                ) : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
