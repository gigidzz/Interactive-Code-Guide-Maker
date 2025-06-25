import { useState } from "react";
import type { TagManagerProps } from "../../types/codeGuides";
import { Tag } from "lucide-react";

const TagManager: React.FC<TagManagerProps> = ({ tags, onAddTag, onRemoveTag }) => {
  const [tagInput, setTagInput] = useState<string>('');

  const handleAddTag = (): void => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onAddTag(tagInput.trim());
      setTagInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add tag..."
          className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleAddTag}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Tag className="w-4 h-4" />
          Add
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span
            key={tag}
            onClick={() => onRemoveTag(tag)}
            className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm cursor-pointer hover:bg-purple-600/30 transition-colors"
          >
            {tag} ×
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagManager