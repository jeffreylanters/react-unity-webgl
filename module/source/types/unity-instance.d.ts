import { UnityEventParameter } from "./unity-event-parameters";
import { UnityBooleanLike } from "./unity-boolean-like";
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
   * The internal Unity Module.
   */
  Module: UnityModule;
};

export type { UnityInstance };
