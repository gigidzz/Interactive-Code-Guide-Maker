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