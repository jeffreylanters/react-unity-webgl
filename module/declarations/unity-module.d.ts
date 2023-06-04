/**
 * Type declaration for the UnityModule.
 */
declare type UnityModule = {
  /**
   * Stringifies a pointer to a string.
   * @param pointer The pointer to the string.
   * @param length The length of the string.
   * @deprecated Deprecated in Unity 2021.2, use UTF8ToString instead.
   */
  Pointer_stringify(pointer: number, length: number): string;

  /**
   * Converts a pointer to a string.
   * @param pointer The pointer to the string.
   */
  UTF8ToString(pointer: number): string;

  /**
   * Enables or disabled the fullscreen mode of the UnityInstance.
   * @param fullScreen sets the fullscreen mode.
   */
  SetFullscreen(fullScreen: UnityBooleanLike): void;

  /**
   * A reference to the Unity Instance's Canvas.
   */
  canvas?: HTMLCanvasElement;
};
