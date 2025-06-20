import React, { Suspense } from 'react';
import { Code } from 'lucide-react';
import type { CodeGuide, CodeGuidesGridProps } from '../../types/codeGuides';
import { CodeGuideCard } from './CodeGuideCard';

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 6 }, (_, i) => (
      <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="bg-gray-900 h-32 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-16">
    <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-medium text-gray-900 mb-2">No code guides found</h3>
    <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
  </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
    <div className="flex items-center">
      <div className="text-red-800 font-medium">{error}</div>
      <button
        onClick={onRetry}
        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);

const CodeGuidesContent: React.FC<{ codeGuides: CodeGuide[] }> = ({ codeGuides }) => {
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
};

const CodeGuidesGrid: React.FC<CodeGuidesGridProps> = ({
  codeGuides,
  error,
  onRetry,
}) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {`${codeGuides.length} Code Guides`}
        </h2>
      </div>

      {error && <ErrorState error={error} onRetry={onRetry} />}

      <Suspense fallback={<LoadingSkeleton />}>
        <CodeGuidesContent codeGuides={codeGuides} />
      </Suspense>
    </>
  );
};

export default CodeGuidesGrid;