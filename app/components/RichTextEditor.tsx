"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useCallback, useEffect } from "react";

// ─── Toolbar Button ────────────────────────────────────
function ToolbarBtn({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 text-sm leading-none
        ${
          isActive
            ? "bg-brand text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]"
            : "text-gray-400 hover:text-white hover:bg-white/10"
        }
        disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

// ─── Separator ─────────────────────────────────────────
function Separator() {
  return <div className="w-px h-6 bg-white/10 mx-1" />;
}

// ─── Image Insert Modal ────────────────────────────────
function ImageModal({
  onInsert,
  onClose,
  lang,
}: {
  onInsert: (url: string, alt: string) => void;
  onClose: () => void;
  lang: string;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="bg-surface border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        dir={lang === "en" ? "ltr" : "rtl"}
      >
        <h3 className="text-lg font-bold text-white mb-4">
          {lang === "ar" ? "إضافة صورة" : "Insert Image"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {lang === "ar" ? "رابط الصورة (URL)" : "Image URL"}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand transition-colors text-sm"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              {lang === "ar" ? "وصف الصورة (اختياري)" : "Alt text (optional)"}
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder={
                lang === "ar" ? "وصف مختصر للصورة..." : "Brief image description..."
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand transition-colors text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (url.trim()) {
                onInsert(url.trim(), alt.trim());
              }
            }}
            disabled={!url.trim()}
            className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {lang === "ar" ? "إضافة" : "Insert"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Link Insert Modal ─────────────────────────────────
function LinkModal({
  onInsert,
  onClose,
  lang,
  initialUrl,
}: {
  onInsert: (url: string) => void;
  onClose: () => void;
  lang: string;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl || "");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="bg-surface border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        dir={lang === "en" ? "ltr" : "rtl"}
      >
        <h3 className="text-lg font-bold text-white mb-4">
          {lang === "ar" ? "إضافة رابط" : "Insert Link"}
        </h3>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">
            {lang === "ar" ? "الرابط (URL)" : "URL"}
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:border-brand transition-colors text-sm"
            dir="ltr"
          />
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (url.trim()) {
                onInsert(url.trim());
              }
            }}
            disabled={!url.trim()}
            className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-light text-white font-semibold transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.3)]"
          >
            {lang === "ar" ? "إضافة" : "Insert"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SVG Icons ─────────────────────────────────────────
const icons = {
  bold: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  italic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  underline: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  strikethrough: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  h2: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
    </svg>
  ),
  h3: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h8" /><path d="M4 18V6" /><path d="M12 18V6" /><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" /><path d="M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" />
    </svg>
  ),
  bulletList: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" />
    </svg>
  ),
  orderedList: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  ),
  blockquote: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  alignLeft: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  ),
  alignCenter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="10" x2="6" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="18" y1="18" x2="6" y2="18" />
    </svg>
  ),
  alignRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" />
    </svg>
  ),
  undo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  ),
  redo: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  hr: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  ),
};

// ─── Main Editor Component ─────────────────────────────
export default function RichTextEditor({
  content,
  onChange,
  disabled = false,
  lang = "ar",
  placeholder,
}: {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  lang?: string;
  placeholder?: string;
}) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      ImageExtension.configure({
        HTMLAttributes: {
          class: "rich-editor-image",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "rich-editor-link",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content",
        dir: lang === "en" ? "ltr" : "rtl",
      },
    },
  });

  // Sync editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // Handle image insertion
  const handleInsertImage = useCallback(
    (url: string, alt: string) => {
      if (editor) {
        editor.chain().focus().setImage({ src: url, alt: alt || "" }).run();
      }
      setShowImageModal(false);
    },
    [editor]
  );

  // Handle link insertion
  const handleInsertLink = useCallback(
    (url: string) => {
      if (editor) {
        if (editor.state.selection.empty) {
          // Insert the URL as link text
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`)
            .run();
        } else {
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }
      }
      setShowLinkModal(false);
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="w-full h-[300px] rounded-xl bg-gray-900/50 border border-gray-700 animate-pulse" />
    );
  }

  return (
    <div
      className={`rich-editor-wrapper rounded-xl border border-gray-700 bg-gray-900/50 overflow-hidden transition-colors focus-within:border-brand ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* ── Toolbar ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-700/80 bg-gray-900/80 backdrop-blur-sm">
        {/* Text Formatting */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          disabled={disabled}
          title={lang === "ar" ? "عريض" : "Bold"}
        >
          {icons.bold}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          disabled={disabled}
          title={lang === "ar" ? "مائل" : "Italic"}
        >
          {icons.italic}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          disabled={disabled}
          title={lang === "ar" ? "تحته خط" : "Underline"}
        >
          {icons.underline}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          disabled={disabled}
          title={lang === "ar" ? "يتوسطه خط" : "Strikethrough"}
        >
          {icons.strikethrough}
        </ToolbarBtn>

        <Separator />

        {/* Headings */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          title={lang === "ar" ? "عنوان رئيسي" : "Heading 2"}
        >
          {icons.h2}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          title={lang === "ar" ? "عنوان فرعي" : "Heading 3"}
        >
          {icons.h3}
        </ToolbarBtn>

        <Separator />

        {/* Lists */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          disabled={disabled}
          title={lang === "ar" ? "قائمة نقطية" : "Bullet List"}
        >
          {icons.bulletList}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          disabled={disabled}
          title={lang === "ar" ? "قائمة مرقمة" : "Ordered List"}
        >
          {icons.orderedList}
        </ToolbarBtn>

        <Separator />

        {/* Block Elements */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          disabled={disabled}
          title={lang === "ar" ? "اقتباس" : "Blockquote"}
        >
          {icons.blockquote}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={disabled}
          title={lang === "ar" ? "خط فاصل" : "Horizontal Rule"}
        >
          {icons.hr}
        </ToolbarBtn>

        <Separator />

        {/* Alignment */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
          title={lang === "ar" ? "محاذاة لليسار" : "Align Left"}
        >
          {icons.alignLeft}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
          title={lang === "ar" ? "توسيط" : "Align Center"}
        >
          {icons.alignCenter}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
          title={lang === "ar" ? "محاذاة لليمين" : "Align Right"}
        >
          {icons.alignRight}
        </ToolbarBtn>

        <Separator />

        {/* Links & Media */}
        <ToolbarBtn
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
            } else {
              setShowLinkModal(true);
            }
          }}
          isActive={editor.isActive("link")}
          disabled={disabled}
          title={lang === "ar" ? "رابط" : "Link"}
        >
          {icons.link}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => setShowImageModal(true)}
          disabled={disabled}
          title={lang === "ar" ? "صورة" : "Image"}
        >
          {icons.image}
        </ToolbarBtn>

        <Separator />

        {/* Undo/Redo */}
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          title={lang === "ar" ? "تراجع" : "Undo"}
        >
          {icons.undo}
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          title={lang === "ar" ? "إعادة" : "Redo"}
        >
          {icons.redo}
        </ToolbarBtn>
      </div>

      {/* ── Editor Content ────────────────────────────── */}
      <EditorContent
        editor={editor}
        className="rich-editor-area"
      />

      {/* ── Image Modal ───────────────────────────────── */}
      {showImageModal && (
        <ImageModal
          onInsert={handleInsertImage}
          onClose={() => setShowImageModal(false)}
          lang={lang as string}
        />
      )}

      {/* ── Link Modal ────────────────────────────────── */}
      {showLinkModal && (
        <LinkModal
          onInsert={handleInsertLink}
          onClose={() => setShowLinkModal(false)}
          lang={lang as string}
          initialUrl={editor.getAttributes("link").href}
        />
      )}
    </div>
  );
}
