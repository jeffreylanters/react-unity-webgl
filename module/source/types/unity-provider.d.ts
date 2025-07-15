import { UnityConfig } from "./unity-config";

type UnityProvider = Pick<
  UnityConfig,
  "loaderUrl" | "dataUrl" | "frameworkUrl" | "codeUrl"
> & {
  /**
   * Sets the Unity Context's loading progression.
   */
  readonly setLoadingProgression: (loadingProgression: number) => void;

  /**
   * Sets the Unity Context's loaded state.
   */
  readonly setIsLoaded?: (isLoaded: boolean) => void;
};

export type { UnityProvider };
