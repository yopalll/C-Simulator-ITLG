import React, { useState, useEffect } from 'react';
import {
  Cpu,
  AlertOctagon,
  HelpCircle,
  CheckCircle2,
  Layers,
  Grid,
  List,
  ArrowRight,
} from 'lucide-react';
import { MemoryBlock } from '../types/curriculum';

export interface GridDimensions {
  rows: number;
  cols: number;
  is2D?: boolean;
  arrayName?: string;
}

export interface UniversalRAMVisualizerProps {
  memoryBlocks: MemoryBlock[];
  title?: string;
  subtitle?: string;
  gridMode?: boolean | GridDimensions;
  dimensions?: GridDimensions;
  selectedAddress?: string | null;
  onSelectBlock?: (block: MemoryBlock, index: number) => void;
}

export const UniversalRAMVisualizer: React.FC<UniversalRAMVisualizerProps> = ({
  memoryBlocks,
  title = 'Inspektor Blok Memori Fisik (RAM Strip)',
  subtitle = 'Representasi alamat heksadesimal berurutan (Contiguous Memory Allocation)',
  gridMode = false,
  dimensions,
  selectedAddress,
  onSelectBlock,
}) => {
  const isGridModePropActive = Boolean(
    typeof gridMode === 'object' ? gridMode.rows > 0 && gridMode.cols > 0 : gridMode
  );

  const [internalSelectedAddr, setInternalSelectedAddr] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState<boolean>(isGridModePropActive);

  useEffect(() => {
    setIsGridView(isGridModePropActive);
  }, [isGridModePropActive, dimensions?.rows, dimensions?.cols]);

  const activeAddr = selectedAddress !== undefined ? selectedAddress : internalSelectedAddr;
  const activeBlock = memoryBlocks.find((b) => b.address === activeAddr) || memoryBlocks[0] || null;

  const validBlocks = memoryBlocks.filter((b) => !b.isError);
  const errorBlocks = memoryBlocks.filter((b) => b.isError);

  const totalBytes = validBlocks.reduce((sum, block) => sum + (block.byteSize || 4), 0);

  const explicitDims: GridDimensions | undefined =
    typeof gridMode === 'object' ? gridMode : dimensions;

  const inferredMaxRow = validBlocks.reduce((max, b) => Math.max(max, b.row ?? 0), 0);
  const inferredMaxCol = validBlocks.reduce((max, b) => Math.max(max, b.col ?? 0), 0);

  const primaryLabel = validBlocks[0]?.label || 'arr[0]';
  const primaryArrayName = explicitDims?.arrayName || primaryLabel.split('[')[0] || 'arr';
  const primaryArrayBlocks = validBlocks.filter((b) =>
    b.label.startsWith(`${primaryArrayName}[`)
  );
  const targetBlocks = primaryArrayBlocks.length > 0 ? primaryArrayBlocks : validBlocks;

  const gridRows = Math.max(explicitDims?.rows ?? inferredMaxRow + 1, 1);
  const gridCols = Math.max(
    explicitDims?.cols ?? (gridRows > 1 ? inferredMaxCol + 1 : targetBlocks.length),
    1
  );

  const matrixRows: (MemoryBlock | undefined)[][] = Array.from({ length: gridRows }, (_, r) =>
    Array.from({ length: gridCols }, (__, c) => {
      const flatIdx = r * gridCols + c;
      return (
        targetBlocks.find((b) => b.row === r && b.col === c) || targetBlocks[flatIdx]
      );
    })
  );

  const getCellStyle = (block: MemoryBlock) => {
    if (block.isError) {
      return {
        cardStyle: 'bg-[#770707] border-[#770707] text-white',
        badgeText: 'ILEGAL / OUT-OF-BOUNDS',
      };
    }
    if (block.isGarbage) {
      return {
        cardStyle: 'bg-amber-50 border-amber-500 text-amber-950',
        badgeText: 'GARBAGE VALUE',
      };
    }
    if (block.highlight) {
      return {
        cardStyle: 'bg-[#1A5187] border-[#0F2D43] text-white',
        badgeText: 'DIAKSES / AKTIF',
      };
    }
    return {
      cardStyle: 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#770707]',
      badgeText: block.dataType ? `${block.dataType} (${block.byteSize || 4}B)` : '4 Byte',
    };
  };

  return (
    <section
      aria-label="Visualisasi Memori RAM"
      className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs"
    >
      {/* Header Bar in ITLG Navy Dark (#0F2D43) with Crimson Red (#770707) Accent */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0F2D43] border-b-2 border-[#770707]">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-white shrink-0" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              {title}
            </h3>
            <p className="text-[11px] text-sky-200">{subtitle}</p>
          </div>
        </div>

        {/* Right Controls: Mode Switcher + Telemetry */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white p-0.5 border border-slate-300 rounded-sm">
            <button
              type="button"
              onClick={() => setIsGridView(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                !isGridView
                  ? 'bg-[#770707] text-white font-bold'
                  : 'text-[#0F2D43] hover:bg-slate-100'
              }`}
              title="Tampilkan sebagai urutan sekuensial 1D (flex-wrap)"
            >
              <List className="w-3.5 h-3.5" />
              <span>Urutan Flat 1D</span>
            </button>
            <button
              type="button"
              onClick={() => setIsGridView(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                isGridView
                  ? 'bg-[#770707] text-white font-bold'
                  : 'text-[#0F2D43] hover:bg-slate-100'
              }`}
              title="Tampilkan sebagai Matriks 2D menggunakan CSS Grid berdasarkan dimensi parser"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>
                Matriks 2D ({gridRows}×{gridCols})
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono text-white tabular-nums">
            <span>Slot: {validBlocks.length}</span>
            <span aria-hidden="true">·</span>
            <span>Alokasi: {totalBytes}B</span>
            {memoryBlocks[0] && (
              <>
                <span aria-hidden="true">·</span>
                <span>Base: {memoryBlocks[0].address}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Legend & Active Layout Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 bg-[#F8FAFC] border-b border-slate-200 text-[11px]">
        <div className="flex flex-wrap items-center gap-4 text-[#0F2D43] font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#1A5187] border border-[#0F2D43] inline-block" />
            <span>Diakses / Highlight (#1A5187)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white border border-slate-400 inline-block" />
            <span>Memori Terinisialisasi</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-100 border border-amber-500 inline-block" />
            <span>Garbage Value (Belum Diisi)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#770707] border border-red-900 inline-block" />
            <span>Out-of-Bounds / Ilegal (#770707)</span>
          </span>
        </div>
        <span className="text-[#770707] font-mono font-bold">
          {isGridView
            ? `gridMode: AKTIF — CSS Grid ${gridRows} Baris × ${gridCols} Kolom (${primaryArrayName}[${gridRows}][${gridCols}])`
            : `gridMode: NONAKTIF — Urutan Sekuensial Flat (${validBlocks.length} Blok)`}
        </span>
      </div>

      {/* Memory Blocks Stage on White Background */}
      <div className="p-4 bg-white">
        {memoryBlocks.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500 font-mono">
            Tidak ada blok memori yang dialokasikan. Jalankan kode untuk melihat struktur RAM.
          </div>
        ) : isGridView ? (
          /* ===================================================================
             2D MATRIX LAYOUT (CSS Grid dynamically sized by parser rows & cols)
             =================================================================== */
          <div className="space-y-4">
            <div className="overflow-x-auto pb-2">
              <div className="min-w-fit space-y-2">
                {/* Column Index Headers aligned via dynamic CSS Grid */}
                <div
                  className="grid gap-2.5 items-center"
                  style={{
                    gridTemplateColumns: `110px repeat(${gridCols}, minmax(145px, 1fr))`,
                  }}
                >
                  <div className="px-2.5 py-1.5 bg-[#770707] text-white rounded-sm font-mono text-[11px] font-bold text-center">
                    {primaryArrayName}[{gridRows}][{gridCols}]
                  </div>
                  {Array.from({ length: gridCols }).map((_, colIdx) => (
                    <div
                      key={colIdx}
                      className="px-2.5 py-1.5 bg-[#0F2D43] text-white rounded-sm font-mono text-[11px] font-bold text-center"
                    >
                      Kolom [{colIdx}]
                    </div>
                  ))}
                </div>

                {/* Matrix Rows rendered via dynamic CSS Grid */}
                {matrixRows.map((rowCells, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="grid gap-2.5 items-stretch"
                    style={{
                      gridTemplateColumns: `110px repeat(${gridCols}, minmax(145px, 1fr))`,
                    }}
                  >
                    {/* Row Header Box */}
                    <div className="p-2.5 bg-[#F8FAFC] border border-slate-300 rounded-sm font-mono flex flex-col justify-center">
                      <div className="text-xs font-extrabold text-[#0F2D43]">Baris [{rowIdx}]</div>
                      <div className="text-[10px] text-[#770707] font-semibold mt-0.5 tabular-nums">
                        Offset +{rowIdx * gridCols * (targetBlocks[0]?.byteSize || 4)}B
                      </div>
                    </div>

                    {/* Row Memory Cells */}
                    {rowCells.map((block, colIdx) => {
                      const flatIdx = rowIdx * gridCols + colIdx;
                      if (!block) {
                        return (
                          <div
                            key={colIdx}
                            className="p-3 border border-dashed border-slate-300 bg-slate-50 rounded-sm flex items-center justify-center font-mono text-xs text-slate-400"
                          >
                            Kosong
                          </div>
                        );
                      }

                      const isSelected = activeAddr === block.address;
                      const { cardStyle, badgeText } = getCellStyle(block);

                      return (
                        <button
                          key={`${block.address}-${rowIdx}-${colIdx}`}
                          type="button"
                          onClick={() => {
                            setInternalSelectedAddr(block.address);
                            onSelectBlock?.(block, flatIdx);
                          }}
                          className={`text-left p-3 border-2 rounded-sm transition-colors cursor-pointer flex flex-col justify-between ${cardStyle} ${
                            isSelected ? 'ring-2 ring-[#770707]' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 pb-1.5 mb-1.5 border-b border-current/15">
                            <span className="font-mono text-[11px] font-semibold tracking-tight opacity-90 tabular-nums">
                              {block.address}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-black/10 rounded-sm">
                              [{rowIdx}][{colIdx}]
                            </span>
                          </div>

                          <div className="my-1">
                            <div className="text-[10px] uppercase tracking-wider opacity-75">
                              Nilai Elemen
                            </div>
                            <div className="font-mono text-lg font-extrabold tracking-tight truncate tabular-nums">
                              {String(block.value)}
                            </div>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-current/15 flex items-center justify-between gap-1">
                            <span className="font-mono text-xs font-bold truncate">
                              {block.label}
                            </span>
                            <span className="font-mono text-[10px] opacity-85 whitespace-nowrap">
                              {badgeText}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {errorBlocks.length > 0 && (
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="text-xs font-mono font-bold text-[#770707] uppercase">
                  Blok Di Luar Batas Dimensi Matriks (Out-of-Bounds):
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {errorBlocks.map((block, idx) => (
                    <button
                      key={`${block.address}-err-${idx}`}
                      type="button"
                      onClick={() => setInternalSelectedAddr(block.address)}
                      className="w-48 p-3 bg-[#770707] border border-red-900 text-white rounded-sm text-left font-mono cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs pb-1 mb-1 border-b border-white/20">
                        <span>{block.address}</span>
                        <AlertOctagon className="w-3.5 h-3.5 text-red-200" />
                      </div>
                      <div className="text-base font-bold">{String(block.value)}</div>
                      <div className="text-[11px] mt-1 opacity-90">{block.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ===================================================================
             FLAT 1D SEQUENCE MODE (flex-wrap sequential linear strip)
             =================================================================== */
          <div className="flex flex-wrap items-stretch gap-2.5">
            {memoryBlocks.map((block, index) => {
              const isSelected = activeAddr === block.address;
              const { cardStyle, badgeText } = getCellStyle(block);

              return (
                <div
                  key={`${block.address}-${block.label}-${index}`}
                  className="flex items-center gap-1.5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setInternalSelectedAddr(block.address);
                      onSelectBlock?.(block, index);
                    }}
                    className={`w-44 text-left p-3 border-2 rounded-sm transition-colors cursor-pointer flex flex-col justify-between ${cardStyle} ${
                      isSelected ? 'ring-2 ring-[#770707]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 pb-1.5 mb-2 border-b border-current/15">
                      <span className="font-mono text-[11px] font-semibold tracking-tight opacity-90 tabular-nums">
                        {block.address}
                      </span>
                      {block.isError ? (
                        <AlertOctagon className="w-3.5 h-3.5 text-red-200 shrink-0" />
                      ) : block.isGarbage ? (
                        <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 opacity-75 shrink-0" />
                      )}
                    </div>

                    <div className="my-1">
                      <div className="text-[10px] uppercase tracking-wider opacity-75">
                        Nilai Tersimpan
                      </div>
                      <div className="font-mono text-lg font-extrabold tracking-tight truncate tabular-nums">
                        {String(block.value)}
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-current/15 flex items-center justify-between gap-1">
                      <span className="font-mono text-xs font-bold truncate">
                        {block.label}
                      </span>
                      <span className="font-mono text-[10px] opacity-85 whitespace-nowrap">
                        {badgeText}
                      </span>
                    </div>
                  </button>

                  {index < memoryBlocks.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#770707] shrink-0 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Cell Inspector Bar */}
        {activeBlock && (
          <div className="mt-4 p-3 bg-[#F8FAFC] border border-slate-300 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#770707] shrink-0" />
              <div>
                <span className="text-slate-600 mr-2">Detail Blok Terpilih:</span>
                <span className="font-mono font-bold text-[#770707] mr-2">{activeBlock.label}</span>
                <span className="font-mono text-[#0F2D43]">
                  berada di alamat fisik <strong className="text-[#1A5187]">{activeBlock.address}</strong> dengan nilai{' '}
                  <strong className="text-[#0F2D43]">{String(activeBlock.value)}</strong>
                </span>
              </div>
            </div>

            <div className="font-mono text-[11px] text-[#0F2D43] tabular-nums">
              {activeBlock.isError ? (
                <span className="text-[#770707] font-bold">
                  STATUS: Pelanggaran Batas Memori (Segmentation Fault / Buffer Overflow Risk)
                </span>
              ) : activeBlock.isGarbage ? (
                <span className="text-amber-800 font-bold">
                  STATUS: Residu Memori Acak (Variabel belum diinisialisasi)
                </span>
              ) : (
                <span className="font-semibold">
                  Ukuran: {activeBlock.byteSize || 4} Byte ({((activeBlock.byteSize || 4) * 8)} bit) ·{' '}
                  {activeBlock.subLabel || 'Alokasi Kontigu Valid'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UniversalRAMVisualizer;
