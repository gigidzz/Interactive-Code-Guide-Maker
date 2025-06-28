import type { CodeLineProps } from "../../types/codeGuides";

const CodeLine: React.FC<CodeLineProps> = ({ line, lineNumber, isSelected, step, onClick }) => (
  <div
    onClick={(e) => onClick(lineNumber, e)}
    className={`flex items-center cursor-pointer hover:bg-slate-700/30 transition-colors ${
      isSelected ? 'bg-purple-600/30 border-l-4 border-purple-400' : ''
    } ${step ? 'bg-emerald-600/20' : ''}`}
  >
    <span className="w-12 text-slate-500 text-xs text-center py-2 font-mono">
      {lineNumber}
    </span>
    <div className="flex-1 px-4 py-2">
      <code className="text-slate-200 font-mono text-sm">{line || ' '}</code>
      {step && (
        <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
          Step {step.step_number}
        </span>
      )}
    </div>
  </div>
);

export default CodeLine