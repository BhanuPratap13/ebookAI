import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pencil, Eye, Sparkles } from "lucide-react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS, API_BASE_URL } from "../utils/apiPath";
import { countWords, getInitials } from "../utils/helper";
import { WRITING_STYLES } from "../utils/data";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import SimpleMDEditor from "../components/SimpleMDEditor";

// ─── Markdown Preview Component ───────────────────────────────────────────────
const MarkdownPreview = ({ content }) => {
  const renderMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-[#26333B] mt-6 mb-3">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-[#26333B] mt-5 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-[#26333B] mt-4 mb-2">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[#26333B] font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-[#8A9BA4] italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-[#2C5F7C]/8 text-[#2C5F7C] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-[#F5F4F1] border border-[#E8E6E0] rounded-xl p-4 my-3 overflow-x-auto"><code class="text-[#2C5F7C] text-sm font-mono">$1</code></pre>')
      .replace(/^[\-\*] (.*)$/gm, '<li class="text-[#26333B]/80 ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*)$/gm, '<li class="text-[#26333B]/80 ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-[#26333B]/80 leading-relaxed mb-3">')
      .replace(/^(?!<[h1-6|li|pre|ul|ol])(.+)$/gm, '<p class="text-[#26333B]/80 leading-relaxed mb-3">$1</p>');
  };
  return (
    <div
      className="prose max-w-none px-1"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

// ─── Chapter List Item ────────────────────────────────────────────────────────
const ChapterItem = ({ chapter, index, isActive, onClick, onDragStart, onDragOver, onDrop, isDragging }) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, index)}
    onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
    onDrop={(e) => { e.preventDefault(); onDrop(index); }}
    onClick={onClick}
    className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all select-none border ${
      isActive
        ? "bg-[#2C5F7C]/8 border-[#2C5F7C]/25"
        : "hover:bg-[#F0876B]/5 border-transparent hover:border-[#F0876B]/15"
    } ${isDragging ? "opacity-40" : ""}`}
  >
    <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
      <svg className="w-4 h-4 text-[#8A9BA4] group-hover:text-[#2C5F7C]/60 cursor-grab" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 2a2 2 0 110 4 2 2 0 010-4zM7 10a2 2 0 110 4 2 2 0 010-4zM7 18a2 2 0 110-4 2 2 0 010 4zM13 2a2 2 0 110 4 2 2 0 010-4zM13 10a2 2 0 110 4 2 2 0 010-4zM13 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#8A9BA4] font-medium flex-shrink-0">Ch.{index + 1}</span>
        <p className={`text-sm font-medium truncate ${isActive ? "text-[#2C5F7C]" : "text-[#26333B]"}`}>
          {chapter.title}
        </p>
      </div>
      {chapter.content && (
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-xs text-[#8A9BA4]">{countWords(chapter.content)} words</span>
        </div>
      )}
    </div>
  </div>
);

// ─── Editor Page ──────────────────────────────────────────────────────────────
const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // editor | meta
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [style, setStyle] = useState("Professional");
  const [dragIndex, setDragIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Cover image upload
  const [uploadingCover, setUploadingCover] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!hasUnsavedChanges || !book) return;
    const timer = setTimeout(() => {
      handleSave(false);
    }, 30000);
    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, book]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.BOOKS.GET_BY_ID(bookId));
      setBook(res.data.book);
    } catch (error) {
      toast.error("Failed to load ebook");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (showToast = true) => {
    if (!book) return;
    setSaving(true);
    try {
      const res = await axiosInstance.put(API_PATHS.BOOKS.UPDATE(bookId), {
        title: book.title,
        subtitle: book.subtitle,
        author: book.author,
        chapters: book.chapters,
        status: book.status,
        coverImage: book.coverImage,
      });
      setBook(res.data.book);
      setHasUnsavedChanges(false);
      if (showToast) toast.success("Saved ✓");
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateChapterContent = (content) => {
    setBook((prev) => {
      const chapters = [...prev.chapters];
      chapters[activeChapterIndex] = { ...chapters[activeChapterIndex], content };
      return { ...prev, chapters };
    });
    setHasUnsavedChanges(true);
  };

  const handleGenerateChapter = async () => {
    const chapter = book.chapters[activeChapterIndex];
    if (!chapter) return;
    setGeneratingContent(true);
    try {
      const res = await axiosInstance.post(
        API_PATHS.AI.GENERATE_CHAPTER,
        { chapterTitle: chapter.title, chapterDescription: chapter.description, style },
        { timeout: 120000 }
      );
      updateChapterContent(res.data.content);
      toast.success("Chapter content generated! ✨");
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message || "Failed to generate content";
      toast.error(msg);
    } finally {
      setGeneratingContent(false);
    }
  };

  // ── Generate AI Cover ──────────────────────────────────────────────────────
  const handleGenerateAICover = async () => {
    if (!book) return;
    setGeneratingCover(true);
    try {
      // Call the AI cover generation endpoint
      const res = await axiosInstance.post(
        API_PATHS.AI?.GENERATE_COVER
          ? API_PATHS.AI.GENERATE_COVER
          : `/api/ai/generate-cover`,
        {
          title: book.title,
          subtitle: book.subtitle,
          author: book.author,
          genre: book.genre || "",
        },
        { timeout: 120000 }
      );
      // Expect res.data.coverImage or res.data.book.coverImage
      const newCover =
        res.data?.book?.coverImage || res.data?.coverImage || null;
      if (newCover) {
        setBook((prev) => ({ ...prev, coverImage: newCover }));
        setHasUnsavedChanges(true);
        toast.success("AI Cover generated! 🎨");
      } else {
        toast.success("Cover generation initiated — refresh to see your new cover.");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to generate cover";
      // If endpoint doesn't exist yet, show a friendly message
      if (error?.response?.status === 404) {
        toast.error("AI Cover endpoint not yet connected. Coming soon! 🚀");
      } else {
        toast.error(msg);
      }
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleAddChapter = () => {
    const newChapter = {
      title: `Chapter ${(book.chapters?.length || 0) + 1}`,
      description: "",
      content: "",
    };
    setBook((prev) => ({
      ...prev,
      chapters: [...(prev.chapters || []), newChapter],
    }));
    setActiveChapterIndex((book.chapters?.length || 0));
    setHasUnsavedChanges(true);
  };

  const handleDeleteChapter = () => {
    if (book.chapters.length <= 1) {
      toast.error("Cannot delete the last chapter");
      return;
    }
    const chapters = book.chapters.filter((_, i) => i !== activeChapterIndex);
    setBook((prev) => ({ ...prev, chapters }));
    setActiveChapterIndex(Math.max(0, activeChapterIndex - 1));
    setHasUnsavedChanges(true);
    toast.success("Chapter deleted");
  };

  // Drag & drop reorder
  const handleDragStart = (e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (index) => {
    if (dragIndex === null || dragIndex === index) return;
  };
  const handleDrop = (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return;
    const chapters = [...book.chapters];
    const [moved] = chapters.splice(dragIndex, 1);
    chapters.splice(dropIndex, 0, moved);
    setBook((prev) => ({ ...prev, chapters }));
    setActiveChapterIndex(dropIndex);
    setDragIndex(null);
    setHasUnsavedChanges(true);
  };

  // Cover image upload
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const formData = new FormData();
    formData.append("coverImage", file);
    setUploadingCover(true);
    try {
      const res = await axiosInstance.put(
        API_PATHS.BOOKS.UPDATE_COVER(bookId),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setBook((prev) => ({ ...prev, coverImage: res.data.book.coverImage }));
      toast.success("Cover updated!");
    } catch (error) {
      toast.error("Failed to upload cover");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const url = format === "pdf" ? API_PATHS.EXPORT.PDF(bookId) : API_PATHS.EXPORT.DOCX(bookId);
      const token = localStorage.getItem("token");
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.${format === "pdf" ? "pdf" : "docx"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      toast.success(`Exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error("Export failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAF8] gap-3">
        <div className="w-10 h-10 border-3 border-[#F0876B] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#8A9BA4] text-sm">Loading your ebook...</p>
      </div>
    );
  }

  if (!book) return null;

  const activeChapter = book.chapters?.[activeChapterIndex];

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* ── Top Bar ── */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#E8E6E0] z-30 flex-shrink-0 shadow-sm">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Back */}
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-[#8A9BA4] hover:text-[#2C5F7C] transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="w-px h-5 bg-[#E8E6E0]" />

          {/* Book title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[#26333B] font-semibold text-sm truncate">{book.title}</h1>
          </div>

          {/* Tab switcher */}
          <div className="hidden md:flex items-center bg-[#F5F4F1] border border-[#E8E6E0] rounded-lg p-0.5">
            {["editor", "meta"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "bg-white text-[#26333B] shadow-sm border border-[#E8E6E0]"
                    : "text-[#8A9BA4] hover:text-[#26333B]"
                }`}
              >
                {tab === "editor" ? "✏️ Editor" : "⚙️ Details"}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="hidden sm:block text-amber-500 text-xs font-medium">Unsaved changes</span>
            )}
            <button
              id="editor-save-btn"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F5F4F1] border border-[#E8E6E0] rounded-lg text-[#26333B] text-sm font-medium transition-all disabled:opacity-50 shadow-sm"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-[#8A9BA4] border-t-[#2C5F7C] rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              <span className="hidden sm:inline">{saving ? "Saving..." : "Save"}</span>
            </button>

            {/* Export dropdown */}
            <div className="relative group">
              <button
                id="editor-export-btn"
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#F0876B] to-[#e06d50] hover:from-[#e87d60] hover:to-[#d65f42] rounded-lg text-white text-sm font-medium transition-all shadow-md shadow-[#F0876B]/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
              <div className="absolute right-0 top-10 w-40 bg-white border border-[#E8E6E0] rounded-xl shadow-xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50" style={{ boxShadow: "0 8px 32px rgba(38,51,59,0.12)" }}>
                <button
                  id="export-pdf-btn"
                  onClick={() => handleExport("pdf")}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#26333B] hover:bg-[#F5F4F1] hover:text-[#2C5F7C] transition-colors flex items-center gap-2 font-medium"
                >
                  📄 Export PDF
                </button>
                <button
                  id="export-docx-btn"
                  onClick={() => handleExport("docx")}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#26333B] hover:bg-[#F5F4F1] hover:text-[#2C5F7C] transition-colors flex items-center gap-2 font-medium"
                >
                  📝 Export Word
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>

        {/* ── EDITOR TAB ── */}
        {activeTab === "editor" && (
          <>
            {/* Sidebar */}
            <aside
              className={`flex-shrink-0 bg-[#F5F4F1] border-r border-[#E8E6E0] flex flex-col transition-all duration-300 ${
                sidebarOpen ? "w-64" : "w-0 overflow-hidden"
              }`}
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E6E0]">
                <span className="text-[#8A9BA4] text-xs font-semibold uppercase tracking-wider">Chapters</span>
                <button
                  id="add-chapter-btn"
                  onClick={handleAddChapter}
                  className="w-6 h-6 rounded-md bg-[#2C5F7C]/10 hover:bg-[#2C5F7C]/20 text-[#2C5F7C] flex items-center justify-center transition-colors text-sm font-bold"
                  title="Add chapter"
                >
                  +
                </button>
              </div>

              {/* Chapter list */}
              <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
                {book.chapters?.map((ch, i) => (
                  <ChapterItem
                    key={i}
                    chapter={ch}
                    index={i}
                    isActive={activeChapterIndex === i}
                    onClick={() => setActiveChapterIndex(i)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={dragIndex === i}
                  />
                ))}
              </div>

              {/* Sidebar footer stats */}
              <div className="px-4 py-3 border-t border-[#E8E6E0]">
                <div className="flex justify-between text-xs text-[#8A9BA4]">
                  <span>{book.chapters?.length || 0} chapters</span>
                  <span>
                    {(book.chapters || []).reduce((acc, ch) => acc + countWords(ch.content || ""), 0).toLocaleString()} words
                  </span>
                </div>
              </div>
            </aside>

            {/* Chapter editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAF8]">
              {/* Editor toolbar */}
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-[#E8E6E0] bg-white shadow-sm">
                {/* Toggle sidebar */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 text-[#8A9BA4] hover:text-[#2C5F7C] hover:bg-[#2C5F7C]/8 rounded-lg transition-all"
                  title="Toggle sidebar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="w-px h-5 bg-[#E8E6E0]" />

                {/* Chapter title (editable) */}
                {activeChapter && (
                  <input
                    value={activeChapter.title}
                    onChange={(e) => {
                      const chapters = [...book.chapters];
                      chapters[activeChapterIndex] = { ...chapters[activeChapterIndex], title: e.target.value };
                      setBook((prev) => ({ ...prev, chapters }));
                      setHasUnsavedChanges(true);
                    }}
                    className="flex-1 bg-transparent text-[#26333B] font-semibold text-sm focus:outline-none placeholder-[#8A9BA4] border-b border-transparent focus:border-[#2C5F7C]/30 pb-0.5 transition-all"
                    placeholder="Chapter title..."
                  />
                )}

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Style selector */}
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="hidden md:block bg-[#F5F4F1] border border-[#E8E6E0] rounded-lg text-[#26333B] text-xs px-2 py-1.5 focus:outline-none focus:border-[#2C5F7C]/40"
                  >
                    {WRITING_STYLES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>

                  {/* Preview toggle */}
                  <button
                    id="preview-toggle-btn"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      previewMode
                        ? "bg-[#2C5F7C]/10 text-[#2C5F7C] border-[#2C5F7C]/25"
                        : "bg-[#F5F4F1] text-[#8A9BA4] border-[#E8E6E0] hover:text-[#26333B]"
                    }`}
                  >
                    {previewMode ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{previewMode ? "Edit" : "Preview"}</span>
                  </button>

                  {/* AI Generate chapter */}
                  <button
                    id="ai-generate-chapter-btn"
                    onClick={handleGenerateChapter}
                    disabled={generatingContent}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#2C5F7C]/10 to-[#2C5F7C]/15 hover:from-[#2C5F7C]/20 hover:to-[#2C5F7C]/25 border border-[#2C5F7C]/20 rounded-lg text-[#2C5F7C] text-xs font-medium transition-all disabled:opacity-50"
                  >
                    {generatingContent ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-[#2C5F7C]/30 border-t-[#2C5F7C] rounded-full animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">AI Write</span>
                      </>
                    )}
                  </button>

                  {/* Delete chapter */}
                  <button
                    onClick={handleDeleteChapter}
                    className="p-1.5 text-[#8A9BA4] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete chapter"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Editor body */}
              <div className="flex-1 overflow-hidden">
                {activeChapter ? (
                  previewMode ? (
                    <div className="h-full overflow-y-auto px-8 py-6 max-w-3xl mx-auto">
                      <h1 className="text-2xl font-bold text-[#26333B] mb-6">{activeChapter.title}</h1>
                      {activeChapter.description && (
                        <p className="text-[#8A9BA4] italic mb-6 pb-4 border-b border-[#E8E6E0]">{activeChapter.description}</p>
                      )}
                      <MarkdownPreview content={activeChapter.content} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Description field */}
                      <div className="px-6 pt-4 pb-2 border-b border-[#E8E6E0]/60">
                        <input
                          value={activeChapter.description || ""}
                          onChange={(e) => {
                            const chapters = [...book.chapters];
                            chapters[activeChapterIndex] = { ...chapters[activeChapterIndex], description: e.target.value };
                            setBook((prev) => ({ ...prev, chapters }));
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full bg-transparent text-[#8A9BA4] text-sm focus:outline-none placeholder-[#8A9BA4]/50 italic"
                          placeholder="Chapter description (optional, used by AI when generating content)..."
                        />
                      </div>

                      {/* Markdown Editor */}
                      <div className="flex-1 overflow-hidden">
                        <SimpleMDEditor
                          value={activeChapter.content || ""}
                          onChange={updateChapterContent}
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-[#8A9BA4] mb-4">No chapters yet</p>
                    <button
                      onClick={handleAddChapter}
                      className="px-5 py-2.5 bg-gradient-to-r from-[#F0876B] to-[#e06d50] text-white rounded-xl hover:shadow-lg hover:shadow-[#F0876B]/25 transition-all text-sm font-semibold shadow-md shadow-[#F0876B]/20"
                    >
                      Add First Chapter
                    </button>
                  </div>
                )}
              </div>

              {/* Status bar */}
              {activeChapter && (
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-2 border-t border-[#E8E6E0] text-xs text-[#8A9BA4] bg-white/50">
                  <span>
                    {countWords(activeChapter.content || "")} words · {(activeChapter.content || "").length} chars
                  </span>
                  <span className="flex items-center gap-1">
                    {hasUnsavedChanges ? (
                      <span className="text-amber-500 font-medium">● Unsaved</span>
                    ) : (
                      <span className="text-emerald-500 font-medium">✓ Saved</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── META TAB ── */}
        {activeTab === "meta" && (
          <div className="flex-1 overflow-y-auto bg-[#FAFAF8]">
            <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
              <h2 className="text-xl font-bold text-[#26333B]">Book Details</h2>

              {/* Cover image */}
              <div className="bg-white rounded-2xl border border-[#E8E6E0] p-5 shadow-sm">
                <label className="block text-sm font-semibold text-[#26333B] mb-4">Cover Image</label>
                <div className="flex items-start gap-5">
                  {/* Cover preview */}
                  <div className="w-28 h-36 rounded-xl overflow-hidden bg-gradient-to-br from-[#2C5F7C]/8 to-[#F0876B]/8 border border-[#E8E6E0] flex items-center justify-center flex-shrink-0 shadow-sm">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage.startsWith("http") ? book.coverImage : `${API_BASE_URL}${book.coverImage}`}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">📚</span>
                    )}
                  </div>

                  {/* Cover actions */}
                  <div className="flex flex-col gap-3 pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />

                    {/* Upload button */}
                    <button
                      id="upload-cover-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingCover || generatingCover}
                      className="px-4 py-2.5 bg-white hover:bg-[#F5F4F1] border-2 border-[#E8E6E0] hover:border-[#2C5F7C]/30 rounded-xl text-[#26333B] text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                    >
                      {uploadingCover ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#8A9BA4] border-t-[#2C5F7C] rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-[#2C5F7C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload Cover
                        </>
                      )}
                    </button>

                    {/* ✨ Generate AI Cover button */}
                    <button
                      id="generate-ai-cover-btn"
                      onClick={handleGenerateAICover}
                      disabled={generatingCover || uploadingCover}
                      className="px-4 py-2.5 bg-gradient-to-r from-[#F0876B] to-[#e06d50] hover:from-[#e87d60] hover:to-[#d65f42] rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center gap-2 shadow-md shadow-[#F0876B]/25 hover:shadow-lg hover:shadow-[#F0876B]/35 hover:-translate-y-0.5"
                    >
                      {generatingCover ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate AI Cover
                        </>
                      )}
                    </button>

                    <p className="text-[#8A9BA4] text-xs">JPG, PNG or GIF · max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Fields */}
              <div className="bg-white rounded-2xl border border-[#E8E6E0] p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-[#26333B]">Book Information</h3>
                {[
                  { label: "Book Title", field: "title", placeholder: "Enter book title" },
                  { label: "Subtitle", field: "subtitle", placeholder: "Optional subtitle" },
                  { label: "Author Name", field: "author", placeholder: "Author name" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-[#26333B] mb-2">{label}</label>
                    <input
                      id={`meta-${field}-input`}
                      type="text"
                      value={book[field] || ""}
                      onChange={(e) => {
                        setBook((prev) => ({ ...prev, [field]: e.target.value }));
                        setHasUnsavedChanges(true);
                      }}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 bg-[#FAFAF8] border-2 border-[#E8E6E0] rounded-xl text-[#26333B] placeholder-[#8A9BA4] focus:outline-none focus:border-[#2C5F7C] transition-all text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="bg-white rounded-2xl border border-[#E8E6E0] p-5 shadow-sm">
                <label className="block text-sm font-semibold text-[#26333B] mb-3">Status</label>
                <div className="flex gap-3">
                  {["draft", "published"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setBook((prev) => ({ ...prev, status: s }));
                        setHasUnsavedChanges(true);
                      }}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all capitalize border-2 ${
                        book.status === s
                          ? s === "published"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-[#FAFAF8] text-[#8A9BA4] border-[#E8E6E0] hover:border-[#2C5F7C]/30 hover:text-[#26333B]"
                      }`}
                    >
                      {s === "published" ? "✅ " : "📝 "}{s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <button
                id="meta-save-btn"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="w-full py-3.5 bg-gradient-to-r from-[#2C5F7C] to-[#1e4a63] text-white font-semibold rounded-xl hover:from-[#265571] hover:to-[#183d53] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2C5F7C]/25 hover:shadow-[#2C5F7C]/40 hover:-translate-y-0.5"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

              {/* View book link */}
              <button
                onClick={() => navigate(`/view-book/${bookId}`)}
                className="w-full py-3 bg-white hover:bg-[#F5F4F1] border-2 border-[#E8E6E0] hover:border-[#2C5F7C]/30 text-[#26333B] hover:text-[#2C5F7C] font-medium rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View eBook
              </button>
            </div>
          </div>
        )}

        {/* Mobile tab bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-[#E8E6E0] flex z-30 shadow-lg">
          {["editor", "meta"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-all ${
                activeTab === tab ? "text-[#2C5F7C]" : "text-[#8A9BA4]"
              }`}
            >
              {tab === "editor" ? "✏️ Editor" : "⚙️ Details"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
