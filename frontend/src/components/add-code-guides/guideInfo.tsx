import { Zap } from "lucide-react";
import type { GuideInfoProps } from "../../types/codeGuides";
import TagManager from "./tagsManager";

const CATEGORIES = [
  'Frontend',
  'Backend', 
  'Database',
  'DevOps',
  'Mobile',
  'Data Science',
  'Algorithm',
  'Architecture',
  'Testing',
  'Security',
  'Other'
];

const LANGUAGES = [
  'javascript',
  'typescript', 
  'python',
  'java',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'c++',
  'c#',
  'html',
  'css',
  'sql',
  'shell',
  'other'
];

const GuideInfo: React.FC<GuideInfoProps> = ({ guide, onUpdateGuide }) => {
  const handleAddTag = (tag: string): void => {
    const currentTags = Array.isArray(guide.tags) ? guide.tags : [];
    const newTags = [...currentTags, tag];
    onUpdateGuide({ tags: newTags });
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    const currentTags = Array.isArray(guide.tags) ? guide.tags : [];
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    onUpdateGuide({ tags: newTags });
  };

  const tagsArray = Array.isArray(guide.tags) ? guide.tags : [];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-400" />
        Guide Information
      </h2>
      
      <div className="space-y-4">
        <input
          type="text"
          value={guide.title}
          onChange={(e) => onUpdateGuide({ title: e.target.value })}
          placeholder="Guide title..."
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <textarea
          value={guide.description}
          onChange={(e) => onUpdateGuide({ description: e.target.value })}
          placeholder="Guide description..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select
              value={guide.category || ''}
              onChange={(e) => onUpdateGuide({ category: e.target.value || undefined })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Language
            </label>
            <select
              value={guide.code_language || ''}
              onChange={(e) => onUpdateGuide({ code_language: e.target.value || undefined })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select language...</option>
              {LANGUAGES.map(language => (
                <option key={language} value={language}>
                  {language.charAt(0).toUpperCase() + language.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TagManager
          tags={tagsArray}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>
    </div>
  );
};

export default GuideInfo;