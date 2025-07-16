import { UnityConfig } from "./unity-config";
import { UnityInstance } from "./unity-instance";

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
> & {
  /**
   * Sets the Unity Context's loading progression.
   */
  readonly setLoadingProgression: (loadingProgression: number) => void;

  /**
   * Sets the Unity Context's loaded state.
   */
  readonly setIsLoaded: (isLoaded: boolean) => void;

  /**
   * Sets the Unity Context's initialisation error.
   */
  readonly setInitialisationError: (error?: Error) => void;

  /**
   * Sets the Unity instance, used for internally managing the Unity instance
   * between the context and the UnityProvider.
   */
  readonly setUnityInstance: (unityInstance: UnityInstance | null) => void;
};

export type { UnityProvider };
