const GuideHeaderSkeleton = () => (
  <div className="bg-slate-900 rounded-xl border border-slate-700 p-8 mb-8 animate-pulse">
    <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
  </div>
);

const CodeHighlightSkeleton = () => (
  <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 animate-pulse">
    <div className="space-y-3">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-slate-700 rounded ${
            Math.random() > 0.3 
              ? `w-${Math.floor(Math.random() * 4 + 5)}/12` 
              : 'w-1/4'
          }`}
        ></div>
      ))}
    </div>
  </div>
);

const StepNavigatorSkeleton = () => (
  <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-700 rounded"></div>
      ))}
    </div>
  </div>
);

export const CodeGuidePageSkeleton = () => (
  <div className="min-h-screen bg-slate-950 p-6">
    <div className="max-w-7xl mx-auto">
      <GuideHeaderSkeleton />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CodeHighlightSkeleton />
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <StepNavigatorSkeleton />
          </div>
        </div>
      </div>
    </div>
  </div>
);