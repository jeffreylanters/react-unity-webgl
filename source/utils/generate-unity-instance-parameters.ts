import { UnityContext } from "..";
import { IUnityInstanceParameters } from "../interfaces/unity-instance-parameters";
import { IUnityProps } from "../interfaces/unity-props";

/**
 * Generates the parameters for the Unity Instance based on the Unity Context
 * and Unity Props passed to the component.
 * @param unityContext The Unity Context
 * @param unityProps The Unity Props passed to the component
 * @returns A Unity Instance Parameters object
 */
export function generateUnityInstanceParameters(
  unityContext: UnityContext,
  unityProps: IUnityProps
): IUnityInstanceParameters {
  // Creation of an object with the parameters for the Unity Instance.
  const unityInstanceParameters: IUnityInstanceParameters = {
    ...unityContext.unityConfig,
  };

  // Print and printErr event hooks will be intercepted in order to catch
  // messages to the Unity Context.
  unityInstanceParameters.print = function (message: string) {
    unityContext.dispatchEvent("debug", message);
  };
  unityInstanceParameters.printErr = function (error: string) {
    unityContext.dispatchEvent("error", error);
  };

  // Some preferences will be set based on props and context config.
  if (unityProps.devicePixelRatio !== undefined) {
    unityInstanceParameters.devicePixelRatio = unityProps.devicePixelRatio;
  }
  if (unityContext.unityConfig.webglContextAttributes !== undefined) {
    unityInstanceParameters.webglContextAttributes =
      unityContext.unityConfig.webglContextAttributes;
  }
  if (unityProps.matchWebGLToCanvasSize !== undefined) {
    unityInstanceParameters.matchWebGLToCanvasSize =
      unityProps.matchWebGLToCanvasSize;
  }

  return unityInstanceParameters;
}
