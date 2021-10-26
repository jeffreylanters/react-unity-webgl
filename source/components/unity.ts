import { createElement, ReactElement } from "react";
import { useState, useRef, useEffect } from "react";
import { useUnityInstance } from "../hooks/use-unity-instance";
import { useUnityLoader } from "../hooks/use-unity-loader";
import { IUnityProps } from "../interfaces/unity-props";
import { UnityContext } from "../library/unity-context";
import { generateUnityInstanceParameters } from "../utils/generate-unity-instance-parameters";

/**
 * Renders the Unity Instance to the React DOM.
 * @param props Properties of the Unity Component.
 * @returns A React Element.
 */
export function Unity(props: IUnityProps): ReactElement {
  const htmlCanvasElement = useRef<HTMLCanvasElement>(null);
  const unityContext = useState<UnityContext>(props.unityContext)[0];
  const unityInstanceParameters = generateUnityInstanceParameters(
    unityContext,
    props
  );

  // The Unity Loader is required for the unity instance to be created.
  const unityLoaderStatus = useUnityLoader(unityContext.unityConfig.loaderUrl);

  // Creates the Unity Instance while defining a set of hooks which indicate
  // whether the Unity Instance is ready to be used among with its progression.
  const [unityInstance, progression, error] = useUnityInstance(
    unityLoaderStatus,
    htmlCanvasElement.current,
    unityInstanceParameters
  );

  // Effect hook will be called when the Unity instance changes.
  useEffect(
    function () {
      // If the Unity Instance has been defined, it will be passed to the
      // Unity Context.
      if (unityInstance !== null) {
        unityContext.setUnityInstance(unityInstance);
      }
    },
    [unityInstance]
  );

  // Effect hook will be called when the Unity Instance progession changes.
  useEffect(
    function () {
      // If the Unity Instance loading progression hits 1, then the Unity
      // Instance is ready to be used and the loaded event is dispatched.
      if (progression === 1) {
        unityContext.dispatchEventListener("loaded");
      }
      // Dispatches an event every time the Unity Instance progression changes.
      unityContext.dispatchEventListener("progress", progression);
    },
    [progression]
  );

  // Effect hook will be called when the Unity Instance threw an error.
  useEffect(
    function () {
      // If the Unity Instance threw an error, then the error event is
      // dispatched.
      if (error !== null) {
        unityContext.dispatchEventListener("error", error);
      }
    },
    [error]
  );

  // Event hook will be called when the component mounts and unmounts.
  useEffect(function () {
    return function () {
      // If the Unity Instance is defined, then it will be quitted.
      unityContext?.quitUnityInstance();
    };
  }, []);

  // Renders the actual canvas element.
  return createElement("canvas", {
    className: props.className || undefined,
    tabIndex: props.tabIndex || undefined,
    style: props.style || {},
    ref: htmlCanvasElement,
  });
}
