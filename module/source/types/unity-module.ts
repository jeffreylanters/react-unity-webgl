import { UnitySystemInfo } from "./unity-system-info";
import { UnityBooleanLike } from "./unity-boolean-like";
import { UnityMessageParameter } from "./unity-message-parameters";

/**
 * Type declaration for the UnityModule.
 */
type UnityModule = {
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;

  /**
   * Stringifies a pointer to a string.
   * @param pointer The pointer to the string.
   * @param length The length of the string.
   * @deprecated Deprecated in Unity 2021.2, use UTF8ToString instead.
   */
  Pointer_stringify(pointer: number, length: number): string;

  /**
   * Cleans up the UnityInstance and releases resources.
   */
  QuitCleanup: VoidFunction;

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param gameObjectName the name of the game object in your Unity scene.
   * @param methodName the name of the public method on the game object.
   * @param parameter an optional parameter to pass along to the method.
   */
  SendMessage(
    gameObjectName: string,
    methodName: string,
    parameter?: UnityMessageParameter
  ): void;

  /**
   * Enables or disabled the fullscreen mode of the UnityInstance.
   * @param fullScreen sets the fullscreen mode.
   */
  SetFullscreen(fullScreen: UnityBooleanLike): void;

  /**
   * Returns the current system information of the UnityInstance.
   */
  SystemInfo: UnitySystemInfo;

  /**
   * Converts a pointer to a string.
   * @param pointer The pointer to the string.
   */
  UTF8ToString(pointer: number): string;

  /**
   * A reference to the Unity Instance's Canvas.
   */
  canvas?: HTMLCanvasElement;

  /**
   * A reference to the Unity Instance's WebGL context attributes.
   * This is used to configure the WebGL context for the Unity instance.
   */
  webglContextAttributes: WebGLContextAttributes;
};

export type { UnityModule };
