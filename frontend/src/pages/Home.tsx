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
    language: '',
    minStars: 0,
    sortBy: 'newest'
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = async () => {
    setError(null);
    
    try {
      const response = await fetchCodeGuides({
        ...filters,
        search: debouncedSearchTerm,
        minStars: filters.minStars || undefined
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Code className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Code Guides
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and explore comprehensive code guides from our community
          </p>
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