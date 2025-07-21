type UnityMetricsInfo = {
  /** Time taken to load assets (ms). */
  assetLoadTime?: number;

  /** Time taken to download code (ms). */
  codeDownloadTime?: number;

  /** Current frames per second. */
  fps?: number;

  /** Time taken for the game to start up (ms). */
  gameStartupTime?: number;

  /** Moving average of frames per second. */
  movingAverageFps?: number;

  /** Number of janked frames detected. */
  numJankedFrames?: number;

  /** Time taken for the page to load (ms). */
  pageLoadTime?: number;

  /** Time from page load to first frame rendered (ms). */
  pageLoadTimeToFrame1?: number;

  /** Total JavaScript heap size (bytes). */
  totalJSHeapSize?: number;

  /** Total WebAssembly heap size (bytes). */
  totalWASMHeapSize?: number;

  /** Used JavaScript heap size (bytes). */
  usedJSHeapSize?: number;

  /** Used WebAssembly heap size (bytes). */
  usedWASMHeapSize?: number;

  /** Time taken for WebAssembly to start up (ms). */
  webAssemblyStartupTime?: number;
};

export type { UnityMetricsInfo };
