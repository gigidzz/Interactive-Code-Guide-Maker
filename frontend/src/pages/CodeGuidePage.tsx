import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCodeGuideWithSteps } from '../api/codeGuides';
import CodeHighlight from '../components/code-guide-page/codeHighlight';
import StepNavigator from '../components/code-guide-page/stepNavigator';
import GuideHeader from '../components/code-guide-page/guideHeader';
import LoadingSpinner from '../components/loadingSpinner';
import ErrorDisplay from '../components/errorDisplay';
import type { CodeGuide, Step } from '../types/codeGuides';

const CodeGuidePage: React.FC = () => {
  const { 'guide-id': guideId } = useParams<{ 'guide-id': string }>();
  
  const [guide, setGuide] = useState<CodeGuide | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const codeHighlightRef = useRef<{ scrollToHighlight: () => void } | null>(null);

  const fetchData = async () => {
    if (!guideId) {
      setError('Guide ID not found in URL');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCodeGuideWithSteps(guideId);
      setGuide(data.guide);
      setSteps(data.steps);
      if (data.steps.length > 0) {
        setCurrentStep(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load code guide');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [guideId]);

  const handleStepChange = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    setTimeout(() => {
      codeHighlightRef.current?.scrollToHighlight();
    }, 100);
  };

  const getCurrentHighlightedLines = () => {
    const currentStepData = steps.find(step => step.step_number === currentStep);
    if (!currentStepData) return [];
    
    const lines = [];
    for (let i = currentStepData.start_line; i <= currentStepData.end_line; i++) {
      lines.push(i);
    }
    return lines;
  };

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (error) {
    return (
      <ErrorDisplay error={error} onRetry={fetchData}/>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-8 text-center">
            <p className="text-slate-300">Code guide not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <GuideHeader guide={guide} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CodeHighlight
              ref={codeHighlightRef}
              code={guide.code_snippet}
              language={guide.code_language}
              highlightedLines={getCurrentHighlightedLines()}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {steps.length > 0 ? (
                <StepNavigator
                  steps={steps}
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                />
              ) : (
                <div className="bg-slate-900 rounded-xl shadow-2xl p-6 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">
                    No Steps Available
                  </h3>
                  <p className="text-slate-300">
                    This code guide doesn't have any steps defined yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGuidePage;