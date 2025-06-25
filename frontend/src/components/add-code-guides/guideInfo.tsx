import { Zap } from "lucide-react";
import type { GuideInfoProps } from "../../types/codeGuides";
import TagManager from "./tagsManager";

const GuideInfo: React.FC<GuideInfoProps> = ({ guide, onUpdateGuide }) => {
  const handleAddTag = (tag: string): void => {
    onUpdateGuide({ tags: [...guide.tags, tag] });
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    onUpdateGuide({ tags: guide.tags.filter(tag => tag !== tagToRemove) });
  };

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

        <TagManager
          tags={guide.tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>
    </div>
  );
};

export default GuideInfo