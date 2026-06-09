"use client";

import { useState, useEffect } from "react";
import { getComments, postComment, deleteAdminComment } from "@/services/api";

interface CommentsProps {
  blogId: string;
  lang: string;
}

export default function Comments({ blogId, lang }: CommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState("");

  useEffect(() => {
    fetchComments();
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");
    if (token && role === 'admin') {
      setIsAdmin(true);
      setAdminToken(token);
    }
  }, [blogId]);

  const fetchComments = async () => {
    setLoading(true);
    const data = await getComments(blogId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError(lang === 'ar' ? 'الرجاء كتابة تعليق.' : 'Please write a comment.');
      return;
    }
    
    setError("");
    setSubmitting(true);
    
    const result = await postComment(blogId, authorName, content);
    if (result.success && result.comment) {
      // Optimistic UI update
      setComments([result.comment, ...comments]);
      setContent("");
      setAuthorName("");
    } else {
      setError(result.error || (lang === 'ar' ? 'حدث خطأ.' : 'An error occurred.'));
    }
    
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا التعليق؟' : 'Are you sure you want to delete this comment?')) return;
    const success = await deleteAdminComment(commentId, adminToken);
    if (success) {
      setComments(comments.filter(c => c._id !== commentId));
    } else {
      alert(lang === 'ar' ? 'فشل الحذف' : 'Failed to delete');
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-glass-border" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
        <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {lang === 'ar' ? 'التعليقات' : 'Comments'} ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 mb-10 shadow-lg">
        <div className="mb-4">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'الاسم (اختياري)' : 'Name (Optional)'}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full bg-surface/50 border border-glass-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand/50 transition-colors"
            maxLength={50}
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder={lang === 'ar' ? 'اكتب تعليقك هنا...' : 'Write your comment here...'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-surface/50 border border-glass-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-brand/50 transition-colors min-h-[120px] resize-y"
            maxLength={1000}
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-8 py-3 rounded-full font-bold text-white transition-all duration-300 ${
              submitting 
                ? 'bg-brand/50 cursor-not-allowed' 
                : 'bg-brand hover:bg-brand-hover hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--brand-color),0.4)]'
            }`}
          >
            {submitting 
              ? (lang === 'ar' ? 'جاري النشر...' : 'Posting...') 
              : (lang === 'ar' ? 'إرسال التعليق' : 'Post Comment')
            }
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>{lang === 'ar' ? 'كن أول من يعلق!' : 'Be the first to comment!'}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-surface/10 border border-white/5 rounded-2xl p-5 hover:bg-surface/20 transition-colors duration-300 relative group">
              {isAdmin && (
                <button 
                  onClick={() => handleDelete(comment._id)}
                  className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-500/10"
                  title="Delete Comment"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-brand/80 to-brand-hover/80 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                  {(comment.authorName || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-foreground">{comment.authorName || (lang === 'ar' ? 'مجهول' : 'Anonymous')}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed ltr:pl-14 rtl:pr-14 whitespace-pre-wrap">
                {/* HTML tags are already escaped by the backend sanitize function, so rendering it directly is safe */}
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
