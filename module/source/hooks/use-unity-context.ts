import { useCallback, useRef, useState } from "react";
import { UnityConfig } from "../types/unity-config";
import { UnityContext } from "../types/unity-context";
import { UnityProvider } from "../types/unity-provider";
import { UnityInstance } from "../types/unity-instance";
import { UnityEventParameter } from "../exports";

/**
 * Custom hook to create a Unity context.
 * This hook initializes the Unity instance and provides the necessary state and methods.
 * @param unityConfig - Configuration object for the Unity instance.
 * @returns An object containing the Unity context state and methods.
 */
const useUnityContext = (unityConfig: UnityConfig): UnityContext => {
  const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(
    null
  );
  const [loadingProgression, setLoadingProgression] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialisationError, setInitialisationError] = useState<Error>();

  // Create a ref to hold the UnityProvider instance, it consists of a selection
  // of properties from the UnityConfig and methods to interact with the Unity instance.
  // This allows us to avoid unnecessary re-renders when the UnityProvider is updated.
  // The useRef hook is used to persist the UnityProvider instance across renders.
  const unityProvider = useRef<UnityProvider>({
    companyName: unityConfig.companyName,
    productName: unityConfig.productName,
    productVersion: unityConfig.productVersion,
    codeUrl: unityConfig.codeUrl,
    dataUrl: unityConfig.dataUrl,
    frameworkUrl: unityConfig.frameworkUrl,
    loaderUrl: unityConfig.loaderUrl,
    memoryUrl: unityConfig.memoryUrl,
    symbolsUrl: unityConfig.symbolsUrl,
    streamingAssetsUrl: unityConfig.streamingAssetsUrl,
    workerUrl: unityConfig.workerUrl,
    webglContextAttributes: unityConfig.webglContextAttributes,
    cacheControl: unityConfig.cacheControl,
    setUnityInstance,
    setLoadingProgression,
    setIsLoaded,
    setInitialisationError,
  });

  /**
   * Requests the Unity Instance to enter or exit fullscreen mode.
   */
  const requestFullscreen = useCallback(
    (enabled: boolean) => unityInstance?.SetFullscreen(enabled ? 1 : 0),
    [unityInstance]
  );

  /**
   * Requests the Unity Instance to enter pointer lock mode.
   * Pointer lock mode allows the Unity Instance to capture mouse movements
   * without the cursor leaving the Unity canvas.
   */
  const requestPointerLock = useCallback(() => {
    unityInstance?.Module.canvas?.requestPointerLock();
  }, [unityInstance]);

  /**
   * Sends a message to the Unity Instance to invoke a public method.
   */
  const sendMessage = useCallback(
    (
      gameObjectName: string,
      methodName: string,
      parameter?: UnityEventParameter
    ) => unityInstance?.SendMessage(gameObjectName, methodName, parameter),
    [unityInstance]
  );

  /**
   * Takes a screenshot of the Unity Instance and returns a base64 encoded
   * string.
   * @param dataType Defines the type of screenshot to take.
   * @param quality Defines the quality of the screenshot.
   * @returns A base 64 encoded string of the screenshot.
   */
  const takeScreenshot = useCallback(
    (dataType?: string, quality?: number): string | undefined =>
      unityInstance?.Module.canvas?.toDataURL(dataType, quality),
    [unityInstance]
  );

  /**
   * Unloads the Unity Instance and cleans up resources.
   */
  const unload = useCallback(
    () => unityInstance?.Quit() ?? Promise.reject(),
    [unityInstance]
  );

  // Initialize the UnityProvider with the provided configuration
  // This is where you would typically load the Unity instance
  // and set up event listeners, etc.
  return {
    unityProvider: unityProvider.current,
    loadingProgression,
    isLoaded,
    initialisationError,
    requestFullscreen,
    requestPointerLock,
    sendMessage,
    takeScreenshot,
    unload,
    UNSAFE__unityInstance: unityInstance,
  };
};

export { useUnityContext };
