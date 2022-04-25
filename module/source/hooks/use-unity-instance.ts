import { useEffect } from "react";
import { IUnityArguments } from "../interfaces/unity-arguments";
import { IUnityProvider } from "../interfaces/unity-provider";
import { UnityLoaderStatus } from "../enums/unity-loader-status";

/**
 * Creates a Unity Instance.
 * @param unityLoaderStatus The loader status.
 * @param htmlCanvasElement A reference to the html canvas element.
 * @param unityArguments The Unity instance arguments.
 * @param unityProvider The Unity provider.
 * @returns the Unity Instance among with the status of the Unity Instance.
 */
const useUnityInstance = (
  unityLoaderStatus: UnityLoaderStatus,
  htmlCanvasElement: HTMLCanvasElement | null,
  unityArguments: IUnityArguments,
  unityProvider: IUnityProvider
) => {
  // Effect invoked when the Unity Loader status or canvas reference changes.
  useEffect(() => {
    (async () => {
      if (
        unityLoaderStatus !== UnityLoaderStatus.Loaded ||
        htmlCanvasElement === null
      ) {
        // If the loader is not loaded, or the canvas is not available,
        // we can't create the Unity instance yet.
        unityProvider.setUnityInstance(null);
        return;
      }
      // Creates the Unity Instance, this method is made available globally by
      // the Unity Loader.
      try {
        // It is possible for the application being rendered server side. In
        // this scenario, the window is not available. We can't create the
        // Unity Instance in this case.
        if (typeof window === "undefined") {
          return;
        }
        /**
         * The internal Unity Instance which has been initialized usign the
         * create Unity Instance method exposed by the Unity Loader.
         */
        const unityInstance = await window.createUnityInstance(
          htmlCanvasElement,
          unityArguments,
          unityProvider.setLoadingProgression
        );
        // When the Unity Instance is created, its reference is stored in the
        // state while the error state is cleared.
        unityProvider.setUnityInstance(unityInstance);
        unityProvider.setInitialisationError(null);
      } catch (error: any) {
        // When the Unity Instance catches due to a fail during the creation,
        // the Unity Instnace reference will be cleared while the error is
        // placed into the state.
        unityProvider.setUnityInstance(null);
        unityProvider.setInitialisationError(error);
      }
    })();
  }, [unityLoaderStatus, htmlCanvasElement, unityArguments, unityProvider]);
};

export { useUnityInstance };
