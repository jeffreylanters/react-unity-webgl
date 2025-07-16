import { UnityEventParameter } from "./unity-event-parameters";
import { UnityBooleanLike } from "./unity-boolean-like";
import { UnityModule } from "./unity-module";

/**
 * Type declaration for the UnityInstance.
 */
type UnityInstance = Pick<
  UnityModule,
  "SendMessage" | "SetFullscreen" | "Quit"
> & {
  /**
   * The internal Unity Module.
   */
  Module: UnityModule;
};

export type { UnityInstance };
