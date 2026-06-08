"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";
import Modal from "@/app/components/Modal";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const params = useParams();
  
  const lang = params?.lang || 'ar';
  const dict = lang === 'en' ? en : ar;

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api";
      const res = await fetch(`${apiUrl}/blog?page=${page}&limit=10`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data.slice((page - 1) * 10, page * 10));
        setTotalPages(Math.ceil(data.length / 10) || 1);
        setCurrentPage(page);
      } else if (data && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
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
    fetchBlogs(1);
  }, [router, lang]);

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setModalType('warning');
    setModalTitle(lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete');
    setModalMessage(dict.admin.deleteConfirm);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    const id = itemToDelete;

    try {
      const token = localStorage.getItem("adminToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api";
      const res = await fetch(`${apiUrl}/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setBlogs(blogs.filter((b: any) => b._id !== id));
        setModalType('success');
        setModalTitle(lang === 'ar' ? 'تم الحذف' : 'Deleted');
        setModalMessage(lang === 'ar' ? 'تم حذف المقال بنجاح.' : 'Blog deleted successfully.');
        setItemToDelete(null);
        setModalOpen(true);
      } else {
        const data = await res.json();
        setModalType('error');
        setModalTitle(lang === 'ar' ? 'خطأ' : 'Error');
        setModalMessage(data.message || "فشل الحذف");
        setItemToDelete(null);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setModalType('error');
      setModalTitle(lang === 'ar' ? 'خطأ' : 'Error');
      setModalMessage("حدث خطأ أثناء الحذف");
      setItemToDelete(null);
      setModalOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push(`/${lang}/admin/login`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] relative overflow-hidden" dir="rtl">
        {/* Background Gradient */}
        <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        
        {/* Header Skeleton */}
        <header className="relative z-10 pt-32 pb-8 px-6 border-b border-white/5">
          <div className="container mx-auto max-w-7xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface/40 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-40 bg-surface/50 rounded-lg animate-pulse"></div>
              <div className="h-3 w-28 bg-surface/30 rounded animate-pulse"></div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 max-w-7xl mt-8 mb-20 relative z-10">
          {/* Stats Skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="bg-surface/20 border border-white/5 rounded-3xl p-6 flex items-center gap-6 min-w-[280px] animate-pulse">
              <div className="w-16 h-16 rounded-2xl bg-surface/40"></div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-surface/40 rounded"></div>
                <div className="h-8 w-12 bg-surface/50 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-surface/20 border border-white/5 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex gap-20">
              <div className="h-4 w-16 bg-surface/40 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-surface/40 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-surface/40 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-surface/40 rounded animate-pulse"></div>
            </div>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-6 p-5 border-b border-white/5" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 rounded-xl bg-surface/30 animate-pulse shrink-0"></div>
                <div className="flex-1 h-4 bg-surface/30 rounded-lg animate-pulse"></div>
                <div className="h-4 w-24 bg-surface/20 rounded animate-pulse shrink-0"></div>
                <div className="flex gap-2 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-surface/20 animate-pulse"></div>
                  <div className="w-10 h-10 rounded-xl bg-surface/20 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
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
                            onClick={() => confirmDelete(blog._id)}
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 pt-4">
            {currentPage > 1 ? (
              <button onClick={() => fetchBlogs(currentPage - 1)} className="px-6 py-2 rounded-full border border-glass-border hover:bg-white/10 text-white transition-colors text-sm font-medium cursor-pointer">
                 {dict?.blogs?.prevPage || (lang === 'ar' ? 'السابق' : 'Previous')}
              </button>
            ) : (
              <span className="px-6 py-2 rounded-full border border-glass-border opacity-50 cursor-not-allowed text-gray-500 text-sm font-medium">
                 {dict?.blogs?.prevPage || (lang === 'ar' ? 'السابق' : 'Previous')}
              </span>
            )}
            
            <span className="text-sm font-mono text-gray-400" dir="ltr">
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <button onClick={() => fetchBlogs(currentPage + 1)} className="px-6 py-2 rounded-full border border-glass-border hover:bg-white/10 text-white transition-colors text-sm font-medium cursor-pointer">
                 {dict?.blogs?.nextPage || (lang === 'ar' ? 'التالي' : 'Next')}
              </button>
            ) : (
              <span className="px-6 py-2 rounded-full border border-glass-border opacity-50 cursor-not-allowed text-gray-500 text-sm font-medium">
                 {dict?.blogs?.nextPage || (lang === 'ar' ? 'التالي' : 'Next')}
              </span>
            )}
          </div>
        )}
      </main>
      
      <Modal 
        isOpen={modalOpen} 
        onClose={() => {
          setModalOpen(false);
          setItemToDelete(null);
        }}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onConfirm={itemToDelete ? handleDelete : undefined}
        confirmText={itemToDelete ? (lang === 'ar' ? 'حذف' : 'Delete') : undefined}
        cancelText={itemToDelete ? (lang === 'ar' ? 'إلغاء' : 'Cancel') : undefined}
      />
    </div>
  );
}
