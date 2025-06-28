import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Code } from 'lucide-react';
import type { Filters, User } from '../types';
import { useDebounce, fetchCodeGuides } from '../api/codeGuides';
import type { CodeGuide } from '../types/codeGuides';
import SearchAndFilters from '../components/home-page/Filter';
import CodeGuidesGrid from '../components/home-page/CodeGuidesGrid';
import { getUsers } from '../api/usersService';
import MappedUsers from '../components/home-page/mappedUsers';
import { CodeGuidesSkeletonGrid, MappedUsersSkeleton } from '../components/skeletons/homePageSkeletons';

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

  const memoizedFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearchTerm,
  }), [filters, debouncedSearchTerm]);

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