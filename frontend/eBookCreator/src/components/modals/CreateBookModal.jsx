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

// import { useEffect, useRef, useState } from "react";
// import { useAuthContext } from "../../context/AuthContext";
// import Modal from "../ui/Modal";
// import Input from "../ui/InputField";
// import {
//   ArrowLeft,
//   BookOpen,
//   Hash,
//   Lightbulb,
//   Palette,
//   Plus,
//   Sparkles,
//   Trash2,
// } from "lucide-react";
// import Select from "../ui/SelectField";
// import { WRITING_STYLES, CHAPTER_COUNT_OPTIONS } from "../../utils/data";
// import Button from "../ui/Button";
// import toast from "react-hot-toast";
// import { API_PATHS } from "../../utils/apiPath";

// function CreateBookModal({ isOpen, onClose, onBookCreate }) {
//   const [step, setStep] = useState(1);
//   const [bookTitle, setBookTitle] = useState("");
//   const [chapterCount, setChapterCount] = useState(5);
//   const [chapters, setChapters] = useState([]);
//   const [topic, setTopic] = useState("");
//   const [writingStyle, setWritingStyle] = useState(WRITING_STYLES[0]);
//   const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
//   const [isFinalisingBook, setIsFinalisingBook] = useState(false);

//   const chaptersContainerRef = useRef(null);

//   const { user } = useAuthContext();

//   const resetModal = () => {
//     setStep(1);
//     setBookTitle("");
//     setChapterCount(5);
//     setChapters([]);
//     setTopic("");
//     setWritingStyle(WRITING_STYLES[0]);
//     setIsGeneratingOutline(false);
//     setIsFinalisingBook(false);
//   };

//   const handleGenerateOutline = async () => {
//     const validChapterCount =
//       typeof chapterCount === "string" ? parseInt(chapterCount) : chapterCount;

//     if (!bookTitle || !validChapterCount || validChapterCount < 1) {
//       toast.error("Book title and a valid number of chapters are required!", {
//         duration: 5000,
//       });

//       return;
//     }

//     setIsGeneratingOutline(true);

//     try {
//       const {
//         data: { outline },
//       } = await axiosInstance.post(API_ENDPOINTS.AI.GENERATE_OUTLINE, {
//         topic: bookTitle,
//         description: topic || "",
//         style: writingStyle,
//         chapterCount: validChapterCount,
//       });
//       setChapters(outline);
//       setStep(2);
//       toast.success("Outline generated! Review and edit chapters if needed.");
//     } catch (error) {
//       console.error("Error generating book outline:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to generate book outline."
//       );
//     } finally {
//       setIsGeneratingOutline(false);
//     }
//   };

//   const handleAddChapter = () => {
//     setChapters((prev) => [
//       ...prev,
//       {
//         title: `Chapter ${prev.length + 1}`,
//         description: "",
//       },
//     ]);
//   };

//   const handleEditChapter = (index, field, value) => {
//     const updatedChapters = [...chapters];
//     updatedChapters[index][field] = value;
//     setChapters(updatedChapters);
//   };

//   const handleDeleteChapter = (index) => {
//     if (chapters.length <= 1) return;

//     setChapters((prev) => [...prev].filter((_, i) => i !== index));
//   };

//   const handleFinaliseBook = async () => {
//     if (chapters.length === 0) {
//       toast.error("At least one chapter is required!", { duration: 5000 });

//       return;
//     }

//     setIsFinalisingBook(true);

//     try {
//       const {
//         data: { book },
//       } = await axiosInstance.post(API_ENDPOINTS.BOOKS.CREATE, {
//         title: bookTitle,
//         author: user?.name || "Unknown Author",
//         chapters,
//       });
//       toast.success("eBook created successfully!");
//       onBookCreate(book._id);
//       onClose();
//       resetModal();
//     } catch (error) {
//       console.error("Error while creating eBook:", error);
//       toast.error(error.response?.data?.message || "Failed to create eBook!");
//     } finally {
//       setIsFinalisingBook(false);
//     }
//   };

//   useEffect(() => {
//     if (step === 2 && chaptersContainerRef.current) {
//       const scrollableDiv = chaptersContainerRef.current;
//       scrollableDiv.scrollTo({
//         top: scrollableDiv.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [step, chapters.length]);

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={() => {
//         onClose();
//         resetModal();
//       }}
//       title="Create New eBook"
//     >
//       {step === 1 && (
//         <div className="space-y-4 md:space-y-5">
//           {/* Progress indicator */}
//           <ol className="flex items-center gap-2 mb-4 md:mb-6">
//             <li
//               aria-label="Step 1"
//               className="size-7 md:size-8 bg-violet-100 text-violet-600 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
//             >
//               1
//             </li>

//             <div className="flex-1 h-0.5 bg-gray-200" />

//             <li
//               aria-label="Step 2"
//               className="size-7 md:size-8 bg-gray-100 text-gray-400 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
//             >
//               2
//             </li>
//           </ol>

//           {/* Form inputs */}
//           <Input
//             type="text"
//             value={bookTitle}
//             onChange={(event) => setBookTitle(event.target.value)}
//             icon={BookOpen}
//             label="Book Title"
//             required
//             placeholder="What should we call your eBook?"
//           />

//           <Input
//             type="number"
//             value={chapterCount}
//             onChange={(event) => {
//               const value = event.target.value;

//               if (value === "") {
//                 setChapterCount("");

//                 return;
//               }

//               // parse and clamp between 1-20
//               const parsed = parseInt(value);

//               if (!isNaN(parsed)) {
//                 setChapterCount(Math.max(1, Math.min(20, parsed)));
//               }
//             }}
//             onBlur={(event) => {
//               // ensure we have a valid number
//               const value = event.target.value;

//               if (value === "" || isNaN(parseInt(value))) {
//                 setChapterCount(5);
//               }
//             }}
//             icon={Hash}
//             label="Number of Chapters"
//             min="1"
//             max="20"
//             step="1"
//             placeholder="5"
//           />

//           <Input
//             type="text"
//             value={topic}
//             onChange={(event) => setTopic(event.target.value)}
//             icon={Lightbulb}
//             label="Topic (Optional)"
//             placeholder="Specific topic for AI generation"
//           />

//           <Select
//             value={writingStyle}
//             onChange={(event) => setWritingStyle(event.target.value)}
//             options={WRITING_STYLES}
//             icon={Palette}
//             label="Writing Style"
//           />

//           {/* Action button */}
//           <div className="pt-3 md:pt-4 flex justify-end">
//             <Button
//               type="button"
//               onClick={handleGenerateOutline}
//               isLoading={isGeneratingOutline}
//               icon={Sparkles}
//             >
//               Generate Outline with AI
//             </Button>
//           </div>
//         </div>
//       )}

//       {step === 2 && (
//         <div className="space-y-4 md:space-y-5">
//           {/* Progress indicator */}
//           <ol className="mb-4 md:mb-6 flex items-center gap-2">
//             <li
//               aria-label="Step 1 completed"
//               className="size-7 md:size-8 bg-violet-100 text-violet-600 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
//             >
//               &#10003;
//             </li>

//             <div className="flex-1 h-0.5 bg-violet-600" />

//             <li
//               aria-label="Step 2"
//               className="size-7 md:size-8 bg-violet-100 text-violet-600 text-xs md:text-sm font-semibold rounded-full flex justify-center items-center"
//             >
//               2
//             </li>
//           </ol>

//           {/* Chapter review header */}
//           <section className="mb-3 md:mb-4 flex justify-between items-center">
//             <h3 className="text-gray-900 text-base md:text-lg font-semibold">
//               Review Chapters
//             </h3>

//             <span className="text-gray-500 text-xs md:text-sm">
//               {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}
//             </span>
//           </section>

//           {/* Chapters list */}
//           <div
//             ref={chaptersContainerRef}
//             className="space-y-3 max-h-80 md:max-h-96 overflow-y-auto pr-1"
//           >
//             {chapters.length === 0 ? (
//               <div className="bg-gray-50 text-center rounded-xl px-4 py-10 md:py-12">
//                 <BookOpen className="size-10 md:size-12 text-gray-300 mx-auto mb-3" />

//                 <p className="text-gray-500 text-xs md:text-sm">
//                   No chapters yet! Add one to start...
//                 </p>
//               </div>
//             ) : (
//               chapters.map(({ title, description }, index) => (
//                 <div
//                   key={index}
//                   className="bg-white border border-gray-200 rounded-xl p-3 md:p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm focus-within:border-gray-300 focus-within:shadow-sm group"
//                 >
//                   <div className="mb-2 md:mb-3 flex items-start gap-2 md:gap-3">
//                     <div className="shrink-0 size-5 md:size-6 bg-violet-50 text-violet-600 text-xs font-semibold rounded-full mt-1 flex justify-center items-center">
//                       {index + 1}
//                     </div>

//                     {/* Chapter title input */}
//                     <input
//                       type="text"
//                       value={title}
//                       onChange={(event) =>
//                         handleEditChapter(index, "title", event.target.value)
//                       }
//                       placeholder="Chapter Title"
//                       className="flex-1 bg-transparent text-gray-900 text-sm md:text-base font-medium border-none focus:outline-none focus:ring-0 p-0"
//                     />

//                     {/* Delete button */}
//                     <button
//                       type="button"
//                       onClick={() => handleDeleteChapter(index)}
//                       aria-label="Delete chapter"
//                       title="Delete chapter"
//                       disabled={chapters.length === 1}
//                       className="opacity-0 rounded-lg p-1 md:p-1.5 transition-all duration-200 disabled:opacity-0 disabled:cursor-not-allowed group-hover:opacity-100 group-hover:bg-red-50 group-focus-within:opacity-100 group-focus-within:bg-red-50 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
//                     >
//                       <Trash2 className="size-3.5 md:size-4 text-red-500" />
//                     </button>
//                   </div>

//                   {/* Chapter description textarea */}
//                   <textarea
//                     value={description}
//                     onChange={(event) =>
//                       handleEditChapter(
//                         index,
//                         "description",
//                         event.target.value
//                       )
//                     }
//                     rows={2}
//                     placeholder="Brief description of what this chapter covers..."
//                     className="w-full bg-transparent text-gray-600 text-xs md:text-sm placeholder-gray-400 border-none resize-none focus:outline-none focus:ring-0 p-0"
//                   />
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Action buttons */}
//           <div className="border-t border-gray-100 pt-3 md:pt-4 flex flex-wrap justify-between items-center gap-2">
//             <Button
//               variant="ghost"
//               onClick={() => setStep(1)}
//               icon={ArrowLeft}
//               ariaLabel="Go back to step 1"
//             >
//               Back
//             </Button>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="secondary"
//                 onClick={handleAddChapter}
//                 icon={Plus}
//               >
//                 Add Chapter
//               </Button>

//               <Button onClick={handleFinaliseBook} isLoading={isFinalisingBook}>
//                 Create eBook
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Modal>
//   );
// }

// export default CreateBookModal;
