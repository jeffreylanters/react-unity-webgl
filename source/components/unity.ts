import { createElement, ReactElement } from "react";
import { useState, useRef, useEffect } from "react";
import { useUnityInstance } from "../hooks/use-unity-instance";
import { useUnityLoader } from "../hooks/use-unity-loader";
import { IUnityProps } from "../interfaces/unity-props";
import { UnityContext } from "../library/unity-context";
import { generateUnityInstanceParameters } from "../utils/generate-unity-instance-parameters";

/**
 * A unique instance identifier for each mounted Unity Instance.
 */
let unityInstanceIdentifier: number = 0;

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
  const { unityInstance, progression, error } = useUnityInstance(
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
        unityContext.unityInstance = unityInstance;
      }
    },
    [unityInstance]
  );

  // Effect hook will be called when the reference to the canvas changes.
  useEffect(
    function () {
      // Whether or not the canvas has been defined, it will be set as the
      // current html canvas element on the Unity Context.
      unityContext.htmlCanvasElement = htmlCanvasElement.current;
      // Only when it is defined, an event will be dispatched.
      if (unityContext.htmlCanvasElement !== null) {
        unityContext.dispatchEvent("canvas", htmlCanvasElement.current);
      }
    },
    [htmlCanvasElement]
  );

  // Effect hook will be called when the Unity Instance progession changes.
  useEffect(
    function () {
      // If the Unity Instance loading progression hits 1, then the Unity
      // Instance is ready to be used and the loaded event is dispatched.
      if (progression === 1) {
        unityContext.dispatchEvent("loaded");
      }
      // Dispatches an event every time the Unity Instance progression changes.
      unityContext.dispatchEvent("progress", progression);
    },
    [progression]
  );

  // Effect hook will be called when the Unity Instance threw an error.
  useEffect(
    function () {
      // If the Unity Instance threw an error, then the error event is
      // dispatched.
      if (error !== null) {
        unityContext.dispatchEvent("error", error);
      }
    },
    [error]
  );

  // Event hook will be called when the component mounts and unmounts.
  useEffect(function () {
    // Each time a component is mounted, the Unity Context identifier is
    // incremented to ensure that each component is referenced correctly.
    unityInstanceIdentifier++;
    return function () {
      // If the Unity Instance is defined, Quit will be invoked on the Unity
      // Instance. This removes the Unity Loader and Framework from memory.
      unityContext?.quitUnityInstance();
    };
  }, []);

  // Renders the actual canvas element which Unity will use to render.
  return createElement("canvas", {
    // Unity 2021.2 and above requires a unique identifier for each canvas
    // internally. This is not documented in the Unity documentation, but
    // it is required for the canvas to be rendered. This is further explained
    // in https://github.com/jeffreylanters/react-unity-webgl/issues/223.
    id: `unity-canvas-${unityInstanceIdentifier}`,
    // A reference to the canvas element is required to create a Unity Instance.
    ref: htmlCanvasElement,
    // Push through of some properties.
    className: props.className || undefined,
    style: props.style || {},
    tabIndex: props.tabIndex || undefined,
  });
}
