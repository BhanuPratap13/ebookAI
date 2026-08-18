import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, getTotalWordCount } from "../../utils/helper";
import { API_BASE_URL } from "../../utils/apiPath";

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const wordCount = getTotalWordCount(book.chapters || []);
  const chapterCount = book.chapters?.length || 0;

  const coverUrl = book.coverImage
    ? book.coverImage.startsWith("http")
      ? book.coverImage
      : `${API_BASE_URL}${book.coverImage}`
    : null;

  const statusColors = {
    draft:
      "text-amber-600 bg-amber-50 border-amber-200",
    published:
      "text-emerald-600 bg-emerald-50 border-emerald-200",
  };

  return (
    <div
      className="group relative bg-white border border-[#E8E6E0] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
      style={{ boxShadow: "0 2px 8px rgba(38,51,59,0.06)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 8px 32px rgba(240,135,107,0.18), 0 2px 8px rgba(44,95,124,0.08)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(38,51,59,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Cover Image / Placeholder */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#2C5F7C]/8 to-[#2C5F7C]/20">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-16 h-20 bg-gradient-to-br from-[#2C5F7C]/20 to-[#F0876B]/20 border border-[#2C5F7C]/15 rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <span className="text-3xl">📚</span>
            </div>
            <p className="text-[#8A9BA4] text-xs font-medium">No cover image</p>
          </div>
        )}

        {/* Status badge */}
        <div
          className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border ${
            statusColors[book.status] || statusColors.draft
          }`}
        >
          {book.status === "published" ? "Published" : "Draft"}
        </div>

        {/* Action menu button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="w-8 h-8 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-white border border-[#E8E6E0] flex items-center justify-center transition-all text-[#26333B]/60 hover:text-[#26333B] opacity-0 group-hover:opacity-100 shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7a1.5 1.5 0 110-3 1.5 1.5 0 010 4z" />
            </svg>
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-10 w-44 bg-white border border-[#E8E6E0] rounded-2xl shadow-xl overflow-hidden z-20"
              style={{ boxShadow: "0 8px 32px rgba(38,51,59,0.12)" }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  navigate(`/editor/${book._id}`);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#26333B] hover:bg-[#2C5F7C]/5 hover:text-[#2C5F7C] transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  navigate(`/view-book/${book._id}`);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-[#26333B] hover:bg-[#2C5F7C]/5 hover:text-[#2C5F7C] transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>
              <div className="h-px bg-[#E8E6E0] mx-3" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(book);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card content */}
      <div
        className="p-4"
        onClick={() => navigate(`/editor/${book._id}`)}
      >
        <h3 className="text-[#26333B] font-semibold text-sm mb-1 line-clamp-2 leading-snug group-hover:text-[#2C5F7C] transition-colors duration-200">
          {book.title}
        </h3>
        {book.subtitle && (
          <p className="text-[#8A9BA4] text-xs mb-2 line-clamp-1">{book.subtitle}</p>
        )}
        <p className="text-[#8A9BA4] text-xs mb-3">by {book.author}</p>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-[#8A9BA4]">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {chapterCount} ch.
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            {wordCount.toLocaleString()} words
          </span>
          <span className="ml-auto">{formatDate(book.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
