import { useState } from "react";
import type { Guide, LineSelection, Step } from "../types/codeGuides";
import { saveCodeGuide, saveSteps } from '../api/codeGuides';
import Header from "../components/add-code-guides/guideHeader";
import CodeEditor from "../components/add-code-guides/codeEditor";
import CodeLinesDisplay from "../components/add-code-guides/codeLinesDisplay";
import GuideInfo from "../components/add-code-guides/guideInfo";
import AddStep from "../components/add-code-guides/addStep";
import StepsList from "../components/add-code-guides/stepsList";
import SaveButton from "../components/add-code-guides/saveButton";

const CodeGuideEditor: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [guide, setGuide] = useState<Guide>({
    title: '',
    description: '',
    tags: [], // Changed from undefined to empty array
    code_snippet: undefined,
    code_language: undefined,
    category: undefined
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedLines, setSelectedLines] = useState<LineSelection | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const codeLines = code.split('\n');

  const handleLineClick = (lineNumber: number, event: React.MouseEvent): void => {
    if (event.shiftKey && selectedLines?.start) {
      const start = Math.min(selectedLines.start, lineNumber);
      const end = Math.max(selectedLines.start, lineNumber);
      setSelectedLines({ start, end });
    } else {
      setSelectedLines({ start: lineNumber, end: lineNumber });
    }
  };

  const handleUpdateGuide = (updates: Partial<Guide>): void => {
    setGuide(prev => ({ ...prev, ...updates }));
  };

  const handleAddStep = (title: string, description: string): void => {
    if (!selectedLines) return;

    const step: Step = {
      guide_id: '', // Will be set after guide is saved
      step_number: steps.length + 1,
      title,
      description,
      start_line: selectedLines.start,
      end_line: selectedLines.end
    };

    setSteps(prev => [...prev, step]);
    setSelectedLines(null);
  };

  const handleRemoveStep = (stepId: string): void => {
    setSteps(prev => 
      prev.filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, step_number: index + 1 }))
    );
  };

  const handleSaveGuide = async (): Promise<void> => {
    if (isSaving) return;
    
    // Basic validation
    if (!guide.title.trim()) {
      alert('Please enter a guide title');
      return;
    }
    
    if (!guide.description.trim()) {
      alert('Please enter a guide description');
      return;
    }
    
    if (!code.trim()) {
      alert('Please enter some code');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare guide data with code
      const guideToSave: Guide = {
        ...guide,
        code_snippet: code
      };

      console.log('Saving guide:', guideToSave);
      
      // Save the guide first
      const guideResult = await saveCodeGuide(guideToSave);
      
      if (!guideResult.success) {
        alert(guideResult.message || 'Failed to save guide');
        return;
      }

      // If we have steps and a guide ID, save the steps
      if (steps.length > 0 && guideResult.guideId) {
        const stepsToSave = steps.map(step => ({
          ...step,
          guide_id: guideResult.guideId!
        }));

        console.log('Saving steps:', stepsToSave);
        
        const stepsResult = await saveSteps(stepsToSave);
        
        if (!stepsResult.success) {
          alert(`Guide saved but failed to save steps: ${stepsResult.message}`);
          return;
        }
      }

      alert('Guide and steps saved successfully!');
      
      // Reset form
      setGuide({
        title: '',
        description: '',
        tags: [], // Changed from undefined to empty array
        code_snippet: undefined,
        code_language: undefined,
        category: undefined
      });
      setSteps([]);
      setCode('');
      
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred while saving the guide');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        <Header />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              previewMode={previewMode}
              onPreviewToggle={() => setPreviewMode(!previewMode)}
            />

            <CodeLinesDisplay
              code={code}
              selectedLines={selectedLines}
              steps={steps}
              onLineClick={handleLineClick}
            />
          </div>

          <div className="space-y-6">
            <GuideInfo
              guide={guide}
              onUpdateGuide={handleUpdateGuide}
            />

            {selectedLines && (
              <AddStep
                selectedLines={selectedLines}
                codeLines={codeLines}
                onAddStep={handleAddStep}
              />
            )}

            <StepsList
              steps={steps}
              onRemoveStep={handleRemoveStep}
            />

            <SaveButton
              guide={guide}
              onSave={handleSaveGuide}
              isLoading={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGuideEditor;