import { forwardRef, useImperativeHandle, useRef } from 'react';

interface CodeHighlightProps {
  code: string;
  language?: string;
  highlightedLines?: number[];
  startLine?: number;
  endLine?: number;
}

export interface CodeHighlightRef {
  scrollToHighlight: () => void;
}

const CodeHighlight = forwardRef<CodeHighlightRef, CodeHighlightProps>(({
  code,
  language = 'javascript',
  highlightedLines = [],
  startLine,
  endLine
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lines = code.split('\n');
  const displayLines = startLine && endLine 
    ? lines.slice(startLine - 1, endLine)
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
      javascript: 'text-yellow-300',
      typescript: 'text-blue-300',
      python: 'text-green-300',
      java: 'text-orange-300',
      cpp: 'text-purple-300',
      c: 'text-gray-300',
      html: 'text-red-300',
      css: 'text-pink-300',
      sql: 'text-cyan-300',
    };
    return langMap[lang.toLowerCase()] || 'text-gray-300';
  };

  const isLineHighlighted = (lineIndex: number) => {
    const actualLineNumber = startLine ? startLine + lineIndex : lineIndex + 1;
    return highlightedLines.includes(actualLineNumber);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-800 rounded-t-lg border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className={`text-sm font-medium ${getLanguageClass(language || 'javascript')}`}>
            {language?.toUpperCase() || 'CODE'}
          </span>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-gray-400 hover:text-white transition-colors duration-200 text-sm px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
        >
          Copy
        </button>
      </div>
      
      <div 
        ref={containerRef}
        className="bg-gray-900 rounded-b-lg overflow-auto max-h-[70vh]"
      >
        <div className="w-max">
          {displayLines.map((line, index) => {
            const lineNumber = startLine ? startLine + index : index + 1;
            const isHighlighted = isLineHighlighted(index);
            
            return (
              <div
                key={index}
                data-line-number={lineNumber}
                className={`flex w-full ${
                  isHighlighted 
                    ? 'bg-blue-500/20 border-l-4 border-blue-400' 
                    : 'hover:bg-gray-800/50'
                } transition-colors duration-150`}
              >
                <span className="select-none text-gray-500 text-right pr-4 pl-4 w-16 flex-shrink-0 text-sm">
                  {lineNumber}
                </span>
                <pre className="text-gray-100 flex-1 text-sm whitespace-pre pr-4">
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