import React from 'react';
import { Calendar, User, Tag, Code, ArrowLeft } from 'lucide-react';
import type { CodeGuide } from '../../types/codeGuides';

interface GuideHeaderProps {
  guide: CodeGuide;
  onBack?: () => void;
}

const GuideHeader: React.FC<GuideHeaderProps> = ({ guide, onBack }) => {

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language?: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      typescript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      python: 'bg-green-500/20 text-green-300 border-green-500/30',
      java: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      cpp: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
      c: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
      html: 'bg-red-500/20 text-red-300 border-red-500/30',
      css: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      sql: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    };
    return colors[language?.toLowerCase() || ''] || 'bg-slate-400/20 text-slate-300 border-slate-400/30';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white rounded-xl shadow-2xl p-8 mb-8 border border-purple-500/20">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack || (() => window.history.back())}
          className="flex items-center text-purple-300 hover:text-purple-200 mb-6 transition-all duration-200 group hover:bg-purple-800/20 px-3 py-2 rounded-lg"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Guides
        </button>

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4 leading-tight bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
            {guide.title}
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            {guide.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center text-slate-400">
            <User size={18} className="mr-2" />
            <span>Author: {guide.author.name}</span>
          </div>
          
          <div className="flex items-center text-slate-400">
            <Calendar size={18} className="mr-2" />
            <span>{formatDate(guide.created_at)}</span>
          </div>

          {guide.code_language && (
            <div className="flex items-center">
              <Code size={18} className="mr-2 text-slate-400" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLanguageColor(guide.code_language)}`}>
                {guide.code_language.toUpperCase()}
              </span>
            </div>
          )}

          {guide.category && (
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {guide.category}
              </span>
            </div>
          )}
        </div>

        {guide.tags && guide.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2">
            <Tag size={18} className="text-slate-400 mr-2" />
            {guide.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm font-medium text-purple-200 hover:bg-slate-700/50 hover:border-purple-400/50 transition-all duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideHeader;