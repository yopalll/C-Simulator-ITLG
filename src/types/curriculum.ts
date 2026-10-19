export interface MemoryBlock {
  address: string;
  value: string | number;
  label: string;
  highlight?: boolean;
  isError?: boolean;
  isGarbage?: boolean;
  dataType?: string;
  byteSize?: number;
  subLabel?: string;
  row?: number;
  col?: number;
}

export interface ModuleQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleChallenge {
  title: string;
  instruction: string;
  hint: string;
  expectedCheckDescription: string;
  quiz: ModuleQuizQuestion;
}

export type ModuleInteractiveMode =
  | 'welcome'
  | 'konsep-dasar'
  | 'inisialisasi'
  | 'akses-modifikasi'
  | 'iterasi-loop'
  | 'sizeof-operator'
  | 'array-2d'
  | 'generic';

export interface CurriculumModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  type: 'welcome' | 'module';
  interactiveMode: ModuleInteractiveMode;
  conceptSummary: string;
  keyPoints: {
    title: string;
    description: string;
    codeSnippet?: string;
  }[];
  initialCode: string;
  readOnly?: boolean;
  defaultMemoryBlocks: MemoryBlock[];
  challenge?: ModuleChallenge;
}

export interface CurriculumTopic {
  id: string;
  topicNumber: string;
  title: string;
  subtitle: string;
  locked?: boolean;
  estimatedDuration: string;
  modules: CurriculumModule[];
}

export interface ExecutionResult {
  consoleOutput: string[];
  memoryBlocks: MemoryBlock[];
  hasError: boolean;
  errorMessage?: string;
  errorLine?: number;
  stats: {
    totalBytes: number;
    elementCount: number;
    dataType: string;
    bytePerElement: number;
    dimensions?: {
      rows: number;
      cols: number;
      is2D: boolean;
      arrayName: string;
    };
  };
}
