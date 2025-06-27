import { useState, useEffect } from 'react';
import type { CodeGuide, CodeGuideFilters, CodeGuideResponse, Guide } from "../types/codeGuides";
import { getCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.BACKEND_URL;

export const saveCodeGuide = async (guide: Guide): Promise<{ success: boolean; message?: string; guideId?: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/code-guides/guides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie('accesstoken')}`
      },
      body: JSON.stringify(guide),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data, 'saving code guide data');
      return { 
        success: true, 
        message: 'Guide saved successfully!', 
        guideId: data.id || data.data?.id 
      };
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
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 0) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const searchParams = new URLSearchParams();
    Object.entries(cleanFilters).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/code-guides/guides${queryString ? `?${queryString}` : ''}`;
console.log(url, 'url')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data, 'datunia datuna')
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

export const getCodeGuideById = async (id: string): Promise<CodeGuide> => {
  try {
    const response = await fetch(`${API_BASE_URL}/code-guides/guides/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch code guide: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching code guide:', error);
    throw error;
  }
};

export const getCodeGuideByAuthorId = async (id: string): Promise<CodeGuide[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/code-guides/guides/author/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch code guide: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching code guide:', error);
    throw error;
  }
};