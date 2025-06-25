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
    steps: []
  });
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

    const getSelectedCode = (): string => {
      return codeLines
        .slice(selectedLines.start - 1, selectedLines.end)
        .join('\n');
    };

    const step: Step = {
      id: Date.now().toString(),
      stepNumber: guide.steps.length + 1,
      title,
      description,
      startLine: selectedLines.start,
      endLine: selectedLines.end,
      codeSnippet: getSelectedCode()
    };

    setGuide(prev => ({
      ...prev,
      steps: [...prev.steps, step]
    }));

    setSelectedLines(null);
  };

  const handleRemoveStep = (stepId: string): void => {
    setGuide(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, stepNumber: index + 1 }))
    }));
  };

  const handleSaveGuide = async (): Promise<void> => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    try {
      console.log(guide, 'guideeeee')
      const result = await saveCodeGuide(guide);
      
      if (result.success) {
        alert(result.message || 'Guide saved successfully!');
        setGuide({ title: '', description: '', tags: [], steps: [] });
        setCode('');
      } else {
        alert(result.message || 'Failed to save guide');
      }
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
              steps={guide.steps}
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
              steps={guide.steps}
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