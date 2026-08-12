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

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              My eBooks
            </h1>
            <p className="text-gray-400">
              {books.length} {books.length === 1 ? "ebook" : "ebooks"} · {totalWords.toLocaleString()} words written
            </p>
          </div>
          <button
            id="create-ebook-btn"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-pink-500 transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New eBook
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total eBooks", value: books.length, icon: "📚" },
            { label: "Drafts", value: books.filter((b) => b.status === "draft").length, icon: "📝" },
            { label: "Published", value: books.filter((b) => b.status === "published").length, icon: "✅" },
            { label: "Total Words", value: totalWords.toLocaleString(), icon: "💬" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 bg-white/3 border border-white/8 rounded-2xl">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-gray-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="dashboard-search"
              type="text"
              placeholder="Search ebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            {["all", "draft", "published"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${
                  filterStatus === f
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/8 hover:text-white border border-white/8"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Books grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-white text-xl font-semibold mb-2">
              {books.length === 0 ? "No ebooks yet" : "No results found"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {books.length === 0
                ? "Create your first ebook with AI assistance"
                : "Try a different search or filter"}
            </p>
            {books.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-xl hover:from-orange-400 hover:to-pink-500 transition-all"
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

