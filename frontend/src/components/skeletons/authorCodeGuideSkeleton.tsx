const AuthorHeaderSkeleton = () => (
  <div className="bg-slate-800 rounded-2xl shadow-2xl border border-purple-500/20 p-8 mb-8 animate-pulse">
    <div className="flex items-start gap-6">
      <div className="w-24 h-24 bg-slate-700 rounded-full"></div>
      <div className="flex-1">
        <div className="h-8 bg-slate-700 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-slate-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-slate-700 rounded w-20"></div>
          <div className="h-6 bg-slate-700 rounded w-24"></div>
        </div>
        <div className="flex gap-6">
          <div className="h-4 bg-slate-700 rounded w-16"></div>
          <div className="h-4 bg-slate-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

const CodeGuideCardSkeleton = () => (
  <div className="bg-slate-800 rounded-xl border border-purple-500/20 p-6 animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-slate-700 rounded w-2/3 mb-4"></div>
    <div className="flex gap-2 mb-4">
      <div className="h-6 bg-slate-700 rounded w-16"></div>
      <div className="h-6 bg-slate-700 rounded w-20"></div>
    </div>
    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
  </div>
);

const StatsSkeleton = () => (
  <div className="bg-slate-800 rounded-2xl shadow-2xl border border-purple-500/20 p-6 animate-pulse">
    <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-slate-700 rounded-lg p-4">
          <div className="h-8 bg-slate-600 rounded w-8 mx-auto mb-2"></div>
          <div className="h-4 bg-slate-600 rounded w-16 mx-auto"></div>
        </div>
      ))}
    </div>
  </div>
);

export const AuthorCodeGuidesSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="container mx-auto px-4 py-8">
      <AuthorHeaderSkeleton />
      
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 bg-slate-700 rounded animate-pulse"></div>
          <div className="h-8 bg-slate-700 rounded w-64 animate-pulse"></div>
          <div className="w-8 h-6 bg-slate-700 rounded-full animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <CodeGuideCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <StatsSkeleton />
    </div>
  </div>
);