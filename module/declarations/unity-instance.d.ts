import { ReactUnityEventParameter } from "../source/types/react-unity-event-parameters";

/**
 * Type declaration for the UnityInstance.
 */
declare class UnityInstance {
  /**
   * Creates a new instance of Unity Instance.
   */
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
    parameter?: ReactUnityEventParameter
  ): void;

  /**
   * Enables or disabled the fullscreen mode of the UnityInstance.
   * @param fullScreen sets the fullscreen mode.
   */
  public SetFullscreen(fullScreen: UnityBooleanLike): void;

  /**
   * Quits the Unity WebGL application and removes it from the memory.
   * @returns a promise which resolves when the application did quit.
   */
  public Quit(): Promise<void>;

  /**
   * The internal Unity Module.
   */
  public Module: UnityModule;
}
