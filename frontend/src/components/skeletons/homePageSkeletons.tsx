export const CodeGuidesSkeletonGrid = () => (
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

export const MappedUsersSkeleton = () => (
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