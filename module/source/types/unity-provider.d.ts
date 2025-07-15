import { UnityConfig } from "./unity-config";

type UnityProvider = Pick<
  UnityConfig,
  "loaderUrl" | "dataUrl" | "frameworkUrl" | "codeUrl"
> & {};

export type { UnityProvider };
