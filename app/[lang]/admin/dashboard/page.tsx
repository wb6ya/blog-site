"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const params = useParams();
  
  const lang = params?.lang || 'ar';
  const dict = lang === 'en' ? en : ar;

  const fetchBlogs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/blog`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      } else if (data && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");
    if (!token) {
      router.push(`/${lang}/admin/login`);
      return;
    }
    if (role === 'admin') setIsAdmin(true);
    fetchBlogs();
  }, [router, lang]);

  const handleDelete = async (id: string) => {
    if (!confirm(dict.admin.deleteConfirm)) return;

    try {
      const token = localStorage.getItem("adminToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBlogs(blogs.filter((b: any) => b._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "فشل الحذف");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push(`/${lang}/admin/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-brand" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-400 animate-pulse">{dict.admin.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden" dir="rtl">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-brand/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      
      {/* Dashboard Header (Pushed down to avoid global navbar overlap) */}
      <header className="relative z-10 pt-32 pb-8 px-6 border-b border-white/5">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface/80 border border-white/10 flex items-center justify-center shadow-lg backdrop-blur-md">
              <svg className="w-6 h-6 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-wide">{dict.admin.dashboard}</h1>
              <p className="text-sm text-muted-foreground mt-1">{dict.admin.welcomeBack}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-surface/30 p-1.5 rounded-full border border-glass-border backdrop-blur-md">
             <Link href={`/${lang}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5">{dict.nav.home}</Link>
             {isAdmin && (
               <Link href={`/${lang}/admin/profile`} className="text-sm font-medium text-brand hover:text-brand-light transition-colors px-4 py-2 rounded-full hover:bg-brand/10">{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</Link>
             )}
             <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 px-5 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {dict.admin.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-7xl mt-8 mb-20 relative z-10">
        
        {/* Header Actions & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          {/* Stat Card */}
          <div className="bg-surface/30 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex items-center gap-6 min-w-[280px] shadow-lg">
             <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
             </div>
             <div>
               <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">{dict.admin.totalArticles}</p>
               <p className="text-4xl font-extrabold text-white drop-shadow-md">{blogs.length}</p>
             </div>
          </div>

          <Link
            href={`/${lang}/admin/create`}
            className="group flex items-center gap-3 bg-brand hover:bg-brand-light text-white px-8 py-4 rounded-full transition-all duration-300 font-bold shadow-[0_0_20px_rgba(var(--brand),0.4)] hover:shadow-[0_0_40px_rgba(var(--brand),0.6)] hover:-translate-y-1"
          >
            <span className="text-base">{dict.admin.newPost}</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Data Table */}
        <div className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-gray-300 border-collapse">
              <thead className="bg-black/40 border-b border-white/10 text-gray-400 text-sm font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-5 pl-0 w-24 text-center">{dict.admin.image}</th>
                  <th className="p-5">{dict.admin.title}</th>
                  <th className="p-5 w-48">{dict.admin.date}</th>
                  <th className="p-5 w-32 text-center">{dict.admin.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-500">
                       <div className="flex flex-col items-center gap-3">
                         <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                         </svg>
                         <p>{dict.admin.empty}</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog: any) => (
                    <tr key={blog._id} className="group hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center">
                        {blog.image ? (
                          <div className="relative w-14 h-14 mx-auto rounded-xl overflow-hidden border border-white/10 group-hover:border-brand/40 transition-colors">
                            <Image src={blog.image.startsWith('http') || blog.image.startsWith('/') ? blog.image : `/${blog.image}`} alt={blog.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 mx-auto bg-gray-800/50 border border-white/5 rounded-xl flex items-center justify-center text-[10px] text-gray-500">
                            {dict.admin.noCover}
                          </div>
                        )}
                      </td>
                      <td className="p-5 font-medium text-white group-hover:text-brand-light transition-colors">
                        <div className="truncate max-w-sm md:max-w-md lg:max-w-lg">
                          {blog.title}
                        </div>
                      </td>
                      <td className="p-5 text-sm text-gray-400 font-mono">
                        {new Date(blog.createdAt).toLocaleDateString(lang === 'ar' ? "ar-SA" : "en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/${lang}/admin/edit/${blog._id}`}
                            className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 border border-blue-500/20 hover:border-blue-500 text-blue-400 hover:text-white transition-all duration-300 tooltip-wrapper"
                            title={dict.admin.edit}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white transition-all duration-300 tooltip-wrapper"
                            title={dict.admin.delete}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
