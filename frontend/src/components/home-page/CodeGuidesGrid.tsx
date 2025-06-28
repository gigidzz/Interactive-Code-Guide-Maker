import React, { Suspense, memo } from 'react';
import { Code } from 'lucide-react';
import type { CodeGuide, CodeGuidesGridProps } from '../../types/codeGuides';
import { CodeGuideCard } from './CodeGuideCard';

const LoadingSkeleton: React.FC = memo(() => (
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
          <div className="flex gap-2 mb-3">
            <div className="bg-slate-700 h-6 rounded-full w-16"></div>
            <div className="bg-slate-700 h-6 rounded-full w-20"></div>
          </div>
          <div className="bg-slate-700 h-4 rounded mb-2"></div>
          <div className="bg-slate-700 h-4 rounded w-2/3 mb-4"></div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <div className="flex gap-4">
              <div className="bg-slate-700 h-4 rounded w-20"></div>
              <div className="bg-slate-700 h-4 rounded w-16"></div>
            </div>
            <div className="bg-purple-600/30 h-9 rounded-lg w-24"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
));

const EmptyState: React.FC = memo(() => (
  <div className="text-center py-16">
    <Code className="w-16 h-16 text-slate-400 mx-auto mb-4" />
    <h3 className="text-xl font-medium text-slate-200 mb-2">No code guides found</h3>
    <p className="text-slate-400">Try adjusting your search or filters to find what you're looking for.</p>
  </div>
));

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = memo(({ error, onRetry }) => (
  <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-6 mb-8">
    <div className="flex items-center justify-between">
      <div className="text-red-200 font-medium">{error}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-200 font-medium"
      >
        Retry
      </button>
    </div>
  </div>
));

const CodeGuidesContent: React.FC<{ codeGuides: CodeGuide[] }> = memo(({ codeGuides }) => {
  if (codeGuides.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {codeGuides.map((guide) => (
        <CodeGuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
});

const CodeGuidesGrid: React.FC<CodeGuidesGridProps> = memo(({
  codeGuides,
  error,
  onRetry,
}) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">
          {`${codeGuides.length} Code Guide${codeGuides.length !== 1 ? 's' : ''}`}
        </h2>
      </div>

      {error && <ErrorState error={error} onRetry={onRetry} />}

      <Suspense fallback={<LoadingSkeleton />}>
        <CodeGuidesContent codeGuides={codeGuides} />
      </Suspense>
    </>
  );
});

CodeGuidesGrid.displayName = 'CodeGuidesGrid';
LoadingSkeleton.displayName = 'LoadingSkeleton';
EmptyState.displayName = 'EmptyState';
ErrorState.displayName = 'ErrorState';
CodeGuidesContent.displayName = 'CodeGuidesContent';

export default CodeGuidesGrid;