import { useRef, useState } from "react";
import { UnityConfig } from "../types/unity-config";
import { UnityContext } from "../types/unity-context";
import { UnityProvider } from "../types/unity-provider";

const useUnityContext = (unityConfig: UnityConfig): UnityContext => {
  const [loadingProgression, setLoadingProgression] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialisationError, setInitialisationError] = useState<Error>();

  const unityProvider = useRef<UnityProvider>({
    codeUrl: unityConfig.codeUrl,
    dataUrl: unityConfig.dataUrl,
    frameworkUrl: unityConfig.frameworkUrl,
    loaderUrl: unityConfig.loaderUrl,
    setLoadingProgression,
    setIsLoaded,
    setInitialisationError,
  });

  return {
    unityProvider: unityProvider.current,
    loadingProgression,
    isLoaded,
    initialisationError,
  };
};

export { useUnityContext };
