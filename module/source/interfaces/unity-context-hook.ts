import { IUnityProvider } from "../interfaces/unity-provider";

export interface IUnityContextHook {
  readonly unityProvider: IUnityProvider;
  readonly loadingProgression: number;
  readonly isLoaded: boolean;
  readonly initialisationError: Error | null;
  readonly setFullscreen: (enabled: boolean) => void;
  readonly sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: string | number | boolean
  ) => void;
}
