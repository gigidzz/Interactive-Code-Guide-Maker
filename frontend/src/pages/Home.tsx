import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Code } from 'lucide-react';
import type { Filters, User } from '../types';
import { useDebounce, fetchCodeGuides } from '../api/codeGuides';
import type { CodeGuide } from '../types/codeGuides';
import SearchAndFilters from '../components/home-page/Filter';
import CodeGuidesGrid from '../components/home-page/CodeGuidesGrid';
import { getUsers } from '../api/usersService';
import MappedUsers from '../components/home-page/mappedUsers';

const CodeGuidesSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-purple-500/20 animate-pulse">
        <div className="bg-slate-900 h-32 p-4">
          <div className="bg-slate-700 h-4 rounded mb-2"></div>
          <div className="bg-slate-700 h-4 rounded w-3/4 mb-2"></div>
          <div className="bg-slate-700 h-4 rounded w-1/2"></div>
        </div>
        <div className="p-6">
          <div className="bg-slate-700 h-6 rounded mb-3"></div>
          <div className="bg-slate-700 h-4 rounded mb-2"></div>
          <div className="bg-slate-700 h-4 rounded w-2/3 mb-4"></div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <div className="bg-slate-700 h-4 rounded w-1/3"></div>
            <div className="bg-purple-600/30 h-8 rounded-lg w-20"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MappedUsersSkeleton = () => (
  <div className="relative w-full max-w-7xl mx-auto p-6 mb-8">
    <div className="text-center mb-8">
      <div className="bg-slate-700 h-12 rounded w-48 mx-auto mb-4 animate-pulse"></div>
      <div className="bg-slate-700 h-6 rounded w-64 mx-auto animate-pulse"></div>
    </div>
    
    <div className="relative bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-16">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-600 animate-pulse">
            <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-4"></div>
            <div className="text-center">
              <div className="bg-slate-700 h-6 rounded mb-2 w-3/4 mx-auto"></div>
              <div className="bg-slate-700 h-4 rounded mb-3 w-full mx-auto"></div>
              <div className="bg-slate-700 h-4 rounded mb-4 w-2/3 mx-auto"></div>
              <div className="bg-slate-700 h-6 rounded w-24 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [codeGuides, setCodeGuides] = useState<CodeGuide[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingCodeGuides, setIsLoadingCodeGuides] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    code_language: '',
    minStars: 0,
    sortBy: 'asc'
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Memoize the filter object to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearchTerm,
  }), [filters, debouncedSearchTerm]);

  // Use useCallback to prevent function recreation on every render
  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoadingCodeGuides(true);
    
    try {
      const response = await fetchCodeGuides(memoizedFilters);
      setCodeGuides(response.data || response);
    } catch (err) {
      setError('Failed to fetch code guides. Please try again.');
    } finally {
      setIsLoadingCodeGuides(false);
    }
  }, [memoizedFilters]);

  const fetchUsers = useCallback(async () => {
    setError(null);
    setIsLoadingUsers(true);
    
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Memoized retry function
  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
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
        </div>

        <Suspense fallback={<MappedUsersSkeleton />}>
          {!isLoadingUsers && users.length > 0 && <MappedUsers users={users} />}
          {isLoadingUsers && <MappedUsersSkeleton />}
        </Suspense>

        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        <Suspense fallback={<CodeGuidesSkeletonGrid />}>
          {!isLoadingCodeGuides ? (
            <CodeGuidesGrid
              codeGuides={codeGuides}
              error={error}
              onRetry={handleRetry}
            />
          ) : (
            <CodeGuidesSkeletonGrid />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Home;