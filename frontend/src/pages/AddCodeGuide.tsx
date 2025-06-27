import { useState } from "react";
import type { Guide, LineSelection, Step } from "../types/codeGuides";
import { saveCodeGuide } from '../api/codeGuides';
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
    tags: [],
    code_snippet: undefined,
    code_language: undefined,
    category: undefined,
    steps: []
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedLines, setSelectedLines] = useState<LineSelection | null>(null);
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
      guide_id: '',
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
      const guideToSave: Guide = {
        ...guide,
        steps: steps,
        code_snippet: code
      };

      console.log('Saving guide:', guideToSave);
      
      const guideResult = await saveCodeGuide(guideToSave);
      
      if (!guideResult.success) {
        alert(guideResult.message || 'Failed to save guide');
        return;
      }

      alert('Guide and steps saved successfully!');
      
      setGuide({
        title: '',
        description: '',
        tags: [],
        code_snippet: undefined,
        code_language: undefined,
        category: undefined,
        steps: []
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
          <div className="space-y-6">
            <CodeEditor
              code={code}
              onCodeChange={setCode}
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