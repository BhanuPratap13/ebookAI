import React, { useState } from "react";
import { WRITING_STYLES, CHAPTER_COUNT_OPTIONS } from "../../utils/data";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";

const CreateBookModal = ({ onClose, onBookCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    style: "Professional",
    topic: "",
    description: "",
    chapterCount: 5,
  });
  const [loading, setLoading] = useState(false);
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [outline, setOutline] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateOutline = async () => {
    if (!formData.topic) {
      toast.error("Please enter a topic first");
      return;
    }
    setGeneratingOutline(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AI.GENERATE_OUTLINE, {
        topic: formData.topic,
        description: formData.description,
        style: formData.style,
        chapterCount: formData.chapterCount,
      });
      setOutline(res.data.outline);
      toast.success(`Generated ${res.data.outline.length} chapters!`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to generate outline");
    } finally {
      setGeneratingOutline(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.author) {
      toast.error("Title and author are required");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.BOOKS.CREATE, {
        title: formData.title,
        subtitle: formData.subtitle,
        author: formData.author,
        chapters: outline.length > 0 ? outline : [],
      });
      toast.success("eBook created successfully! 📚");
      onBookCreated(res.data.book);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to create ebook");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <div>
            <h2 className="text-xl font-bold text-white">Create New eBook</h2>
            <p className="text-gray-400 text-sm mt-0.5">Fill in details or use AI to generate an outline</p>
          </div>
          <button
            id="create-book-modal-close"
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Book Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Book Title <span className="text-orange-400">*</span>
              </label>
              <input
                id="book-title-input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. The Art of Mindful Leadership"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle</label>
              <input
                id="book-subtitle-input"
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Optional subtitle"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Author Name <span className="text-orange-400">*</span>
              </label>
              <input
                id="book-author-input"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-gray-500 text-xs font-medium">AI OUTLINE GENERATOR</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* AI Section */}
          <div className="p-4 bg-orange-500/5 border border-orange-500/15 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Topic / Genre
              </label>
              <input
                id="book-topic-input"
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. Productivity for remote workers"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Brief Description (optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What should this ebook be about?"
                rows={2}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Writing Style</label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0f0f1a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                >
                  {WRITING_STYLES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Chapters</label>
                <select
                  name="chapterCount"
                  value={formData.chapterCount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0f0f1a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/50 transition-all text-sm"
                >
                  {CHAPTER_COUNT_OPTIONS.map((n) => (
                    <option key={n} value={n}>{n} chapters</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              id="generate-outline-btn"
              onClick={handleGenerateOutline}
              disabled={generatingOutline}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:from-orange-400 hover:to-pink-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {generatingOutline ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating outline with AI...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate AI Outline
                </>
              )}
            </button>
          </div>

          {/* Generated Outline Preview */}
          {outline.length > 0 && (
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-400 text-sm font-medium">
                  {outline.length} chapters generated
                </span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scroll">
                {outline.map((ch, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gray-500 text-xs w-5 flex-shrink-0 mt-0.5">{i + 1}.</span>
                    <div>
                      <p className="text-white text-sm font-medium">{ch.title}</p>
                      <p className="text-gray-400 text-xs">{ch.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-3 p-6 border-t border-white/8">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            id="create-book-confirm-btn"
            onClick={handleCreate}
            disabled={loading || !formData.title || !formData.author}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:from-orange-400 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create eBook"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBookModal;

