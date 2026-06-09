"use client";

import { useState, useEffect } from "react";
import { recordView, recordLike } from "@/services/api";

interface EngagementBarProps {
  id: string;
  initialViews: number;
  initialLikes: number;
  lang: string;
}

export default function EngagementBar({ id, initialViews, initialLikes, lang }: EngagementBarProps) {
  const [views, setViews] = useState(initialViews || 0);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    // Check local storage to prevent duplicate views on refresh
    const viewedKey = `viewed_${id}`;
    if (!localStorage.getItem(viewedKey)) {
      recordView(id).then((success) => {
        if (success) {
          localStorage.setItem(viewedKey, "true");
          setViews(v => v + 1);
        }
      });
    }

    // Check if user has liked before
    const likedKey = `liked_${id}`;
    if (localStorage.getItem(likedKey)) {
      setHasLiked(true);
    }
  }, [id]);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);
    
    // Optimistic UI update
    setLikes(l => l + 1);
    setHasLiked(true);
    
    const likedKey = `liked_${id}`;
    localStorage.setItem(likedKey, "true");

    const result = await recordLike(id);
    if (!result.success) {
      // Revert if failed
      setLikes(l => Math.max(0, l - 1));
      setHasLiked(false);
      localStorage.removeItem(likedKey);
    } else if (result.likes !== undefined) {
      // Sync with server
      setLikes(result.likes);
    }
    
    setIsLiking(false);
  };

  return (
    <div className="flex items-center gap-4 text-muted-foreground mt-8 p-4 bg-surface/30 backdrop-blur-md rounded-2xl border border-glass-border shadow-sm w-fit" dir={lang === 'en' ? 'ltr' : 'rtl'}>
      {/* Views */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-muted-foreground/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className="font-medium text-foreground">{views}</span>
        <span className="text-sm font-light">{lang === 'ar' ? 'مشاهدة' : 'Views'}</span>
      </div>

      <div className="w-px h-6 bg-glass-border mx-2"></div>

      {/* Likes */}
      <button 
        onClick={handleLike}
        disabled={hasLiked || isLiking}
        className={`flex items-center gap-2 transition-all duration-300 group ${hasLiked ? 'cursor-default' : 'hover:scale-105 active:scale-95'}`}
        aria-label="Like Article"
      >
        <div className={`relative flex items-center justify-center p-2 rounded-full transition-colors duration-300 ${hasLiked ? 'bg-rose-500/10 text-rose-500' : 'bg-surface border border-glass-border text-muted-foreground group-hover:border-rose-500/50 group-hover:text-rose-400'}`}>
          <svg className={`w-5 h-5 transition-transform duration-500 ${hasLiked ? 'scale-110 fill-current' : 'group-hover:scale-110'}`} fill={hasLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {hasLiked && (
            <span className="absolute inset-0 rounded-full animate-ping bg-rose-500/40 opacity-0 duration-1000"></span>
          )}
        </div>
        <span className={`font-medium transition-colors ${hasLiked ? 'text-rose-500' : 'text-foreground'}`}>
          {likes}
        </span>
        <span className={`text-sm font-light transition-colors ${hasLiked ? 'text-rose-500/80' : 'text-muted-foreground'}`}>
          {lang === 'ar' ? 'إعجاب' : 'Likes'}
        </span>
      </button>
    </div>
  );
}
