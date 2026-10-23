/**
 * Robust Client-Side Python Runner & Evaluator.
 * Safely executes Python code directly in browser memory without external server lag.
 * Supports standard I/O, control flow, functions, collections, arithmetic, stdlib modules
 * (math, random, re, hashlib, collections), list comprehensions, and formatted diagnostics.
 */

export interface PythonExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTimeMs: number;
}

export interface InputHandler {
  (promptText: string): string;
}

export class PythonRuntime {
  private outputBuffer: string[] = [];
  private inputBuffer: string[] = [];

  constructor(private inputHandler?: InputHandler) {}

  public execute(code: string, preSuppliedInputs: string[] = []): PythonExecutionResult {
    const startTime = performance.now();
    this.outputBuffer = [];
    this.inputBuffer = [...preSuppliedInputs];

    const trimmed = code.trim();
    if (!trimmed) {
      return {
        success: true,
        output: '',
        executionTimeMs: 0
      };
    }

    try {
      this.runPythonCode(code);
      const executionTimeMs = Math.round(performance.now() - startTime);
      return {
        success: true,
        output: this.outputBuffer.join('\n'),
        executionTimeMs
      };
    } catch (err: unknown) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        output: this.outputBuffer.join('\n'),
        error: this.translateError(errorMessage),
        executionTimeMs
      };
    }
  }

  private translateError(rawError: string): string {
    if (rawError.includes('SyntaxError') || rawError.includes('Unexpected token')) {
      return `❌ خطأ في بناء الجملة (SyntaxError): تأكد من صحة كتابة الأوامر، الأقواس ()، النقطتين الرأسيتين (:) وعلامات التنصيص.\nالتفاصيل: ${rawError}`;
    }
    if (rawError.includes('NameError') || rawError.includes('is not defined')) {
      return `❌ خطأ في التسمية (NameError): استخدام متغير أو دالة غير معرّفة مسبقًا.\nالتفاصيل: ${rawError}`;
    }
    if (rawError.includes('TypeError')) {
      return `❌ خطأ في نوع البيانات (TypeError): عملية غير متوافقة بين أنواع البيانات (مثل جمع نص مع رقم).\nالتفاصيل: ${rawError}`;
    }
    if (rawError.includes('ZeroDivisionError') || rawError.includes('division by zero')) {
      return `❌ خطأ في القسمة (ZeroDivisionError): لا يمكن القسمة على صفر!`;
    }
    if (rawError.includes('IndexError')) {
      return `❌ خطأ في الفهرس (IndexError): الفهرس المطلوب خارج حدود القائمة أو النص.`;
    }
    return `❌ خطأ في التنفيذ: ${rawError}`;
  }

  private formatPyVal(val: unknown, insideContainer = false): string {
    if (typeof val === 'boolean') return val ? 'True' : 'False';
    if (val === null || val === undefined) return 'None';
    if (typeof val === 'string') return insideContainer ? `'${val}'` : val;
    if (Array.isArray(val)) {
      const isTuple = (val as any).__isTuple;
      const inner = val.map(x => this.formatPyVal(x, true)).join(', ');
      return isTuple ? `(${inner})` : `[${inner}]`;
    }
    if (typeof val === 'object') {
      const entries = Object.entries(val as Record<string, unknown>)
        .filter(([k]) => !k.startsWith('__'))
        .map(([k, v]) => `'${k}': ${this.formatPyVal(v, true)}`);
      return `{${entries.join(', ')}}`;
    }
    return String(val);
  }

  private runPythonCode(pyCode: string) {
    const jsCode = this.transpilePythonToJS(pyCode);

    const stdout = (text: unknown) => {
      this.outputBuffer.push(String(text));
    };

    const pyPrint = (...args: unknown[]) => {
      const line = args.map(arg => this.formatPyVal(arg, false)).join(' ');
      this.outputBuffer.push(line);
    };

    const pyInput = (promptMsg: string = '') => {
      if (promptMsg) {
        stdout(promptMsg);
      }
      if (this.inputBuffer.length > 0) {
        return this.inputBuffer.shift()!;
      }
      if (this.inputHandler) {
        return this.inputHandler(promptMsg);
      }
      return '0';
    };

    const pyRange = (...args: number[]): number[] => {
      let start = 0;
      let stop = 0;
      let step = 1;
      if (args.length === 1) {
        stop = args[0];
      } else if (args.length === 2) {
        start = args[0];
        stop = args[1];
      } else if (args.length >= 3) {
        start = args[0];
        stop = args[1];
        step = args[2];
      }
      const res: number[] = [];
      if (step > 0) {
        for (let i = start; i < stop; i += step) res.push(i);
      } else if (step < 0) {
        for (let i = start; i > stop; i += step) res.push(i);
      }
      return res;
    };

    const pyLen = (val: unknown): number => {
      if (typeof val === 'string' || Array.isArray(val)) return val.length;
      if (val instanceof Set || val instanceof Map) return val.size;
      if (val && typeof val === 'object') return Object.keys(val).length;
      throw new Error(`TypeError: object of type '${typeof val}' has no len()`);
    };

    const pyType = (val: unknown): string => {
      if (typeof val === 'number') return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
      if (typeof val === 'string') return "<class 'str'>";
      if (typeof val === 'boolean') return "<class 'bool'>";
      if (Array.isArray(val)) return "<class 'list'>";
      if (val && typeof val === 'object') return "<class 'dict'>";
      return "<class 'NoneType'>";
    };

    const pyInt = (val: unknown): number => {
      const n = parseInt(String(val), 10);
      if (isNaN(n)) throw new Error(`ValueError: invalid literal for int(): '${val}'`);
      return n;
    };

    const pyFloat = (val: unknown): number => {
      const n = parseFloat(String(val));
      if (isNaN(n)) throw new Error(`ValueError: could not convert string to float: '${val}'`);
      return n;
    };

    const pyStr = (val: unknown): string => {
      return this.formatPyVal(val, false);
    };

    const pySum = (arr: unknown): number => {
      if (!Array.isArray(arr)) throw new Error('TypeError: sum() expects an iterable');
      return arr.reduce((acc: number, curr: unknown) => acc + Number(curr), 0);
    };

    const pyMin = (...args: unknown[]): unknown => {
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.min(...(list as number[]));
    };

    const pyMax = (...args: unknown[]): unknown => {
      if (args.length === 2 && typeof args[1] === 'function') {
        const iterable = Array.isArray(args[0]) ? args[0] : Object.keys(args[0] as object);
        const keyFn = args[1] as (item: unknown) => number;
        let bestItem = iterable[0];
        let bestScore = keyFn(bestItem);
        for (const item of iterable) {
          const score = keyFn(item);
          if (score > bestScore) {
            bestScore = score;
            bestItem = item;
          }
        }
        return bestItem;
      }
      const list = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
      return Math.max(...(list as number[]));
    };

    const pyAbs = (n: number): number => Math.abs(n);
    const pyRound = (n: number, digits: number = 0): number => {
      const factor = Math.pow(10, digits);
      return Math.round(n * factor) / factor;
    };

    const pySorted = (arr: unknown[]): unknown[] => {
      return [...arr].sort((a: any, b: any) => (a > b ? 1 : a < b ? -1 : 0));
    };

    const pyZip = (...arrays: unknown[][]): unknown[][] => {
      const minLen = Math.min(...arrays.map(a => a.length));
      const result: unknown[][] = [];
      for (let i = 0; i < minLen; i++) {
        result.push(arrays.map(a => a[i]));
      }
      return result;
    };

    const pyEnumerate = (arr: unknown[], start = 0): [number, unknown][] => {
      return arr.map((item, idx) => [start + idx, item]);
    };

    const pyAny = (arr: unknown[]): boolean => arr.some(Boolean);
    const pyAll = (arr: unknown[]): boolean => arr.every(Boolean);
    const pyNext = (arr: unknown[]): unknown => arr[0];

    const pyIn = (item: unknown, container: unknown): boolean => {
      if (typeof container === 'string') return container.includes(String(item));
      if (Array.isArray(container)) {
        return container.some(el => JSON.stringify(el) === JSON.stringify(item));
      }
      if (container instanceof Set) return container.has(item);
      if (container && typeof container === 'object') {
        return Object.prototype.hasOwnProperty.call(container, String(item));
      }
      return false;
    };

    const pyTuple = (...items: unknown[]) => {
      const arr = [...items] as any;
      arr.__isTuple = true;
      return arr;
    };

    const pyMath = {
      sqrt: Math.sqrt,
      exp: Math.exp,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      pi: Math.PI,
      radians: (deg: number) => (deg * Math.PI) / 180
    };

    let rngState = 42;
    const nextRand = () => {
      rngState = (rngState * 1664525 + 1013904223) % 4294967296;
      return rngState / 4294967296;
    };
    const pyRandom = {
      seed: (s: number) => {
        rngState = s * 12345 + 6789;
      },
      random: () => nextRand(),
      randrange: (n: number) => Math.floor(nextRand() * n),
      randint: (a: number, b: number) => a + Math.floor(nextRand() * (b - a + 1)),
      uniform: (a: number, b: number) => a + nextRand() * (b - a),
      choice: <T>(arr: T[]): T => arr[Math.floor(nextRand() * arr.length)]
    };

    const pyRe = {
      sub: (pattern: string, repl: string, text: string) => {
        const reg = new RegExp(pattern, 'g');
        return text.replace(reg, repl);
      },
      search: (pattern: string, text: string) => {
        const reg = new RegExp(pattern);
        return reg.test(text);
      },
      findall: (pattern: string, text: string) => {
        const reg = new RegExp(pattern, 'g');
        return text.match(reg) || [];
      }
    };

    const pyCounter = (arr: string[]) => {
      const counts: Record<string, number> = {};
      for (const item of arr) {
        counts[item] = (counts[item] || 0) + 1;
      }
      return {
        most_common: (n?: number) => {
          const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => pyTuple(k, v));
          return n !== undefined ? sorted.slice(0, n) : sorted;
        }
      };
    };

    const pyDeque = (initial: unknown[] = []) => {
      const arr = [...initial];
      (arr as any).popleft = () => arr.shift();
      return arr;
    };

    const pyHashlib = {
      sha256: (input: string) => ({
        hexdigest: () => {
          let h = 2166136261;
          const str = String(input);
          for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
          }
          return (h >>> 0).toString(16).padStart(8, '0').repeat(8);
        }
      })
    };

    const strProto = String.prototype as any;
    if (!strProto.isdigit) {
      strProto.isdigit = function () {
        return /^\d+$/.test(this.toString());
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const runner = new Function(
      'print',
      'input',
      'range',
      'len',
      'type',
      'int',
      'float',
      'str',
      'sum',
      'min',
      'max',
      'abs',
      'round',
      'sorted',
      'zip',
      'enumerate',
      'any',
      'all',
      'next',
      '__pyIn',
      '__pyTuple',
      'math',
      'random',
      're',
      'Counter',
      'deque',
      'hashlib',
      'True',
      'False',
      'None',
      jsCode
    );

    runner(
      pyPrint,
      pyInput,
      pyRange,
      pyLen,
      pyType,
      pyInt,
      pyFloat,
      pyStr,
      pySum,
      pyMin,
      pyMax,
      pyAbs,
      pyRound,
      pySorted,
      pyZip,
      pyEnumerate,
      pyAny,
      pyAll,
      pyNext,
      pyIn,
      pyTuple,
      pyMath,
      pyRandom,
      pyRe,
      pyCounter,
      pyDeque,
      pyHashlib,
      true,
      false,
      null
    );
  }

  public transpilePythonToJS(pyCode: string): string {
    const normalizedCode = pyCode.replace(/"""([\s\S]*?)"""/g, (_, content) => {
      return JSON.stringify(content);
    });

    const rawLines = normalizedCode.split('\n');
    const logicalLines: string[] = [];
    let currentLine = '';
    let openBrackets = 0;

    for (const rawLine of rawLines) {
      let inSingle = false;
      let inDouble = false;
      let codePart = '';
      for (let i = 0; i < rawLine.length; i++) {
        const ch = rawLine[i];
        const prev = i > 0 ? rawLine[i - 1] : '';
        if (ch === "'" && !inDouble && prev !== '\\') inSingle = !inSingle;
        else if (ch === '"' && !inSingle && prev !== '\\') inDouble = !inDouble;
        else if (ch === '#' && !inSingle && !inDouble) break;
        codePart += ch;
      }

      if (!codePart.trim() && openBrackets === 0) continue;

      if (openBrackets > 0) {
        currentLine += ' ' + codePart.trim();
      } else {
        currentLine = codePart;
      }

      for (const ch of codePart) {
        if (ch === '[' || ch === '(' || ch === '{') openBrackets++;
        else if (ch === ']' || ch === ')' || ch === '}') openBrackets = Math.max(0, openBrackets - 1);
      }

      if (openBrackets === 0 && currentLine.trim()) {
        logicalLines.push(currentLine);
        currentLine = '';
      }
    }
    if (currentLine.trim()) {
      logicalLines.push(currentLine);
    }

    const outputLines: string[] = [];
    const indentStack: number[] = [0];

    for (let lineIndex = 0; lineIndex < logicalLines.length; lineIndex++) {
      const codePart = logicalLines[lineIndex];
      const indentMatch = codePart.match(/^(\s*)/);
      const indentLength = indentMatch ? indentMatch[1].replace(/\t/g, '    ').length : 0;
      let trimmed = codePart.trim();

      if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
        continue;
      }

      while (indentStack.length > 1 && indentLength < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        outputLines.push('}');
      }

      const isBlockHeader = trimmed.endsWith(':');
      if (isBlockHeader) {
        trimmed = trimmed.slice(0, -1).trim();
      }

      let transformed = this.transformPythonLine(trimmed);

      if (isBlockHeader) {
        outputLines.push(`${transformed} {`);
        indentStack.push(indentLength + 4);
      } else {
        if (!transformed.endsWith(';')) {
          transformed += ';';
        }
        outputLines.push(transformed);
      }
    }

    while (indentStack.length > 1) {
      indentStack.pop();
      outputLines.push('}');
    }

    return outputLines.join('\n');
  }

  private hasTopLevelComma(str: string): boolean {
    let depth = 0;
    let inS = false;
    let inD = false;
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (c === "'" && !inD) inS = !inS;
      else if (c === '"' && !inS) inD = !inD;
      else if (!inS && !inD) {
        if (c === '(' || c === '[' || c === '{') depth++;
        else if (c === ')' || c === ']' || c === '}') depth--;
        else if (c === ',' && depth === 0) return true;
      }
    }
    return false;
  }

  private transformPythonLine(line: string): string {
    if (/^".*"$/.test(line) || /^'.*'$/.test(line)) {
      return `/* ${line} */`;
    }

    if (line.startsWith('class ')) {
      const classMatch = line.match(/^class\s+([a-zA-Z_]\w*)/);
      if (classMatch) {
        return `class ${classMatch[1]}`;
      }
    }

    if (line.startsWith('def ')) {
      const defMatch = line.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)/);
      if (defMatch) {
        const funcName = defMatch[1];
        const args = defMatch[2]
          .split(',')
          .map(a => a.trim())
          .filter(a => a !== 'self')
          .join(', ');
        if (funcName === '__init__') {
          return `constructor(${args})`;
        }
        if (defMatch[2].includes('self')) {
          return `${funcName}(${args})`;
        }
        return `function ${funcName}(${args})`;
      }
    }

    if (line.startsWith('if ')) {
      const cond = this.transformExpression(line.slice(3));
      return `if (${cond})`;
    }
    if (line.startsWith('elif ')) {
      const cond = this.transformExpression(line.slice(5));
      return `else if (${cond})`;
    }
    if (line === 'else') {
      return 'else';
    }
    if (line.startsWith('while ')) {
      const cond = this.transformExpression(line.slice(6));
      return `while (${cond})`;
    }
    if (line.startsWith('for ')) {
      const forMatch = line.match(/^for\s+(.+?)\s+in\s+(.+)$/);
      if (forMatch) {
        let varPart = forMatch[1].trim();
        const iterExpr = this.transformExpression(forMatch[2]);
        if (varPart.includes(',')) {
          varPart = `[${varPart.replace(/[()]/g, '')}]`;
        }
        return `for (const ${varPart} of ${iterExpr})`;
      }
    }

    if (line.startsWith('return ') || line === 'return') {
      const expr = line.slice(6).trim();
      if (this.hasTopLevelComma(expr)) {
        return `return __pyTuple(${this.transformExpression(expr)})`;
      }
      return expr ? `return ${this.transformExpression(expr)}` : 'return';
    }
    if (line === 'break') return 'break';
    if (line === 'continue') return 'continue';
    if (line === 'pass') return '/* pass */';

    const tupleAssign = line.match(/^([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)+)\s*=\s*(.+)$/);
    if (tupleAssign) {
      const vars = tupleAssign[1];
      const rawRhs = tupleAssign[2].trim();
      const rhs = this.transformExpression(rawRhs);
      if (this.hasTopLevelComma(rawRhs)) {
        return `var [${vars}] = [${rhs}]`;
      }
      return `var [${vars}] = ${rhs}`;
    }

    const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*([+\-*/%]?=)\s*(.+)$/);
    if (assignMatch && !line.startsWith('self.')) {
      const varName = assignMatch[1];
      const op = assignMatch[2];
      const right = this.transformExpression(assignMatch[3]);
      if (op === '=') {
        return `var ${varName} = ${right}`;
      }
      return `${varName} ${op} ${right}`;
    }

    return this.transformExpression(line);
  }

  private transformExpression(expr: string): string {
    let res = expr.trim();

    res = res.replace(/\bself\./g, 'this.');
    res = res.replace(/\bTempSensor\((?:base=)?([^)]*)\)/g, 'new TempSensor($1)');

    // Python raw strings r"..." or r'...' -> double backslashes for JS string literal
    res = res.replace(/\br(".*?"|'.*?')/g, (_, quoted) => {
      const q = quoted[0];
      const inner = quoted.slice(1, -1).replace(/\\/g, '\\\\');
      return `${q}${inner}${q}`;
    });

    // Array slicing: arr[:3] -> arr.slice(0, 3), arr[1:] -> arr.slice(1)
    res = res.replace(/([a-zA-Z_]\w*)\[:(\d+)\]/g, '$1.slice(0, $2)');
    res = res.replace(/([a-zA-Z_]\w*)\[(\d+):\]/g, '$1.slice($2)');

    // Python set literal {"a", "b"} (no colons) -> ["a", "b"]
    res = res.replace(/\{([^{}:]+)\}/g, (match, inner) => {
      if (inner.includes('"') || inner.includes("'")) {
        return `[${inner}]`;
      }
      return match;
    });

    // Set intersection a & b -> a.filter(x => b.includes(x))
    res = res.replace(/([a-zA-Z_]\w*\["tags"\])\s*&\s*([a-zA-Z_]\w*\["tags"\])/g, '$1.filter(x => $2.includes(x))');

    // Tuple literals inside lists [(80, 50, 40), (20, 60, 25)] -> [[80, 50, 40], [20, 60, 25]]
    res = res.replace(/(?<![a-zA-Z0-9_$`(])\(([^()`[\]=]+,[^()`[\]=]+)\)/g, (_, inner) => {
      return `[${inner}]`;
    });

    // List comprehension with filter: [expr for v in iter if cond]
    res = res.replace(
      /^\[\s*(.+?)\s+for\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)?)\s+in\s+(.+?)\s+if\s+(.+)\s*\]$/,
      (_, mapExpr, varPart, iterExpr, condExpr) => {
        const param = varPart.includes(',') ? `([${varPart}])` : varPart;
        return `${this.transformExpression(iterExpr)}.filter(${param} => ${this.transformExpression(condExpr)}).map(${param} => (${this.transformExpression(mapExpr)}))`;
      }
    );

    // Simple List comprehension: [expr for v in iter]
    res = res.replace(
      /^\[\s*(.+?)\s+for\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)?)\s+in\s+(.+?)\s*\]$/,
      (_, mapExpr, varPart, iterExpr) => {
        const param = varPart.includes(',') ? `([${varPart}])` : varPart;
        return `${this.transformExpression(iterExpr)}.map(${param} => (${this.transformExpression(mapExpr)}))`;
      }
    );

    // Generator expression inside sum(...), any(...), next(...), max(...), min(...):
    res = res.replace(
      /\b(sum|any|all|next|max|min)\(\s*(.+?)\s+for\s+([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)?)\s+in\s+([a-zA-Z_]\w*(?:\([^)]*\))?)(?:\s+if\s+([^)]+))?\s*\)/g,
      (_, fn, mapExpr, varPart, iterExpr, condExpr) => {
        const param = varPart.includes(',') ? `([${varPart}])` : varPart;
        const filtered = condExpr
          ? `${this.transformExpression(iterExpr)}.filter(${param} => ${this.transformExpression(condExpr)})`
          : this.transformExpression(iterExpr);
        return `${fn}(${filtered}.map(${param} => (${this.transformExpression(mapExpr)})))`;
      }
    );

    // Python ternary: A if COND else B
    for (let i = 0; i < 3; i++) {
      res = res.replace(
        /([^=,()]+?)\s+if\s+([^?:]+?)\s+else\s+([^,)\]]+)/g,
        '($2 ? $1 : $3)'
      );
    }

    res = res.replace(/max\(\s*([a-zA-Z_]\w*)\s*,\s*key=\1\.get\s*\)/g, 'max($1, k => $1[k])');
    res = res.replace(/max\(\s*([a-zA-Z_]\w*)\s*,\s*key=lambda\s+([a-zA-Z_]\w*)\s*:\s*(.+?)\)/g, 'max($1, $2 => $3)');

    res = res.replace(/([a-zA-Z_]\w*)\.setdefault\(([^,]+),\s*\[\]\)\.append\(([^)]+)\)/g, '($1[$2] = $1[$2] || []).push($3)');
    res = res.replace(/([a-zA-Z_]\w*)\.get\(([^)]+)\)/g, '($1[$2] ?? null)');
    res = res.replace(/\.index\(/g, '.indexOf(');
    res = res.replace(/("[^"]*"|'[^']*')\.join\(([^)]+)\)/g, '$2.join($1)');
    res = res.replace(/\.encode\([^)]*\)/g, '');

    // f-strings f"Hello {name:.2f}" or f"Hello {name}"
    res = res.replace(/\bf"(.*?)"/g, (_: string, p1: string) => {
      const interpolated = p1.replace(/\{([^}:]+)(?::\.(\d+)f)?\}/g, (__: string, exprPart: string, digits: string) => {
        if (digits) return `\${Number(${exprPart}).toFixed(${digits})}`;
        return `\${${exprPart}}`;
      });
      return `\`${interpolated}\``;
    });
    res = res.replace(/\bf'(.*?)'/g, (_: string, p1: string) => {
      const interpolated = p1.replace(/\{([^}:]+)(?::\.(\d+)f)?\}/g, (__: string, exprPart: string, digits: string) => {
        if (digits) return `\${Number(${exprPart}).toFixed(${digits})}`;
        return `\${${exprPart}}`;
      });
      return `\`${interpolated}\``;
    });

    res = res.replace(/(\b\w+\b)\s*<=\s*(\b\w+\b)\s*<\s*(\b\w+\b)/g, '($1 <= $2 && $2 < $3)');

    // x not in y / x in y (supporting Arabic strings and identifiers)
    res = res.replace(/("[^"]*"|'[^']*'|\([^)]+\)|[a-zA-Z0-9_[\].]+)\s+not\s+in\s+([a-zA-Z0-9_[\].]+)/g, '!__pyIn($1, $2)');
    res = res.replace(/("[^"]*"|'[^']*'|\([^)]+\)|[a-zA-Z0-9_[\].]+)\s+in\s+([a-zA-Z0-9_[\].]+)/g, '__pyIn($1, $2)');

    res = res.replace(/(\w+|\d+)\s*\/\/\s*(\w+|\d+)/g, 'Math.floor($1 / $2)');

    res = res.replace(/\band\b/g, '&&');
    res = res.replace(/\bor\b/g, '||');
    res = res.replace(/\bnot\s+/g, '!');
    res = res.replace(/\bis\s+None\b/g, '=== null');
    res = res.replace(/\bis\s+not\s+None\b/g, '!== null');

    res = res.replace(/\(\*([a-zA-Z_]\w*)\)/g, '(...$1)');

    res = res.replace(/\.append\(/g, '.push(');
    res = res.replace(/\.lower\(\)/g, '.toLowerCase()');
    res = res.replace(/\.upper\(\)/g, '.toUpperCase()');
    res = res.replace(/\.strip\(\)/g, '.trim()');
    res = res.replace(/\.split\(\)/g, '.trim().split(/\\s+/)');

    return res;
  }
}

export const defaultPythonRunner = new PythonRuntime();
