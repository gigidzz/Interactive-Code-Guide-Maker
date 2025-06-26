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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            Step {currentStep} of {steps.length}
          </h3>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {sortedSteps.map((step) => (
            <button
              key={step.step_number}
              onClick={() => onStepChange(step.step_number)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center ${
                step.step_number === currentStep
                  ? 'bg-blue-500 text-white scale-110 shadow-lg'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
            <h4 className="text-xl font-bold text-gray-800 flex-1">
              {currentStepData.title}
            </h4>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-4">
            {currentStepData.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Play size={14} className="mr-1" />
              Lines {currentStepData.start_line}-{currentStepData.end_line}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
          }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous
        </button>

        <div className="flex space-x-2">
          {currentStep > 1 && (
            <button
              onClick={() => onStepChange(1)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Reset to Start
            </button>
          )}
        </div>

        <button
          onClick={handleNextStep}
          disabled={currentStep === steps.length}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentStep === steps.length
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md'
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