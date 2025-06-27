import React, { useState, useEffect, useMemo } from 'react';
import { FileText, AlertCircle, CheckCircle2, Info, Code } from "lucide-react";
import type { CodeEditorProps } from "../../types/codeGuides";
import { detectLanguageWithConfidence } from '../../utils/languageDetector';
import SyntaxChecker, { type SyntaxCheckResult } from "../../utils/syntaxChecker";

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange }) => {
  const [syntaxResult, setSyntaxResult] = useState<SyntaxCheckResult>({ isValid: true, errors: [], warnings: [] });
  const [showDetails, setShowDetails] = useState(false);

  const languageInfo = useMemo(() => {
    return detectLanguageWithConfidence(code);
  }, [code]);

  useEffect(() => {
    if (code.trim() && languageInfo.language) {
      const result = SyntaxChecker.checkSyntax(code, languageInfo.language);
      setSyntaxResult(result);
    } else {
      setSyntaxResult({ isValid: true, errors: [], warnings: [] });
    }
  }, [code, languageInfo.language]);

  const getStatusIcon = () => {
    if (syntaxResult.errors.length > 0) {
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    } else if (syntaxResult.warnings.length > 0) {
      return <Info className="w-4 h-4 text-yellow-400" />;
    } else if (code.trim()) {
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (syntaxResult.errors.length > 0) {
      return `${syntaxResult.errors.length} error(s)`;
    } else if (syntaxResult.warnings.length > 0) {
      return `${syntaxResult.warnings.length} warning(s)`;
    } else if (code.trim()) {
      return "No issues";
    }
    return "Ready";
  };

  const getStatusColor = () => {
    if (syntaxResult.errors.length > 0) return "text-red-400";
    if (syntaxResult.warnings.length > 0) return "text-yellow-400";
    if (code.trim()) return "text-green-400";
    return "text-slate-400";
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Code Editor</h2>
        
        {languageInfo.language && (
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-lg">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 capitalize">{languageInfo.language}</span>
            <span className="text-xs text-slate-400">
              ({Math.round(languageInfo.confidence * 100)}%)
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-lg">
          {getStatusIcon()}
          <span className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

      </div>

      {(syntaxResult.errors.length > 0 || syntaxResult.warnings.length > 0) && (
        <div className="mb-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            {showDetails ? 'Hide' : 'Show'} Issues Details
          </button>
          
          {showDetails && (
            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
              {syntaxResult.errors.map((error, index) => (
                <div key={`error-${index}`} className="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-red-300">
                        Line {error.line}, Column {error.column}
                      </div>
                      <div className="text-sm text-red-200 mt-1">
                        {error.message}
                      </div>
                      <div className="text-xs text-red-400 mt-1">
                        Type: {error.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {syntaxResult.warnings.map((warning, index) => (
                <div key={`warning-${index}`} className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-yellow-300">
                        Line {warning.line}, Column {warning.column}
                      </div>
                      <div className="text-sm text-yellow-200 mt-1">
                        {warning.message}
                      </div>
                      <div className="text-xs text-yellow-400 mt-1">
                        Type: {warning.type}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <textarea
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Paste your code here..."
        className="w-full h-96 bg-slate-900/50 border border-slate-600 rounded-lg p-4 text-slate-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      
      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
          {languageInfo.language && (
            <span>Language: {languageInfo.language} ({Math.round(languageInfo.confidence * 100)}% confidence)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {syntaxResult.isValid ? (
            <span className="text-green-400">✓ Syntax OK</span>
          ) : (
            <span className="text-red-400">✗ Syntax Issues</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;