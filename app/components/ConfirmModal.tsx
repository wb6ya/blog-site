import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  lang: string;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, lang }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-surface/90 border border-glass-border rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
        dir={lang === 'en' ? 'ltr' : 'rtl'}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
        
        <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
          {message}
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-glass-border text-foreground hover:bg-white/5 transition-colors font-medium text-sm"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium text-sm shadow-[0_0_15px_rgba(239,68,68,0.3)]"
          >
            {lang === 'ar' ? 'نعم، متأكد' : 'Yes, confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
