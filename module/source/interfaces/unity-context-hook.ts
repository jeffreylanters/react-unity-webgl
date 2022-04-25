import { IUnityProvider } from "../interfaces/unity-provider";
import { IEventSystemHook } from "./event-system-hook";

export interface IUnityContextHook extends IEventSystemHook {
  readonly unityProvider: IUnityProvider;
  readonly loadingProgression: number;
  readonly isLoaded: boolean;
  readonly initialisationError: Error | null;
  readonly setFullscreen: (enabled: boolean) => void;
  readonly sendMessage: (
    gameObjectName: string,
    methodName: string,
    parameter?: ReactUnityEventArgumentType
  ) => void;
  readonly unload: () => Promise<void> | undefined;
}
