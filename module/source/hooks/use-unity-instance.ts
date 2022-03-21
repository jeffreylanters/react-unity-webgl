import { useEffect, useState } from "react";
import { IUnityInstanceParameters } from "../interfaces/unity-instance-parameters";
import { Status as UnityLoaderStatus } from "./use-unity-loader";

/**
 * Creates a Unity Instance.
 * @param unityLoaderStatus The loader status
 * @param htmlCanvasElement A reference to the html canvas element
 * @param unityInstanceParameters The Unity instance parameters
 * @returns the Unity Instance among with the status of the Unity Instance.
 */
export function useUnityInstance(
  unityLoaderStatus: UnityLoaderStatus,
  htmlCanvasElement: HTMLCanvasElement | null,
  unityInstanceParameters: IUnityInstanceParameters
): {
  unityInstance: UnityInstance | null;
  progression: number;
  error: string | null;
} {
  const [progression, setProgression] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(
    null
  );

  // Effect invoked when the Unity Loader status or canvas reference changes.
  useEffect(
    function () {
      (async function () {
        if (
          unityLoaderStatus !== UnityLoaderStatus.Loaded ||
          htmlCanvasElement === null
        ) {
          // If the loader is not loaded, or the canvas is not available,
          // we can't create the Unity instance yet.
          setUnityInstance(null);
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
          const unityInstance = await window.createUnityInstance(
            htmlCanvasElement,
            unityInstanceParameters,
            setProgression
          );
          // When the Unity Instance is created, its reference is stored in the
          // state while the error state is cleared.
          setUnityInstance(unityInstance);
          setError(null);
        } catch (error: any) {
          // When the Unity Instance catches due to a fail during the creation,
          // the Unity Instnace reference will be cleared while the error is
          // placed into the state.
          setUnityInstance(null);
          setError(error);
        }
      })();
    },
    [unityLoaderStatus, htmlCanvasElement]
  );

  return { unityInstance, progression, error };
}
