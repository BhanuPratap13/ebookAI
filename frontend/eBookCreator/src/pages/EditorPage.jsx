import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pencil, Eye } from "lucide-react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPath";
import { countWords, getInitials } from "../utils/helper";
import { WRITING_STYLES } from "../utils/data";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import SimpleMDEditor from "../components/SimpleMDEditor";

// ─── Markdown Preview Component ──────────────────────────────────────────────
const MarkdownPreview = ({ content }) => {
  const renderMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-3">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-gray-100 mt-5 mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-200 mt-4 mb-2">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-gray-300 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-white/5 border border-white/10 rounded-xl p-4 my-3 overflow-x-auto"><code class="text-green-300 text-sm font-mono">$1</code></pre>')
      .replace(/^[\-\*] (.*)$/gm, '<li class="text-gray-300 ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*)$/gm, '<li class="text-gray-300 ml-4 list-decimal">$1</li>')
      .replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-3">')
      .replace(/^(?!<[h1-6|li|pre|ul|ol])(.+)$/gm, '<p class="text-gray-300 leading-relaxed mb-3">$1</p>');
  };
  return (
    <div
      className="prose prose-invert max-w-none px-1"
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
    className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all select-none ${
      isActive
        ? "bg-orange-500/15 border border-orange-500/30"
        : "hover:bg-white/5 border border-transparent"
    } ${isDragging ? "opacity-50" : ""}`}
  >
    <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-1">
      <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 cursor-grab" fill="currentColor" viewBox="0 0 20 20">
        <path d="M7 2a2 2 0 110 4 2 2 0 010-4zM7 10a2 2 0 110 4 2 2 0 010-4zM7 18a2 2 0 110-4 2 2 0 010 4zM13 2a2 2 0 110 4 2 2 0 010-4zM13 10a2 2 0 110 4 2 2 0 010-4zM13 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-medium flex-shrink-0">Ch.{index + 1}</span>
        <p className={`text-sm font-medium truncate ${isActive ? "text-orange-300" : "text-gray-300"}`}>
          {chapter.title}
        </p>
      </div>
      {chapter.content && (
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">{countWords(chapter.content)} words</span>
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
        {
          chapterTitle: chapter.title,
          chapterDescription: chapter.description,
          style,
        },
        { timeout: 120000 }
      );
      updateChapterContent(res.data.content);
      toast.success("Chapter content generated! ✨");
    } catch (error) {
      console.error("AI generate chapter error:", error);
      const msg = error?.response?.data?.error || error?.message || "Failed to generate content";
      toast.error(msg);
    } finally {
      setGeneratingContent(false);
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
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      <div className="flex items-center justify-center min-h-screen bg-[#0f0f1a]">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) return null;

  const activeChapter = book.chapters?.[activeChapterIndex];

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#0f0f1a]/95 backdrop-blur-xl border-b border-white/8 z-30 flex-shrink-0">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Back */}
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <div className="w-px h-5 bg-white/10" />

          {/* Book title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-semibold text-sm truncate">{book.title}</h1>
          </div>

          {/* Tab switcher */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/8 rounded-lg p-0.5">
            {["editor", "meta"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm rounded-md font-medium transition-all capitalize ${
                  activeTab === tab
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "editor" ? "✏️ Editor" : "⚙️ Details"}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="hidden sm:block text-yellow-400 text-xs">Unsaved changes</span>
            )}
            <button
              id="editor-save-btn"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 rounded-lg text-white text-sm font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
              <div className="absolute right-0 top-10 w-36 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                <button
                  id="export-pdf-btn"
                  onClick={() => handleExport("pdf")}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                >
                  📄 Export PDF
                </button>
                <button
                  id="export-docx-btn"
                  onClick={() => handleExport("docx")}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                >
                  📝 Export Word
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>

        {/* ── EDITOR TAB ── */}
        {activeTab === "editor" && (
          <>
            {/* Sidebar */}
            <aside
              className={`flex-shrink-0 bg-[#0d0d1a] border-r border-white/8 flex flex-col transition-all duration-300 ${
                sidebarOpen ? "w-64" : "w-0 overflow-hidden"
              }`}
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Chapters</span>
                <button
                  id="add-chapter-btn"
                  onClick={handleAddChapter}
                  className="w-6 h-6 rounded-md bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 flex items-center justify-center transition-colors text-sm"
                  title="Add chapter"
                >
                  +
                </button>
              </div>

              {/* Chapter list */}
              <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
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
              <div className="px-4 py-3 border-t border-white/8">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{book.chapters?.length || 0} chapters</span>
                  <span>
                    {(book.chapters || []).reduce((acc, ch) => acc + countWords(ch.content || ""), 0).toLocaleString()} words
                  </span>
                </div>
              </div>
            </aside>

            {/* Chapter editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Editor toolbar */}
              <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-white/8 bg-[#0f0f1a]">
                {/* Toggle sidebar */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  title="Toggle sidebar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <div className="w-px h-5 bg-white/10" />

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
                    className="flex-1 bg-transparent text-white font-semibold text-sm focus:outline-none placeholder-gray-600 border-b border-transparent focus:border-white/20 pb-0.5 transition-all"
                    placeholder="Chapter title..."
                  />
                )}

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Style selector */}
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="hidden md:block bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs px-2 py-1.5 focus:outline-none"
                  >
                    {WRITING_STYLES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>

                  {/* Preview toggle */}
                  <button
                    id="preview-toggle-btn"
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      previewMode
                        ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                    }`}
                  >
                    {previewMode ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{previewMode ? "Edit" : "Preview"}</span>
                  </button>

                  {/* AI Generate */}
                  <button
                    id="ai-generate-chapter-btn"
                    onClick={handleGenerateChapter}
                    disabled={generatingContent}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/20 rounded-lg text-purple-300 text-xs font-medium transition-all disabled:opacity-50"
                  >
                    {generatingContent ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin" />
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        <span className="hidden sm:inline">AI Write</span>
                      </>
                    )}
                  </button>

                  {/* Delete chapter */}
                  <button
                    onClick={handleDeleteChapter}
                    className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
                      <h1 className="text-2xl font-bold text-white mb-6">{activeChapter.title}</h1>
                      {activeChapter.description && (
                        <p className="text-gray-400 italic mb-6 pb-4 border-b border-white/8">{activeChapter.description}</p>
                      )}
                      <MarkdownPreview content={activeChapter.content} />
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      {/* Description field */}
                      <div className="px-6 pt-4 pb-2 border-b border-white/5">
                        <input
                          value={activeChapter.description || ""}
                          onChange={(e) => {
                            const chapters = [...book.chapters];
                            chapters[activeChapterIndex] = { ...chapters[activeChapterIndex], description: e.target.value };
                            setBook((prev) => ({ ...prev, chapters }));
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full bg-transparent text-gray-400 text-sm focus:outline-none placeholder-gray-600 italic"
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
                    <p className="text-gray-400 mb-4">No chapters yet</p>
                    <button
                      onClick={handleAddChapter}
                      className="px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-400 transition-all text-sm font-medium"
                    >
                      Add First Chapter
                    </button>
                  </div>
                )}
              </div>

              {/* Status bar */}
              {activeChapter && (
                <div className="flex-shrink-0 flex items-center justify-between px-6 py-2 border-t border-white/5 text-xs text-gray-600">
                  <span>
                    {countWords(activeChapter.content || "")} words · {(activeChapter.content || "").length} chars
                  </span>
                  <span className="flex items-center gap-1">
                    {hasUnsavedChanges ? (
                      <span className="text-yellow-500">● Unsaved</span>
                    ) : (
                      <span className="text-green-500">✓ Saved</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── META TAB ── */}
        {activeTab === "meta" && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
              <h2 className="text-xl font-bold text-white">Book Details</h2>

              {/* Cover image */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Cover Image</label>
                <div className="flex items-start gap-5">
                  <div className="w-28 h-36 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {book.coverImage ? (
                      <img
                        src={`http://localhost:8000${book.coverImage}`}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">📚</span>
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <button
                      id="upload-cover-btn"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingCover}
                      className="px-4 py-2.5 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {uploadingCover ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          Upload Cover
                        </>
                      )}
                    </button>
                    <p className="text-gray-500 text-xs mt-2">JPG, PNG or GIF, max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Fields */}
              {[
                { label: "Book Title", field: "title", placeholder: "Enter book title" },
                { label: "Subtitle", field: "subtitle", placeholder: "Optional subtitle" },
                { label: "Author Name", field: "author", placeholder: "Author name" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                  <input
                    id={`meta-${field}-input`}
                    type="text"
                    value={book[field] || ""}
                    onChange={(e) => {
                      setBook((prev) => ({ ...prev, [field]: e.target.value }));
                      setHasUnsavedChanges(true);
                    }}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                  />
                </div>
              ))}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <div className="flex gap-3">
                  {["draft", "published"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setBook((prev) => ({ ...prev, status: s }));
                        setHasUnsavedChanges(true);
                      }}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all capitalize border ${
                        book.status === s
                          ? s === "published"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/8"
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
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
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
                className="w-full py-3 bg-white/5 hover:bg-white/8 border border-white/10 text-gray-300 hover:text-white font-medium rounded-xl transition-all text-sm flex items-center justify-center gap-2"
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

        {/* Mobile tab for meta */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f0f1a]/95 backdrop-blur-xl border-t border-white/8 flex z-30">
          {["editor", "meta"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-all ${
                activeTab === tab ? "text-orange-400" : "text-gray-500"
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
