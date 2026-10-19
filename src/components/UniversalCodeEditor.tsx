import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, FileCode, AlertTriangle } from 'lucide-react';

export interface UniversalCodeEditorProps {
  initialCode: string;
  code?: string;
  readOnly?: boolean;
  onChange?: (newCode: string) => void;
  onRun?: (currentCode: string) => void;
  onReset?: () => void;
  fileName?: string;
  errorLine?: number;
  errorMessage?: string;
}

export const UniversalCodeEditor: React.FC<UniversalCodeEditorProps> = ({
  initialCode,
  code: controlledCode,
  readOnly = false,
  onChange,
  onRun,
  onReset,
  fileName = 'praktikum_daspro.c',
  errorLine,
  errorMessage,
}) => {
  const [internalCode, setInternalCode] = useState<string>(controlledCode ?? initialCode);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (controlledCode !== undefined) {
      setInternalCode(controlledCode);
    }
  }, [controlledCode]);

  useEffect(() => {
    setInternalCode(initialCode);
  }, [initialCode]);

  const currentCode = controlledCode !== undefined ? controlledCode : internalCode;
  const lines = currentCode.split('\n');

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const nextVal = e.target.value;
    setInternalCode(nextVal);
    onChange?.(nextVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun?.(currentCode);
      return;
    }
    if (e.key === 'Tab' && !readOnly) {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = currentCode.substring(0, start) + '    ' + currentCode.substring(end);
      setInternalCode(updated);
      onChange?.(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => {
    setInternalCode(initialCode);
    onChange?.(initialCode);
    onReset?.();
  };

  return (
    <div className="border border-slate-300 bg-white rounded-sm flex flex-col overflow-hidden shadow-xs">
      {/* Top IDE Editor Tab & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[#0F2D43] border-b-2 border-[#770707]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border-t-2 border-t-[#770707] text-xs font-mono font-bold text-[#0F2D43] rounded-xs whitespace-nowrap shrink-0">
            <FileCode className="w-3.5 h-3.5 text-[#770707]" />
            <span>{fileName}</span>
          </div>
          <span className="text-[11px] font-mono text-sky-200 hidden sm:inline whitespace-nowrap shrink-0">
            GCC C11 · {readOnly ? 'Mode Baca Saja' : 'Mode Interaktif'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0F2D43] bg-white hover:bg-slate-100 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Salin kode C"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0F2D43] bg-white hover:bg-slate-100 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Kembalikan ke kode awal modul"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Kode</span>
            </button>
          )}

          {onRun && (
            <button
              type="button"
              onClick={() => onRun(currentCode)}
              className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold text-white bg-[#770707] hover:bg-[#5a0505] border border-red-300/40 rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Eksekusi kode C dan perbarui RAM (Ctrl + Enter)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Jalankan Kode</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Code Area with Synchronized Line Numbers on Crisp White Canvas */}
      <div className="relative flex font-mono text-[13px] leading-6 bg-white min-h-[240px]">
        {/* Gutter / Line Numbers */}
        <div
          aria-hidden="true"
          className="select-none py-3 px-2.5 bg-[#F8FAFC] border-r border-slate-200 text-right text-slate-500 min-w-[44px] tabular-nums"
        >
          {lines.map((_, idx) => {
            const lineNum = idx + 1;
            const isErrLine = errorLine === lineNum;
            return (
              <div
                key={lineNum}
                className={`px-1 ${
                  isErrLine ? 'bg-[#770707] text-white font-bold' : ''
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Editable Textarea */}
        <div className="relative flex-1 overflow-x-auto">
          <textarea
            value={currentCode}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label="Editor Kode C Dasar Pemrograman"
            className={`w-full h-full min-h-[240px] py-3 px-4 bg-white text-[#0F2D43] font-mono text-[13px] font-medium leading-6 focus:outline-none resize-y selection:bg-[#770707] selection:text-white ${
              readOnly ? 'cursor-default opacity-90' : ''
            }`}
            rows={Math.max(lines.length + 1, 10)}
          />
        </div>
      </div>

      {/* Error Diagnostic Banner (ITLG Crimson Red #770707) */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 px-4 py-2.5 bg-[#770707] border-t border-red-900 text-xs text-white">
          <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0 mt-0.5" />
          <div className="font-mono leading-relaxed">
            <span className="font-bold uppercase tracking-wider mr-2">[PERINGATAN KOMPILATOR / MEMORI]</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F8FAFC] border-t border-slate-200 text-[11px] font-mono text-[#0F2D43]">
        <div className="flex items-center gap-3">
          <span>Baris: {lines.length}</span>
          <span>·</span>
          <span>Karakter: {currentCode.length}</span>
          <span>·</span>
          <span className="text-[#770707] font-semibold">Pintasan: Ctrl + Enter untuk Eksekusi</span>
        </div>
        <div className="font-semibold text-[#1A5187]">UTF-8 · C / C++ (Daspro ITLG)</div>
      </div>
    </div>
  );
};

export default UniversalCodeEditor;
