import { User, Tag, Calendar, Hash } from 'lucide-react';
import type { CodeGuide } from '../../types/codeGuides';

export const CodeGuideCard: React.FC<{ guide: CodeGuide }> = ({ guide }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="relative bg-gray-900 p-4 h-32 overflow-hidden">
        <pre className="text-sm text-green-400 font-mono leading-tight">
          <code>{guide.code_snippet.slice(0, 150)}...</code>
        </pre>
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          {guide.code_language || 'Unknown'}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{guide.title}</h3>
          {guide.id && (
            <div className="flex items-center text-gray-400 ml-2">
              <Hash className="w-4 h-4" />
              <span className="text-xs font-medium ml-1">{guide.id}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {guide.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <Tag className="w-3 h-3 mr-1" />
              {guide.category}
            </span>
          )}
          {guide.tags && (
            
              guide.tags.map((tag) => {
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Tag className="w-3 h-3 mr-1 space-x-2" /> <p className='p-1'>{tag}</p>
                </span>
              })
            
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{guide.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 space-x-2">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span className="font-medium">{guide.author_id}</span>
            </div>
            {guide.created_at && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{formatDate(guide.created_at)}</span>
              </div>
            )}
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
            View Code
          </button>
        </div>
      </div>
    </div>
  );
};