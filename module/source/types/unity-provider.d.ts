import { UnityInstance } from "../../declarations/unity-instance";
import { UnityConfig } from "./unity-config";

/**
 * The Unity Provider is a statefull object that contains a series of methods
 * and properties that are used to alter the Unity Context state.
 */
type UnityProvider = {
  /**
   * Sets the Unity Context's loading progression.
   */
  readonly setLoadingProgression: (loadingProgression: number) => void;

  /**
   * Sets the Unity Context's initialisation error.
   */
  readonly setInitialisationError: (error: Error | null) => void;

  /**
   * Sets te Unity Context's loaded state.
   */
  readonly setIsLoaded: (isLoaded: boolean) => void;

  /**
   * Sets the Unity Context's Unity Instance.
   */
  readonly setUnityInstance: (unityInstance: UnityInstance | null) => void;

  /**
   * The Unity Context's Unity Config.
   */
  readonly unityConfig: UnityConfig;
};

export type { UnityProvider };
