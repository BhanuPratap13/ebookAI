import React from "react";

const DeleteConfirmModal = ({ bookTitle, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-6">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-5">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-white text-xl font-bold text-center mb-2">Delete eBook</h3>
        <p className="text-gray-400 text-sm text-center mb-2">
          Are you sure you want to delete
        </p>
        <p className="text-white font-semibold text-center mb-6 truncate px-4">
          "{bookTitle}"
        </p>
        <p className="text-red-400/80 text-xs text-center mb-6 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-4">
          ⚠️ This action cannot be undone. All chapters will be permanently deleted.
        </p>

        <div className="flex gap-3">
          <button
            id="delete-cancel-btn"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all text-sm font-medium"
          >
            Cancel
          </button>
          <button
            id="delete-confirm-btn"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                </svg>
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
