export interface SyntaxError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  type: string;
}

export interface SyntaxCheckResult {
  isValid: boolean;
  errors: SyntaxError[];
  warnings: SyntaxError[];
}

export class SyntaxChecker {
  private static checkJavaScript(code: string): SyntaxCheckResult {
    const errors: SyntaxError[] = [];
    const warnings: SyntaxError[] = [];
    const lines = code.split('\n');

    let openBraces = 0;
    let openParens = 0;
    let openBrackets = 0;
    
    const declaredFunctions = new Set<string>();
    const declaredVariables = new Set<string>();

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || !trimmed) {
        return;
      }

      const functionMatch = trimmed.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (functionMatch) {
        declaredFunctions.add(functionMatch[1]);
      }

      const arrowFunctionMatch = trimmed.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:\([^)]*\)|[a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/);
      if (arrowFunctionMatch) {
        declaredFunctions.add(arrowFunctionMatch[1]);
      }

      const functionExprMatch = trimmed.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*function/);
      if (functionExprMatch) {
        declaredFunctions.add(functionExprMatch[1]);
      }

      const varMatch = trimmed.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (varMatch && !declaredFunctions.has(varMatch[1])) {
        declaredVariables.add(varMatch[1]);
      }

      const classMatch = trimmed.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
      if (classMatch) {
        declaredFunctions.add(classMatch[1]);
      }
    });

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || !trimmed) {
        return;
      }

      let inString = false;
      let stringChar = '';
      let escaped = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const prevChar = i > 0 ? line[i - 1] : '';

        if (!inString && (char === '"' || char === "'" || char === '`')) {
          inString = true;
          stringChar = char;
          escaped = false;
        } else if (inString && char === stringChar && !escaped) {
          inString = false;
          stringChar = '';
        }

        escaped = inString && prevChar === '\\' && !escaped;

        if (inString) continue;

        switch (char) {
          case '{':
            openBraces++;
            break;
          case '}':
            openBraces--;
            if (openBraces < 0) {
              errors.push({
                line: lineNum,
                column: i + 1,
                message: 'Unexpected closing brace',
                severity: 'error',
                type: 'syntax'
              });
              openBraces = 0;
            }
            break;
          case '(':
            openParens++;
            break;
          case ')':
            openParens--;
            if (openParens < 0) {
              errors.push({
                line: lineNum,
                column: i + 1,
                message: 'Unexpected closing parenthesis',
                severity: 'error',
                type: 'syntax'
              });
              openParens = 0;
            }
            break;
          case '[':
            openBrackets++;
            break;
          case ']':
            openBrackets--;
            if (openBrackets < 0) {
              errors.push({
                line: lineNum,
                column: i + 1,
                message: 'Unexpected closing bracket',
                severity: 'error',
                type: 'syntax'
              });
              openBrackets = 0;
            }
            break;
        }
      }

      if (inString) {
        errors.push({
          line: lineNum,
          column: line.lastIndexOf(stringChar) + 1,
          message: `Unclosed string literal`,
          severity: 'error',
          type: 'syntax'
        });
      }

      if (trimmed && 
          !trimmed.endsWith(';') && 
          !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') && 
          !trimmed.endsWith(',') &&
          !trimmed.endsWith(':') &&
          !trimmed.includes('//') &&
          !trimmed.match(/^(if|else|for|while|function|class|const|let|var|return|import|export|try|catch|finally|switch|case|default|break|continue)\b/) &&
          !trimmed.match(/^\s*\}/) &&
          !trimmed.includes('=>') &&
          (trimmed.match(/^\w+\s*\+\+/) || 
           trimmed.match(/^\w+\s*--/) ||
           (trimmed.match(/^\w+\s*\(/) && !trimmed.match(/^(if|for|while|switch)\s*\(/)) ||
           trimmed.match(/^throw\s+/))) {
        warnings.push({
          line: lineNum,
          column: line.length,
          message: 'Consider adding semicolon to avoid potential ASI issues',
          severity: 'warning',
          type: 'style'
        });
      }

      const functionCallRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
      let funcMatch;
      while ((funcMatch = functionCallRegex.exec(line)) !== null) {
        const funcName = funcMatch[1];
        
        if (this.isInString(line, funcMatch.index)) continue;
        
        if (this.isKnownFunction(funcName) || 
            declaredFunctions.has(funcName) ||
            ['if', 'for', 'while', 'switch', 'catch'].includes(funcName)) {
          continue;
        }

        const beforeFunc = line.substring(0, funcMatch.index).trim();
        if (beforeFunc.endsWith('.') || beforeFunc.match(/\.\s*$/)) {
          continue;
        }

        warnings.push({
          line: lineNum,
          column: funcMatch.index + 1,
          message: `Potential undefined function: ${funcName}`,
          severity: 'warning',
          type: 'reference'
        });
      }

      if (trimmed.match(/\bif\s*\([^)]*[^!=<>]=\s*[^=]/)) {
        const assignmentIndex = line.indexOf('=');
        if (assignmentIndex > 0 && 
            line[assignmentIndex - 1] !== '!' && 
            line[assignmentIndex - 1] !== '=' && 
            line[assignmentIndex - 1] !== '<' && 
            line[assignmentIndex - 1] !== '>' &&
            line[assignmentIndex + 1] !== '=') {
          warnings.push({
            line: lineNum,
            column: assignmentIndex + 1,
            message: 'Assignment in if condition, did you mean == or ===?',
            severity: 'warning',
            type: 'logic'
          });
        }
      }

      const objectKeyMatch = line.match(/\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/);
      if (objectKeyMatch && !line.includes('"' + objectKeyMatch[1] + '"') && !line.includes("'" + objectKeyMatch[1] + "'")) {
        warnings.push({
          line: lineNum,
          column: line.indexOf(objectKeyMatch[1]) + 1,
          message: 'Consider using quoted object keys for consistency',
          severity: 'warning',
          type: 'style'
        });
      }
    });

    if (openBraces > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `${openBraces} unclosed brace(s)`,
        severity: 'error',
        type: 'syntax'
      });
    }

    if (openParens > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `${openParens} unclosed parenthesis(es)`,
        severity: 'error',
        type: 'syntax'
      });
    }

    if (openBrackets > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `${openBrackets} unclosed bracket(s)`,
        severity: 'error',
        type: 'syntax'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static checkPython(code: string): SyntaxCheckResult {
    const errors: SyntaxError[] = [];
    const warnings: SyntaxError[] = [];
    const lines = code.split('\n');

    let openParens = 0;
    let openBrackets = 0;
    let openBraces = 0;
    let indentStack: number[] = [0];
    
    const declaredFunctions = new Set<string>();
    const declaredVariables = new Set<string>();

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('#') || !trimmed) return;

      const funcMatch = trimmed.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (funcMatch) {
        declaredFunctions.add(funcMatch[1]);
      }

      const classMatch = trimmed.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (classMatch) {
        declaredFunctions.add(classMatch[1]);
      }

      const varMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
      if (varMatch && !declaredFunctions.has(varMatch[1])) {
        declaredVariables.add(varMatch[1]);
      }
    });

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      if (trimmed.startsWith('#') || !trimmed) {
        return;
      }

      let inString = false;
      let stringChar = '';
      let escaped = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const prevChar = i > 0 ? line[i - 1] : '';

        if (!inString && (char === '"' || char === "'")) {
          if (i + 2 < line.length && line.substring(i, i + 3) === char.repeat(3)) {
            inString = true;
            stringChar = char.repeat(3);
            i += 2;
          } else {
            inString = true;
            stringChar = char;
          }
          escaped = false;
        } else if (inString && line.substring(i, i + stringChar.length) === stringChar && !escaped) {
          inString = false;
          stringChar = '';
          if (stringChar.length === 3) i += 2;
        }

        escaped = inString && prevChar === '\\' && !escaped;

        if (inString) continue;

        switch (char) {
          case '(':
            openParens++;
            break;
          case ')':
            openParens--;
            if (openParens < 0) {
              errors.push({
                line: lineNum,
                column: i + 1,
                message: 'Unexpected closing parenthesis',
                severity: 'error',
                type: 'syntax'
              });
              openParens = 0;
            }
            break;
          case '[':
            openBrackets++;
            break;
          case ']':
            openBrackets--;
            if (openBrackets < 0) {
              errors.push({
                line: lineNum,
                column: i + 1,
                message: 'Unexpected closing bracket',
                severity: 'error',
                type: 'syntax'
              });
              openBrackets = 0;
            }
            break;
          case '{':
            openBraces++;
            break;
          case '}':
            openBraces--;
            if (openBraces < 0) {
              errors.push({
                line: lineNum,
                column: i + 1,
                message: 'Unexpected closing brace',
                severity: 'error',
                type: 'syntax'
              });
              openBraces = 0;
            }
            break;
        }
      }

      const leadingSpaces = line.length - line.trimStart().length;
      
      if (trimmed.endsWith(':')) {
        indentStack.push(leadingSpaces + 4);
      } else if (trimmed) {
        const currentIndent = leadingSpaces;
        
        while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
          indentStack.pop();
        }
        
        const expectedLevel = indentStack[indentStack.length - 1];
        
        if (currentIndent !== expectedLevel) {
          if (currentIndent % 4 !== 0) {
            errors.push({
              line: lineNum,
              column: 1,
              message: 'Indentation should be a multiple of 4 spaces',
              severity: 'error',
              type: 'indentation'
            });
          } else if (currentIndent > expectedLevel) {
            errors.push({
              line: lineNum,
              column: 1,
              message: `Unexpected indentation. Expected ${expectedLevel} spaces, got ${currentIndent}`,
              severity: 'error',
              type: 'indentation'
            });
          }
        }
      }

      if (trimmed.match(/\bprint\s+[^(]/)) {
        warnings.push({
          line: lineNum,
          column: line.indexOf('print ') + 1,
          message: 'Use print() function instead of print statement (Python 3)',
          severity: 'warning',
          type: 'syntax'
        });
      }

      const assignmentMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
      if (assignmentMatch) {
        const varName = assignmentMatch[1];
        const pythonKeywords = [
          'False', 'None', 'True', 'and', 'as', 'assert', 'break', 'class', 
          'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 
          'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 
          'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 
          'with', 'yield'
        ];
        
        if (pythonKeywords.includes(varName)) {
          errors.push({
            line: lineNum,
            column: line.indexOf(varName) + 1,
            message: `Cannot assign to reserved keyword: ${varName}`,
            severity: 'error',
            type: 'syntax'
          });
        }
      }

      const controlStructures = /^(if|elif|else|for|while|try|except|finally|with|def|class)\b/;
      if (controlStructures.test(trimmed) && !trimmed.endsWith(':') && !trimmed.includes('#')) {
        errors.push({
          line: lineNum,
          column: line.length,
          message: 'Missing colon at end of statement',
          severity: 'error',
          type: 'syntax'
        });
      }

      const functionCallRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
      let funcMatch;
      while ((funcMatch = functionCallRegex.exec(line)) !== null) {
        const funcName = funcMatch[1];
        
        if (this.isInString(line, funcMatch.index)) continue;
        
        const builtinFunctions = [
          'print', 'len', 'range', 'str', 'int', 'float', 'bool', 'list', 
          'dict', 'tuple', 'set', 'type', 'isinstance', 'hasattr', 'getattr',
          'setattr', 'dir', 'vars', 'id', 'abs', 'min', 'max', 'sum', 'any',
          'all', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed',
          'open', 'input', 'round', 'pow', 'divmod', 'bin', 'oct', 'hex'
        ];
        
        if (builtinFunctions.includes(funcName) || declaredFunctions.has(funcName)) {
          continue;
        }

        const beforeFunc = line.substring(0, funcMatch.index).trim();
        if (beforeFunc.endsWith('.')) {
          continue;
        }

        warnings.push({
          line: lineNum,
          column: funcMatch.index + 1,
          message: `Potential undefined function: ${funcName}`,
          severity: 'warning',
          type: 'reference'
        });
      }
    });

    if (openParens > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `${openParens} unclosed parenthesis(es)`,
        severity: 'error',
        type: 'syntax'
      });
    }

    if (openBrackets > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `${openBrackets} unclosed bracket(s)`,
        severity: 'error',
        type: 'syntax'
      });
    }

    if (openBraces > 0) {
      errors.push({
        line: lines.length,
        column: 1,
        message: `${openBraces} unclosed brace(s)`,
        severity: 'error',
        type: 'syntax'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static checkHTML(code: string): SyntaxCheckResult {
    const errors: SyntaxError[] = [];
    const warnings: SyntaxError[] = [];
    const lines = code.split('\n');
    
    const tagStack: Array<{name: string, line: number, column: number}> = [];
    const selfClosingTags = [
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ];

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      const tagRegex = /<\s*\/?([a-zA-Z][a-zA-Z0-9]*)\s*[^>]*\s*\/?>/g;
      let match;
      
      while ((match = tagRegex.exec(line)) !== null) {
        const fullTag = match[0];
        const tagName = match[1].toLowerCase();
        const isClosingTag = fullTag.match(/<\s*\//);
        const isSelfClosing = fullTag.endsWith('/>') || selfClosingTags.includes(tagName);
        const column = match.index + 1;
        
        if (!fullTag.endsWith('>')) {
          errors.push({
            line: lineNum,
            column,
            message: 'Malformed HTML tag - missing closing >',
            severity: 'error',
            type: 'html'
          });
          continue;
        }

        if (isClosingTag) {
          if (tagStack.length === 0) {
            errors.push({
              line: lineNum,
              column,
              message: `Unexpected closing tag: </${tagName}>`,
              severity: 'error',
              type: 'html'
            });
          } else {
            const lastTag = tagStack.pop();
            if (lastTag && lastTag.name !== tagName) {
              errors.push({
                line: lineNum,
                column,
                message: `Mismatched closing tag. Expected: </${lastTag.name}> (opened at line ${lastTag.line}:${lastTag.column}), Found: </${tagName}>`,
                severity: 'error',
                type: 'html'
              });
              tagStack.push(lastTag);
            }
          }
        } else if (!isSelfClosing) {
          tagStack.push({name: tagName, line: lineNum, column});
        }
      }

      const quoteRegex = /(\w+)\s*=\s*["']([^"']*)$/;
      const quoteMatch = line.match(quoteRegex);
      if (quoteMatch) {
        errors.push({
          line: lineNum,
          column: line.indexOf(quoteMatch[0]) + quoteMatch[0].length,
          message: `Unclosed quote in attribute "${quoteMatch[1]}"`,
          severity: 'error',
          type: 'html'
        });
      }

      const unquotedAttrRegex = /\s+(\w+)\s*=\s*([^"'\s>]+)/g;
      let attrMatch;
      while ((attrMatch = unquotedAttrRegex.exec(line)) !== null) {
        warnings.push({
          line: lineNum,
          column: line.indexOf(attrMatch[2]) + 1,
          message: `Attribute value should be quoted: ${attrMatch[1]}="${attrMatch[2]}"`,
          severity: 'warning',
          type: 'html'
        });
      }

      const deprecatedTags = ['font', 'center', 'big', 'small', 'tt', 'strike', 'u'];
      const deprecatedMatch = line.match(new RegExp(`<(${deprecatedTags.join('|')})\\b`, 'i'));
      if (deprecatedMatch) {
        warnings.push({
          line: lineNum,
          column: line.indexOf(deprecatedMatch[0]) + 1,
          message: `Deprecated HTML tag: <${deprecatedMatch[1]}>`,
          severity: 'warning',
          type: 'html'
        });
      }
    });

    tagStack.forEach(tag => {
      errors.push({
        line: tag.line,
        column: tag.column,
        message: `Unclosed tag: <${tag.name}> (opened at line ${tag.line}:${tag.column})`,
        severity: 'error',
        type: 'html'
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static isInString(line: string, position: number): boolean {
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inBacktick = false;
    let escaped = false;

    for (let i = 0; i < position; i++) {
      const char = line[i];
      const prevChar = i > 0 ? line[i - 1] : '';

      if (!escaped) {
        if (char === '"' && !inSingleQuote && !inBacktick) {
          inDoubleQuote = !inDoubleQuote;
        } else if (char === "'" && !inDoubleQuote && !inBacktick) {
          inSingleQuote = !inSingleQuote;
        } else if (char === '`' && !inDoubleQuote && !inSingleQuote) {
          inBacktick = !inBacktick;
        }
      }

      escaped = (inSingleQuote || inDoubleQuote || inBacktick) && prevChar === '\\' && !escaped;
    }

    return inSingleQuote || inDoubleQuote || inBacktick;
  }

  private static isKnownFunction(name: string): boolean {
    const knownFunctions = [
      'console', 'alert', 'confirm', 'prompt', 'setTimeout', 'setInterval',
      'clearTimeout', 'clearInterval', 'parseInt', 'parseFloat', 'isNaN', 
      'isFinite', 'encodeURIComponent', 'decodeURIComponent', 'eval',
      
      'require', 'module', 'exports', '__dirname', '__filename', 'global',
      'process', 'Buffer',
      
      'Array', 'Object', 'String', 'Number', 'Boolean', 'RegExp', 'Error',
      'Date', 'Math', 'JSON', 'Promise', 'Map', 'Set', 'WeakMap', 'WeakSet',
      'Symbol', 'Proxy', 'Reflect', 'ArrayBuffer', 'DataView', 'Int8Array',
      'Uint8Array', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array',
      'Float32Array', 'Float64Array',
      
      'fetch', 'XMLHttpRequest', 'WebSocket', 'Worker', 'SharedWorker',
      'ServiceWorker', 'Notification', 'localStorage', 'sessionStorage',
      
      'document', 'window', 'navigator', 'location', 'history', 'screen',
      'addEventListener', 'removeEventListener', 'querySelector', 
      'querySelectorAll', 'getElementById', 'getElementsByClassName',
      'getElementsByTagName', 'createElement', 'createTextNode'
    ];
    
    return knownFunctions.includes(name);
  }

  public static checkSyntax(code: string, language: string): SyntaxCheckResult {
    if (!code.trim()) {
      return { isValid: true, errors: [], warnings: [] };
    }

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return this.checkJavaScript(code);
      case 'typescript':
      case 'ts':
        return this.checkJavaScript(code);
      case 'python':
      case 'py':
        return this.checkPython(code);
      case 'html':
        return this.checkHTML(code);
      default:
        return { 
          isValid: true, 
          errors: [], 
          warnings: [
            {
              line: 1,
              column: 1,
              message: `Syntax checking not implemented for language: ${language}`,
              severity: 'warning',
              type: 'unsupported'
            }
          ]
        };
    }
  }
}

export default SyntaxChecker;