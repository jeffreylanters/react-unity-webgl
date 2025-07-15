import { UnityEventParameter } from "./unity-event-parameters";
import { UnityBooleanLike } from "./unity-boolean-like";
import { UnityModule } from "./unity-module";

/**
 * Type declaration for the UnityInstance.
 */
type UnityInstance = {
  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param gameObjectName the name of the game object in your Unity scene.
   * @param methodName the name of the public method on the game object.
   * @param parameter an optional parameter to pass along to the method.
   */
  SendMessage(
    gameObjectName: string,
    methodName: string,
    parameter?: UnityEventParameter
  ): void;

  /**
   * Enables or disabled the fullscreen mode of the UnityInstance.
   * @param fullScreen sets the fullscreen mode.
   */
  SetFullscreen(fullScreen: UnityBooleanLike): void;

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
