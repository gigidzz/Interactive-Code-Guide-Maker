import { User, Tag, Calendar, Hash } from 'lucide-react';
import type { CodeGuide } from '../../types/codeGuides';
import { Link } from 'react-router-dom';

export const CodeGuideCard: React.FC<{ guide: CodeGuide }> = ({ guide }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-purple-500/20 hover:border-purple-500/40">
      <div className="relative bg-slate-900 p-4 h-32 overflow-hidden">
        <pre className="text-sm text-green-400 font-mono leading-tight">
          <code>{guide.code_snippet.slice(0, 150)}...</code>
        </pre>
        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
          {guide.code_language || 'Unknown'}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-slate-100 leading-tight">{guide.title}</h3>
          {guide.id && (
            <div className="flex items-center text-slate-400 ml-2">
              <Hash className="w-4 h-4" />
              <span className="text-xs font-medium ml-1">{guide.id}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {guide.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Tag className="w-3 h-3 mr-1" />
              {guide.category}
            </span>
          )}
          {guide.tags && (
            guide.tags.map((tag, index) => {
              return <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                <Tag className="w-3 h-3 mr-1" />
                <span className="pl-1">{tag}</span>
              </span>
            })
          )}
        </div>
        
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">{guide.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-700 space-x-2">
          <div className="flex items-center gap-4 text-sm text-slate-400">
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
          <Link 
            to={guide.id!} 
            className="text-nowrap bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
          >
            View Code
          </Link>
        </div>
      </div>
    </div>
  );
};