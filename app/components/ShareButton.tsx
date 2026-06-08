"use client";

interface ShareButtonProps {
  lang: string;
  title: string;
}

export default function ShareButton({ lang, title }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: lang === 'ar' ? 'اقرأ هذا المقال الرائع:' : 'Check out this awesome article:',
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard copy
      navigator.clipboard.writeText(window.location.href);
      alert(lang === 'ar' ? 'تم نسخ الرابط!' : 'Link copied to clipboard!');
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="px-6 py-2.5 rounded-full bg-surface/50 backdrop-blur-md border border-glass-border hover:bg-white/5 hover:border-brand/40 transition-all text-sm font-medium flex items-center gap-2 group cursor-pointer"
    >
      <svg className="w-4 h-4 text-muted-foreground group-hover:text-brand-light transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      {lang === 'ar' ? 'مشاركة' : 'Share'}
    </button>
  );
}
