"use client";

import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang as string || 'ar';
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem("adminRole");
    if (role === 'admin') setIsAdmin(true);
  }, []);

  if (!mounted) return null;

  // Don't show on login page
  if (pathname.includes('/login')) return null;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    router.push(`/${lang}/admin/login`);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-surface/70 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-3.5 flex items-center gap-6 sm:gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
      <Link href={`/${lang}/admin/dashboard`} className={`flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 ${pathname.endsWith('/dashboard') ? 'text-brand drop-shadow-[0_0_8px_rgba(var(--brand),0.8)]' : 'text-gray-400 hover:text-white'}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span className="hidden sm:block">{lang === 'ar' ? 'الداشبورد' : 'Dashboard'}</span>
      </Link>
      
      <Link href={`/${lang}/admin/create`} className={`flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 ${pathname.includes('/create') ? 'text-brand drop-shadow-[0_0_8px_rgba(var(--brand),0.8)]' : 'text-gray-400 hover:text-white'}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="hidden sm:block">{lang === 'ar' ? 'مقال جديد' : 'New Post'}</span>
      </Link>
      
      {isAdmin && (
        <Link href={`/${lang}/admin/profile`} className={`flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 ${pathname.includes('/profile') ? 'text-brand drop-shadow-[0_0_8px_rgba(var(--brand),0.8)]' : 'text-gray-400 hover:text-white'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden sm:block">{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</span>
        </Link>
      )}
      
      <div className="w-px h-5 bg-white/10"></div>
      
      <Link href={`/${lang}`} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-all hover:scale-105" title={lang === 'ar' ? 'الموقع' : 'Site'}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </Link>
      
      <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-all hover:scale-105" title={lang === 'ar' ? 'خروج' : 'Logout'}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  );
}
