export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface Filters {
  category: string;
  language: string;
  minStars: number;
  sortBy: 'newest' | 'oldest' | 'stars' | 'name';
}

export interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}