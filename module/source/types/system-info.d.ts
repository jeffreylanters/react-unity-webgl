/**
 * Unity WebGL System Information Type Definition
 * This type provides information about the system on which the Unity instance
 * is running. It includes details about the browser, GPU, OS, and other system
 * characteristics.
 */
type SystemInfo = {
  browser: string;
  browserVersion: string;
  gpu: string;
  hasCursorLock: boolean;
  hasFullscreen: boolean;
  hasThreads: boolean;
  hasWasm: boolean;
  hasWasmThreads: boolean;
  hasWebGL: 2 | 1;
  height: number;
  language: string;
  mobile: boolean;
  os: string;
  osVersion: string;
  userAgent: string;
  width: number;
};

export type { SystemInfo };
