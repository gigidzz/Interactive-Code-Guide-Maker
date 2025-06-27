import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-xl border border-red-500/20 p-8 text-center">
            <div className="text-red-400 text-lg font-semibold mb-2">Error</div>
            <p className="text-slate-300 mb-4">{error}</p>
            <button
              onClick={onRetry}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
  );
};

export default ErrorDisplay;