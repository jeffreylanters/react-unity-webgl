import { UnityProvider } from "./unity-provider";
import { UnityArguments } from "./unity-arguments";
import { CanvasHTMLAttributes, DetailedHTMLProps } from "react";

type HTMLCanvasElementProps = DetailedHTMLProps<
  CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

type UnityProps = Pick<
  UnityArguments,
  "devicePixelRatio" | "matchWebGLToCanvasSize" | "disabledCanvasEvents"
> &
  Pick<HTMLCanvasElementProps, "id" | "style" | "className" | "tabIndex"> & {
    /**
     * The Unity provider that contains the necessary URLs to load the Unity
     * instance. This is required to load the Unity WebGL build.
     */
    unityProvider: UnityProvider;
  };

export type { UnityProps };
