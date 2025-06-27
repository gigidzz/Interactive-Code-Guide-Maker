import React from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { Step } from '../../types/codeGuides';

interface StepNavigatorProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (stepNumber: number) => void;
}

const StepNavigator: React.FC<StepNavigatorProps> = ({
  steps,
  currentStep,
  onStepChange
}) => {
  const currentStepData = steps.find(step => step.step_number === currentStep);
  const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-purple-500/20">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-purple-300">
            Step {currentStep} of {steps.length}
          </h3>
        </div>
        
        <div className="w-full bg-slate-800 rounded-full h-3 mb-4 border border-slate-700">
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/30"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {sortedSteps.map((step) => (
            <button
              key={step.step_number}
              onClick={() => onStepChange(step.step_number)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center border ${
                step.step_number === currentStep
                  ? 'bg-purple-500 text-white scale-110 shadow-lg shadow-purple-500/40 border-purple-400'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-purple-300 border-slate-600 hover:border-purple-500/50'
              }`}
            >
              {step.step_number}
            </button>
          ))}
        </div>
      </div>

      {currentStepData && (
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-xl font-bold text-white flex-1">
              {currentStepData.title}
            </h4>
          </div>
          
          <p className="text-slate-300 leading-relaxed mb-4">
            {currentStepData.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <span className="flex items-center bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700">
              <Play size={14} className="mr-1 text-purple-400" />
              Lines {currentStepData.start_line}-{currentStepData.end_line}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
            currentStep === 1
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-purple-300 hover:shadow-md border-slate-600 hover:border-purple-500/50'
          }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        <div className="flex space-x-2">
          {currentStep > 1 && (
            <button
              onClick={() => onStepChange(1)}
              className="px-3 py-2 text-sm text-slate-400 hover:text-purple-300 transition-colors duration-200 rounded-lg hover:bg-slate-800/50"
            >
              Reset to Start
            </button>
          )}
        </div>

        <button
          onClick={handleNextStep}
          disabled={currentStep === steps.length}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
            currentStep === steps.length
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-700'
              : 'bg-purple-600 text-white hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/30 border-purple-500'
          }`}
        >
          Next
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default StepNavigator;