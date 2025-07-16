import { EventSystem } from "./event-system";
import { UnityEventParameter } from "./unity-event-parameters";
import { UnityInstance } from "./unity-instance";
import { UnityProvider } from "./unity-provider";

type UnityContext = Pick<
  EventSystem,
  "addEventListener" | "removeEventListener"
> & {
  /**
   * The Unity Context returns a Unity Provider instance. This immutable object
   * should be passed onto a Unity Component in order to be able to access the
   * Unity Context's state.
   */
  readonly unityProvider: UnityProvider;

  /**
   * The Unity Instance's loading progression represents the percentage of the
   * Unity Instance's loading process that has been completed.
   */
  readonly loadingProgression: number;

  /**
   * Defines whether the Unity Instance has been loaded.
   */
  readonly isLoaded: boolean;

  /**
   * The Unity Instance's initialisation error, if any.
   */
  readonly initialisationError?: Error;

  /**
   * Requests the Unity Instance to enter or exit fullscreen mode.
   * @param enabled - A boolean indicating whether to enter (true) or exit (false) fullscreen mode.
   */
  readonly requestFullscreen: (enabled: boolean) => void;

  /**
   * Requests the Unity Instance to enter pointer lock mode.
   * Pointer lock mode allows the Unity Instance to capture mouse movements
   * without the cursor leaving the Unity canvas.
   * This is useful for first-person games or applications where continuous
   * mouse movement is required.
   */
  readonly requestPointerLock: VoidFunction;

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param gameObjectName the name of the game object in your Unity scene.
   * @param methodName the name of the public method on the game object.
   * @param parameter an optional parameter to pass along to the method.
   */
  readonly sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: UnityEventParameter
  ) => void;

  /**
   * Takes a screenshot of the Unity Instance and returns a base64 encoded
   * string.
   * @param type Defines the type of screenshot to take.
   * @param quality Defines the quality of the screenshot.
   * @returns A base 64 encoded string of the screenshot.
   */
  readonly takeScreenshot: (
    dataType?: string,
    quality?: number
  ) => string | undefined;

  /**
   * Unloads the Unity Instance, freeing up resources and memory.
   * This method should be called when the Unity Instance is no longer needed
   * to ensure proper cleanup. Note that this is done automatically when the
   * Unity Context is unmounted, so manual unloading is typically not necessary
   * no longer needed.
   */
  readonly unload: () => Promise<void>;

  /**
   * An unsafe reference to the Unity Instance.
   * This reference should be used with caution, as it may not be available
   * at all times, and accessing it may lead to unexpected behavior if the
   * Unity Instance is not fully initialized or has been unloaded.
   * It is recommended to use the provided methods and properties of the Unity
   * Context to interact with the Unity Instance safely.
   */
  readonly UNSAFE__unityInstance: UnityInstance | null;
};

export type { UnityContext };
