export interface CodeGuide {
  id?: string;
  created_at?: string;
  title: string;
  description: string;
  author_id: string;
  tags?: string[];
  code_snippet: string;
  code_language?: string;
  category?: string;
}

export interface CodeGuideResponse {
  data: CodeGuide[];
  total: number;
  page: number;
  limit: number;
}

export interface CodeGuideFilters {
  category?: string;
  code_language?: string;
  minStars?: number;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface CodeGuidesGridProps {
  codeGuides: CodeGuide[];
  error: string | null;
  onRetry: () => void;
}

// Updated Step interface to match backend
export interface Step {
  id?: string;
  guide_id: string;
  step_number: number;
  title: string;
  description: string;
  start_line: number;
  end_line: number;
}

export interface Guide {
  id?: string;
  created_at?: string;
  title: string;
  description: string;
  tags?: string[];
  code_snippet?: string;
  code_language?: string;
  category?: string;
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