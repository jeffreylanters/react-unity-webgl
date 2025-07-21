import { UnityConfig } from "./unity-config";
import { UnityInstance } from "./unity-instance";

/**
 * The UnityProvider interface defines the properties and methods required to
 * create and manage a Unity instance within a React application. It is used for
 * internal management of the Unity instance and provides methods to interact
 * with the Unity instance, such as setting the loading progression, handling
 * fullscreen requests, and managing the Unity instance's state.
 */
type UnityProvider = Pick<
  UnityConfig,
  | "loaderUrl"
  | "dataUrl"
  | "frameworkUrl"
  | "codeUrl"
  | "memoryUrl"
  | "symbolsUrl"
  | "streamingAssetsUrl"
  | "workerUrl"
  | "companyName"
  | "productName"
  | "productVersion"
  | "webglContextAttributes"
  | "cacheControl"
  | "autoSyncPersistentDataPath"
> & {
  /**
   * Sets the Unity Context's loading progression.
   * This is used to track the loading state of the Unity instance.
   * @param loadingProgression The loading progression to set, typically a value between 0
   */
  readonly setLoadingProgression: (loadingProgression: number) => void;

  /**
   * Sets the Unity Context's loaded state.
   * This is used to indicate whether the Unity instance has finished loading.
   * @param isLoaded The loaded state to set, true if loaded, false otherwise.
   */
  readonly setIsLoaded: (isLoaded: boolean) => void;

  /**
   * Sets the Unity Context's initialisation error.
   * This is used to handle errors that occur during the initialisation of the Unity instance.
   * @param error The error to set, or undefined to clear the error.
   */
  readonly setInitialisationError: (error?: Error) => void;

  /**
   * Sets the Unity instance, used for internally managing the Unity instance
   * between the context and the UnityProvider.
   * @param unityInstance The Unity instance to set, or null to clear it.
   */
  readonly setUnityInstance: (unityInstance: UnityInstance | null) => void;
};

export type { UnityProvider };
