export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface Filters {
  category: string;
  code_language: string;
  minStars: number;
  sortBy: 'asc' | 'desc';
}

export interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}