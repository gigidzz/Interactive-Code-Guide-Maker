import { forwardRef, useImperativeHandle, useRef } from 'react';

interface CodeHighlightProps {
  code: string;
  language?: string;
  highlightedLines?: number[];
  start_line?: number;
  end_line?: number;
}

export interface CodeHighlightRef {
  scrollToHighlight: () => void;
}

const CodeHighlight = forwardRef<CodeHighlightRef, CodeHighlightProps>(({
  code,
  language = 'javascript',
  highlightedLines = [],
  start_line,
  end_line
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');
  const displayLines = start_line && end_line 
    ? lines.slice(start_line - 1, end_line)
    : lines;

  useImperativeHandle(ref, () => ({
    scrollToHighlight: () => {
      if (highlightedLines.length > 0 && containerRef.current) {
        const firstHighlightedLine = Math.min(...highlightedLines);
        const targetLineElement = containerRef.current.querySelector(
          `[data-line-number="${firstHighlightedLine}"]`
        ) as HTMLElement;
        
        if (targetLineElement) {
          const container = containerRef.current;
          const containerRect = container.getBoundingClientRect();
          const targetRect = targetLineElement.getBoundingClientRect();
          
          const scrollTop = container.scrollTop;
          const targetTop = targetRect.top - containerRect.top + scrollTop;
          const centerOffset = containerRect.height / 2 - targetRect.height / 2;
          
          container.scrollTo({
            top: Math.max(0, targetTop - centerOffset),
            behavior: 'smooth'
          });
        }
      }
    }
  }));

  const getLanguageClass = (lang: string) => {
    const langMap: Record<string, string> = {
      javascript: 'text-yellow-400',
      typescript: 'text-blue-400',
      python: 'text-green-400',
      java: 'text-orange-400',
      cpp: 'text-purple-400',
      c: 'text-slate-400',
      html: 'text-red-400',
      css: 'text-pink-400',
      sql: 'text-cyan-400',
    };
    return langMap[lang.toLowerCase()] || 'text-slate-400';
  };

  const isLineHighlighted = (lineIndex: number) => {
    const actualLineNumber = start_line ? start_line + lineIndex : lineIndex + 1;
    return highlightedLines.includes(actualLineNumber);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-900 rounded-t-xl border border-purple-500/20 border-b-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
          </div>
          <span className={`text-sm font-medium ${getLanguageClass(language || 'javascript')}`}>
            {language?.toUpperCase() || 'CODE'}
          </span>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-slate-400 hover:text-purple-300 transition-colors duration-200 text-sm px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-purple-500/50"
        >
          Copy
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="bg-slate-950 rounded-b-xl overflow-auto max-h-[70vh] border border-purple-500/20 border-t-0 shadow-2xl"
      >
        <div className="w-max">
          {displayLines.map((line, index) => {
            const lineNumber = start_line ? start_line + index : index + 1;
            const isHighlighted = isLineHighlighted(index);
            
            return (
              <div
                key={index}
                data-line-number={lineNumber}
                className={`flex w-full ${
                  isHighlighted 
                    ? 'bg-purple-500/20 border-l-4 border-purple-400 shadow-lg shadow-purple-500/10' 
                    : 'hover:bg-slate-800/30'
                } transition-all duration-150`}
              >
                <span className="select-none text-slate-500 text-right pr-4 pl-4 w-16 flex-shrink-0 text-sm">
                  {lineNumber}
                </span>
                <pre className="text-slate-200 flex-1 text-sm whitespace-pre pr-4">
                  {line || ' '}
                </pre>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

CodeHighlight.displayName = 'CodeHighlight';

export default CodeHighlight;