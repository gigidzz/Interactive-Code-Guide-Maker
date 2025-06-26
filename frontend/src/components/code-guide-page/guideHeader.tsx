import React from 'react';
import { Calendar, User, Tag, Code, ArrowLeft } from 'lucide-react';
import type { CodeGuide } from '../../types/codeGuides';

interface GuideHeaderProps {
  guide: CodeGuide;
  onBack?: () => void;
}

const GuideHeader: React.FC<GuideHeaderProps> = ({ guide, onBack }) => {
  // const navigate = useNavigate(); // Uncomment if using react-router-dom

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
      javascript: 'bg-yellow-100 text-yellow-800',
      typescript: 'bg-blue-100 text-blue-800',
      python: 'bg-green-100 text-green-800',
      java: 'bg-orange-100 text-orange-800',
      cpp: 'bg-purple-100 text-purple-800',
      c: 'bg-gray-100 text-gray-800',
      html: 'bg-red-100 text-red-800',
      css: 'bg-pink-100 text-pink-800',
      sql: 'bg-cyan-100 text-cyan-800',
    };
    return colors[language?.toLowerCase() || ''] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white rounded-lg shadow-xl p-8 mb-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={onBack || (() => window.history.back())}
          className="flex items-center text-white/80 hover:text-white mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Guides
        </button>

        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {guide.title}
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
            {guide.description}
          </p>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center text-white/80">
            <User size={18} className="mr-2" />
            <span>Author: {guide.author_id}</span>
          </div>
          
          <div className="flex items-center text-white/80">
            <Calendar size={18} className="mr-2" />
            <span>{formatDate(guide.created_at)}</span>
          </div>

          {guide.code_language && (
            <div className="flex items-center">
              <Code size={18} className="mr-2 text-white/80" />
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLanguageColor(guide.code_language)} bg-white/20 text-white border border-white/30`}>
                {guide.code_language.toUpperCase()}
              </span>
            </div>
          )}

          {guide.category && (
            <div className="flex items-center">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                {guide.category}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {guide.tags && guide.tags.length > 0 && (
          <div className="flex items-center flex-wrap gap-2">
            <Tag size={18} className="text-white/80 mr-2" />
            {guide.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium text-white hover:bg-white/30 transition-colors duration-200"
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