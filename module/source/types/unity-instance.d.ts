import { UnityMetricsInfo } from "./unity-metrics-info";
import { UnityModule } from "./unity-module";

/**
 * Type declaration for the UnityInstance.
 */
type UnityInstance = Pick<UnityModule, "SendMessage" | "SetFullscreen"> & {
  /**
   * Quits the Unity WebGL application and removes it from the memory.
   * @returns a promise which resolves when the application did quit.
   */
  Quit(): Promise<void>;

  /**
   * Returns the current system information of the UnityInstance.
   * This is a more detailed version of the SystemInfo property in UnityModule.
   * @returns the system information of the UnityInstance.
   * @remark only available in Unity 6000.1 and later.
   */
  GetMetricsInfo?(): UnityMetricsInfo;

  /**
   * The internal Unity Module.
   */
  Module: UnityModule;
};

export type { UnityInstance };
