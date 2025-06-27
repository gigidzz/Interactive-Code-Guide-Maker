interface LanguagePattern {
  language: string;
  patterns: RegExp[];
  keywords: string[];
  extensions: string[];
  weight: number;
}

const LANGUAGE_PATTERNS: LanguagePattern[] = [
  {
    language: 'javascript',
    patterns: [
      /\b(const|let|var)\s+\w+\s*=/,
      /\bfunction\s+\w+\s*\(/,
      /=>\s*{/,
      /console\.log\s*\(/,
      /\brequire\s*\(/,
      /\bimport\s+.*\bfrom\b/,
      /\bexport\s+(default|const|function)/,
      /\$\{.*\}/,
      /\.then\s*\(/,
      /async\s+function/,
      /await\s+/
    ],
    keywords: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'extends', 'import', 'export', 'async', 'await', 'try', 'catch'],
    extensions: ['.js', '.mjs'],
    weight: 1
  },
  {
    language: 'typescript',
    patterns: [
      /:\s*(string|number|boolean|object|any|void|unknown)/,
      /\binterface\s+\w+/,
      /\btype\s+\w+\s*=/,
      /\bas\s+\w+/,
      /\bpublic\s+|private\s+|protected\s+/,
      /<.*>/,
      /\w+\?\s*:/,
      /\w+:\s*\w+\[\]/,
      /\bReadonly</,
      /\bPartial</
    ],
    keywords: ['interface', 'type', 'public', 'private', 'protected', 'readonly', 'abstract', 'implements', 'enum', 'namespace'],
    extensions: ['.ts', '.tsx'],
    weight: 1.2
  },
  {
    language: 'python',
    patterns: [
      /^def\s+\w+\s*\(/m,
      /^class\s+\w+/m,
      /^import\s+\w+/m,
      /^from\s+\w+\s+import/m,
      /print\s*\(/,
      /if\s+__name__\s*==\s*['"']__main__['"']/,
      /^\s*#.*$/m,
      /^\s*@\w+/m,
      /\bself\./,
      /:\s*$/m,
      /\brange\s*\(/,
      /\blen\s*\(/
    ],
    keywords: ['def', 'class', 'import', 'from', 'print', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'with', 'lambda', 'self', 'True', 'False', 'None'],
    extensions: ['.py'],
    weight: 1
  },
  {
    language: 'java',
    patterns: [
      /\bpublic\s+class\s+\w+/,
      /\bpublic\s+static\s+void\s+main/,
      /System\.out\.println/,
      /\bpackage\s+[\w.]+;/,
      /\bimport\s+[\w.]+;/,
      /@\w+/,
      /\bnew\s+\w+\s*\(/,
      /\bString\s+\w+/,
      /\bint\s+\w+/,
      /\bboolean\s+\w+/
    ],
    keywords: ['public', 'private', 'protected', 'class', 'interface', 'extends', 'implements', 'static', 'final', 'abstract', 'int', 'String', 'boolean', 'void'],
    extensions: ['.java'],
    weight: 1
  },
  {
    language: 'html',
    patterns: [
      /<html/i,
      /<head/i,
      /<body/i,
      /<div/i,
      /<span/i,
      /<p>/i,
      /<!DOCTYPE/i,
      /<\/\w+>/,
      /\w+\s*=\s*["'][^"']*["']/,
      /<!--.*-->/
    ],
    keywords: ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'script', 'style', 'meta', 'link'],
    extensions: ['.html', '.htm'],
    weight: 1
  },
  {
    language: 'css',
    patterns: [
      /\w+\s*:\s*[^;]+;/,
      /\.\w+\s*{/,
      /#\w+\s*{/,
      /@media/,
      /@import/,
      /\w+:\w+/,
      /rgba?\s*\(/,
      /hsla?\s*\(/
    ],
    keywords: ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'font'],
    extensions: ['.css'],
    weight: 1
  }
];

export function detectLanguage(code: string): string | null {
  if (!code.trim()) return null;

  const scores: { [key: string]: number } = {};

  LANGUAGE_PATTERNS.forEach(lang => {
    scores[lang.language] = 0;
  });

  LANGUAGE_PATTERNS.forEach(lang => {
    lang.patterns.forEach(pattern => {
      if (pattern.test(code)) {
        scores[lang.language] += lang.weight;
      }
    });

    const codeWords = code.toLowerCase().split(/\W+/);
    lang.keywords.forEach(keyword => {
      if (codeWords.includes(keyword.toLowerCase())) {
        scores[lang.language] += 0.5 * lang.weight;
      }
    });
  });

  const sortedLanguages = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);

  return sortedLanguages.length > 0 ? sortedLanguages[0][0] : null;
}

export function detectLanguageWithConfidence(code: string): { language: string | null; confidence: number } {
  if (!code.trim()) return { language: null, confidence: 0 };

  const scores: { [key: string]: number } = {};
  let totalMatches = 0;

  LANGUAGE_PATTERNS.forEach(lang => {
    scores[lang.language] = 0;
  });

  LANGUAGE_PATTERNS.forEach(lang => {
    lang.patterns.forEach(pattern => {
      if (pattern.test(code)) {
        scores[lang.language] += lang.weight;
        totalMatches++;
      }
    });

    const codeWords = code.toLowerCase().split(/\W+/);
    lang.keywords.forEach(keyword => {
      if (codeWords.includes(keyword.toLowerCase())) {
        scores[lang.language] += 0.5 * lang.weight;
        totalMatches += 0.5;
      }
    });
  });

  const sortedLanguages = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);

  if (sortedLanguages.length === 0) {
    return { language: null, confidence: 0 };
  }

  const topLanguage = sortedLanguages[0];
  const confidence = Math.min(topLanguage[1] / Math.max(totalMatches * 0.3, 1), 1);

  return {
    language: topLanguage[0],
    confidence: Math.round(confidence * 100) / 100
  };
}