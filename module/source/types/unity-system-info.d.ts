/**
 * Unity WebGL System Information Type Definition
 * This type provides information about the system on which the Unity instance
 * is running. It includes details about the browser, GPU, OS, and other system
 * characteristics.
 */
type UnitySystemInfo = {
  /** Name of the browser (e.g., 'Chrome', 'Firefox'). */
  browser: string;

  /** Version of the browser (e.g., '91.0.4472.124'). */
  browserVersion: string;

  /** Name of the detected GPU (e.g., 'NVIDIA GeForce GTX 1050'). */
  gpu: string;

  /** Indicates if cursor lock is supported. */
  hasCursorLock: boolean;

  /** Indicates if fullscreen mode is supported. */
  hasFullscreen: boolean;

  /** Indicates if threads are supported. */
  hasThreads: boolean;

  /** Indicates if WebAssembly is supported. */
  hasWasm: boolean;

  /** Indicates if WebAssembly threads are supported. */
  hasWasmThreads: boolean;

  /** Indicates the supported WebGL version (1 or 2). */
  hasWebGL: 2 | 1;

  /** Height of the browser window in pixels. */
  height: number;

  /** Language of the browser (e.g., 'en-US'). */
  language: string;

  /** Indicates if the device is mobile. */
  mobile: boolean;

  /** Name of the operating system (e.g., 'Windows', 'macOS'). */
  os: string;

  /** Version of the operating system (e.g., '10.15.7'). */
  osVersion: string;

  /** User agent string of the browser. */
  userAgent: string;

  /** Width of the browser window in pixels. */
  width: number;
};

export type { UnitySystemInfo };
