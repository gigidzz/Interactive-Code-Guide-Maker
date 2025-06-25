import { Save } from "lucide-react";
import type { Guide } from "../../types/codeGuides";

interface SaveButtonProps {
  guide: Guide;
  onSave: () => void;
  isLoading: boolean
}

const SaveButton: React.FC<SaveButtonProps> = ({ guide, onSave, isLoading }) => {
  const isDisabled = !guide.title.trim() || guide.steps.length === 0;

  return (
    <button
      onClick={onSave}
      disabled={isDisabled}
      className={`${isLoading && 'animate-spin'} w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed text-lg font-semibold`}
    >
      <Save className="w-5 h-5" />
      Save Code Guide
    </button>
  );
};

export default SaveButton