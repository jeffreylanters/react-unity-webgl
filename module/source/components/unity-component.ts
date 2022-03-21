import { createElement, FC, useRef } from "react";
import { useUnityCanvasId } from "../hooks/use-unity-canvas-id";
import { useUnityInstance } from "../hooks/use-unity-instance";
import { useUnityArguments } from "../hooks/use-unity-arguments";
import { useUnityLoader } from "../hooks/use-unity-loader";
import { IUnityProps } from "../interfaces/unity-props";

// HACK -- Prevent error during development
(window as any).dispatchReactUnityEvent = () => {};

/**
 * Renders the provided Unity application.
 * @param unityProps The Unity props provided the the Unity component.
 * @returns The Unity canvas renderer.
 */
const Unity: FC<IUnityProps> = (unityProps: IUnityProps): JSX.Element => {
  /**
   * A reference to the HTML Canvas Element. This Canvas Element will eventually
   * be passed to the Unity Instance hook which it will use to render the Unity
   * application.
   */
  const htmlCanvasElement = useRef<HTMLCanvasElement>(null);

  /**
   * A unique Unity canvas ID. This is used internally by Unity since version
   * 2021.2 to identify the canvas element in the DOM. This is not documented in
   * the Unity documentation, but it is used in the Unity source code.
   */
  const unityCanvasId = useUnityCanvasId();

  /**
   * The Unity Arguments object which can be passed to the create Unity instance
   * method in order to initialize it. These arguments are created based on the
   * provided Unity Props which also include the Unity Provider and thus the
   * Unity Config.
   */
  const unityArguments = useUnityArguments(unityProps);

  /**
   * The corresponding Unity Loader will be loaded based on the provided loader
   * URL from the Unity Provider's Unity Config.
   */
  const unityLoaderStatus = useUnityLoader(
    unityProps.unityProvider.unityConfig.loaderUrl
  );

  // The Unity Instance is created based on the Unity Arguments. The loader
  // status will be used to determine if the Unity instance should be created.
  // The Unity is mounted to the Canvas Element.
  useUnityInstance(
    unityLoaderStatus,
    htmlCanvasElement.current,
    unityArguments,
    unityProps.unityProvider
  );

  // Returns the Unity Canvas Element which will render the Unity application.
  return createElement("canvas", {
    ref: htmlCanvasElement,
    id: unityCanvasId,
    style: unityProps.style,
  });
};

export { Unity };
