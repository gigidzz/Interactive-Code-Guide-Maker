import { Trash2 } from "lucide-react";
import type { StepItemProps } from "../../types/codeGuides";

const StepItem: React.FC<StepItemProps> = ({ step, onRemove }) => (
  <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-white font-medium">
        {step.step_number}. {step.title}
      </h4>
      <button
        onClick={() => onRemove(step.id)}
        className="text-red-400 hover:text-red-300 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
    <p className="text-slate-400 text-sm mb-2">{step.description}</p>
    <span className="text-purple-400 text-xs">
      Lines {step.start_line}-{step.end_line}
    </span>
  </div>
);

export default StepItem