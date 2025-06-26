import React from 'react';
import type { ProfessionInputProps } from '../../types/authTypes';

export const ProfessionInput: React.FC<ProfessionInputProps> = ({
  professions, professionInput, error, onInputChange, onAdd, onRemove, onKeyDown
}) => (
  <div>
    <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
      Professions
    </label>
    <div className="mt-1">
      <div className="flex gap-2">
        <input
          id="profession"
          type="text"
          value={professionInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          className={`appearance-none block flex-1 px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter a profession"
        />
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      {professions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {professions.map((prof, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
            >
              {prof}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);