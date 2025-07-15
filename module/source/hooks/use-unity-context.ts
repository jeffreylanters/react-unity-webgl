import { useRef } from "react";
import { UnityConfig } from "../types/unity-config";
import { UnityContext } from "../types/unity-context";
import { UnityProvider } from "../types/unity-provider";

const useUnityContext = (unityConfig: UnityConfig): UnityContext => {
  const unityProvider = useRef<UnityProvider>({
    codeUrl: unityConfig.codeUrl,
    dataUrl: unityConfig.dataUrl,
    frameworkUrl: unityConfig.frameworkUrl,
    loaderUrl: unityConfig.loaderUrl,
  });

  return {
    unityProvider: unityProvider.current,
  };
};

export { useUnityContext };
