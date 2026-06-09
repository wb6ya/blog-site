"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Cropper from "react-easy-crop";
import Modal from "@/app/components/Modal";

// Helper to get cropped image file
const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      resolve(file);
    }, "image/jpeg");
  });
};

export default function AdminProfile() {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'warning' | 'info'>('info');
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // My Account
  const [myUsername, setMyUsername] = useState("");
  const [myAvatar, setMyAvatar] = useState<File | null>(null);
  const [myAvatarUrl, setMyAvatarUrl] = useState("");
  const [myAvatarPreview, setMyAvatarPreview] = useState<string | null>(null);

  // Tags
  const [tags, setTags] = useState<{_id: string, name: string}[]>([]);
  const [newTag, setNewTag] = useState("");

  // Authors
  const [authors, setAuthors] = useState<any[]>([]);
  const [editingAuthor, setEditingAuthor] = useState<string | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editAvatar, setEditAvatar] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);

  // Cropper States
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropTarget, setCropTarget] = useState<'myAvatar' | 'editAvatar' | null>(null);

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
        setTags(data.data || data || []);
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
        setAuthors(data.data || data || []);
        setLoading(false);
      }
    } catch (e) { console.error(e) }
  };

  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
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
        setMyAvatarPreview(null);
        showAlert('success', lang === 'ar' ? 'نجاح' : 'Success', lang === 'ar' ? 'تم تحديث حسابك بنجاح.' : 'Profile updated successfully.');
      } else {
        const err = await res.json();
        showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', err.message || 'Update failed');
      }
    } catch (e) {
      console.error(e);
      showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', 'An error occurred while updating profile.');
    }
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
      } else {
        const err = await res.json();
        showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', err.message || 'Failed to add tag');
      }
    } catch (e) {
      console.error(e);
      showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', 'An error occurred while adding tag.');
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/tags/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTags();
      } else {
        showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', 'Failed to delete tag');
      }
    } catch (e) {
      console.error(e);
      showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', 'An error occurred while deleting tag.');
    }
  };

  const startEditAuthor = (author: any) => {
    setEditingAuthor(author._id);
    setEditUsername(author.username);
    setEditAvatar(null);
    setEditAvatarPreview(null);
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
        showAlert('success', lang === 'ar' ? 'نجاح' : 'Success', lang === 'ar' ? 'تم تحديث حساب الكاتب بنجاح.' : 'Author account updated successfully.');
      } else {
        const err = await res.json();
        showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', err.message || 'Update failed');
      }
    } catch (e) {
      console.error(e);
      showAlert('error', lang === 'ar' ? 'خطأ' : 'Error', 'An error occurred while updating author.');
    }
  };

  // Cropper logic
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'myAvatar' | 'editAvatar') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', lang === 'ar' ? 'حجم الصورة كبير جداً' : 'Image is too large', lang === 'ar' ? 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت' : 'Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
        setCropTarget(target);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (cropTarget === 'myAvatar') {
          setMyAvatar(croppedFile);
          setMyAvatarPreview(URL.createObjectURL(croppedFile));
        } else if (cropTarget === 'editAvatar') {
          setEditAvatar(croppedFile);
          setEditAvatarPreview(URL.createObjectURL(croppedFile));
        }
        setShowCropper(false);
      }
    } catch (e) {
      console.error(e);
      showAlert('error', lang === 'ar' ? 'خطأ في القص' : 'Cropping Error', 'Failed to crop image.');
    }
  };

  if (!isAdmin || loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <main className="min-h-screen pt-32 pb-24 relative z-10" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          {lang === 'ar' ? 'لوحة تحكم المدير' : 'Admin Profile'}
        </h1>

        <div className="flex flex-col gap-12">
          
          {/* Section 1: My Profile */}
          <section className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">
              {lang === 'ar' ? 'حسابي' : 'My Account'}
            </h2>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 relative rounded-full overflow-hidden border-2 border-white/10 bg-black/40">
                  {myAvatarPreview ? (
                     <img src={myAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : myAvatarUrl ? (
                     <Image src={myAvatarUrl.startsWith('http') || myAvatarUrl.startsWith('/') ? myAvatarUrl : `/${myAvatarUrl}`} alt={myUsername} fill className="object-cover" />
                  ) : (
                     <div className="w-full h-full bg-brand/20 flex items-center justify-center text-brand-light font-bold text-3xl">
                       {myUsername?.charAt(0)?.toUpperCase()}
                     </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {lang === 'ar' ? 'تحديث الصورة' : 'Update Avatar'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileChange(e, 'myAvatar')}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/20 file:text-brand-light hover:file:bg-brand/30"
                    />
                  </div>
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
                </div>
              </div>

              <button type="submit" className="px-8 py-3 rounded-xl bg-brand text-white font-medium hover:bg-brand-light transition-colors self-start shadow-[0_0_15px_rgba(var(--brand),0.3)]">
                {lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
            </form>
          </section>

          {/* Section 2: Manage Tags */}
          <section className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
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
          <section className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-white/10 pb-4">
              {lang === 'ar' ? 'إدارة الكتاب' : 'Manage Authors'}
            </h2>
            <div className="flex flex-col gap-4">
              {authors.map(author => (
                <div key={author._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-900/30 border border-white/5 gap-4 hover:bg-white/5 transition-colors">
                  {editingAuthor === author._id ? (
                    <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full items-start sm:items-center">
                      <div className="w-16 h-16 shrink-0 relative rounded-full overflow-hidden border border-white/10 bg-black/40">
                         {editAvatarPreview ? (
                            <img src={editAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                         ) : author.avatar ? (
                            <Image src={author.avatar.startsWith('http') || author.avatar.startsWith('/') ? author.avatar : `/${author.avatar}`} alt={author.username} fill className="object-cover" />
                         ) : (
                            <div className="w-full h-full bg-brand/20 flex items-center justify-center text-brand-light font-bold">
                              {author.username.charAt(0).toUpperCase()}
                            </div>
                         )}
                      </div>
                      <div className="flex flex-col gap-3 flex-1 w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onFileChange(e, 'editAvatar')}
                          className="text-xs text-gray-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/10 file:text-white hover:file:bg-white/20"
                        />
                        <input
                          type="text"
                          value={editUsername}
                          onChange={e => setEditUsername(e.target.value)}
                          className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white w-full focus:outline-none focus:border-brand"
                        />
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <button onClick={() => handleUpdateAuthor(author._id)} className="px-4 py-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 text-sm flex-1">
                          {lang === 'ar' ? 'حفظ' : 'Save'}
                        </button>
                        <button onClick={() => setEditingAuthor(null)} className="px-4 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm flex-1">
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
                          <p className="font-bold text-foreground">{author.username} {author.role === 'admin' && <span className="text-xs text-brand bg-brand/10 px-2 py-0.5 rounded-full ml-2 border border-brand/20 shadow-[0_0_5px_rgba(var(--brand),0.5)]">Admin</span>}</p>
                          <p className="text-xs text-muted-foreground">{author.email}</p>
                        </div>
                      </div>
                      {author.role !== 'admin' && (
                        <button onClick={() => startEditAuthor(author)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors self-start sm:self-auto border border-white/5">
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

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
      />

      {/* Image Cropper Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[70vh] sm:h-[500px]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h3 className="text-xl font-bold text-white">{lang === 'ar' ? 'قص الصورة' : 'Crop Avatar'}</h3>
              <button onClick={() => setShowCropper(false)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="relative flex-1 bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-6 bg-black/40 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4 w-full sm:w-1/2">
                  <label className="text-sm text-gray-400 whitespace-nowrap">{lang === 'ar' ? 'التقريب' : 'Zoom'}</label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-brand h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button onClick={() => setShowCropper(false)} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors">
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button onClick={handleSaveCrop} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all shadow-[0_0_15px_rgba(var(--brand),0.3)] hover:shadow-[0_0_20px_rgba(var(--brand),0.5)]">
                    {lang === 'ar' ? 'قص وحفظ' : 'Save Crop'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
