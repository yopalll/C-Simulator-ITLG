import React, { useState } from 'react';
import { ArrowRight, BookOpen, Code2, Cpu, Layers } from 'lucide-react';
import { CurriculumModule } from '../types/curriculum';

interface WelcomeScreenProps {
  modules: CurriculumModule[];
  onSelectModule: (moduleId: string) => void;
  isRamVisible: boolean;
  onToggleRam: () => void;
}

type PillarKey = 'nama' | 'nilai' | 'indeks';

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  modules,
  onSelectModule,
  isRamVisible,
  onToggleRam,
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('nama');
  const [selectedBoxIdx, setSelectedBoxIdx] = useState<number>(0);

  const sampleValues = [85, 90, 78, 92, 88];
  const sampleAddresses = ['0x7ffe00', '0x7ffe04', '0x7ffe08', '0x7ffe0c', '0x7ffe10'];

  const pillars: {
    key: PillarKey;
    numberTitle: string;
    subtitle: string;
    description: string;
    highlightToken: string;
    detailNote: string;
    accentColor: string;
  }[] = [
    {
      key: 'nama',
      numberTitle: '01. NAMA',
      subtitle: 'Identitas Tunggal Variabel Array',
      description:
        'Tanpa array, menyimpan 5 nilai ujian membutuhkan 5 variabel berbeda (nilai1, nilai2, dst). Dengan array, cukup gunakan satu nama identifier tunggal untuk mewakili seluruh deretan data.',
      highlightToken: 'int nilai[5]',
      detailNote:
        'Aturan penamaan sama seperti variabel biasa di C: tidak boleh diawali angka, tidak mengandung spasi, dan bersifat Case-Sensitive.',
      accentColor: '#1A5187',
    },
    {
      key: 'nilai',
      numberTitle: '02. NILAI',
      subtitle: 'Data Homogen di Dalam Setiap Elemen',
      description:
        'Setiap kotak di dalam array menyimpan satu nilai data aktual. Seluruh elemen dalam satu array wajib memiliki tipe data yang sama (misal seluruhnya int atau seluruhnya float).',
      highlightToken: '{ 85, 90, 78, 92, 88 }',
      detailNote:
        'Karena bertipe int (4 Byte), kelima nilai ini disimpan berdempetan dengan total ukuran 5 × 4 Byte = 20 Byte di memori.',
      accentColor: '#0F2D43',
    },
    {
      key: 'indeks',
      numberTitle: '03. INDEKS',
      subtitle: 'Nomor Posisi Elemen (Mulai dari 0)',
      description:
        'Untuk mengambil atau mengubah nilai tertentu di dalam array, kita memanggil nomor posisinya di dalam kurung siku [i]. Bahasa C selalu memulai indeks pertama dari angka 0.',
      highlightToken: 'nilai[0] s/d nilai[4]',
      detailNote:
        'Rumus batas indeks: Jika ukuran array adalah N, maka indeks pertama adalah 0 dan indeks terakhir adalah (N - 1).',
      accentColor: '#770707',
    },
  ];

  const learningModules = modules.filter((m) => m.type === 'module');

  return (
    <div className="space-y-6">
      {/* Hero Banner Section on White Canvas with ITLG Style Guide Accents */}
      <div className="border-2 border-[#0F2D43] bg-white rounded-sm overflow-hidden shadow-xs">
        <div className="px-6 py-2.5 bg-gradient-to-r from-[#770707] via-[#0F2D43] to-[#1A5187] text-white flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold">
          <span>TOPIK 01 · STRUKTUR DATA ARRAY DASAR (C / C++)</span>
          <span>MODUL PRAKTIKUM DASPRO — ITLG</span>
        </div>

        <div className="p-6 md:p-8">
          <blockquote className="text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0F2D43] leading-snug tracking-tight max-w-4xl">
            “Kalau kamu punya banyak data tapi cuma mau{' '}
            <span className="text-[#770707] underline decoration-[#770707]/40">
              satu nama variabel
            </span>{' '}
            — itulah fungsi <span className="text-[#1A5187]">Array</span>”
          </blockquote>

          <p className="mt-4 text-sm md:text-base text-slate-700 max-w-3xl leading-relaxed">
            Selamat datang di Simulator Laboratorium Dasar Pemrograman ITLG. Sebelum menulis kode di editor,
            pahami tiga komponen pembentuk Array melalui kartu anatomi interaktif di bawah ini.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => learningModules[0] && onSelectModule(learningModules[0].id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#770707] hover:bg-[#5a0505] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              <span>Mulai Modul 01: Konsep Dasar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onToggleRam}
              className={`flex items-center gap-2 px-4 py-2.5 border text-xs font-mono font-bold rounded-sm transition-colors cursor-pointer ${
                isRamVisible
                  ? 'bg-[#1A5187] border-[#1A5187] text-white'
                  : 'bg-white border-[#0F2D43] text-[#0F2D43] hover:border-[#770707] hover:text-[#770707]'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Visualisasi RAM: {isRamVisible ? 'Aktif' : 'Nonaktif'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Grid Cards: 01. NAMA (#1A5187), 02. NILAI (#0F2D43), 03. INDEKS (#770707) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-gradient-to-r from-[#770707] to-[#1A5187] text-white text-xs font-bold uppercase tracking-wider rounded-sm">
              Anatomi Array
            </span>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#0F2D43]">
              Tiga Pilar Utama (Klik Kartu untuk Sorot Sintaks)
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-[#770707]">
            Materi ARRAY DASPRO — ITLG
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pillars.map((pillar) => {
            const isActive = activePillar === pillar.key;
            const activeBg =
              pillar.key === 'nama'
                ? 'bg-[#1A5187] border-[#1A5187] text-white'
                : pillar.key === 'nilai'
                ? 'bg-[#0F2D43] border-[#0F2D43] text-white'
                : 'bg-[#770707] border-[#770707] text-white';

            const headerColor =
              pillar.key === 'nama'
                ? 'text-[#1A5187]'
                : pillar.key === 'nilai'
                ? 'text-[#0F2D43]'
                : 'text-[#770707]';

            return (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActivePillar(pillar.key)}
                className={`text-left p-5 border-2 rounded-sm transition-colors flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? activeBg
                    : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#770707]'
                }`}
              >
                <div>
                  <div
                    className={`flex items-center justify-between gap-2 pb-2 mb-3 border-b ${
                      isActive ? 'border-white/20' : 'border-slate-200'
                    }`}
                  >
                    <span
                      className={`text-base font-extrabold tracking-tight ${
                        isActive ? 'text-white' : headerColor
                      }`}
                    >
                      {pillar.numberTitle}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isActive ? 'text-white' : 'text-[#770707]'
                      }`}
                    >
                      {isActive ? 'AKTIF DISOROT' : 'KLIK INSPEKSI'}
                    </span>
                  </div>

                  <div
                    className={`text-xs font-bold mb-2 ${
                      isActive ? 'text-sky-100' : 'text-[#1A5187]'
                    }`}
                  >
                    {pillar.subtitle}
                  </div>

                  <p
                    className={`text-xs leading-relaxed mb-4 ${
                      isActive ? 'text-white/90' : 'text-slate-700'
                    }`}
                  >
                    {pillar.description}
                  </p>
                </div>

                <div
                  className={`pt-3 border-t ${
                    isActive ? 'border-white/20' : 'border-slate-200'
                  }`}
                >
                  <div className="font-mono text-xs font-bold px-2.5 py-1.5 bg-[#0F2D43] text-white rounded-sm mb-2">
                    {pillar.highlightToken}
                  </div>
                  <p
                    className={`text-[11px] leading-snug ${
                      isActive ? 'text-white/85' : 'text-slate-600'
                    }`}
                  >
                    {pillar.detailNote}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Anatomy Diagram synced with 01. NAMA, 02. NILAI, 03. INDEKS */}
      <div className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-[#0F2D43] border-b-2 border-[#770707] text-white">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-300" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Peta Visual Hubungan: 01. NAMA — 02. NILAI — 03. INDEKS
            </h3>
          </div>
          <span className="text-xs font-mono text-sky-200">
            Klik salah satu kotak elemen untuk menguji pemanggilan indeks
          </span>
        </div>

        <div className="p-5">
          {/* Code Declaration Highlight Strip */}
          <div className="p-4 bg-[#F8FAFC] border border-slate-300 rounded-sm font-mono text-sm md:text-base flex flex-wrap items-center gap-2 mb-5">
            <span className="text-[#1A5187] font-bold">int</span>
            <span
              onClick={() => setActivePillar('nama')}
              className={`px-2 py-0.5 cursor-pointer transition-colors rounded-sm ${
                activePillar === 'nama'
                  ? 'bg-[#1A5187] text-white font-bold'
                  : 'text-[#0F2D43] font-semibold hover:bg-slate-200'
              }`}
            >
              nilai
            </span>
            <span
              onClick={() => setActivePillar('indeks')}
              className={`px-2 py-0.5 cursor-pointer transition-colors rounded-sm ${
                activePillar === 'indeks'
                  ? 'bg-[#770707] text-white font-bold'
                  : 'text-[#770707] font-semibold hover:bg-slate-200'
              }`}
            >
              [5]
            </span>
            <span className="text-slate-500">=</span>
            <span
              onClick={() => setActivePillar('nilai')}
              className={`px-2 py-0.5 cursor-pointer transition-colors rounded-sm ${
                activePillar === 'nilai'
                  ? 'bg-[#0F2D43] text-white font-bold'
                  : 'text-[#0F2D43] font-semibold hover:bg-slate-200'
              }`}
            >
              {`{ ${sampleValues.join(', ')} }`}
            </span>
            <span className="text-slate-500">;</span>
          </div>

          {/* Visual Array Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {sampleValues.map((val, idx) => {
              const isBoxSelected = selectedBoxIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedBoxIdx(idx)}
                  className={`p-3.5 border-2 rounded-sm text-left transition-colors cursor-pointer ${
                    isBoxSelected
                      ? 'bg-[#770707] border-[#770707] text-white'
                      : 'bg-white border-slate-300 text-[#0F2D43] hover:border-[#1A5187]'
                  }`}
                >
                  {/* 01. NAMA + 03. INDEKS */}
                  <div
                    className={`flex items-center justify-between text-xs font-mono pb-2 mb-2 border-b ${
                      isBoxSelected ? 'border-white/20' : 'border-slate-200'
                    }`}
                  >
                    <span className="font-bold">
                      nilai
                      <strong
                        className={
                          isBoxSelected ? 'text-amber-200' : 'text-[#770707]'
                        }
                      >
                        [{idx}]
                      </strong>
                    </span>
                    <span className="text-[11px] opacity-80">Indeks {idx}</span>
                  </div>

                  {/* 02. NILAI */}
                  <div className="my-1">
                    <div className="text-[10px] uppercase tracking-wider opacity-75">
                      02. NILAI
                    </div>
                    <div className="font-mono text-2xl font-extrabold tabular-nums">
                      {val}
                    </div>
                  </div>

                  {/* Physical Address */}
                  <div
                    className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[11px] font-mono opacity-85 ${
                      isBoxSelected ? 'border-white/20' : 'border-slate-200'
                    }`}
                  >
                    <span>RAM: {sampleAddresses[idx]}</span>
                    <span>4B</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-[#F8FAFC] border border-slate-300 rounded-sm flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div>
              <span className="text-slate-600">Ekspresi C terpilih: </span>
              <span className="text-[#770707] font-bold">nilai[{selectedBoxIdx}]</span>
              <span className="text-slate-600"> menghasilkan nilai </span>
              <span className="text-[#1A5187] font-bold">{sampleValues[selectedBoxIdx]}</span>
            </div>
            <div className="text-slate-600">
              Alamat Memori: <span className="text-[#0F2D43] font-bold">{sampleAddresses[selectedBoxIdx]}</span> (Base + {selectedBoxIdx} × 4 Byte)
            </div>
          </div>
        </div>
      </div>

      {/* Directory of the 6 Core Array Modules */}
      <div className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-5 py-3 bg-[#1A5187] text-white border-b-2 border-[#770707]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-white" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Kurikulum Praktikum Topik 1: 6 Modul Interaktif Array
            </h3>
          </div>
          <span className="text-xs text-sky-100">Pilih modul untuk mulai praktikum</span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {learningModules.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelectModule(mod.id)}
              className="p-4 bg-white hover:bg-[#F8FAFC] border border-slate-300 hover:border-[#770707] rounded-sm text-left transition-colors flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#770707] mb-1.5">
                  <span>{mod.code}</span>
                  <Code2 className="w-3.5 h-3.5 text-[#1A5187]" />
                </div>
                <h4 className="text-sm font-extrabold text-[#0F2D43] mb-1">{mod.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{mod.subtitle}</p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#1A5187] group-hover:text-[#770707]">
                <span>Buka Simulasi & Editor</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
