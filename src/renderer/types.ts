export interface ElectronAPI {
  windowMinimize: () => Promise<void>;
  windowMaximize: () => Promise<void>;
  windowClose: () => Promise<void>;
  openFileDialog: () => Promise<FileDialogResult>;
  saveFileDialog: (data: { content: string; defaultName?: string }) => Promise<SaveResult>;
  exportHtml: (data: { content: string; defaultName?: string }) => Promise<SaveResult>;
  getAppVersion: () => Promise<string>;
  getSettings: (key?: string) => Promise<any>;
  setSettings: (key: string, value: any) => Promise<{ success: boolean }>;
  showNotification: (options: { title: string; body: string }) => Promise<void>;
  onMenuOpenFile: (callback: () => void) => void;
  onMenuSaveAnalysis: (callback: () => void) => void;
  onMenuExportPdf: (callback: () => void) => void;
  onMenuExportHtml: (callback: () => void) => void;
  onMenuRunAnalysis: (callback: () => void) => void;
  onMenuClearResults: (callback: () => void) => void;
  onUpdateAvailable: (callback: (info: any) => void) => void;
  onDownloadProgress: (callback: (progress: any) => void) => void;
  onUpdateDownloaded: (callback: (info: any) => void) => void;
  onShowNotification: (callback: (options: { title: string; body: string }) => void) => void;
}

export interface FileDialogResult {
  success: boolean;
  content?: string;
  filePath?: string;
  error?: string;
}

export interface SaveResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  colemanLiauIndex: number;
  automatedReadabilityIndex: number;
  smogIndex: number;
  gunningFog: number;
  lixIndex: number;
}

export interface TextStatistics {
  characterCount: number;
  characterCountNoSpaces: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  syllableCount: number;
  averageWordsPerSentence: number;
  averageSyllablesPerWord: number;
  complexWordCount: number;
  longWordCount: number;
}

export interface AnalysisResult {
  text: string;
  metrics: ReadabilityMetrics;
  statistics: TextStatistics;
  interpretation: {
    level: 'Elementary' | 'Middle School' | 'High School' | 'College' | 'Graduate' | 'Professional';
    description: string;
    recommendations: string[];
  };
  timestamp: string;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
