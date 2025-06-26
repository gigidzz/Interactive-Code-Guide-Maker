import { Star, User, Tag } from 'lucide-react';
import type { CodeGuide } from '../../types/codeGuides';

export const CodeGuideCard: React.FC<{ guide: CodeGuide }> = ({ guide }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      <div className="relative bg-gray-900 p-4 h-32 overflow-hidden">
        <pre className="text-sm text-green-400 font-mono leading-tight">
          <code>{guide.code_snippet.slice(0, 150)}...</code>
        </pre>
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
          {guide.code_language}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{guide.title}</h3>
          <div className="flex items-center text-yellow-500 ml-2">
            <Star className="w-4 h-4 fill-current" />
            {/* <span className="text-sm font-medium text-gray-700 ml-1">{guide.stars}</span> */}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Tag className="w-3 h-3 mr-1" />
            {guide.category}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{guide.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1" />
            <span className="font-medium">{guide.author_id}</span>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
            View Code
          </button>
        </div>
      </div>
    </div>
  );
};