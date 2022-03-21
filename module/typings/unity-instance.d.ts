/**
 * Type declaration for the UnityInstance.
 */
declare class UnityInstance {
  constructor();

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param gameObjectName the name of the game object in your Unity scene.
   * @param methodName the name of the public method on the game object.
   * @param parameter an optional parameter to pass along to the method.
   */
  public SendMessage(
    gameObjectName: string,
    methodName: string,
    parameter?: string | number | boolean
  ): void;

  /**
   * Enables or disabled the fullscreen mode of the UnityInstance.
   * @param fullScreen sets the fullscreen mode.
   */
  public SetFullscreen(fullScreen: 0 | 1): void;

  /**
   * Quits the Unity WebGL application and removes it from the memory.
   * @returns a promise which resolves when the application did quit.
   */
  public Quit(): Promise<void>;
}
