/**
 * Type declaration for the UnityInstance.
 */
declare class UnityInstance {
  constructor();

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @public
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
   * @public
   * @param fullScreen sets the fullscreen mode.
   */
  public SetFullscreen(fullScreen: number): void;

  /**
   * Quits the Unity WebGL application
   * and removes it from the memory.
   * @public
   * @returns {Promise<void>} a promise whether the application did quit.
   */
  public Quit(): Promise<void>;
}
