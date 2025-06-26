import { List, Trash2 } from "lucide-react";
import type { StepsListProps, Step } from "../../types/codeGuides";

const StepItem: React.FC<{ step: Step; onRemove: (stepId: string) => void }> = ({ step, onRemove }) => (
  <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-600/30">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
            Step {step.step_number}
          </span>
          <span className="text-slate-400 text-sm">
            Lines {step.start_line}-{step.end_line}
          </span>
        </div>
        <h4 className="text-white font-medium mb-1">{step.title}</h4>
        {step.description && (
          <p className="text-slate-300 text-sm">{step.description}</p>
        )}
      </div>
      <button
        onClick={() => step.id && onRemove(step.id)}
        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors"
        title="Remove step"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const StepsList: React.FC<StepsListProps> = ({ steps, onRemoveStep }) => {
  if (steps.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <List className="w-5 h-5 text-blue-400" />
          Steps ({steps.length})
        </h3>
        <p className="text-slate-400 text-center py-8">
          No steps added yet. Select code lines and add your first step!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <List className="w-5 h-5 text-blue-400" />
        Steps ({steps.length})
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {steps.map((step, index) => (
          <StepItem
            key={step.id || index}
            step={step}
            onRemove={onRemoveStep}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsList;