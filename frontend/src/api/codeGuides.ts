import { useState, useEffect } from 'react';
import type { CodeGuideFilters, CodeGuideResponse, Guide } from "../types/codeGuides";

const API_BASE_URL = 'http://localhost:5000/api';

export const saveCodeGuide = async (guide: Guide): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/codeguides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guide),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data, 'saving code guide data')
      return { success: true, message: 'Guide saved successfully!' };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || `Failed to save guide (${response.status})` 
      };
    }
  } catch (error) {
    console.error('Error saving guide:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Network error occurred' 
    };
  }
};

export const fetchCodeGuides = async (
  filters: CodeGuideFilters = {}
): Promise<CodeGuideResponse> => {
  try {
    // Clean up filters - remove empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 0) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const response = await fetch('http://localhost:5000/codeguides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanFilters),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching code guides:', error);
    throw new Error('Failed to fetch code guides. Please try again.');
  }
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};