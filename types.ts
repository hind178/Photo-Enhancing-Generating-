export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  PREVIEW = 'PREVIEW',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
}

export interface OriginalImage {
  dataUrl: string;
  file: File;
}