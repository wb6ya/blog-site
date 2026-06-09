"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Cropper from "react-easy-crop";
import dynamic from "next/dynamic";
import en from "@/dictionaries/en.json";
import ar from "@/dictionaries/ar.json";

const RichTextEditor = dynamic(() => import("@/app/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-xl bg-gray-900/50 border border-gray-700 animate-pulse" />
  ),
});

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

export default function EditBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enhanceWithAI, setEnhanceWithAI] = useState(false);
  
  // Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [systemTags, setSystemTags] = useState<{_id: string, name: string}[]>([]);
  const [token, setToken] = useState("");
  
  // Cropper States
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  
  const router = useRouter();
  const params = useParams();
  
  const lang = params?.lang || 'ar';
  const dict = lang === 'en' ? en : ar;

  const steps = enhanceWithAI 
    ? [dict.admin.aiStep1, dict.admin.aiStep2, dict.admin.aiStep3, dict.admin.aiStep4]
    : [dict.admin.aiStep1, dict.admin.aiStep3, dict.admin.aiStep4];

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push(`/${lang}/admin/login`);
      return;
    }

    // Fetch tags
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`)
      .then(res => res.json())
      .then(data => setSystemTags(data.data || data || []))
      .catch(console.error);

    const fetchBlog = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/blog/${params.id}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(lang === 'ar' ? "المقال غير موجود" : "Blog not found");
        
        setTitle(data.title);
        setDescription(data.description);
        setContent(data.content || "");
        setTags(data.tags || []);
        if (data.image) {
          setCurrentImageUrl(data.image);
        }
      } catch (err: any) {
        setGlobalError(err.message);
      } finally {
        setFetching(false);
      }
    };

    if (params.id) fetchBlog();
  }, [params.id, router, lang]);

  // Prevent closing the tab while uploading
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading && !success) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [loading, success]);

  // Sequential Loader
  useEffect(() => {
    let interval: any;
    if (loading && !success) {
      setLoadingStep(0);
      let currentStep = 0;
      interval = setInterval(() => {
        currentStep++;
        if (currentStep < steps.length - 1) {
          setLoadingStep(currentStep);
        }
      }, 5000);
    } else if (success) {
      setLoadingStep(steps.length - 1); // All done
    }
    return () => clearInterval(interval);
  }, [loading, success]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setGlobalError(dict.admin.fileTooLarge);
        return;
      }
      setGlobalError("");
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
      setShowCropper(true);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
        setImage(croppedFile);
        setImagePreview(URL.createObjectURL(croppedFile));
        setShowCropper(false);
      }
    } catch (e) {
      console.error(e);
      setGlobalError("Failed to crop image.");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError("");

    let hasError = false;
    const newErrors: {[key: string]: string} = {};

    if (title.trim().length < 3) {
      newErrors.title = lang === 'ar' ? "يجب أن يتكون العنوان من 3 أحرف على الأقل." : "Title must be at least 3 characters.";
      hasError = true;
    }
    if (description.trim().length < 10) {
      newErrors.description = lang === 'ar' ? "يجب أن يتكون الوصف من 10 أحرف على الأقل." : "Description must be at least 10 characters.";
      hasError = true;
    }
    const plainContent = content.replace(/<[^>]*>/g, '').trim();
    if (plainContent.length < 50) {
      newErrors.content = lang === 'ar' ? "يجب أن يتكون المحتوى من 50 حرفاً على الأقل." : "Content must be at least 50 characters.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      setLoading(false);
      
      // Focus first error
      setTimeout(() => {
        if (newErrors.title) {
          titleRef.current?.focus();
          titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (newErrors.description) {
          descriptionRef.current?.focus();
          descriptionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));
      formData.append("enhanceWithAI", enhanceWithAI ? "true" : "false");
      if (image) {
        formData.append("image", image);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/blog/${params.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update blog");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${lang}/admin/dashboard`);
      }, 2000);
    } catch (err: any) {
      setGlobalError(err.message);
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center mt-32 text-white animate-pulse">{dict.admin.loading}</div>;

  return (
    <div className="container mx-auto px-4 max-w-3xl mt-24 mb-20 relative z-10" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <div className="flex items-center mb-8">
        <Link href={`/${lang}/admin/dashboard`} className={`text-gray-400 hover:text-white transition-colors ${lang === 'en' ? 'mr-4' : 'ml-4'}`}>
          <svg className={`w-6 h-6 ${lang === 'en' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        <h1 className="text-3xl font-bold text-white">{dict.admin.editPost}</h1>
      </div>

      <div className="glass-panel rounded-3xl p-8 shadow-xl">
        {globalError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
             <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {globalError}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {dict.admin.editSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.title}
            </label>
            <input
              ref={titleRef}
              type="text"
              disabled={loading || success}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({...errors, title: ''}); }}
              className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-brand'}`}
              placeholder={lang === 'ar' ? "اكتب عنواناً جذاباً..." : "Write a catchy title..."}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1.5 px-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.description}
            </label>
            <textarea
              ref={descriptionRef}
              disabled={loading || success}
              rows={3}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors({...errors, description: ''}); }}
              className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border text-white focus:outline-none transition-colors resize-none disabled:opacity-50 ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-brand'}`}
              placeholder={lang === 'ar' ? "اكتب وصفاً مختصراً..." : "Write a short description..."}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1.5 px-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.content}
            </label>
            <RichTextEditor
              content={content}
              onChange={(val) => { setContent(val); setErrors({...errors, content: ''}); }}
              disabled={loading || success}
              lang={lang as string}
              placeholder={lang === 'ar' ? "اكتب محتوى المقال كاملاً هنا..." : "Write the full article content here..."}
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1.5 px-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {errors.content}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.tags}
            </label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(systemTags) && systemTags.map((tagObj) => {
                const preTag = tagObj.name;
                const isSelected = tags.includes(preTag);
                return (
                  <button
                    key={tagObj._id}
                    type="button"
                    onClick={() => isSelected ? removeTag(preTag) : setTags([...tags, preTag])}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${isSelected ? 'bg-brand text-white shadow-[0_0_10px_rgba(var(--brand),0.3)]' : 'bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-brand/50'}`}
                  >
                    {isSelected ? '✓ ' : '+ '}{preTag}
                  </button>
                )
              })}
              {(!Array.isArray(systemTags) || systemTags.length === 0) && (
                <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'لا توجد أوسمة متاحة، الرجاء إضافة أوسمة من صفحة Profile.' : 'No tags available. Please add them from the Profile page.'}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/20 text-brand-light text-sm border border-brand/30">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="hover:text-white transition-colors">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {dict.admin.coverUpdate}
            </label>
            {currentImageUrl && !imagePreview && (
              <div className="mb-4 relative w-full aspect-video rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                <Image src={currentImageUrl.startsWith('http') || currentImageUrl.startsWith('/') ? currentImageUrl : `/${currentImageUrl}`} alt="Current cover" fill className="object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center text-white font-medium drop-shadow-md">
                  {dict.admin.currentCover}
                </div>
              </div>
            )}
            <input
              type="file"
              disabled={loading || success}
              accept="image/*"
              onChange={onFileChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/20 file:text-brand hover:file:bg-brand/30 transition-colors disabled:opacity-50"
            />
            {imagePreview && !showCropper && (
              <div className="mt-4 relative w-full aspect-video rounded-xl overflow-hidden border border-brand/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                <img src={imagePreview} alt="Preview new cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-medium drop-shadow-md opacity-0 hover:opacity-100 transition-opacity">
                  {dict.admin.newCover}
                </div>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">{dict.admin.coverOptional}</p>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-brand/10 border border-brand/20">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={enhanceWithAI}
                onChange={(e) => setEnhanceWithAI(e.target.checked)}
                disabled={loading || success}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
            </label>
            <div>
              <p className="text-sm font-medium text-white">{lang === 'ar' ? 'تحسين الصياغة بالذكاء الاصطناعي (عند التعديل)' : 'Enhance writing with AI (on edit)'}</p>
              <p className="text-xs text-brand-light/80">{lang === 'ar' ? 'قم بتفعيله إذا كنت تريد للذكاء الاصطناعي إعادة صياغة تعديلاتك.' : 'Enable if you want AI to rephrase your edits.'}</p>
            </div>
          </div>

          {/* Sequential Loader Modal */}
          {loading && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-surface border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                <div className="flex flex-col items-center mb-6">
                  {success ? (
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full border-4 border-brand/20 border-t-brand animate-spin mb-4"></div>
                  )}
                  <h3 className="text-xl font-bold text-white text-center">
                    {success ? dict.admin.editSuccess : dict.admin.saving}
                  </h3>
                  {!success && <p className="text-sm text-gray-400 mt-2 text-center">{lang === 'ar' ? 'الرجاء عدم إغلاق هذه الصفحة...' : 'Please do not close this page...'}</p>}
                </div>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = index === loadingStep && !success;
                    const isCompleted = index < loadingStep || success;
                    
                    return (
                      <div key={index} className={`flex items-center gap-4 transition-all duration-500 ${isCompleted || isActive ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500 border-green-500' : isActive ? 'bg-brand/20 border-brand animate-pulse' : 'border-gray-600'}`}>
                          {isCompleted ? (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : isActive ? (
                            <span className="w-2.5 h-2.5 bg-brand rounded-full animate-ping"></span>
                          ) : null}
                        </div>
                        <span className={`text-base ${isCompleted ? 'text-green-400 font-bold' : isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {!loading && !success && (
            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-light text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(var(--brand),0.3)] hover:shadow-[0_0_30px_rgba(var(--brand),0.5)] mt-8"
            >
              {dict.admin.saveChanges}
            </button>
          )}
        </form>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface border border-white/10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh] sm:h-[600px]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h3 className="text-xl font-bold text-white">{dict.admin.cropImage}</h3>
              <button onClick={() => setShowCropper(false)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="relative flex-1 bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={21 / 9}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="p-6 bg-black/40 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4 w-full sm:w-1/2">
                  <label className="text-sm text-gray-400 whitespace-nowrap">{dict.admin.zoom}</label>
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
                    {dict.admin.cancel}
                  </button>
                  <button onClick={handleSaveCrop} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-light text-white font-bold transition-all shadow-[0_0_15px_rgba(var(--brand),0.3)] hover:shadow-[0_0_20px_rgba(var(--brand),0.5)]">
                    {dict.admin.saveCrop}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

