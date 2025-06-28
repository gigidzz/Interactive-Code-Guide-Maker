import type { CodeLinesDisplayProps, Step } from "../../types/codeGuides";
import CodeLine from "./codeLine";

const CodeLinesDisplay: React.FC<CodeLinesDisplayProps> = ({ 
  code, 
  selectedLines, 
  steps, 
  onLineClick 
}) => {
  const codeLines = code.split('\n');
  
  const isLineSelected = (lineNumber: number): boolean => {
    if (!selectedLines) return false;
    return lineNumber >= selectedLines.start && lineNumber <= selectedLines.end;
  };

  const getStepForLine = (lineNumber: number): Step | undefined => {
    return steps.find(step => 
      lineNumber >= step.start_line && lineNumber <= step.end_line
    );
  };

  if (!code) return null;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Code Lines {selectedLines && `(Selected: ${selectedLines.start}-${selectedLines.end})`}
      </h3>
      <div className="bg-slate-900/50 rounded-lg border border-slate-600 max-h-80 overflow-auto">
        {codeLines.map((line, index) => {
          const lineNumber = index + 1;
          return (
            <CodeLine
              key={index}
              line={line}
              lineNumber={lineNumber}
              isSelected={isLineSelected(lineNumber)}
              step={getStepForLine(lineNumber)}
              onClick={onLineClick}
            />
          );
        })}
      </div>
      <p className="text-slate-400 text-sm mt-2">
        Click lines to select, hold Shift to select ranges
      </p>
    </div>
  );
};

export default CodeLinesDisplay