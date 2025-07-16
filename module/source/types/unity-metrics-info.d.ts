type UnityMetricsInfo = {
  assetLoadTime: number;
  codeDownloadTime: number;
  fps: number;
  gameStartupTime: number;
  movingAverageFps: number;
  numJankedFrames: number;
  pageLoadTime: number;
  pageLoadTimeToFrame1: number;
  totalJSHeapSize: number;
  totalWASMHeapSize: number;
  usedJSHeapSize: number;
  usedWASMHeapSize: number;
  webAssemblyStartupTime: number;
};

export type { UnityMetricsInfo };
