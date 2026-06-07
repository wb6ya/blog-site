"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  // Assume language is in URL. In client component without params prop, we can get it from path:
  const lang = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'ar';
  const dict = lang === 'en' ? en : ar;

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // التحقق من المدخلات (Client-side Validation)
    if (title.trim().length < 3) {
      setError("يجب أن يتكون العنوان من 3 أحرف على الأقل.");
      setLoading(false);
      return;
    }
    if (description.trim().length < 10) {
      setError("يجب أن يتكون الوصف من 10 أحرف على الأقل.");
      setLoading(false);
      return;
    }
    if (content.trim().length < 50) {
      setError("يجب أن يتكون المحتوى من 50 حرفاً على الأقل.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/blog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // لا نضع Content-Type لأنه سيتم وضعه تلقائياً مع الـ Boundary
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "فشل إضافة المقال");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl mt-24 mb-20 relative z-10" dir="rtl">
      <div className="flex items-center mb-8">
        <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors ml-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-white">{dict.admin.addNewPost}</h1>
      </div>

      <div className="glass-panel rounded-3xl p-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-6">
            {dict.admin.createSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.title}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand transition-colors"
              placeholder="اكتب عنواناً جذاباً..."
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.description}
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand transition-colors resize-none"
              placeholder="اكتب وصفاً مختصراً..."
              minLength={10}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.content}
            </label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand transition-colors resize-none"
              placeholder="اكتب محتوى المقال كاملاً هنا..."
              minLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.image}
            </label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/20 file:text-brand hover:file:bg-brand/30 transition-colors"
            />
            {image && (
              <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-light text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? dict.admin.publishing : dict.admin.publish}
          </button>
        </form>
      </div>
    </div>
  );
}
