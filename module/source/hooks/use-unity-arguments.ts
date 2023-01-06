import { useMemo } from "react";
import { UnityArguments } from "../types/unity-arguments";
import { UnityProps } from "../types/unity-props";

/**
 * Creates a memoized Unity Arguments object which can be passed to the Unity
 * instance in order to initialize it.
 * @param unityProps The Unity props provided the the Unity component.
 * @returns The Unity arguments to pass to the Unity instance.
 */
const useUnityArguments = (unityProps: UnityProps): UnityArguments => {
  return useMemo<UnityArguments>(
    () => ({
      ...unityProps.unityProvider.unityConfig,

      /**
       * When the device pixel ratio is defined via the Unity Props, it's value
       * will be appended to the Unity arguments object.
       */
      devicePixelRatio: unityProps.devicePixelRatio,

      /**
       * When the match WebGL to Canvas Size boolean is defined via the Unity
       * Props, it's value will be appended to the Unity arguments object.
       */
      matchWebGLToCanvasSize: unityProps.matchWebGLToCanvasSize,

      /**
       * Even though the WebGL Context Attributes are defined in the Unity
       * Config and are spread into the Unity Arguments object, a check is still
       * performed to see if the WebGL Context Attributes are not undefined
       * since this would cause the Unity Instance to throw an error. An empty
       * object is used as a fallback.
       */
      webglContextAttributes:
        unityProps.unityProvider.unityConfig.webglContextAttributes || {},

      /**
       * Print event hooks will be intercepted in order to catch messages and send
       * them to the unity context instead.
       * @param message The message to be printed.
       */
      print: (message: string) => {
        // TODO -- Re-implement this hook.
        // unityContext.dispatchEvent("debug", message);
      },

      /**
       * Print error event hooks will be intercepted in order to catch error
       * messages and send them to the unity context instead.
       * @param error The error to be printed.
       */
      printErr: (error: string) => {
        // TODO -- Re-implement this hook.
        // unityContext.dispatchEvent("error", error);
      },
    }),
    [
      unityProps.devicePixelRatio,
      unityProps.matchWebGLToCanvasSize,
      unityProps.unityProvider.unityConfig,
    ]
  );
};

export { useUnityArguments };
