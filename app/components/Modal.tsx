"use client";

import { ReactNode } from "react";

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  onConfirm,
  confirmText,
  cancelText
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          type === 'success' ? 'bg-green-500/20 text-green-500' : 
          type === 'error' ? 'bg-red-500/20 text-red-500' :
          type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
          'bg-blue-500/20 text-blue-500'
        }`}>
          {type === 'success' && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          {type === 'error' && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
          {type === 'warning' && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          {type === 'info' && <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        </div>
        {title && <h3 className="text-xl font-bold text-white text-center mb-2">{title}</h3>}
        <p className="text-center text-gray-300 mb-6">{message}</p>
        
        {onConfirm ? (
          <div className="flex gap-3 w-full">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-colors">
              {cancelText || 'Cancel'}
            </button>
            <button type="button" onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-3 rounded-xl font-medium text-white transition-colors ${type === 'warning' || type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-brand hover:bg-brand-light'}`}>
              {confirmText || 'Confirm'}
            </button>
          </div>
        ) : (
          <button type="button" onClick={onClose} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors">
            {confirmText || 'OK'}
          </button>
        )}
      </div>
    </div>
  );
}
