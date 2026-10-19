import { ExecutionResult, MemoryBlock } from '../types/curriculum';

const TYPE_SIZES: Record<string, number> = {
  int: 4,
  float: 4,
  double: 8,
  short: 2,
  long: 8,
  char: 1,
};

const GARBAGE_POOL = ['0x8F2A11', '-858993460', '32767', '-1420912', '4199024', '-9918231', '2147483', '65535'];

function toHexAddress(base: number, offsetBytes: number): string {
  return '0x' + (base + offsetBytes).toString(16).toLowerCase();
}

/**
 * Lightweight, deterministic C/C++ subset parser & simulator designed for
 * Dasar Pemrograman (Daspro) laboratory exercises.
 * Parses scalar variables, 1D/2D arrays, element assignments, 1D/2D nested for-loops,
 * sizeof() calculations, and printf/cout statements to dynamically update
 * the console output, 2D logical grid, and <UniversalRAMVisualizer /> memory blocks.
 */
export function executeCCode(code: string, baseAddressHex = 0x7ffe00): ExecutionResult {
  const consoleOutput: string[] = [];
  const memoryBlocks: MemoryBlock[] = [];
  let hasError = false;
  let errorMessage: string | undefined;
  let errorLine: number | undefined;

  // Strip block comments and single-line comments while preserving line numbers
  const cleanLines = code
    .replace(/\/\*[\s\S]*?\*\//g, (match) => '\n'.repeat((match.match(/\n/g) || []).length))
    .split('\n')
    .map((line) => line.replace(/\/\/.*$/, '').trim());

  interface ArrayRecord {
    name: string;
    type: string;
    byteSize: number;
    is2D: boolean;
    rows: number;
    cols: number;
    length: number;
    values: (number | string)[];
    isGarbageFlags: boolean[];
    highlightedIndices: Set<number>;
    baseAddr: number;
    declOrder: number;
  }

  const arrays: Record<string, ArrayRecord> = {};
  const scalars: Record<string, number> = {};
  let currentOffset = 0;
  let declCounter = 0;

  const evalSimpleExpr = (expr: string, localScope: Record<string, number> = {}): number => {
    const trimmed = expr.trim();
    if (!trimmed) return 0;

    // Handle char literal e.g. 'A'
    if (/^'.'$/.test(trimmed)) {
      return trimmed.charCodeAt(1);
    }

    // Handle sizeof(arr) / sizeof(arr[0])
    const sizeofDivMatch = trimmed.match(
      /sizeof\s*\(\s*([a-zA-Z_]\w*)\s*\)\s*\/\s*sizeof\s*\(\s*([a-zA-Z_]\w*)\s*\[\s*\d+\s*\]\s*\)/
    );
    if (sizeofDivMatch) {
      const arrName = sizeofDivMatch[1];
      if (arrays[arrName]) {
        return arrays[arrName]. is2D ? arrays[arrName].rows : arrays[arrName].length;
      }
    }

    // Handle sizeof(arr[0][0])
    const sizeofElem2DMatch = trimmed.match(
      /sizeof\s*\(\s*([a-zA-Z_]\w*)\s*\[\s*\d+\s*\]\s*\[\s*\d+\s*\]\s*\)/
    );
    if (sizeofElem2DMatch) {
      const arrName = sizeofElem2DMatch[1];
      if (arrays[arrName]) {
        return arrays[arrName].byteSize;
      }
    }

    // Handle sizeof(arr[0])
    const sizeofElemMatch = trimmed.match(/sizeof\s*\(\s*([a-zA-Z_]\w*)\s*\[\s*\d+\s*\]\s*\)/);
    if (sizeofElemMatch) {
      const arrName = sizeofElemMatch[1];
      if (arrays[arrName]) {
        return arrays[arrName].is2D
          ? arrays[arrName].cols * arrays[arrName].byteSize
          : arrays[arrName].byteSize;
      }
    }

    // Handle sizeof(arr) or sizeof(type)
    const sizeofMatch = trimmed.match(/sizeof\s*\(\s*([a-zA-Z_]\w*)\s*\)/);
    if (sizeofMatch) {
      const target = sizeofMatch[1];
      if (arrays[target]) {
        return arrays[target].length * arrays[target].byteSize;
      }
      if (TYPE_SIZES[target]) {
        return TYPE_SIZES[target];
      }
      if (scalars[target] !== undefined) {
        return 4;
      }
    }

    // Replace 2D array accesses like arr[i][j]
    let resolved = trimmed.replace(
      /([a-zA-Z_]\w*)\s*\[\s*([^\]]+)\s*\]\s*\[\s*([^\]]+)\s*\]/g,
      (_, name, rExpr, cExpr) => {
        const arr = arrays[name];
        if (!arr) return '0';
        const r = evalSimpleExpr(rExpr, localScope);
        const c = evalSimpleExpr(cExpr, localScope);
        const idx = r * arr.cols + c;
        if (r < 0 || r >= arr.rows || c < 0 || c >= arr.cols) {
          return '0';
        }
        arr.highlightedIndices.add(idx);
        const v = arr.values[idx];
        return typeof v === 'number' ? String(v) : Number(v) ? String(Number(v)) : '0';
      }
    );

    // Replace 1D array accesses like arr[i]
    resolved = resolved.replace(/([a-zA-Z_]\w*)\s*\[\s*([^\]]+)\s*\]/g, (_, name, idxExpr) => {
      const arr = arrays[name];
      if (!arr) return '0';
      const idx = evalSimpleExpr(idxExpr, localScope);
      if (idx < 0 || idx >= arr.length) {
        return '0';
      }
      arr.highlightedIndices.add(idx);
      const v = arr.values[idx];
      return typeof v === 'number' ? String(v) : Number(v) ? String(Number(v)) : '0';
    });

    // Replace variable names with values
    resolved = resolved.replace(/\b([a-zA-Z_]\w*)\b/g, (id) => {
      if (localScope[id] !== undefined) return String(localScope[id]);
      if (scalars[id] !== undefined) return String(scalars[id]);
      return '0';
    });

    // Safe arithmetic evaluation
    if (/^[0-9+\-*/%()\s.]+$/.test(resolved)) {
      try {
        const val = Function(`"use strict"; return (${resolved});`)();
        return typeof val === 'number' && !Number.isNaN(val) ? Math.trunc(val) : 0;
      } catch {
        return 0;
      }
    }
    return Number(resolved) || 0;
  };

  const parseValueToken = (rawToken: string, type: string, localScope: Record<string, number>): number | string => {
    const trimmed = rawToken.trim();
    if (type === 'char' && /^'.'$/.test(trimmed)) {
      return trimmed.slice(1, -1);
    }
    if (/^'.'$/.test(trimmed)) {
      return trimmed.slice(1, -1);
    }
    return evalSimpleExpr(trimmed, localScope);
  };

  const executeStatement = (stmt: string, lineIndex: number, localScope: Record<string, number> = {}) => {
    const s = stmt.trim().replace(/;$/, '').trim();
    if (!s || s.startsWith('#') || s.startsWith('using ') || s.startsWith('return')) return;

    // 1. 2D Array Declaration:
    // Supports int matriks[R][C]; or int matriks[R][C] = {{...}, {...}}; or int matriks[][C] = {...};
    const decl2D = s.match(
      /^(int|float|double|short|long|char)\s+([a-zA-Z_]\w*)\s*\[\s*(\d*)\s*\]\s*\[\s*(\d+)\s*\](?:\s*=\s*\{([\s\S]*)\})?$/
    );
    if (decl2D) {
      const [, type, name, rowsStr, colsStr, initBody] = decl2D;
      const cols = Math.min(Math.max(parseInt(colsStr, 10) || 1, 1), 12);

      // Parse nested row groups if present: {1, 2, 3}, {4, 5, 6}
      const rowGroups: string[][] = [];
      if (initBody !== undefined && /\{/.test(initBody)) {
        const groupRegex = /\{([^{}]*)\}/g;
        let match: RegExpExecArray | null;
        while ((match = groupRegex.exec(initBody)) !== null) {
          const items = match[1]
            .split(',')
            .map((x) => x.trim())
            .filter((x) => x.length > 0);
          rowGroups.push(items);
        }
      }

      const flatItems =
        initBody !== undefined && rowGroups.length === 0
          ? initBody
              .replace(/[{}]/g, ' ')
              .split(',')
              .map((x) => x.trim())
              .filter((x) => x.length > 0)
          : [];

      let inferredRows = rowsStr ? parseInt(rowsStr, 10) : 0;
      if (!inferredRows) {
        if (rowGroups.length > 0) {
          inferredRows = rowGroups.length;
        } else if (flatItems.length > 0) {
          inferredRows = Math.ceil(flatItems.length / cols);
        } else {
          inferredRows = 2;
        }
      }
      const rows = Math.min(Math.max(inferredRows, 1), 12);
      const total = rows * cols;
      const byteSize = TYPE_SIZES[type] || 4;
      const values: (number | string)[] = [];
      const isGarbageFlags: boolean[] = [];

      if (initBody !== undefined) {
        if (rowGroups.length > 0) {
          for (let r = 0; r < rows; r++) {
            const group = rowGroups[r] || [];
            for (let c = 0; c < cols; c++) {
              if (c < group.length) {
                values.push(parseValueToken(group[c], type, localScope));
              } else {
                values.push(type === 'char' ? '\\0' : 0);
              }
              isGarbageFlags.push(false);
            }
          }
        } else {
          for (let i = 0; i < total; i++) {
            if (i < flatItems.length) {
              values.push(parseValueToken(flatItems[i], type, localScope));
            } else {
              values.push(type === 'char' ? '\\0' : 0);
            }
            isGarbageFlags.push(false);
          }
        }
      } else {
        for (let i = 0; i < total; i++) {
          values.push(GARBAGE_POOL[i % GARBAGE_POOL.length]);
          isGarbageFlags.push(true);
        }
      }

      arrays[name] = {
        name,
        type,
        byteSize,
        is2D: true,
        rows,
        cols,
        length: total,
        values,
        isGarbageFlags,
        highlightedIndices: new Set<number>(),
        baseAddr: baseAddressHex + currentOffset,
        declOrder: ++declCounter,
      };
      currentOffset += total * byteSize;
      return;
    }

    // 2. 1D Array Declaration: int angka[5] = {10, 20, 30}; or int angka[] = {10, 20}; or int angka[5];
    const decl1D = s.match(
      /^(int|float|double|short|long|char)\s+([a-zA-Z_]\w*)\s*\[\s*(\d*)\s*\](?:\s*=\s*\{([^}]*)\})?$/
    );
    if (decl1D) {
      const [, type, name, lenStr, initBody] = decl1D;
      const byteSize = TYPE_SIZES[type] || 4;
      const initItems =
        initBody !== undefined
          ? initBody
              .split(',')
              .map((x) => x.trim())
              .filter((x) => x.length > 0)
          : [];

      const length = Math.min(
        Math.max(lenStr ? parseInt(lenStr, 10) : Math.max(initItems.length, 1), 1),
        32
      );
      const values: (number | string)[] = [];
      const isGarbageFlags: boolean[] = [];

      if (initBody !== undefined && initItems.length > length) {
        hasError = true;
        errorLine = lineIndex + 1;
        errorMessage = `Baris ${lineIndex + 1}: Terlalu banyak nilai inisialisasi untuk array '${name}[${length}]' (diberikan ${initItems.length} elemen).`;
      }

      for (let i = 0; i < length; i++) {
        if (initBody !== undefined) {
          if (i < initItems.length) {
            values.push(parseValueToken(initItems[i], type, localScope));
          } else {
            values.push(type === 'char' ? '\\0' : 0);
          }
          isGarbageFlags.push(false);
        } else {
          values.push(GARBAGE_POOL[i % GARBAGE_POOL.length]);
          isGarbageFlags.push(true);
        }
      }

      arrays[name] = {
        name,
        type,
        byteSize,
        is2D: false,
        rows: 1,
        cols: length,
        length,
        values,
        isGarbageFlags,
        highlightedIndices: new Set<number>(),
        baseAddr: baseAddressHex + currentOffset,
        declOrder: ++declCounter,
      };
      currentOffset += length * byteSize;
      return;
    }

    // 3. Scalar variable declaration: int n = sizeof(arr) / sizeof(arr[0]);
    const scalarDecl = s.match(/^(int|float|double|short|long|char)\s+([a-zA-Z_]\w*)(?:\s*=\s*(.+))?$/);
    if (scalarDecl) {
      const [, type, name, expr] = scalarDecl;
      const byteSize = TYPE_SIZES[type] || 4;
      const val = expr !== undefined ? evalSimpleExpr(expr, localScope) : Number(GARBAGE_POOL[0]) || 0;
      scalars[name] = val;

      memoryBlocks.push({
        address: toHexAddress(baseAddressHex, currentOffset),
        value: expr !== undefined ? val : 'GARBAGE',
        label: name,
        highlight: false,
        isGarbage: expr === undefined,
        dataType: type,
        byteSize,
        subLabel: 'Variabel Tunggal',
      });
      currentOffset += byteSize;
      return;
    }

    // 4. 2D Array element assignment: matriks[1][2] = 99;
    const assign2D = s.match(/^([a-zA-Z_]\w*)\s*\[\s*([^\]]+)\s*\]\s*\[\s*([^\]]+)\s*\]\s*=\s*(.+)$/);
    if (assign2D) {
      const [, name, rExpr, cExpr, valExpr] = assign2D;
      const arr = arrays[name];
      if (arr && arr.is2D) {
        const r = evalSimpleExpr(rExpr, localScope);
        const c = evalSimpleExpr(cExpr, localScope);
        const val = parseValueToken(valExpr, arr.type, localScope);
        if (r < 0 || r >= arr.rows || c < 0 || c >= arr.cols) {
          hasError = true;
          errorLine = lineIndex + 1;
          errorMessage = `PERINGATAN MEMORI (Baris ${lineIndex + 1}): Akses indeks di luar batas '${name}[${r}][${c}]'! Ukuran matriks adalah [${arr.rows}][${arr.cols}] (Indeks valid baris 0..${arr.rows - 1}, kolom 0..${arr.cols - 1}).`;
          memoryBlocks.push({
            address: toHexAddress(arr.baseAddr, (r * arr.cols + c) * arr.byteSize),
            value: `${val} (ILEGAL)`,
            label: `${name}[${r}][${c}]`,
            highlight: true,
            isError: true,
            dataType: arr.type,
            byteSize: arr.byteSize,
            subLabel: 'OUT OF BOUNDS 2D!',
          });
          return;
        }
        const idx = r * arr.cols + c;
        arr.values[idx] = val;
        arr.isGarbageFlags[idx] = false;
        arr.highlightedIndices.add(idx);
      }
      return;
    }

    // 5. 1D Array element assignment: nilai[2] = 100; or nilai[3] = 95;
    const assign1D = s.match(/^([a-zA-Z_]\w*)\s*\[\s*([^\]]+)\s*\]\s*=\s*(.+)$/);
    if (assign1D) {
      const [, name, idxExpr, valExpr] = assign1D;
      const arr = arrays[name];
      if (arr) {
        const idx = evalSimpleExpr(idxExpr, localScope);
        const val = parseValueToken(valExpr, arr.type, localScope);
        if (idx < 0 || idx >= arr.length) {
          hasError = true;
          errorLine = lineIndex + 1;
          errorMessage = `ERROR OUT-OF-BOUNDS (Baris ${lineIndex + 1}): Indeks '${name}[${idx}]' tidak valid! Indeks valid untuk '${name}[${arr.length}]' hanya 0 sampai ${arr.length - 1}.`;
          memoryBlocks.push({
            address: toHexAddress(arr.baseAddr, idx * arr.byteSize),
            value: `${val} (ILLEGAL)`,
            label: `${name}[${idx}]`,
            highlight: true,
            isError: true,
            dataType: arr.type,
            byteSize: arr.byteSize,
            subLabel: 'OUT OF BOUNDS!',
          });
          return;
        }
        arr.values[idx] = val;
        arr.isGarbageFlags[idx] = false;
        arr.highlightedIndices.add(idx);
      }
      return;
    }

    // 6. Scalar compound assignment: total += nilai[i];
    const scalarPlusAssign = s.match(/^([a-zA-Z_]\w*)\s*\+=\s*(.+)$/);
    if (scalarPlusAssign) {
      const [, name, expr] = scalarPlusAssign;
      const rhs = evalSimpleExpr(expr, localScope);
      if (localScope[name] !== undefined) {
        localScope[name] += rhs;
      } else if (scalars[name] !== undefined) {
        scalars[name] += rhs;
      }
      return;
    }

    const scalarAssign = s.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (scalarAssign) {
      const [, name, expr] = scalarAssign;
      const rhs = evalSimpleExpr(expr, localScope);
      if (localScope[name] !== undefined) {
        localScope[name] = rhs;
      } else {
        scalars[name] = rhs;
      }
      return;
    }

    // 7. printf statement: printf("...", args...)
    const printfMatch = s.match(/^printf\s*\(\s*"([^"]*)"(?:\s*,\s*(.+))?\s*\)$/);
    if (printfMatch) {
      const [, fmt, argsStr] = printfMatch;
      const args = argsStr
        ? argsStr.split(',').map((a) => {
            const trimmedArg = a.trim();
            // Check 2D out-of-bounds inside printf
            const arr2DAccess = trimmedArg.match(
              /^([a-zA-Z_]\w*)\s*\[\s*([^\]]+)\s*\]\s*\[\s*([^\]]+)\s*\]$/
            );
            if (arr2DAccess) {
              const [, arrName, rExpr, cExpr] = arr2DAccess;
              const arr = arrays[arrName];
              if (arr && arr.is2D) {
                const r = evalSimpleExpr(rExpr, localScope);
                const c = evalSimpleExpr(cExpr, localScope);
                if (r < 0 || r >= arr.rows || c < 0 || c >= arr.cols) {
                  hasError = true;
                  errorLine = lineIndex + 1;
                  errorMessage = `ERROR OUT-OF-BOUNDS (Baris ${lineIndex + 1}): Membaca '${arrName}[${r}][${c}]' di luar ukuran matriks [${arr.rows}][${arr.cols}].`;
                  return -858993460;
                }
                const idx = r * arr.cols + c;
                arr.highlightedIndices.add(idx);
                return arr.values[idx];
              }
            }

            // Check 1D out-of-bounds inside printf
            const arrAccess = trimmedArg.match(/^([a-zA-Z_]\w*)\s*\[\s*([^\]]+)\s*\]$/);
            if (arrAccess) {
              const [, arrName, idxExpr] = arrAccess;
              const arr = arrays[arrName];
              if (arr) {
                const idx = evalSimpleExpr(idxExpr, localScope);
                if (idx < 0 || idx >= arr.length) {
                  hasError = true;
                  errorLine = lineIndex + 1;
                  errorMessage = `ERROR OUT-OF-BOUNDS (Baris ${lineIndex + 1}): Membaca '${arrName}[${idx}]' di luar batas memori (indeks maksimum: ${arr.length - 1}). Mengembalikan nilai sampah (garbage value)!`;
                  memoryBlocks.push({
                    address: toHexAddress(arr.baseAddr, idx * arr.byteSize),
                    value: 'GARBAGE!',
                    label: `${arrName}[${idx}]`,
                    highlight: true,
                    isError: true,
                    dataType: arr.type,
                    byteSize: arr.byteSize,
                    subLabel: 'OUT OF BOUNDS READ',
                  });
                  return -858993460;
                }
                arr.highlightedIndices.add(idx);
                return arr.values[idx];
              }
            }
            return evalSimpleExpr(trimmedArg, localScope);
          })
        : [];

      let argIdx = 0;
      const formatted = fmt
        .replace(/%[dluifsc]/g, () => {
          const val = args[argIdx++];
          return val !== undefined ? String(val) : '0';
        })
        .replace(/\\n/g, '')
        .replace(/\\t/g, '  ');
      consoleOutput.push(formatted);
      return;
    }

    // 8. cout statement: cout << ...
    if (s.startsWith('cout') || s.startsWith('std::cout')) {
      const parts = s
        .replace(/^(?:std::)?cout\s*<<\s*/, '')
        .split('<<')
        .map((p) => p.trim())
        .filter((p) => p && p !== 'endl' && p !== 'std::endl' && p !== '"\\n"');

      const rendered = parts
        .map((p) => {
          if (p.startsWith('"') && p.endsWith('"')) {
            return p.slice(1, -1).replace(/\\n/g, '');
          }
          return String(evalSimpleExpr(p, localScope));
        })
        .join('');
      consoleOutput.push(rendered);
    }
  };

  // Join multi-line array declarations before line-by-line execution
  const normalizedLines: { text: string; origLine: number }[] = [];
  let buffer = '';
  let bufferStartLine = 0;
  let openBracesInDecl = 0;

  for (let i = 0; i < cleanLines.length; i++) {
    const line = cleanLines[i];
    if (!line) continue;
    if (
      line.startsWith('int main') ||
      line.startsWith('void main') ||
      line.startsWith('#include') ||
      line.startsWith('using namespace')
    ) {
      continue;
    }

    if (openBracesInDecl > 0) {
      buffer += ' ' + line;
      openBracesInDecl += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (openBracesInDecl <= 0 && line.endsWith(';')) {
        normalizedLines.push({ text: buffer.trim(), origLine: bufferStartLine });
        buffer = '';
        openBracesInDecl = 0;
      }
      continue;
    }

    // Multi-line array initializer start
    if (/^(int|float|double|short|long|char)\s+[a-zA-Z_]\w*\s*\[/.test(line) && !line.endsWith(';')) {
      buffer = line;
      bufferStartLine = i;
      openBracesInDecl = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (openBracesInDecl <= 0) openBracesInDecl = 1;
      continue;
    }

    normalizedLines.push({ text: line, origLine: i });
  }

  // Helper to collect a loop body with proper brace depth matching
  const extractLoopBlock = (
    lines: { text: string; origLine: number }[],
    forLineIndex: number
  ): { body: { text: string; origLine: number }[]; nextIndex: number } => {
    const header = lines[forLineIndex].text;
    const body: { text: string; origLine: number }[] = [];
    let braceDepth = (header.match(/\{/g) || []).length - (header.match(/\}/g) || []).length;
    let j = forLineIndex + 1;

    if (braceDepth === 0 && j < lines.length && lines[j].text.startsWith('{')) {
      braceDepth += (lines[j].text.match(/\{/g) || []).length - (lines[j].text.match(/\}/g) || []).length;
      const stripped = lines[j].text.replace(/^\{/, '').trim();
      if (stripped) {
        body.push({ text: stripped, origLine: lines[j].origLine });
      }
      j++;
    }

    if (braceDepth > 0) {
      while (j < lines.length && braceDepth > 0) {
        const cur = lines[j].text;
        const opens = (cur.match(/\{/g) || []).length;
        const closes = (cur.match(/\}/g) || []).length;
        braceDepth += opens - closes;

        if (braceDepth <= 0) {
          const cleaned = cur.replace(/\}\s*$/, '').trim();
          if (cleaned) {
            body.push({ text: cleaned, origLine: lines[j].origLine });
          }
          j++;
          break;
        } else {
          body.push(lines[j]);
          j++;
        }
      }
      return { body, nextIndex: j };
    }

    // Braceless single-statement for-loop
    if (j < lines.length) {
      body.push(lines[j]);
      return { body, nextIndex: j + 1 };
    }
    return { body, nextIndex: j };
  };

  const runLinesBlock = (
    blockLines: { text: string; origLine: number }[],
    localScope: Record<string, number> = {}
  ) => {
    for (let idx = 0; idx < blockLines.length; idx++) {
      const { text: line, origLine } = blockLines[idx];
      if (line === '{' || line === '}') continue;

      const forMatch = line.match(
        /^for\s*\(\s*(?:int\s+)?([a-zA-Z_]\w*)\s*=\s*([^;]+);\s*\1\s*(<|<=|>|>=)\s*([^;]+);\s*\1(\+\+|--|\+=\s*\d+)\s*\)/
      );

      if (forMatch) {
        const [, loopVar, startExpr, cmpOp, limitExpr] = forMatch;
        const startVal = evalSimpleExpr(startExpr, localScope);
        const limitVal = evalSimpleExpr(limitExpr, localScope);
        const { body, nextIndex } = extractLoopBlock(blockLines, idx);

        const maxSteps = 64;
        let steps = 0;
        for (
          let v = startVal;
          (cmpOp === '<'
            ? v < limitVal
            : cmpOp === '<='
            ? v <= limitVal
            : cmpOp === '>'
            ? v > limitVal
            : v >= limitVal) && steps < maxSteps;
          cmpOp === '>' || cmpOp === '>=' ? v-- : v++, steps++
        ) {
          runLinesBlock(body, { ...localScope, [loopVar]: v });
        }

        idx = nextIndex - 1;
        continue;
      }

      executeStatement(line, origLine, localScope);
    }
  };

  runLinesBlock(normalizedLines);

  // Convert parsed arrays into UniversalRAMVisualizer memory blocks.
  // If multiple arrays are declared in the code editor, prioritize the most recently
  // declared 2D array (when 2D arrays exist) or most recently declared array so the
  // interactive visualizer always reflects the newest array declaration in the code box!
  const arrayList = Object.values(arrays).sort((a, b) => a.declOrder - b.declOrder);
  if (arrayList.length > 0) {
    const errorBlocks = memoryBlocks.filter((b) => b.isError);
    memoryBlocks.length = 0;

    // Put the newest declared array first so visualizers bound to memoryBlocks[0..]
    // immediately follow the newly declared array in the code box.
    const prioritizedArrays = [...arrayList].reverse();

    for (const arr of prioritizedArrays) {
      for (let i = 0; i < arr.length; i++) {
        const row = arr.is2D ? Math.floor(i / arr.cols) : 0;
        const col = arr.is2D ? i % arr.cols : i;
        const label = arr.is2D ? `${arr.name}[${row}][${col}]` : `${arr.name}[${i}]`;
        const subLabel = arr.is2D
          ? `Baris ${row}, Kolom ${col} (Offset +${i * arr.byteSize}B)`
          : `Indeks ke-${i} (${arr.byteSize} Byte)`;

        memoryBlocks.push({
          address: toHexAddress(arr.baseAddr, i * arr.byteSize),
          value: arr.values[i],
          label,
          highlight: arr.highlightedIndices.has(i),
          isGarbage: arr.isGarbageFlags[i],
          dataType: arr.type,
          byteSize: arr.byteSize,
          subLabel,
          row,
          col,
        });
      }
    }

    memoryBlocks.push(...errorBlocks);
  }

  // Compute stats for the latest declared array
  const activeArr = arrayList.length > 0 ? arrayList[arrayList.length - 1] : undefined;
  const stats = activeArr
    ? {
        totalBytes: activeArr.length * activeArr.byteSize,
        elementCount: activeArr.length,
        dataType: activeArr.type,
        bytePerElement: activeArr.byteSize,
        dimensions: {
          rows: activeArr.rows,
          cols: activeArr.cols,
          is2D: activeArr.is2D,
          arrayName: activeArr.name,
        },
      }
    : {
        totalBytes: memoryBlocks.reduce((acc, b) => acc + (b.byteSize || 4), 0),
        elementCount: memoryBlocks.length,
        dataType: 'int',
        bytePerElement: 4,
        dimensions: {
          rows: 1,
          cols: Math.max(memoryBlocks.length, 1),
          is2D: false,
          arrayName: 'arr',
        },
      };

  if (consoleOutput.length === 0 && !hasError) {
    consoleOutput.push('[Kompilasi Berhasil] Program dieksekusi dengan status return 0.');
  }

  return {
    consoleOutput,
    memoryBlocks,
    hasError,
    errorMessage,
    errorLine,
    stats,
  };
}
