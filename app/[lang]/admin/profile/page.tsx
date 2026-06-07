"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function AdminProfile() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  // My Account
  const [myUsername, setMyUsername] = useState("");
  const [myAvatar, setMyAvatar] = useState<File | null>(null);
  const [myAvatarUrl, setMyAvatarUrl] = useState("");

  // Tags
  const [tags, setTags] = useState<{_id: string, name: string}[]>([]);
  const [newTag, setNewTag] = useState("");

  // Authors
  const [authors, setAuthors] = useState<any[]>([]);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editAvatar, setEditAvatar] = useState<File | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");
    
    if (!t || role !== 'admin') {
      router.push(`/${lang}`);
      return;
    }
    
    setToken(t);
    setIsAdmin(true);
    
    // Fetch Data
    fetchMyProfile(t);
    fetchTags();
    fetchAuthors(t);
  }, [lang, router]);

  const fetchMyProfile = async (t: string) => {
    try {
      const username = localStorage.getItem("adminUsername") || "";
      const avatar = localStorage.getItem("adminAvatar") || "";
      setMyUsername(username);
      setMyAvatarUrl(avatar);
    } catch (e) { console.error(e) }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${apiUrl}/tags`);
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    } catch (e) { console.error(e) }
  };

  const fetchAuthors = async (t: string) => {
    try {
      const res = await fetch(`${apiUrl}/auth/users`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAuthors(data);
        setLoading(false);
      }
    } catch (e) { console.error(e) }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (myUsername) formData.append("username", myUsername);
    if (myAvatar) formData.append("avatar", myAvatar);

    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("adminUsername", data.username);
        if (data.avatar) localStorage.setItem("adminAvatar", data.avatar);
        setMyAvatarUrl(data.avatar);
        alert(lang === 'ar' ? 'تم التحديث بنجاح' : 'Updated successfully');
      }
    } catch (e) { console.error(e) }
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/tags`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name: newTag.trim() })
      });
      if (res.ok) {
        setNewTag("");
        fetchTags();
      }
    } catch (e) { console.error(e) }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/tags/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTags();
      }
    } catch (e) { console.error(e) }
  };

  const startEditAuthor = (author: any) => {
    setEditingAuthor(author._id);
    setEditUsername(author.username);
    setEditAvatar(null);
  };

  const handleUpdateAuthor = async (id: string) => {
    const formData = new FormData();
    formData.append("username", editUsername);
    if (editAvatar) formData.append("avatar", editAvatar);

    try {
      const res = await fetch(`${apiUrl}/auth/users/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        setEditingAuthor(null);
        fetchAuthors(token);
      }
    } catch (e) { console.error(e) }
  };

  if (!isAdmin || loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <main className="min-h-screen pt-32 pb-24" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {lang === 'ar' ? 'لوحة تحكم المدير' : 'Admin Profile'}
        </h1>

        <div className="flex flex-col gap-12">
          
          {/* Section 1: My Profile */}
          <section className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">
              {lang === 'ar' ? 'حسابي' : 'My Account'}
            </h2>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'اسم المستخدم' : 'Username'}
                </label>
                <input
                  type="text"
                  value={myUsername}
                  onChange={e => setMyUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {lang === 'ar' ? 'تحديث الصورة' : 'Update Avatar'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setMyAvatar(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/20 file:text-brand-light hover:file:bg-brand/30"
                />
              </div>
              <button type="submit" className="mt-4 px-6 py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand/90 transition-colors self-start">
                {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
            </form>
          </section>

          {/* Section 2: Manage Tags */}
          <section className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">
              {lang === 'ar' ? 'إدارة الأوسمة' : 'Manage Tags'}
            </h2>
            <form onSubmit={handleAddTag} className="flex gap-4 mb-6">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder={lang === 'ar' ? 'إضافة وسم جديد...' : 'Add new tag...'}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand"
              />
              <button type="submit" className="px-6 py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand/90 transition-colors">
                {lang === 'ar' ? 'إضافة' : 'Add'}
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag._id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-white/10 text-brand-light text-sm">
                  <span>{tag.name}</span>
                  <button onClick={() => handleDeleteTag(tag._id)} className="text-red-400 hover:text-red-300 ml-2">
                    &times;
                  </button>
                </div>
              ))}
              {tags.length === 0 && <p className="text-muted-foreground text-sm">{lang === 'ar' ? 'لا توجد أوسمة.' : 'No tags found.'}</p>}
            </div>
          </section>

          {/* Section 3: Manage Authors */}
          <section className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">
              {lang === 'ar' ? 'إدارة الكتاب' : 'Manage Authors'}
            </h2>
            <div className="flex flex-col gap-4">
              {authors.map(author => (
                <div key={author._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-900/30 border border-white/5 gap-4">
                  {editingAuthor === author._id ? (
                    <div className="flex flex-col gap-3 flex-1 w-full">
                      <input
                        type="text"
                        value={editUsername}
                        onChange={e => setEditUsername(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white w-full"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => setEditAvatar(e.target.files?.[0] || null)}
                        className="text-xs text-gray-400"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleUpdateAuthor(author._id)} className="px-4 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm">
                          {lang === 'ar' ? 'حفظ' : 'Save'}
                        </button>
                        <button onClick={() => setEditingAuthor(null)} className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm">
                          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden relative bg-black/40">
                          {author.avatar ? (
                             <Image src={author.avatar.startsWith('http') || author.avatar.startsWith('/') ? author.avatar : `/${author.avatar}`} alt={author.username} fill className="object-cover" />
                          ) : (
                             <div className="w-full h-full bg-brand/20 flex items-center justify-center text-brand-light font-bold">
                               {author.username.charAt(0).toUpperCase()}
                             </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{author.username} {author.role === 'admin' && <span className="text-xs text-brand bg-brand/10 px-2 py-0.5 rounded-full ml-2">Admin</span>}</p>
                          <p className="text-xs text-muted-foreground">{author.email}</p>
                        </div>
                      </div>
                      {author.role !== 'admin' && (
                        <button onClick={() => startEditAuthor(author)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors self-start sm:self-auto">
                          {lang === 'ar' ? 'تعديل' : 'Edit'}
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
