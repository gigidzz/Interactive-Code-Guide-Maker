export interface CodeGuide {
  id: string;
  name: string;
  category: string;
  language: string;
  description: string;
  stars: number;
  uploadedBy: string;
  code: string;
  createdAt: string;
}

export interface CodeGuideResponse {
  data: CodeGuide[];
  total: number;
  page: number;
  limit: number;
}

export interface CodeGuideFilters {
  category?: string;
  language?: string;
  minStars?: number;
  sortBy?: 'newest' | 'oldest' | 'stars' | 'name';
  search?: string;
}

export interface CodeGuidesGridProps {
  codeGuides: CodeGuide[];
  error: string | null;
  onRetry: () => void;
}

export interface Step {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  startLine: number;
  endLine: number;
  codeSnippet: string;
}

export interface Guide {
  title: string;
  description: string;
  tags: string[];
  steps: Step[];
}

export interface LineSelection {
  start: number;
  end: number;
}

export interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  previewMode: boolean;
  onPreviewToggle: () => void;
}

export interface CodeLineProps {
  line: string;
  lineNumber: number;
  isSelected: boolean;
  step?: Step;
  onClick: (lineNumber: number, event: React.MouseEvent) => void;
}

export interface CodeLinesDisplayProps {
  code: string;
  selectedLines: LineSelection | null;
  steps: Step[];
  onLineClick: (lineNumber: number, event: React.MouseEvent) => void;
}

export interface TagManagerProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export interface GuideInfoProps {
  guide: Guide;
  onUpdateGuide: (updates: Partial<Guide>) => void;
}

export interface AddStepProps {
  selectedLines: LineSelection;
  codeLines: string[];
  onAddStep: (title: string, description: string) => void;
}

export interface StepItemProps {
  step: Step;
  onRemove: (stepId: string) => void;
}

export interface StepsListProps {
  steps: Step[];
  onRemoveStep: (stepId: string) => void;
}