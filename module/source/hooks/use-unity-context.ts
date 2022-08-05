import { useCallback, useEffect, useRef, useState } from "react";
import { errorMessages } from "../constants/error-messages";
import { IUnityConfig } from "../interfaces/unity-config";
import { IUnityContextHook } from "../interfaces/unity-context-hook";
import { IUnityProvider } from "../interfaces/unity-provider";
import { useEventSystem } from "./use-event-system";
import { useNullableState } from "./use-nullable-state";

/**
 * Creates a Unity Context hook.
 * @param unityConfig The Unity Config on which the Unity Context is based.
 * @returns The Unity Context hook.
 */
const useUnityContext = (unityConfig: IUnityConfig): IUnityContextHook => {
  // A reference to the Unity Instance.
  const [unityInstance, setUnityInstance] = useNullableState<UnityInstance>();

  // The Unity Instance's loading progression represents the percentage of the
  // Unity Instance's loading process that has been completed.
  const [loadingProgression, setLoadingProgression] = useState(0);

  // Defines whether the Unity Instance has been loaded.
  const [isLoaded, setIsLoaded] = useState(false);

  // May contain an error that occurred during the initialisation of the Unity
  // Instance.
  const [initialisationError, setInitialisationError] =
    useNullableState<Error>();

  /**
   * The Unity Context's event system stores the event listeners which will
   * allow Unity or any global source to invoke events to the React application.
   */
  const eventSystem = useEventSystem();

  /**
   * The Unity Context returns a Unity Provider instance. This is an immutable
   * object that contains a series of methods and properties that are used to
   * alter the Unity Context state externally.
   */
  const unityProvider = useRef<IUnityProvider>({
    setLoadingProgression,
    setInitialisationError,
    setUnityInstance,
    setIsLoaded,
    unityConfig,
  });

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   */
  const requestFullscreen = useCallback(
    /**
     * @param enabled Defines whether Unity should be in fullscreen.
     */
    (enabled: boolean) => {
      if (unityInstance === null) {
        // Guarding the Unity Instance.
        console.warn(errorMessages.requestFullscreenNoUnityInstance);
        return;
      }
      // For undocumented reasons, the fullscreen mode can only be enabled
      // with an interger value where the value of "1" enables the fullscreen
      // mode and the value of "0" disables the fullscreen mode.
      unityInstance.SetFullscreen(enabled === true ? 1 : 0);
    },
    [unityInstance]
  );

  /**
   * Lets you asynchronously ask for the pointer to be locked on the given Unity
   * Application's Canvas Element.
   */
  const requestPointerLock = useCallback(() => {
    if (
      unityInstance === null ||
      typeof unityInstance.Module.canvas === "undefined"
    ) {
      // Guarding the Unity Instance and the canvas.
      console.warn(errorMessages.requestPointerLockNoUnityInstanceOrCanvas);
      return;
    }
    // Requesting the pointer lock.
    return unityInstance.Module.canvas.requestPointerLock();
  }, [unityInstance]);

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   */
  const sendMessage = useCallback(
    /**
     * @param gameObjectName the name of the game object in your Unity scene.
     * @param methodName the name of the public method on the game object.
     * @param parameter an optional parameter to pass along to the method.
     */
    (
      gameObjectName: string,
      methodName: string,
      parameter?: ReactUnityEventParameterType
    ) => {
      if (unityInstance === null) {
        // Guarding the Unity Instance.
        console.warn(errorMessages.sendMessageNoUnityInstance);
        return;
      }
      unityInstance.SendMessage(gameObjectName, methodName, parameter);
    },
    [unityInstance]
  );

  /**
   * Takes a screenshot of the Unity Instance and returns a base64 encoded
   * string.
   */
  const takeScreenshot = useCallback(
    /**
     * @param dataType Defines the type of screenshot to take.
     * @param quality Defines the quality of the screenshot.
     * @returns A base 64 encoded string of the screenshot.
     */
    (dataType?: string, quality?: number): string | undefined => {
      if (
        unityInstance === null ||
        typeof unityInstance.Module.canvas === "undefined"
      ) {
        // Guarding the Unity Instance and the canvas.
        console.warn(errorMessages.screenshotNoUnityInstanceOrCanvas);
        return;
      }
      // Takes a screenshot by converting Canvas's render-context's buffer into
      // a Data URL of the specified data type and quality.
      return unityInstance.Module.canvas.toDataURL(dataType, quality);
    },
    [unityInstance]
  );

  /**
   * Requests the UnityInstance to be unloaded from memory in order to be
   * unmounted from the DOM.
   */
  const unload = useCallback(
    /**
     * @returns A promise that resolves when the UnityInstance has been unloaded.
     */
    (): Promise<void> => {
      if (unityInstance === null) {
        // Guarding the Unity Instance.
        console.warn(errorMessages.quitNoUnityInstance);
        return Promise.reject();
      }
      return unityInstance.Quit();
    },
    [unityInstance]
  );

  /**
   * Detatches the Unity Instance from the React DOM, by doing so, the Unity
   * Instance can be unloaded from the memory while the Unity component can be
   * unmounted safely.
   *
   * Warning! This is a workaround for the fact that the Unity WebGL instances
   * which are build with Unity 2021.2 and newer cannot be unmounted before the
   * Unity Instance is unloaded.
   * @see https://github.com/jeffreylanters/react-unity-webgl/issues/22
   */
  const UNSAFE__detachAndUnloadImmediate = useCallback(
    /**
     * @returns A promise that resolves when the UnityInstance has been unloaded.
     */
    async (): Promise<void> => {
      if (
        unityInstance === null ||
        typeof unityInstance.Module.canvas === "undefined"
      ) {
        // Guarding the Unity Instance.
        console.warn(errorMessages.genericNoUnityInstance);
        return Promise.reject();
      }
      // Re-attaches the canvas to the body element of the document. This way it
      // wont be removed from the DOM when the component is unmounted. Then the
      // canvas will be hidden while it is being unloaded.
      document.body.appendChild(unityInstance.Module.canvas as Node);
      unityInstance.Module.canvas.style.display = "none";
      // Unloads the Unity Instance.
      await unload();
      // Eventually the canvas will be removed from the DOM. This has to be done
      // manually since the canvas is no longer controlled by the React DOM.
      unityInstance.Module.canvas.remove();
    },
    [unityInstance]
  );

  // Effect invoked when the loading progression changes. When the loading
  // progression is equal to or more than 1, the Unity Instance is considered
  // loaded. This will update the isLoaded state.
  useEffect(() => {
    setIsLoaded(loadingProgression === 1);
  }, [loadingProgression]);

  // Returns the Unity Context Hook.
  return {
    unityProvider: unityProvider.current,
    loadingProgression,
    initialisationError,
    isLoaded,
    requestFullscreen,
    requestPointerLock,
    sendMessage,
    unload,
    takeScreenshot,
    addEventListener: eventSystem.addEventListener,
    removeEventListener: eventSystem.removeEventListener,
    UNSAFE__detachAndUnloadImmediate,
  };
};

export { useUnityContext };
