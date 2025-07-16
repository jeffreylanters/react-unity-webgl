import { UnityInstance } from "./unity-instance";
import { UnityProvider } from "./unity-provider";

type UnityContext = {
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
