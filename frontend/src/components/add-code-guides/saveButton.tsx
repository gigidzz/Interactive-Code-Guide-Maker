import { Save, Loader2 } from "lucide-react";
import type { Guide } from "../../types/codeGuides";

interface SaveButtonProps {
  guide: Guide;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ guide, onSave, isLoading }) => {
  const isDisabled = isLoading || !guide.title.trim() || !guide.description.trim();

  return (
    <div className="bg-gradient-to-r from-green-800/20 to-emerald-800/20 backdrop-blur-sm rounded-2xl border border-green-500/30 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Save Guide</h3>
      
      <div className="space-y-3">
        <div className="text-slate-300 text-sm">
          <p>✓ Title: {guide.title ? 'Set' : 'Required'}</p>
          <p>✓ Description: {guide.description ? 'Set' : 'Required'}</p>
          <p>✓ Category: {guide.category || 'Optional'}</p>
          <p>✓ Language: {guide.code_language || 'Optional'}</p>
        </div>
        
        <button
          onClick={onSave}
          disabled={isDisabled}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Guide
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SaveButton;