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
};

export type { UnityContext };
