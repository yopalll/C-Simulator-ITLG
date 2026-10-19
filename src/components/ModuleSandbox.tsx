import React, { useState, useEffect } from 'react';
import {
  Play,
  SkipForward,
  RotateCcw,
  AlertOctagon,
  CheckCircle2,
  Grid,
  Cpu,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import { CurriculumModule, MemoryBlock } from '../types/curriculum';

interface ModuleSandboxProps {
  module: CurriculumModule;
  memoryBlocks: MemoryBlock[];
  onApplyCodePreset: (newCode: string) => void;
}

const ROW_BADGE_STYLES = [
  'bg-white border-[#1A5187] text-[#0F2D43] hover:border-[#770707]',
  'bg-[#F8FAFC] border-[#0F2D43] text-[#0F2D43] hover:border-[#770707]',
  'bg-white border-[#770707]/60 text-[#0F2D43] hover:border-[#770707]',
];

export const ModuleSandbox: React.FC<ModuleSandboxProps> = ({
  module,
  memoryBlocks,
  onApplyCodePreset,
}) => {
  const [m1Mode, setM1Mode] = useState<'array' | 'scalar'>('array');
  const [m2InitMode, setM2InitMode] = useState<'kosong' | 'otomatis' | 'lengkap'>('lengkap');
  const [m3TargetIndex, setM3TargetIndex] = useState<number>(1);
  const [m3NewValue, setM3NewValue] = useState<number>(95);
  const [loopIndex, setLoopIndex] = useState<number>(0);
  const [isLoopPlaying, setIsLoopPlaying] = useState<boolean>(false);
  const [m5Type, setM5Type] = useState<'int' | 'double' | 'short' | 'char'>('int');
  const [m5Count, setM5Count] = useState<number>(6);
  const [m6Row, setM6Row] = useState<number>(0);
  const [m6Col, setM6Col] = useState<number>(0);

  useEffect(() => {
    setIsLoopPlaying(false);
    setLoopIndex(0);
  }, [module.id]);

  const validBlocks = memoryBlocks.filter((b) => !b.isError);
  const loopMax = Math.max(validBlocks.length, 1);

  useEffect(() => {
    if (!isLoopPlaying) return;
    const timer = setInterval(() => {
      setLoopIndex((prev) => {
        if (prev >= loopMax) {
          setIsLoopPlaying(false);
          return loopMax;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(timer);
  }, [isLoopPlaying, loopMax]);

  const renderKonsepDasarSandbox = () => {
    const applyScalarCode = () => {
      setM1Mode('scalar');
      onApplyCodePreset(`#include <stdio.h>

int main() {
    // 6 Variabel Terpisah (Tidak efisien & tidak bisa di-loop)
    int angka1 = 10;
    int angka2 = 20;
    int angka3 = 30;
    int angka4 = 40;
    int angka5 = 50;
    int angka6 = 60;

    printf("angka1 = %d, angka6 = %d\\n", angka1, angka6);
    return 0;
}`);
    };

    const applyArrayCode = () => {
      setM1Mode('array');
      onApplyCodePreset(module.initialCode);
    };

    const currentItems =
      validBlocks.length > 0 ? validBlocks : module.defaultMemoryBlocks;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-[#0F2D43]">
            Bandingkan deklarasi variabel skalar terpisah dengan 1 deklarasi Array kontigu:
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={applyScalarCode}
              className={`px-3 py-1.5 text-xs font-mono border rounded-sm transition-colors cursor-pointer ${
                m1Mode === 'scalar'
                  ? 'bg-[#770707] border-[#770707] text-white font-bold'
                  : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#770707]'
              }`}
            >
              Tanpa Array (int angka1..angka6)
            </button>
            <button
              type="button"
              onClick={applyArrayCode}
              className={`px-3 py-1.5 text-xs font-mono border rounded-sm transition-colors cursor-pointer ${
                m1Mode === 'array'
                  ? 'bg-[#1A5187] border-[#1A5187] text-white font-bold'
                  : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#1A5187]'
              }`}
            >
              Dengan Array (int angka[6])
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 border-2 rounded-sm ${
              m1Mode === 'scalar'
                ? 'bg-[#F8FAFC] border-[#770707]'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase text-[#770707]">
                Pendekatan Konvensional: Banyak Nama Variabel
              </span>
              <span className="text-[11px] font-mono text-slate-500">Tidak Terindeks</span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {currentItems.slice(0, 6).map((b, i) => (
                <div
                  key={i}
                  className="p-2 bg-white border border-slate-300 rounded-sm text-center"
                >
                  <div className="text-slate-500 text-[11px]">angka{i + 1}</div>
                  <div className="text-[#0F2D43] font-bold text-sm tabular-nums">
                    {String(b.value)}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-700">
              Kelemahan: Jika ada 1000 data mahasiswa, kita harus mengetik 1000 nama variabel berbeda dan tidak bisa memakai perulangan <code className="text-[#770707] font-bold">for</code>.
            </p>
          </div>

          <div
            className={`p-4 border-2 rounded-sm ${
              m1Mode === 'array'
                ? 'bg-[#F8FAFC] border-[#1A5187]'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase text-[#1A5187]">
                Pendekatan Array: 1 Nama + Indeks [0..{currentItems.length - 1}]
              </span>
              <span className="text-[11px] font-mono font-bold text-[#0F2D43]">Kontigu di RAM</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 font-mono text-xs">
              {currentItems.map((b, i) => (
                <div
                  key={i}
                  className="p-2 bg-[#1A5187] text-white rounded-sm text-center"
                >
                  <div className="text-sky-200 text-[10px] truncate">{b.label}</div>
                  <div className="font-bold text-sm tabular-nums">
                    {String(b.value)}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-700">
              Keunggulan: Hanya satu identifier, seluruh elemen bersebelahan di memori, dan langsung mengikuti perubahan deklarasi di kotak kode.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderInisialisasiSandbox = () => {
    const selectMode = (mode: 'kosong' | 'otomatis' | 'lengkap') => {
      setM2InitMode(mode);
      if (mode === 'kosong') {
        onApplyCodePreset(`#include <stdio.h>

int main() {
    // 1. INISIALISASI KOSONG (Hanya Deklarasi Ukuran)
    // Elemen berisi nilai sampah (Garbage Value) dari residu RAM!
    int angka[5];

    printf("angka[0] (Garbage) = %d\\n", angka[0]);
    printf("angka[1] (Garbage) = %d\\n", angka[1]);

    return 0;
}`);
      } else if (mode === 'otomatis') {
        onApplyCodePreset(`#include <stdio.h>

int main() {
    // 2. INISIALISASI SEBAGIAN / OTOMATIS
    // Indeks 0 dan 1 diisi, sedangkan indeks 2, 3, 4 otomatis bernilai 0!
    int angka[5] = {100, 200};

    printf("angka[0] = %d\\n", angka[0]);
    printf("angka[1] = %d\\n", angka[1]);
    printf("angka[2] (Otomatis Nol) = %d\\n", angka[2]);
    printf("angka[4] (Otomatis Nol) = %d\\n", angka[4]);

    return 0;
}`);
      } else {
        onApplyCodePreset(module.initialCode);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-[#0F2D43]">
            Pilih metode inisialisasi atau ubah langsung di kotak kode:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => selectMode('kosong')}
              className={`px-3 py-1.5 text-xs font-mono border rounded-sm cursor-pointer ${
                m2InitMode === 'kosong'
                  ? 'bg-[#770707] border-[#770707] text-white font-bold'
                  : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#770707]'
              }`}
            >
              1. Kosong: int angka[5];
            </button>
            <button
              type="button"
              onClick={() => selectMode('otomatis')}
              className={`px-3 py-1.5 text-xs font-mono border rounded-sm cursor-pointer ${
                m2InitMode === 'otomatis'
                  ? 'bg-[#1A5187] border-[#1A5187] text-white font-bold'
                  : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#1A5187]'
              }`}
            >
              2. Otomatis/Sebagian: int angka[5] = &#123;100, 200&#125;;
            </button>
            <button
              type="button"
              onClick={() => selectMode('lengkap')}
              className={`px-3 py-1.5 text-xs font-mono border rounded-sm cursor-pointer ${
                m2InitMode === 'lengkap'
                  ? 'bg-[#0F2D43] border-[#0F2D43] text-white font-bold'
                  : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#0F2D43]'
              }`}
            >
              3. Lengkap: int angka[5] = &#123;15, 30, 45, 60, 75&#125;;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {validBlocks.map((b, idx) => (
            <div
              key={idx}
              className={`p-3 border-2 rounded-sm font-mono ${
                b.isGarbage
                  ? 'bg-amber-50 border-amber-500 text-amber-950'
                  : 'bg-white border-[#1A5187] text-[#0F2D43]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                <span className="text-[#770707]">{b.label}</span>
                <span className="text-slate-500">{b.address}</span>
              </div>
              <div className="text-base font-extrabold truncate tabular-nums">{String(b.value)}</div>
              <div className="text-[10px] mt-1 font-semibold">
                {b.isGarbage ? 'GARBAGE VALUE' : 'TERINISIALISASI'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAksesModifikasiSandbox = () => {
    const arrLen = Math.max(validBlocks.length, 3);
    const firstLabel = validBlocks[0]?.label || 'nilai[0]';
    const arrName = firstLabel.split('[')[0] || 'nilai';
    const errorBlock = memoryBlocks.find((b) => b.isError);
    const isOutOfBounds = Boolean(errorBlock) || m3TargetIndex < 0 || m3TargetIndex >= arrLen;

    const triggerTestInEditor = (targetIdx: number, val: number) => {
      setM3TargetIndex(targetIdx);
      setM3NewValue(val);
      onApplyCodePreset(`#include <stdio.h>

int main() {
    int ${arrName}[3] = {70, 80, 90};

    // Menguji akses/modifikasi pada indeks ke-${targetIdx}:
    ${arrName}[${targetIdx}] = ${val};

    printf("${arrName}[0] = %d\\n", ${arrName}[0]);
    printf("${arrName}[1] = %d\\n", ${arrName}[1]);
    printf("${arrName}[2] = %d\\n", ${arrName}[2]);

    return 0;
}`);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-medium text-[#0F2D43]">
            Array aktif: <code className="font-mono font-bold text-[#1A5187]">{arrName}[{arrLen}]</code> (Indeks sah: 0 s/d {arrLen - 1}). Uji operasi tulis:
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[0, 1, 2, arrLen, arrLen + 1].map((idx) => {
              const invalid = idx >= arrLen;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => triggerTestInEditor(idx, invalid ? 100 : 95)}
                  className={`px-3 py-1.5 text-xs font-mono border rounded-sm transition-colors cursor-pointer ${
                    m3TargetIndex === idx
                      ? invalid
                        ? 'bg-[#770707] border-[#770707] text-white font-bold'
                        : 'bg-[#1A5187] border-[#1A5187] text-white font-bold'
                      : invalid
                      ? 'bg-red-50 border-[#770707] text-[#770707] font-semibold hover:bg-[#770707] hover:text-white'
                      : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#1A5187]'
                  }`}
                >
                  Uji {arrName}[{idx}] = {invalid ? '100 (ERROR!)' : '95'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {validBlocks.map((blk, idx) => {
            const isTarget = m3TargetIndex === idx || blk.highlight;
            return (
              <div
                key={idx}
                className={`p-3.5 border-2 rounded-sm font-mono ${
                  isTarget
                    ? 'bg-[#1A5187] border-[#0F2D43] text-white'
                    : 'bg-white border-slate-300 text-[#0F2D43]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold">{blk.label}</span>
                  <span className="text-[11px] opacity-80">{blk.address}</span>
                </div>
                <div className="text-xl font-extrabold tabular-nums">{String(blk.value)}</div>
                <div className="mt-2 text-[11px] flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Indeks Valid (0..{arrLen - 1})</span>
                </div>
              </div>
            );
          })}

          <div
            onClick={() => triggerTestInEditor(arrLen, 100)}
            className={`p-3.5 border-2 rounded-sm font-mono cursor-pointer transition-colors ${
              isOutOfBounds
                ? 'bg-[#770707] border-[#0F2D43] text-white ring-2 ring-[#770707]'
                : 'bg-red-50 border-[#770707] text-[#770707] hover:bg-[#770707] hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold">
                {errorBlock ? errorBlock.label : `${arrName}[${arrLen}]`}
              </span>
              <span className="text-[11px]">
                {errorBlock ? errorBlock.address : `0x${(0x7ffe00 + arrLen * 4).toString(16)}`}
              </span>
            </div>
            <div className="text-xl font-extrabold">
              {errorBlock
                ? String(errorBlock.value)
                : isOutOfBounds
                ? `${m3NewValue} (ILEGAL!)`
                : 'MEMORI LUAR'}
            </div>
            <div className="mt-2 text-[11px] flex items-center gap-1 font-bold">
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              <span>OUT OF BOUNDS!</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIterasiLoopSandbox = () => {
    const activeBlocks = validBlocks.length > 0 ? validBlocks : module.defaultMemoryBlocks;
    const n = activeBlocks.length;
    const activeValues = activeBlocks.map((b) => Number(b.value) || 0);
    const arrName = (activeBlocks[0]?.label || 'skor[0]').split('[')[0];
    const clampedLoopIdx = Math.min(loopIndex, n);
    const partialSum = activeValues
      .slice(0, Math.min(clampedLoopIdx + 1, n))
      .reduce((acc, v) => acc + v, 0);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs text-[#0F2D43] bg-[#F8FAFC] px-3 py-1.5 border border-slate-300 rounded-sm">
            <span className="text-[#1A5187] font-bold">for</span> (int{' '}
            <strong className="text-[#770707]">i = {clampedLoopIdx}</strong>;{' '}
            <strong className={clampedLoopIdx < n ? 'text-emerald-700' : 'text-[#770707]'}>
              {clampedLoopIdx} &lt; {n} ({clampedLoopIdx < n ? 'TRUE' : 'FALSE - BERHENTI'})
            </strong>
            ; i++)
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (clampedLoopIdx >= n) setLoopIndex(0);
                setIsLoopPlaying((p) => !p);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#770707] hover:bg-[#5a0505] text-white text-xs font-bold rounded-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isLoopPlaying ? 'Jeda Animasi' : 'Jalankan Otomatis'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLoopPlaying(false);
                setLoopIndex((prev) => (prev < n ? prev + 1 : 0));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A5187] hover:bg-[#0F2D43] text-white text-xs font-mono font-bold rounded-sm cursor-pointer"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Step i++</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsLoopPlaying(false);
                setLoopIndex(0);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-[#0F2D43] text-xs font-mono font-semibold rounded-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {activeBlocks.map((blk, idx) => {
            const isCurrent = clampedLoopIdx === idx;
            const isVisited = idx < clampedLoopIdx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setIsLoopPlaying(false);
                  setLoopIndex(idx);
                }}
                className={`p-3 border-2 rounded-sm font-mono cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-[#770707] border-[#770707] text-white ring-2 ring-[#770707]/40'
                    : isVisited
                    ? 'bg-[#1A5187] border-[#1A5187] text-white'
                    : 'bg-white border-slate-300 text-[#0F2D43]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold">i = {idx}</span>
                  <span>{blk.label}</span>
                </div>
                <div className="text-lg font-extrabold tabular-nums">
                  {String(blk.value)}
                </div>
                <div className="text-[10px] mt-1 font-semibold">
                  {isCurrent ? 'SEDANG DIAKSES' : isVisited ? 'SELESAI DIBACA' : 'MENUNGGU'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#F8FAFC] border border-slate-300 rounded-sm flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#0F2D43]">
          <div>
            {clampedLoopIdx < n ? (
              <span>
                Siklus ke-{clampedLoopIdx + 1}: Mengambil{' '}
                <strong className="text-[#770707]">
                  {arrName}[{clampedLoopIdx}] = {activeValues[clampedLoopIdx]}
                </strong>
              </span>
            ) : (
              <span className="text-[#770707] font-bold">
                Loop Selesai! Karena i = {n}, kondisi ({n} &lt; {n}) bernilai FALSE sehingga keluar dari perulangan.
              </span>
            )}
          </div>
          <div>
            Akumulator{' '}
            <strong className="text-[#1A5187]">
              total = {clampedLoopIdx < n ? partialSum : activeValues.reduce((a, b) => a + b, 0)}
            </strong>
          </div>
        </div>
      </div>
    );
  };

  const renderSizeofSandbox = () => {
    const byteMap: Record<'int' | 'double' | 'short' | 'char', number> = {
      int: 4,
      double: 8,
      short: 2,
      char: 1,
    };
    const liveDataType = (validBlocks[0]?.dataType as 'int' | 'double' | 'short' | 'char') || m5Type;
    const elemBytes = validBlocks[0]?.byteSize || byteMap[liveDataType] || 4;
    const liveCount = validBlocks.length > 0 ? validBlocks.length : m5Count;
    const totalBytes = elemBytes * liveCount;
    const arrName = (validBlocks[0]?.label || 'data[0]').split('[')[0];

    const syncToEditor = (type: 'int' | 'double' | 'short' | 'char', count: number) => {
      setM5Type(type);
      setM5Count(count);
      const sampleItems = Array.from({ length: count }, (_, i) => (i + 1) * 5).join(', ');
      onApplyCodePreset(`#include <stdio.h>

int main() {
    ${type} ${arrName}[${count}] = {${sampleItems}};

    int totalByte = sizeof(${arrName});
    int byteElemen = sizeof(${arrName}[0]);
    int panjang = sizeof(${arrName}) / sizeof(${arrName}[0]);

    printf("Ukuran total array (sizeof(${arrName}))   : %d byte\\n", totalByte);
    printf("Ukuran 1 elemen    (sizeof(${arrName}[0])): %d byte\\n", byteElemen);
    printf("Jumlah elemen      (panjang array)  : %d elemen\\n", panjang);

    return 0;
}`);
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#0F2D43] mr-1">Tipe Data:</span>
            {(['int', 'double', 'short', 'char'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => syncToEditor(t, liveCount)}
                className={`px-3 py-1 text-xs font-mono border rounded-sm cursor-pointer ${
                  liveDataType === t
                    ? 'bg-[#770707] border-[#770707] text-white font-bold'
                    : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#770707]'
                }`}
              >
                {t} ({byteMap[t]}B)
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sizeof-count-slider" className="text-xs font-mono font-semibold text-[#0F2D43]">
              Jumlah Elemen (N): <strong className="text-[#770707]">{liveCount}</strong>
            </label>
            <input
              id="sizeof-count-slider"
              type="range"
              min={2}
              max={10}
              value={Math.min(Math.max(liveCount, 2), 10)}
              onChange={(e) => syncToEditor(liveDataType, Number(e.target.value))}
              className="accent-[#770707] cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
          <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#1A5187] rounded-sm">
            <div className="text-[11px] font-bold text-[#1A5187]">1. Total Kapasitas Array</div>
            <div className="text-xs text-[#0F2D43] font-semibold mt-0.5">sizeof({arrName})</div>
            <div className="text-2xl font-extrabold text-[#0F2D43] mt-1 tabular-nums">
              {totalBytes} Byte
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              {liveCount} elemen × {elemBytes} Byte
            </div>
          </div>

          <div className="p-3.5 bg-[#F8FAFC] border-2 border-[#0F2D43] rounded-sm">
            <div className="text-[11px] font-bold text-[#0F2D43]">2. Ukuran Satu Elemen</div>
            <div className="text-xs text-[#1A5187] font-semibold mt-0.5">sizeof({arrName}[0])</div>
            <div className="text-2xl font-extrabold text-[#0F2D43] mt-1 tabular-nums">
              {elemBytes} Byte
            </div>
            <div className="text-[11px] text-slate-600 mt-1">
              Tipe {liveDataType} = {elemBytes * 8} bit
            </div>
          </div>

          <div className="p-3.5 bg-[#770707] border-2 border-[#770707] text-white rounded-sm">
            <div className="text-[11px] text-red-100 font-bold">3. Rumus Panjang Array</div>
            <div className="text-xs text-white font-semibold mt-0.5">
              sizeof({arrName}) / sizeof({arrName}[0])
            </div>
            <div className="text-2xl font-extrabold text-white mt-1 tabular-nums">
              {totalBytes} / {elemBytes} = {liveCount} Elemen
            </div>
            <div className="text-[11px] text-red-100 mt-1">
              Aman untuk batas for-loop dinamis
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderArray2DSandbox = () => {
    const sourceBlocks = validBlocks.length > 0 ? validBlocks : module.defaultMemoryBlocks;

    const primaryLabel = sourceBlocks[0]?.label || 'matriks[0][0]';
    const arrayName = primaryLabel.split('[')[0] || 'matriks';
    const activeArrayBlocks = sourceBlocks.filter((b) =>
      b.label.startsWith(`${arrayName}[`)
    );

    const blocksToRender =
      activeArrayBlocks.length > 0 ? activeArrayBlocks : sourceBlocks;

    const maxRow = blocksToRender.reduce((max, b) => Math.max(max, b.row ?? 0), 0);
    const maxCol = blocksToRender.reduce((max, b) => Math.max(max, b.col ?? 0), 0);
    const rows = Math.max(maxRow + 1, 1);
    const cols = Math.max(maxCol + 1, 1);
    const byteSize = blocksToRender[0]?.byteSize || 4;
    const dataType = blocksToRender[0]?.dataType || 'int';

    const safeRow = Math.min(m6Row, rows - 1);
    const safeCol = Math.min(m6Col, cols - 1);
    const flatIndex = safeRow * cols + safeCol;
    const selectedBlock = blocksToRender[flatIndex] || blocksToRender[0];
    const byteOffset = flatIndex * byteSize;
    const hexAddr =
      selectedBlock?.address || '0x' + (0x7ffe00 + byteOffset).toString(16);

    const applyDimensionPreset = (presetRows: number, presetCols: number) => {
      setM6Row(0);
      setM6Col(0);
      const rowStrings: string[] = [];
      for (let r = 0; r < presetRows; r++) {
        const vals: number[] = [];
        for (let c = 0; c < presetCols; c++) {
          vals.push((r + 1) * 10 + (c + 1));
        }
        rowStrings.push(`        {${vals.join(', ')}}`);
      }

      onApplyCodePreset(`#include <stdio.h>

int main() {
    // Matriks ${presetRows} Baris x ${presetCols} Kolom (Total ${presetRows * presetCols} elemen di RAM)
    int ${arrayName}[${presetRows}][${presetCols}] = {
${rowStrings.join(',\n')}
    };

    printf("Elemen [0][0] = %d\\n", ${arrayName}[0][0]);
    printf("Elemen [${presetRows - 1}][${presetCols - 1}] = %d\\n", ${arrayName}[${presetRows - 1}][${presetCols - 1}]);

    return 0;
}`);
    };

    return (
      <div className="space-y-4">
        {/* Top Live Status & Quick Dimension Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-600 font-semibold">Terdeteksi dari Kotak Kode:</span>
            <span className="px-2 py-0.5 bg-[#770707] text-white font-bold rounded-sm">
              {dataType} {arrayName}[{rows}][{cols}]
            </span>
            <span className="text-[#0F2D43] font-semibold">
              ({rows} Baris × {cols} Kolom = {blocksToRender.length} Elemen)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#0F2D43] mr-1">Uji Ukuran Cepat:</span>
            {[
              { r: 2, c: 3, label: '2×3' },
              { r: 3, c: 3, label: '3×3' },
              { r: 3, c: 4, label: '3×4' },
              { r: 4, c: 2, label: '4×2' },
            ].map((preset) => {
              const isCurrentDim = rows === preset.r && cols === preset.c;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyDimensionPreset(preset.r, preset.c)}
                  className={`px-2.5 py-1 text-xs font-mono border rounded-sm transition-colors cursor-pointer ${
                    isCurrentDim
                      ? 'bg-[#770707] border-[#770707] text-white font-bold'
                      : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#770707]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Left: Dynamic Logical 2D Grid */}
          <div className="lg:col-span-5 p-4 bg-[#F8FAFC] border border-slate-300 rounded-sm flex flex-col justify-between overflow-x-auto">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#1A5187]">
                  <Grid className="w-3.5 h-3.5" />
                  <span>1. Pandangan Logis (Grid 2D [Baris][Kolom])</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#770707]">
                  {arrayName}[{rows}][{cols}]
                </span>
              </div>

              {/* Column Headers */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-16 shrink-0" />
                <div
                  className="grid gap-2 flex-1"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(52px, 1fr))` }}
                >
                  {Array.from({ length: cols }).map((_, c) => (
                    <div
                      key={c}
                      className="text-center font-mono text-[10px] font-bold text-[#0F2D43]"
                    >
                      Kol {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Rows & Columns */}
              <div className="space-y-2">
                {Array.from({ length: rows }).map((_, r) => {
                  const rowStyle = ROW_BADGE_STYLES[r % ROW_BADGE_STYLES.length];
                  return (
                    <div key={r} className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0F2D43] w-16 shrink-0">
                        Baris {r}:
                      </span>
                      <div
                        className="grid gap-2 flex-1"
                        style={{
                          gridTemplateColumns: `repeat(${cols}, minmax(52px, 1fr))`,
                        }}
                      >
                        {Array.from({ length: cols }).map((__, c) => {
                          const idx = r * cols + c;
                          const blk = blocksToRender[idx];
                          const val = blk ? blk.value : 0;
                          const isSelected = safeRow === r && safeCol === c;

                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setM6Row(r);
                                setM6Col(c);
                              }}
                              className={`p-2 border-2 rounded-sm font-mono text-center transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-[#770707] border-[#770707] text-white'
                                  : blk?.isGarbage
                                  ? 'bg-amber-50 border-amber-500 text-amber-950'
                                  : rowStyle
                              }`}
                            >
                              <div className="text-[10px] opacity-80">
                                [{r}][{c}]
                              </div>
                              <div className="text-sm md:text-base font-extrabold truncate tabular-nums">
                                {String(val)}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-600">
              Ubah ukuran atau isi array 2D di kotak kode (misal <code className="text-[#770707] font-bold">int {arrayName}[3][4]</code>) dan tabel logis ini akan menyesuaikan secara otomatis.
            </div>
          </div>

          {/* Right: Dynamic Physical 1D Row-Major Strip */}
          <div className="lg:col-span-7 p-4 bg-[#F8FAFC] border border-slate-300 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#770707]">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>2. Keping Fisik RAM (1D Strip — Row-Major Order)</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#0F2D43]">
                  {blocksToRender.length} Slot Kontigu ({blocksToRender.length * byteSize} Byte)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 max-h-[260px] overflow-y-auto pr-1">
                {blocksToRender.map((blk, idx) => {
                  const r = blk.row ?? Math.floor(idx / cols);
                  const c = blk.col ?? idx % cols;
                  const isSelected = safeRow === r && safeCol === c;
                  const rowStyle = ROW_BADGE_STYLES[r % ROW_BADGE_STYLES.length];

                  return (
                    <button
                      key={`${blk.address}-${idx}`}
                      type="button"
                      onClick={() => {
                        setM6Row(r);
                        setM6Col(c);
                      }}
                      className={`p-2.5 border-2 rounded-sm font-mono text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#770707] border-[#770707] text-white'
                          : blk.isGarbage
                          ? 'bg-amber-50 border-amber-500 text-amber-950'
                          : rowStyle
                      }`}
                    >
                      <div
                        className={`text-[10px] font-bold truncate ${
                          isSelected ? 'text-red-100' : 'text-[#1A5187]'
                        }`}
                      >
                        {blk.address}
                      </div>
                      <div className="text-base font-extrabold my-0.5 truncate tabular-nums">
                        {String(blk.value)}
                      </div>
                      <div className="text-[10px] opacity-85 truncate">
                        [{r}][{c}] · Slot #{idx}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Address Mapping Formula Box */}
            <div className="mt-4 p-3 bg-white border border-slate-300 rounded-sm font-mono text-xs flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-slate-600">Rumus Posisi 1D ({arrayName}[{safeRow}][{safeCol}]): </span>
                <span className="text-[#0F2D43]">
                  (Baris {safeRow} × {cols} Kolom) + Kolom {safeCol} ={' '}
                  <strong className="text-[#770707]">Slot ke-{flatIndex}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#1A5187] font-bold">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>
                  Alamat RAM: <strong>{hexAddr}</strong> (+{byteOffset} Byte)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#1A5187] border-b-2 border-[#770707]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-white" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Simulasi Konsep Interaktif — {module.code}: {module.title}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-sky-100">
          Tersinkronisasi langsung dengan deklarasi array di kotak kode
        </span>
      </div>

      <div className="p-4 bg-white">
        {module.interactiveMode === 'konsep-dasar' && renderKonsepDasarSandbox()}
        {module.interactiveMode === 'inisialisasi' && renderInisialisasiSandbox()}
        {module.interactiveMode === 'akses-modifikasi' && renderAksesModifikasiSandbox()}
        {module.interactiveMode === 'iterasi-loop' && renderIterasiLoopSandbox()}
        {module.interactiveMode === 'sizeof-operator' && renderSizeofSandbox()}
        {module.interactiveMode === 'array-2d' && renderArray2DSandbox()}
      </div>
    </section>
  );
};

export default ModuleSandbox;
