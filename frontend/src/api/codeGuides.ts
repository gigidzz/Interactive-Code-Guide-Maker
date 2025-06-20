import { useState, useEffect } from 'react';
import type { CodeGuideFilters, CodeGuideResponse } from '../types/codeGuides';

// const mockCodeGuides: CodeGuide[] = [
//   {
//     id: '1',
//     name: 'React Hooks Guide',
//     category: 'Frontend',
//     language: 'JavaScript',
//     description: 'Complete guide to React hooks with practical examples and best practices.',
//     stars: 156,
//     uploadedBy: 'john_dev',
//     code: 'import React, { useState, useEffect } from "react";\n\nconst MyComponent = () => {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n};',
//     createdAt: '2024-01-15'
//   },
//   {
//     id: '2',
//     name: 'Python Data Analysis',
//     category: 'Data Science',
//     language: 'Python',
//     description: 'Comprehensive guide for data analysis using pandas and numpy.',
//     stars: 89,
//     uploadedBy: 'data_scientist',
//     code: 'import pandas as pd\nimport numpy as np\n\n# Load data\ndf = pd.read_csv("data.csv")\n\n# Basic analysis\nprint(df.describe())\nprint(df.info())',
//     createdAt: '2024-01-10'
//   },
//   {
//     id: '3',
//     name: 'Node.js API Setup',
//     category: 'Backend',
//     language: 'JavaScript',
//     description: 'Step-by-step guide to create a REST API with Node.js and Express.',
//     stars: 234,
//     uploadedBy: 'backend_master',
//     code: 'const express = require("express");\nconst app = express();\n\napp.use(express.json());\n\napp.get("/api/users", (req, res) => {\n  res.json({ users: [] });\n});\n\napp.listen(3000, () => {\n  console.log("Server running on port 3000");\n});',
//     createdAt: '2024-01-20'
//   }
// ];

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

    const response = await fetch('http://localhost:3000/codeguides', {
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