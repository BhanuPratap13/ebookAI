import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPath";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateBookModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import { getTotalWordCount } from "../utils/helper";
import toast from "react-hot-toast";
import Navbar from "../components/layout/Navbar";

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.BOOKS.GET_ALL);
      setBooks(res.data.books || []);
    } catch {
      toast.error("Failed to load your ebooks");
    } finally {
      setLoading(false);
    }
  };

  const handleBookCreated = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.BOOKS.DELETE(deleteTarget._id));
      setBooks((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      toast.success("eBook deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete ebook");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalWords = books.reduce(
    (acc, b) => acc + getTotalWordCount(b.chapters || []),
    0
  );

  const stats = [
    { label: "Total eBooks", value: books.length, icon: "📚", color: "from-[#2C5F7C]/10 to-[#2C5F7C]/5" },
    { label: "Drafts", value: books.filter((b) => b.status === "draft").length, icon: "📝", color: "from-amber-50 to-amber-50/50" },
    { label: "Published", value: books.filter((b) => b.status === "published").length, icon: "✅", color: "from-emerald-50 to-emerald-50/50" },
    { label: "Total Words", value: totalWords.toLocaleString(), icon: "💬", color: "from-[#F0876B]/10 to-[#F0876B]/5" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#26333B] mb-1">
              My eBooks
            </h1>
            <p className="text-[#8A9BA4]">
              {books.length} {books.length === 1 ? "ebook" : "ebooks"} · {totalWords.toLocaleString()} words written
            </p>
          </div>
          <button
            id="create-ebook-btn"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#F0876B] to-[#e06d50] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#F0876B]/30 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap shadow-md shadow-[#F0876B]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New eBook
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 bg-gradient-to-br ${stat.color} border border-[#E8E6E0] rounded-2xl card-glow group cursor-default`}
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-[#26333B]">{stat.value}</div>
              <div className="text-[#8A9BA4] text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9BA4]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="dashboard-search"
              type="text"
              placeholder="Search ebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#E8E6E0] rounded-xl text-[#26333B] placeholder-[#8A9BA4] focus:outline-none focus:border-[#2C5F7C] transition-all text-sm shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "draft", "published"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize border-2 ${
                  filterStatus === f
                    ? "bg-[#2C5F7C] text-white border-[#2C5F7C] shadow-md shadow-[#2C5F7C]/20"
                    : "bg-white text-[#26333B]/60 border-[#E8E6E0] hover:border-[#2C5F7C]/40 hover:text-[#2C5F7C]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Books grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-3 border-[#F0876B] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#8A9BA4] text-sm">Loading your ebooks...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-[#26333B] text-xl font-semibold mb-2">
              {books.length === 0 ? "No ebooks yet" : "No results found"}
            </h3>
            <p className="text-[#8A9BA4] text-sm mb-6">
              {books.length === 0
                ? "Create your first ebook with AI assistance"
                : "Try a different search or filter"}
            </p>
            {books.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#F0876B] to-[#e06d50] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#F0876B]/30 transition-all shadow-md shadow-[#F0876B]/20"
              >
                Create Your First eBook
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={(b) => setDeleteTarget(b)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreateBookModal
          onClose={() => setShowCreateModal(false)}
          onBookCreated={handleBookCreated}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          bookTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default DashboardPage;
