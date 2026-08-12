import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPath";
import { countWords, getReadingTime, formatDate, getTotalWordCount } from "../utils/helper";
import toast from "react-hot-toast";

const MarkdownPreview = ({ content }) => {
  const renderMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-100 mt-8 mb-4 leading-tight">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-gray-200 mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-300 mt-5 mb-2">$1</h3>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-white/5 border border-white/10 rounded-xl p-5 my-4 overflow-x-auto"><code class="text-green-300 text-sm font-mono leading-relaxed">$1</code></pre>')
      .replace(/^[\-\*] (.*)$/gm, '<li class="text-gray-300 ml-6 my-1 list-disc">$1</li>')
      .replace(/^\d+\. (.*)$/gm, '<li class="text-gray-300 ml-6 my-1 list-decimal">$1</li>')
      .split('\n\n').map(para => {
        if (para.startsWith('<h') || para.startsWith('<li') || para.startsWith('<pre')) return para;
        return `<p class="text-gray-300 leading-relaxed mb-5 text-base">${para}</p>`;
      }).join('\n');
  };

  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

const ViewBookPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [bookId]);

  const fetchBook = async () => {
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
      toast.error("Export failed");
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

  const totalWords = getTotalWordCount(book.chapters || []);
  const readingTime = getReadingTime(totalWords);
  const activeChapter = book.chapters?.[activeChapterIndex];

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a14]/95 backdrop-blur-xl border-b border-white/8">
        <div className="flex items-center h-14 px-6 gap-3 max-w-7xl mx-auto">
          <Link to="/dashboard" className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-gray-400 text-sm truncate flex-1">{book.title}</span>
          <div className="flex items-center gap-2">
            <Link
              to={`/editor/${bookId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/8 hover:bg-white/12 border border-white/10 rounded-lg text-gray-300 hover:text-white text-xs font-medium transition-all"
            >
              ✏️ Edit
            </Link>
            <div className="relative group">
              <button
                id="view-export-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 rounded-lg text-white text-xs font-medium transition-all"
              >
                📤 Export
              </button>
              <div className="absolute right-0 top-9 w-36 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-50">
                <button onClick={() => handleExport("pdf")} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">📄 PDF</button>
                <button onClick={() => handleExport("docx")} className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">📝 Word</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* TOC Sidebar */}
        <aside className={`flex-shrink-0 border-r border-white/8 bg-[#0a0a14] transition-all duration-300 ${tocOpen ? "w-64" : "w-0 overflow-hidden"}`}>
          {/* Book info */}
          <div className="p-5 border-b border-white/8">
            {book.coverImage ? (
              <img
                src={`http://localhost:8000${book.coverImage}`}
                alt={book.title}
                className="w-full h-36 object-cover rounded-xl mb-3"
              />
            ) : (
              <div className="w-full h-36 bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-3 border border-white/8">
                <span className="text-4xl">📚</span>
              </div>
            )}
            <h2 className="text-white font-bold text-sm line-clamp-2 mb-1">{book.title}</h2>
            {book.subtitle && <p className="text-gray-500 text-xs italic mb-1">{book.subtitle}</p>}
            <p className="text-gray-500 text-xs">by {book.author}</p>
            <div className="flex gap-3 mt-3 text-xs text-gray-500">
              <span>📄 {book.chapters?.length || 0} chapters</span>
              <span>⏱ {readingTime}</span>
            </div>
          </div>

          {/* TOC list */}
          <div className="overflow-y-auto py-2">
            <p className="text-gray-600 text-xs font-semibold uppercase px-4 py-2">Table of Contents</p>
            {book.chapters?.map((ch, i) => (
              <button
                key={i}
                onClick={() => setActiveChapterIndex(i)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                  activeChapterIndex === i
                    ? "text-orange-300 bg-orange-500/10 border-r-2 border-orange-500"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-xs text-gray-600 block">Ch.{i + 1}</span>
                <span className="line-clamp-2">{ch.title}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main reading area */}
        <main className="flex-1 overflow-y-auto">
          {/* Toggle TOC */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-20 w-5 h-12 bg-white/5 hover:bg-white/10 border border-white/8 rounded-r-lg flex items-center justify-center text-gray-500 hover:text-white transition-all"
          >
            <svg className={`w-3 h-3 transition-transform ${tocOpen ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="max-w-2xl mx-auto px-6 py-12">
            {/* Chapter navigation */}
            <div className="flex items-center justify-between mb-8 text-sm">
              <button
                onClick={() => setActiveChapterIndex((i) => Math.max(0, i - 1))}
                disabled={activeChapterIndex === 0}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <span className="text-gray-500">
                Ch. {activeChapterIndex + 1} / {book.chapters?.length || 0}
              </span>
              <button
                onClick={() => setActiveChapterIndex((i) => Math.min((book.chapters?.length || 1) - 1, i + 1))}
                disabled={activeChapterIndex === (book.chapters?.length || 1) - 1}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>

            {activeChapter ? (
              <>
                {/* Chapter header */}
                <div className="mb-8 pb-6 border-b border-white/8">
                  <p className="text-orange-400 text-sm font-medium mb-2">Chapter {activeChapterIndex + 1}</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                    {activeChapter.title}
                  </h1>
                  {activeChapter.description && (
                    <p className="text-gray-400 italic text-base leading-relaxed">
                      {activeChapter.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
                    <span>{countWords(activeChapter.content || "")} words</span>
                    <span>~{getReadingTime(countWords(activeChapter.content || ""))} read</span>
                  </div>
                </div>

                {/* Content */}
                {activeChapter.content ? (
                  <MarkdownPreview content={activeChapter.content} />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">✍️</div>
                    <p className="text-gray-500">This chapter has no content yet.</p>
                    <Link
                      to={`/editor/${bookId}`}
                      className="inline-block mt-4 px-5 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-400 transition-all text-sm"
                    >
                      Write Now
                    </Link>
                  </div>
                )}

                {/* Chapter navigation bottom */}
                <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/8">
                  <button
                    onClick={() => { setActiveChapterIndex((i) => Math.max(0, i - 1)); window.scrollTo(0, 0); }}
                    disabled={activeChapterIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  >
                    ← Previous Chapter
                  </button>
                  <button
                    onClick={() => { setActiveChapterIndex((i) => Math.min((book.chapters?.length || 1) - 1, i + 1)); window.scrollTo(0, 0); }}
                    disabled={activeChapterIndex === (book.chapters?.length || 1) - 1}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                  >
                    Next Chapter →
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No chapters available.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewBookPage;

// import React from 'react'

// function ViewBookPage() {
//   return (
//     <div>ViewBookPage</div>
//   )
// }

// export default ViewBookPage