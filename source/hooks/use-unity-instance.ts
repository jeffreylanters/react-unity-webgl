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
): [UnityInstance | null, number, string | null] {
  const [progression, setProgression] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(
    null
  );

  // Effect invoked when the Unity Loader status or canvas reference changes.
  useEffect(
    function () {
      if (
        unityLoaderStatus !== UnityLoaderStatus.Loaded ||
        htmlCanvasElement === null
      ) {
        // If the loader is not loaded, or the canvas is not available,
        // we can't create the Unity instance yet.
        setUnityInstance(null);
        return;
      }

      const unityInstanceFulfilled = function (unityInstance: UnityInstance) {
        // When the Unity Instance is created, its reference is stored in the
        // state while the error state is cleared.
        setUnityInstance(unityInstance);
        setError(null);
      };

      const unityInstanceCatched = function (error: string) {
        // When the Unity Instance catches due to a fail during the creation,
        // the Unity Instnace reference will be cleared while the error is
        // placed into the state.
        setUnityInstance(null);
        setError(error);
      };

      // Creates the Unity Instance, this method is made available globally by
      // the Unity Loader.
      try {
        // TODO since unity 2021.2 the createUnityInstance takes an ID instead of a canvas element...
        window
          .createUnityInstance(
            htmlCanvasElement,
            unityInstanceParameters,
            setProgression
          )
          .then(unityInstanceFulfilled)
          .catch(unityInstanceCatched);
      } catch (error: any) {
        // The the create Unity Instance method was not available,
        // the error is placed into the state.
        setUnityInstance(null);
        setError(`${error}`);
      }
    },
    [unityLoaderStatus, htmlCanvasElement]
  );

  return [unityInstance, progression, error];
}
