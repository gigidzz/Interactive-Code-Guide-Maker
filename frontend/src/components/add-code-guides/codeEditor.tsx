import { Eye, FileText } from "lucide-react";
import type { CodeEditorProps } from "../../types/codeGuides";

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, previewMode, onPreviewToggle }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
    <div className="flex items-center gap-3 mb-4">
      <FileText className="w-5 h-5 text-purple-400" />
      <h2 className="text-xl font-semibold text-white">Code Editor</h2>
      <button
        onClick={onPreviewToggle}
        className={`ml-auto px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
          previewMode 
            ? 'bg-purple-600 text-white' 
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        <Eye className="w-4 h-4" />
        {previewMode ? 'Edit' : 'Preview'}
      </button>
    </div>
    
    <textarea
      value={code}
      onChange={(e) => onCodeChange(e.target.value)}
      placeholder="Paste your code here..."
      className="w-full h-96 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-slate-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

export default CodeEditor