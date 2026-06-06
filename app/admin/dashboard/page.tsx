"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/blog`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchBlogs();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;

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
    router.push("/admin/login");
  };

  if (loading) {
    return <div className="text-center mt-20 text-white">جاري التحميل...</div>;
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl mt-12 mb-20" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-white">إدارة المقالات</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/create"
            className="bg-brand hover:bg-brand-light text-white px-6 py-2 rounded-xl transition-colors font-medium"
          >
            + مقال جديد
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-6 py-2 rounded-xl transition-colors font-medium"
          >
            خروج
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-gray-300">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400">
              <tr>
                <th className="p-4 font-medium">الصورة</th>
                <th className="p-4 font-medium">العنوان</th>
                <th className="p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    لا توجد مقالات مضافة بعد.
                  </td>
                </tr>
              ) : (
                blogs.map((blog: any) => (
                  <tr key={blog._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {blog.image ? (
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
                          لا صورة
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-white truncate max-w-xs">{blog.title}</td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <Link
                          href={`/admin/edit/${blog._id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          حذف
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
    </div>
  );
}
