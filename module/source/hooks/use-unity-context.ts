import { useRef, useState } from "react";
import { UnityConfig } from "../types/unity-config";
import { UnityContext } from "../types/unity-context";
import { UnityProvider } from "../types/unity-provider";

/**
 * Custom hook to create a Unity context.
 * This hook initializes the Unity instance and provides the necessary state and methods.
 *
 * @param unityConfig - Configuration object for the Unity instance.
 * @returns An object containing the Unity context state and methods.
 */
const useUnityContext = (unityConfig: UnityConfig): UnityContext => {
  const [loadingProgression, setLoadingProgression] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialisationError, setInitialisationError] = useState<Error>();

  // Create a ref to hold the UnityProvider instance
  // This allows us to keep the same instance across renders
  // while still being able to update its properties
  // without causing unnecessary re-renders.
  const unityProvider = useRef<UnityProvider>({
    companyName: unityConfig.companyName,
    productName: unityConfig.productName,
    productVersion: unityConfig.productVersion,
    codeUrl: unityConfig.codeUrl,
    dataUrl: unityConfig.dataUrl,
    frameworkUrl: unityConfig.frameworkUrl,
    loaderUrl: unityConfig.loaderUrl,
    setLoadingProgression,
    setIsLoaded,
    setInitialisationError,
  });

  // Initialize the UnityProvider with the provided configuration
  // This is where you would typically load the Unity instance
  // and set up event listeners, etc.
  return {
    unityProvider: unityProvider.current,
    loadingProgression,
    isLoaded,
    initialisationError,
  };
};

export { useUnityContext };
