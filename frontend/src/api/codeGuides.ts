import { useState, useEffect } from 'react';
import type { CodeGuideFilters, CodeGuideResponse, Guide, Step } from "../types/codeGuides";
import { getCookie } from '../utils/cookies';

const API_BASE_URL = 'http://localhost:5000/api';

export const saveCodeGuide = async (guide: Guide): Promise<{ success: boolean; message?: string; guideId?: string }> => {
  try {
    console.log(guide,'radedistyvna unda')
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

export const saveSteps = async (steps: Omit<Step, 'id'>[]): Promise<{ success: boolean; message?: string }> => {
  try {
    // Save all steps
    const stepPromises = steps.map(step => 
      fetch(`${API_BASE_URL}/code-guides/steps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('accesstoken')}`
        },
        body: JSON.stringify(step),
      })
    );

    const responses = await Promise.all(stepPromises);
    
    // Check if all requests were successful
    const allSuccessful = responses.every(response => response.ok);
    
    if (allSuccessful) {
      return { success: true, message: 'All steps saved successfully!' };
    } else {
      const failedCount = responses.filter(response => !response.ok).length;
      return { 
        success: false, 
        message: `Failed to save ${failedCount} step(s)` 
      };
    }
  } catch (error) {
    console.error('Error saving steps:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Network error occurred while saving steps' 
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

    // Convert filters to URL search params
    const searchParams = new URLSearchParams();
    Object.entries(cleanFilters).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/code-guides/guides${queryString ? `?${queryString}` : ''}`;

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