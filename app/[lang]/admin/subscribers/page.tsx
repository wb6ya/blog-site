"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSubscribers, deleteSubscriber } from "@/services/api";
import ConfirmModal from "@/app/components/ConfirmModal";

export default function SubscribersPage({ params }: { params: Promise<{ lang: string }> }) {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>("ar");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setLang(p.lang));
    
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");
    if (!token || role !== "admin") {
      router.push(`/${lang}/admin/login`);
      return;
    }

    fetchSubscribers(token);
  }, [params, router, lang]);

  const fetchSubscribers = async (token: string) => {
    setLoading(true);
    const data = await getSubscribers(token);
    setSubscribers(data);
    setLoading(false);
  };

  const triggerDelete = (id: string) => {
    setSubscriberToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subscriberToDelete) return;
    
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const success = await deleteSubscriber(subscriberToDelete, token);
    if (success) {
      setSubscribers(subscribers.filter(s => s._id !== subscriberToDelete));
    }
    setDeleteModalOpen(false);
    setSubscriberToDelete(null);
  };

  // Helper to copy emails to clipboard
  const copyAllEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-12 h-12 rounded-full border-4 border-brand border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground font-sans relative overflow-hidden" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <main className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-4">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-brand to-blue-500">
              {lang === 'ar' ? 'المشتركون' : 'Subscribers'}
            </span>
            <span className="px-3 py-1 bg-brand/10 border border-brand/20 text-brand rounded-full text-lg">
              {subscribers.length}
            </span>
          </h1>

          {subscribers.length > 0 && (
            <button 
              onClick={copyAllEmails}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all ${
                copied 
                  ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }`}
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              )}
              <span>{copied ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ الإيميلات' : 'Copy Emails')}</span>
            </button>
          )}
        </div>

        <div className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          {subscribers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-xl">{lang === 'ar' ? 'لا يوجد مشتركين حتى الآن.' : 'No subscribers yet.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right">
                <thead className="bg-white/5 text-gray-400 text-sm font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-3xl">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                    <th className="px-6 py-4">{lang === 'ar' ? 'تاريخ الاشتراك' : 'Date Subscribed'}</th>
                    <th className="px-6 py-4 text-center rounded-tr-3xl">{lang === 'ar' ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(sub.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => triggerDelete(sub._id)}
                          className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title={lang === 'ar' ? 'حذف' : 'Delete'}
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <ConfirmModal 
        isOpen={deleteModalOpen}
        title={lang === 'ar' ? 'حذف المشترك' : 'Delete Subscriber'}
        message={lang === 'ar' ? 'هل أنت متأكد من حذف هذا المشترك بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to permanently delete this subscriber? This cannot be undone.'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
