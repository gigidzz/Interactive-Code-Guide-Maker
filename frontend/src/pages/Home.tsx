import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import type { Filters } from '../types';
import { useDebounce, fetchCodeGuides } from '../api/codeGuides';
import type { CodeGuide } from '../types/codeGuides';
import SearchAndFilters from '../components/home-page/Filter';
import CodeGuidesGrid from '../components/home-page/CodeGuidesGrid';

const Home: React.FC = () => {
  const [codeGuides, setCodeGuides] = useState<CodeGuide[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    code_language: '',
    minStars: 0,
    sortBy: 'asc'
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = async () => {
    setError(null);
    
    try {
      const response = await fetchCodeGuides({
        ...filters,
        search: debouncedSearchTerm,
      });
      setCodeGuides(response.data || response);
    } catch (err) {
      setError('Failed to fetch code guides. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
              <Code className="relative w-12 h-12 text-purple-400 mr-3" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
              Code Guides
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover and explore comprehensive code guides from our community
          </p>
          
          {/* Decorative elements */}
          <div className="mt-8 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>

        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <CodeGuidesGrid
          codeGuides={codeGuides}
          error={error}
          onRetry={fetchData}
        />
      </div>
    </div>
  );
};

export default Home;