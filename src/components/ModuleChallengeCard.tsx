import React, { useState, useEffect } from 'react';
import { CheckCircle2, HelpCircle, Award, AlertCircle } from 'lucide-react';
import { ModuleChallenge, ExecutionResult } from '../types/curriculum';

interface ModuleChallengeCardProps {
  moduleId: string;
  challenge: ModuleChallenge;
  executionResult: ExecutionResult;
  currentCode: string;
  isCompleted: boolean;
  onMarkCompleted: (moduleId: string) => void;
}

export const ModuleChallengeCard: React.FC<ModuleChallengeCardProps> = ({
  moduleId,
  challenge,
  executionResult,
  currentCode,
  isCompleted,
  onMarkCompleted,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setShowHint(false);
  }, [moduleId]);

  const checkCodeTaskPassed = (): boolean => {
    const blocks = executionResult.memoryBlocks;
    if (moduleId === 'modul-1-konsep-dasar') {
      const last = blocks.find((b) => b.label === 'angka[5]');
      return Boolean(last && Number(last.value) === 99 && !executionResult.hasError);
    }
    if (moduleId === 'modul-2-inisialisasi') {
      const b0 = blocks.find((b) => b.label === 'angka[0]');
      const b1 = blocks.find((b) => b.label === 'angka[1]');
      const b4 = blocks.find((b) => b.label === 'angka[4]');
      return Boolean(
        b0 &&
          Number(b0.value) === 100 &&
          b1 &&
          Number(b1.value) === 200 &&
          b4 &&
          Number(b4.value) === 0 &&
          !b4.isGarbage
      );
    }
    if (moduleId === 'modul-3-akses-modifikasi') {
      const b2 = blocks.find((b) => b.label === 'nilai[2]');
      return Boolean(b2 && Number(b2.value) === 100 && !executionResult.hasError);
    }
    if (moduleId === 'modul-4-iterasi-loop') {
      return Boolean(
        !executionResult.hasError &&
          executionResult.consoleOutput.some((line) => line.includes('150'))
      );
    }
    if (moduleId === 'modul-5-sizeof') {
      return Boolean(
        !executionResult.hasError &&
          executionResult.stats.elementCount === 8 &&
          executionResult.stats.totalBytes === 32
      );
    }
    if (moduleId === 'modul-6-array-2d') {
      const center = blocks.find((b) => b.label === 'matriks[1][1]');
      return Boolean(center && Number(center.value) === 99 && !executionResult.hasError);
    }
    return !executionResult.hasError && currentCode.length > 10;
  };

  const codeTaskPassed = checkCodeTaskPassed();
  const quizPassed = quizSubmitted && selectedOption === challenge.quiz.correctIndex;

  useEffect(() => {
    if ((codeTaskPassed || quizPassed) && !isCompleted) {
      onMarkCompleted(moduleId);
    }
  }, [codeTaskPassed, quizPassed, isCompleted, moduleId, onMarkCompleted]);

  return (
    <section className="border border-slate-300 bg-white rounded-sm overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-[#770707] text-white border-b border-[#0F2D43]">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-white" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {challenge.title} & Evaluasi Pemahaman
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          {codeTaskPassed ? (
            <span className="bg-white text-[#0F2D43] px-2.5 py-0.5 rounded-sm font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Tugas Kode Terverifikasi
            </span>
          ) : (
            <span className="text-red-100">Status Tugas Kode: Belum Selesai</span>
          )}
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-5 bg-white">
        {/* Left Column: Hands-on Coding Lab Task */}
        <div className="p-4 bg-[#F8FAFC] border border-slate-300 rounded-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#770707] mb-2">
              Instruksi Eksperimen Kode
            </div>
            <p className="text-xs md:text-sm text-[#0F2D43] leading-relaxed mb-3 font-medium">
              {challenge.instruction}
            </p>

            <div className="p-2.5 bg-white border border-slate-300 rounded-sm text-xs font-mono text-[#0F2D43] mb-3">
              <span className="text-slate-500">Target Verifikasi: </span>
              <span className="font-bold text-[#1A5187]">{challenge.expectedCheckDescription}</span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowHint((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1A5187] hover:text-[#770707] cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk Aslab'}</span>
              </button>

              {codeTaskPassed ? (
                <span className="text-xs font-mono font-bold text-emerald-700">
                  LULUS VERIFIKASI OTOMATIS
                </span>
              ) : (
                <span className="text-xs font-mono font-semibold text-[#770707]">
                  Edit di Editor & Klik &quot;Jalankan Kode&quot;
                </span>
              )}
            </div>

            {showHint && (
              <div className="p-2.5 bg-white border-2 border-[#1A5187] text-xs font-mono text-[#0F2D43] rounded-sm">
                <strong className="text-[#770707]">Petunjuk:</strong> {challenge.hint}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Concept Check Quiz */}
        <div className="p-4 bg-[#F8FAFC] border border-slate-300 rounded-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#1A5187] mb-2">
              Kuis Pemahaman Konsep
            </div>
            <p className="text-xs md:text-sm font-bold text-[#0F2D43] mb-3 leading-relaxed">
              {challenge.quiz.question}
            </p>

            <div className="space-y-2">
              {challenge.quiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === challenge.quiz.correctIndex;

                let btnClass =
                  'bg-white border-slate-300 text-[#0F2D43] hover:border-[#1A5187]';
                if (quizSubmitted) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnClass = 'bg-[#770707] border-[#770707] text-white font-bold';
                  }
                } else if (isSelected) {
                  btnClass = 'bg-[#1A5187] border-[#1A5187] text-white font-bold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedOption(idx);
                      setQuizSubmitted(false);
                    }}
                    className={`w-full text-left px-3 py-2 border rounded-sm text-xs font-mono transition-colors cursor-pointer flex items-center justify-between gap-2 ${btnClass}`}
                  >
                    <span>
                      {String.fromCharCode(65 + idx)}. {opt}
                    </span>
                    {quizSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {quizSubmitted && isSelected && !isCorrect && (
                      <AlertCircle className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={() => setQuizSubmitted(true)}
                className="px-4 py-1.5 bg-[#770707] hover:bg-[#5a0505] disabled:opacity-40 text-white text-xs font-bold rounded-sm transition-colors cursor-pointer"
              >
                Periksa Jawaban
              </button>

              {quizSubmitted && (
                <span
                  className={`text-xs font-mono font-bold ${
                    quizPassed ? 'text-emerald-700' : 'text-[#770707]'
                  }`}
                >
                  {quizPassed ? 'JAWABAN TEPAT!' : 'KURANG TEPAT, COBA LAGI'}
                </span>
              )}
            </div>

            {quizSubmitted && (
              <p className="text-xs text-[#0F2D43] bg-white p-2.5 border border-slate-300 rounded-sm leading-relaxed">
                <strong className="text-[#770707]">Penjelasan: </strong>
                {challenge.quiz.explanation}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleChallengeCard;
