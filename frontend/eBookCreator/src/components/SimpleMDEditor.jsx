import { useState, useEffect } from "react";
import { TypeOutline } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

function SimpleMDEditor({ value, onChange, options }) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const editorMode = isLargeScreen ? "live" : "edit";

  return (
    <div
      className="border border-slate-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col"
      data-color-mode="light"
    >
      <header className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-2.5 shrink-0">
        <div className="text-slate-600 text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1">
            <TypeOutline className="size-3 sm:size-3.5" />
            <span className="font-medium">Markdown Editor</span>
          </div>

          <span className="text-[10px] sm:text-xs text-slate-400">
            Supports code highlighting
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={value}
          onChange={onChange}
          height="100%"
          preview={editorMode}
          {...options}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          textareaProps={{
            placeholder:
              "Start writing your chapter content here...\n\nTip: Use ```language to create code blocks with syntax highlighting",
          }}
        />
      </div>
    </div>
  );
}

export default SimpleMDEditor;
