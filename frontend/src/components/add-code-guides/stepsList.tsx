import type { StepsListProps } from "../../types/codeGuides";
import StepItem from "./stepItem";

const StepsList: React.FC<StepsListProps> = ({ steps, onRemoveStep }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
    <h3 className="text-lg font-semibold text-white mb-4">
      Steps ({steps.length})
    </h3>
    
    <div className="space-y-3 max-h-96 overflow-auto">
      {steps.map(step => (
        <StepItem
          key={step.id}
          step={step}
          onRemove={onRemoveStep}
        />
      ))}
      
      {steps.length === 0 && (
        <p className="text-slate-500 text-center py-8">
          No steps added yet. Select code lines and add your first step!
        </p>
      )}
    </div>
  </div>
);

export default StepsList