import React, { useState, useMemo, useCallback } from 'react';
import {
  Terminal,
  Cpu,
  BookOpen,
  Lock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Code2,
  UserCheck,
  PanelLeftClose,
  PanelLeftOpen,
  AlertTriangle,
} from 'lucide-react';
import { CURRICULUM_DATA } from './data/curriculum';
import { CurriculumModule, CurriculumTopic } from './types/curriculum';
import { executeCCode } from './utils/cArrayEngine';
import { UniversalCodeEditor } from './components/UniversalCodeEditor';
import { UniversalRAMVisualizer } from './components/UniversalRAMVisualizer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ModuleSandbox } from './components/ModuleSandbox';
import { ModuleChallengeCard } from './components/ModuleChallengeCard';

const ITLG_LOGO_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
  <rect width="120" height="120" rx="8" fill="#FFFFFF"/>
  <polygon points="42,18 68,18 53,56 24,56" fill="#0F2D43"/>
  <polygon points="73,18 90,18 104,56 64,56 58,40" fill="#1A5187"/>
  <polygon points="24,62 56,62 64,78 52,102 38,102" fill="#1A5187"/>
  <polygon points="69,62 104,62 84,102 57,102" fill="#0F2D43"/>
</svg>`);

export function App() {
  const [activeTopicId, setActiveTopicId] = useState<string>(CURRICULUM_DATA[0].id);
  const [activeModuleId, setActiveModuleId] = useState<string>(
    CURRICULUM_DATA[0].modules[0].id
  );

  // CRITICAL REQUIREMENT: RAM Visualizer Toggle (DEFAULT OFF)
  const [isRamVisible, setIsRamVisible] = useState<boolean>(false);

  // Track user-edited code per module ID
  const [codeByModule, setCodeByModule] = useState<Record<string, string>>({});

  // Track completed modules
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Sidebar collapse state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Locked future topic notice
  const [selectedLockedTopic, setSelectedLockedTopic] = useState<CurriculumTopic | null>(null);

  const activeTopic: CurriculumTopic = useMemo(
    () => CURRICULUM_DATA.find((t) => t.id === activeTopicId) || CURRICULUM_DATA[0],
    [activeTopicId]
  );

  const activeModule: CurriculumModule = useMemo(
    () =>
      activeTopic.modules.find((m) => m.id === activeModuleId) || activeTopic.modules[0],
    [activeTopic, activeModuleId]
  );

  const currentCode = codeByModule[activeModule.id] ?? activeModule.initialCode;

  // Live C/C++ Parser & Memory Engine Execution
  const executionResult = useMemo(() => {
    return executeCCode(currentCode);
  }, [currentCode]);

  const handleCodeChange = useCallback(
    (updatedCode: string) => {
      setCodeByModule((prev) => ({
        ...prev,
        [activeModule.id]: updatedCode,
      }));
    },
    [activeModule.id]
  );

  const handleRunCode = useCallback(
    (codeToExecute: string) => {
      setCodeByModule((prev) => ({
        ...prev,
        [activeModule.id]: codeToExecute,
      }));
    },
    [activeModule.id]
  );

  const handleResetModuleCode = useCallback(() => {
    setCodeByModule((prev) => {
      const copy = { ...prev };
      delete copy[activeModule.id];
      return copy;
    });
  }, [activeModule.id]);

  const handleMarkCompleted = useCallback((modId: string) => {
    setCompletedModules((prev) => (prev.includes(modId) ? prev : [...prev, modId]));
  }, []);

  const currentModuleIndex = activeTopic.modules.findIndex(
    (m) => m.id === activeModule.id
  );
  const prevModule =
    currentModuleIndex > 0 ? activeTopic.modules[currentModuleIndex - 1] : null;
  const nextModule =
    currentModuleIndex < activeTopic.modules.length - 1
      ? activeTopic.modules[currentModuleIndex + 1]
      : null;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white text-[#0F2D43] font-sans">
      {/* =====================================================================
          TOP HEADER BAR (ITLG White & Official Palette #0F2D43, #1A5187, #770707)
         ===================================================================== */}
      <header className="shrink-0 z-30 flex items-center justify-between gap-4 px-4 py-2.5 bg-white border-b-2 border-[#770707] shadow-xs">
        {/* Left Zone: Sidebar Toggle + Official Logo & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="p-1.5 text-[#0F2D43] hover:text-white bg-slate-100 hover:bg-[#770707] border border-slate-300 rounded-sm transition-colors cursor-pointer shrink-0"
            title={isSidebarOpen ? 'Sembunyikan Sidebar Kurikulum' : 'Tampilkan Sidebar Kurikulum'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/logo-itlg.png"
              alt="Logo ITLG"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== ITLG_LOGO_DATA_URI) {
                  target.src = ITLG_LOGO_DATA_URI;
                }
              }}
              className="w-9 h-9 object-contain bg-white p-0.5 rounded-sm border border-slate-200 shrink-0"
            />
            <div className="truncate">
              <h1 className="text-sm md:text-base font-extrabold tracking-tight truncate">
                <span className="text-[#0F2D43]">Laboratorium Dasar Pemrograman</span>{' '}
                <span className="text-[#770707]">— ITLG</span>
              </h1>
              <p className="text-[11px] font-medium text-[#1A5187] hidden sm:block truncate">
                Information Technology Laboratory Group · Bahasa C / C++
              </p>
            </div>
          </div>
        </div>

        {/* Center Zone: Quick Module Indicator */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#0F2D43] whitespace-nowrap shrink-0">
          <span className="font-bold text-[#770707]">{activeTopic.topicNumber}:</span>
          <strong className="text-[#0F2D43]">{activeTopic.title}</strong>
          <span className="text-slate-400">/</span>
          <span className="font-semibold text-[#1A5187]">{activeModule.code}</span>
        </div>

        {/* Right Zone: Global RAM Visualizer Toggle (DEFAULT OFF) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={isRamVisible}
            onClick={() => setIsRamVisible((prev) => !prev)}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 text-xs font-bold border rounded-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isRamVisible
                ? 'bg-[#770707] border-[#770707] text-white'
                : 'bg-white border-[#0F2D43] text-[#0F2D43] hover:border-[#770707] hover:text-[#770707]'
            }`}
          >
            <Cpu className={`w-4 h-4 ${isRamVisible ? 'text-white' : 'text-[#770707]'}`} />
            <span>Visualisasi RAM: {isRamVisible ? 'Aktif' : 'Nonaktif'}</span>
            <span
              className={`w-7 h-4 flex items-center p-0.5 rounded-none border transition-colors ${
                isRamVisible
                  ? 'bg-white border-white justify-end'
                  : 'bg-slate-100 border-slate-400 justify-start'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 ${
                  isRamVisible ? 'bg-[#770707]' : 'bg-[#0F2D43]'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN IDE BODY (Dynamic Data-Driven Sidebar + White Workspace Area)
         ===================================================================== */}
      <div className="flex-1 min-h-0 flex overflow-hidden bg-white">
        {/* LEFT SIDEBAR: Data-Driven Curriculum Tree */}
        {isSidebarOpen && (
          <aside className="w-72 md:w-80 h-full bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between shrink-0 select-none overflow-hidden">
            {/* Top Curriculum List */}
            <div className="overflow-y-auto flex-1 min-h-0 p-3 space-y-3">
              <div className="px-3 py-2 bg-[#770707] text-white rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Kurikulum Praktikum</span>
                </div>
                <span className="font-mono text-[11px] font-semibold tabular-nums">
                  {completedModules.length}/6 Selesai
                </span>
              </div>

              {/* Render Topics Dynamically from CURRICULUM_DATA */}
              {CURRICULUM_DATA.map((topic) => {
                const isTopicActive = topic.id === activeTopic.id;

                return (
                  <div
                    key={topic.id}
                    className="border border-slate-300 bg-white rounded-sm overflow-hidden"
                  >
                    {/* Topic Header */}
                    <button
                      type="button"
                      onClick={() => {
                        if (topic.locked) {
                          setSelectedLockedTopic(topic);
                        } else {
                          setActiveTopicId(topic.id);
                          setActiveModuleId(topic.modules[0].id);
                          setSelectedLockedTopic(null);
                        }
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isTopicActive && !topic.locked
                          ? 'bg-[#0F2D43] text-white'
                          : 'bg-slate-100 text-[#0F2D43] hover:bg-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div
                          className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${
                            isTopicActive && !topic.locked
                              ? 'text-sky-300'
                              : 'text-[#770707] font-bold'
                          }`}
                        >
                          <span>{topic.topicNumber}</span>
                          <span>·</span>
                          <span>{topic.estimatedDuration}</span>
                        </div>
                        <div className="text-xs font-bold truncate mt-0.5">{topic.title}</div>
                      </div>

                      {topic.locked ? (
                        <Lock className="w-3.5 h-3.5 text-[#770707] shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white rotate-90 shrink-0" />
                      )}
                    </button>

                    {/* Modules List (For Active Unlocked Topic) */}
                    {!topic.locked && isTopicActive && (
                      <div className="divide-y divide-slate-200">
                        {topic.modules.map((mod) => {
                          const isModActive =
                            mod.id === activeModule.id && !selectedLockedTopic;
                          const isModDone = completedModules.includes(mod.id);

                          return (
                            <button
                              key={mod.id}
                              type="button"
                              onClick={() => {
                                setSelectedLockedTopic(null);
                                setActiveModuleId(mod.id);
                              }}
                              className={`w-full text-left px-3 py-2.5 flex items-start justify-between gap-2 transition-colors cursor-pointer ${
                                isModActive
                                  ? 'bg-[#770707] text-white font-semibold'
                                  : 'bg-white text-[#0F2D43] hover:bg-slate-100'
                              }`}
                            >
                              <div className="min-w-0">
                                <div
                                  className={`font-mono text-[10px] font-bold ${
                                    isModActive ? 'text-red-100' : 'text-[#770707]'
                                  }`}
                                >
                                  {mod.code}
                                </div>
                                <div className="text-xs leading-snug truncate">
                                  {mod.title}
                                </div>
                              </div>

                              <div className="shrink-0 mt-0.5">
                                {isModDone ? (
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 ${
                                      isModActive ? 'text-white' : 'text-emerald-600'
                                    }`}
                                  />
                                ) : isModActive ? (
                                  <Code2 className="w-3.5 h-3.5 text-white" />
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer: Strictly Include Aslab Identity */}
            <div className="p-3.5 bg-[#0F2D43] text-white border-t-2 border-[#770707] space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <UserCheck className="w-4 h-4 text-sky-300 shrink-0" />
                <span>Aslab: Yosua Valentino (251402055)</span>
              </div>
              <div className="text-[11px] font-mono text-slate-200 leading-relaxed">
                Information Technology Laboratory Group (ITLG) · Fasilkom-TI USU
              </div>
            </div>
          </aside>
        )}

        {/* RIGHT MAIN WORKSPACE (White Background per ITLG Style Guide) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white">
          {selectedLockedTopic ? (
            <div className="max-w-4xl mx-auto border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-5 py-3 bg-[#770707] text-white">
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <Lock className="w-4 h-4" />
                  <span>{selectedLockedTopic.topicNumber} · PERTEMUAN MENDATANG</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLockedTopic(null)}
                  className="px-3 py-1 bg-white text-[#770707] hover:bg-slate-100 text-xs font-bold rounded-sm cursor-pointer"
                >
                  Kembali ke Topik 1 (Array Dasar)
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0F2D43]">
                    {selectedLockedTopic.title}
                  </h2>
                  <p className="text-sm text-[#1A5187] font-medium mt-1">
                    {selectedLockedTopic.subtitle}
                  </p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-sm space-y-2">
                  <div className="text-xs font-bold uppercase text-[#770707]">
                    Informasi Praktikan
                  </div>
                  <p className="text-xs text-[#0F2D43] leading-relaxed">
                    Materi <strong>{selectedLockedTopic.title}</strong> akan dibuka oleh Asisten Laboratorium sesuai jadwal pertemuan praktikum berikutnya. Silakan selesaikan seluruh modul pada <strong>Topik 01: Array Dasar</strong> terlebih dahulu.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* CASE 1: Welcome Screen (Pengantar Array) */}
              {activeModule.type === 'welcome' ? (
                <WelcomeScreen
                  modules={activeTopic.modules}
                  onSelectModule={(modId) => setActiveModuleId(modId)}
                  isRamVisible={isRamVisible}
                  onToggleRam={() => setIsRamVisible((prev) => !prev)}
                />
              ) : (
                /* CASE 2: Learning Module (Modul 01 s/d Modul 06) */
                <>
                  {/* Module Header & Key Concept Cards */}
                  <section className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-[#0F2D43] border-b-2 border-[#770707]">
                      <div>
                        <div className="inline-block px-2 py-0.5 bg-[#770707] text-white text-[11px] font-mono font-bold uppercase rounded-sm mb-1">
                          {activeTopic.topicNumber} · {activeModule.code}
                        </div>
                        <h2 className="text-lg md:text-xl font-extrabold text-white">
                          {activeModule.title} —{' '}
                          <span className="text-sky-200 font-medium">
                            {activeModule.subtitle}
                          </span>
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        {prevModule && (
                          <button
                            type="button"
                            onClick={() => setActiveModuleId(prevModule.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-[#0F2D43] text-xs font-semibold rounded-sm cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Sebelumnya</span>
                          </button>
                        )}
                        {nextModule && (
                          <button
                            type="button"
                            onClick={() => setActiveModuleId(nextModule.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#770707] hover:bg-[#5a0505] text-xs font-bold text-white rounded-sm cursor-pointer"
                          >
                            <span>Modul Berikutnya</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs md:text-sm text-[#0F2D43] leading-relaxed font-medium">
                        {activeModule.conceptSummary}
                      </p>

                      {activeModule.keyPoints.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                          {activeModule.keyPoints.map((pt, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 bg-[#F8FAFC] border border-slate-200 rounded-sm flex flex-col justify-between"
                            >
                              <div>
                                <h3 className="text-xs font-extrabold text-[#770707] uppercase mb-1.5">
                                  {pt.title}
                                </h3>
                                <p className="text-xs text-[#0F2D43] leading-relaxed">
                                  {pt.description}
                                </p>
                              </div>
                              {pt.codeSnippet && (
                                <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[11px] font-semibold text-[#1A5187] truncate">
                                  {pt.codeSnippet}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Module Interactive Concept Sandbox */}
                  <ModuleSandbox
                    module={activeModule}
                    memoryBlocks={executionResult.memoryBlocks}
                    onApplyCodePreset={(presetCode) => handleCodeChange(presetCode)}
                  />
                </>
              )}

              {/* ===============================================================
                  UNIVERSAL CODE EDITOR & C EXECUTION CONSOLE
                 =============================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                <div className="lg:col-span-7 flex flex-col">
                  <UniversalCodeEditor
                    initialCode={activeModule.initialCode}
                    code={currentCode}
                    readOnly={activeModule.readOnly}
                    onChange={handleCodeChange}
                    onRun={handleRunCode}
                    onReset={handleResetModuleCode}
                    fileName={`${activeModule.id.replace(/-/g, '_')}.c`}
                    errorLine={executionResult.errorLine}
                    errorMessage={executionResult.errorMessage}
                  />
                </div>

                {/* Right Pane: Terminal Output & Memory Stats */}
                <div className="lg:col-span-5 border border-slate-300 bg-white rounded-sm flex flex-col justify-between overflow-hidden shadow-xs">
                  <div>
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#770707] text-white border-b border-[#770707]">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <Terminal className="w-4 h-4 text-white" />
                        <span>Terminal Keluaran (stdout)</span>
                      </div>
                      <span className="font-mono text-[11px] text-red-100">
                        ./a.out
                      </span>
                    </div>

                    <div className="p-4 font-mono text-xs space-y-1.5 min-h-[180px] bg-[#0F2D43] text-white">
                      {executionResult.consoleOutput.map((line, i) => (
                        <div key={i} className="leading-relaxed">
                          <span className="text-sky-300 select-none mr-2">$</span>
                          <span>{line}</span>
                        </div>
                      ))}

                      {executionResult.hasError && (
                        <div className="mt-3 p-3 bg-[#770707] border border-red-300 text-white rounded-sm flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-100 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold">RUNTIME / MEMORY ERROR DETECTED</div>
                            <div className="mt-1 text-[11px]">{executionResult.errorMessage}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Summary & RAM Toggle Prompt */}
                  <div className="p-3.5 bg-[#F8FAFC] border-t border-slate-200 space-y-2.5">
                    <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                      <div className="p-2 bg-white border border-slate-200 rounded-sm">
                        <div className="text-[10px] text-slate-500">Tipe Data</div>
                        <div className="font-bold text-[#1A5187]">
                          {executionResult.stats.dataType} ({executionResult.stats.bytePerElement}B)
                        </div>
                      </div>
                      <div className="p-2 bg-white border border-slate-200 rounded-sm">
                        <div className="text-[10px] text-slate-500">Jumlah Elemen</div>
                        <div className="font-bold text-[#0F2D43] tabular-nums">
                          {executionResult.stats.elementCount}
                        </div>
                      </div>
                      <div className="p-2 bg-white border border-slate-200 rounded-sm">
                        <div className="text-[10px] text-slate-500">Total Alokasi</div>
                        <div className="font-bold text-[#770707] tabular-nums">
                          {executionResult.stats.totalBytes} Byte
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[#0F2D43] font-medium">
                        {isRamVisible
                          ? 'Inspektor RAM Fisik ditampilkan di bawah.'
                          : 'Lihat representasi alamat 0x7ffe00 di RAM:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsRamVisible((prev) => !prev)}
                        className="font-mono text-xs font-bold text-[#770707] hover:text-[#1A5187] underline cursor-pointer"
                      >
                        {isRamVisible ? 'Sembunyikan RAM' : 'Aktifkan Visualisasi RAM'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===============================================================
                  UNIVERSAL RAM VISUALIZER (CONDITIONAL ON GLOBAL TOGGLE)
                 =============================================================== */}
              {isRamVisible && (
                <UniversalRAMVisualizer
                  memoryBlocks={
                    executionResult.memoryBlocks.length > 0
                      ? executionResult.memoryBlocks
                      : activeModule.defaultMemoryBlocks
                  }
                  gridMode={
                    activeModule.interactiveMode === 'array-2d' ||
                    Boolean(executionResult.stats.dimensions?.is2D)
                  }
                  dimensions={executionResult.stats.dimensions}
                  title={`Visualisasi Memori RAM — ${activeModule.code}: ${activeModule.title}`}
                />
              )}

              {/* ===============================================================
                  HANDS-ON LAB CHALLENGE & QUIZ (For Modules 1..6)
                 =============================================================== */}
              {activeModule.challenge && (
                <ModuleChallengeCard
                  moduleId={activeModule.id}
                  challenge={activeModule.challenge}
                  executionResult={executionResult}
                  currentCode={currentCode}
                  isCompleted={completedModules.includes(activeModule.id)}
                  onMarkCompleted={handleMarkCompleted}
                />
              )}

              {/* Bottom Footer Bar */}
              <footer className="pt-4 pb-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-[#0F2D43]">
                <div className="font-semibold">
                  Laboratorium Dasar Pemrograman (Daspro) — <span className="text-[#770707]">ITLG</span>
                </div>
                <div className="font-mono font-bold text-[#1A5187]">
                  Aslab: Yosua Valentino (251402055)
                </div>
              </footer>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
