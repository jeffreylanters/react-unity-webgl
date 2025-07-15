import { CSSProperties } from "react";
import { UnityProvider } from "./unity-provider";
import { UnityArguments } from "./unity-arguments";

type UnityProps = Pick<UnityArguments, "devicePixelRatio"> & {
  /**
   * The Unity provider that contains the necessary URLs to load the Unity
   * instance. This is required to load the Unity WebGL build.
   */
  unityProvider: UnityProvider;

  /**
   * The ID of the Unity canvas element. If not provided, a unique ID will be
   * generated. It is recommended to let the library generate a unique ID
   * unless you have a specific reason to use a custom ID.
   */
  id?: string;

  /**
   * The style of the Unity canvas element.
   */
  style?: CSSProperties;
};

export type { UnityProps };
