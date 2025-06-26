import { useState } from "react";
import type { AddStepProps } from "../../types/codeGuides";
import { Plus } from "lucide-react";

const AddStep: React.FC<AddStepProps> = ({ selectedLines, codeLines, onAddStep }) => {
  const [stepTitle, setStepTitle] = useState<string>('');
  const [stepDescription, setStepDescription] = useState<string>('');

  const getSelectedCode = (): string => {
    return codeLines
      .slice(selectedLines.start - 1, selectedLines.end)
      .join('\n');
  };

  const handleAddStep = (): void => {
    if (stepTitle.trim()) {
      onAddStep(stepTitle, stepDescription);
      setStepTitle('');
      setStepDescription('');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-800/20 to-pink-800/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Add Step (Lines {selectedLines.start}-{selectedLines.end})
      </h3>
      
      <div className="space-y-4">
        <input
          type="text"
          value={stepTitle}
          onChange={(e) => setStepTitle(e.target.value)}
          placeholder="Step title..."
          className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <textarea
          value={stepDescription}
          onChange={(e) => setStepDescription(e.target.value)}
          placeholder="Step description..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />

        <div className="bg-slate-900/30 rounded-lg p-3">
          <p className="text-slate-400 text-sm mb-2">Selected code:</p>
          <pre className="text-slate-300 font-mono text-sm overflow-auto">
            {getSelectedCode()}
          </pre>
        </div>
        
        <button
          onClick={handleAddStep}
          disabled={!stepTitle.trim()}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Step
        </button>
      </div>
    </div>
  );
};

export default AddStep