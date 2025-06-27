import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { Filters, SearchAndFiltersProps } from '../../types';
import { CATEGORIES, LANGUAGES } from '../selectionsOptions';

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  showFilters,
  setShowFilters,
}) => {
  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      code_language: '',
      minStars: 0,
      sortBy: 'asc'
    });
    setSearchTerm('');
  };

  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl p-6 mb-8 border border-purple-500/20 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search code guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors duration-200 font-medium text-slate-200 border border-slate-600 hover:border-purple-500/50"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mt-6 pt-6 border-t border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((category) => {
                  return <option key={category} value={category}>{category}</option>
                })}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
              <select
                value={filters.code_language}
                onChange={(e) => updateFilter('code_language', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
              >
                <option value="">All Languages</option>
                {LANGUAGES.map((language) => {
                  return <option key={language} value={language}>{language}</option>
                })}
              </select>
            </div>
            
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as Filters['sortBy'])}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
              >
                <option value="asc">ascending</option>
                <option value="desc">descending</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-slate-400 hover:text-purple-400 font-medium transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;