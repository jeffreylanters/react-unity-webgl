import { CSSProperties } from "react";
import { UnityProvider } from "./unity-provider";
import { UnityArguments } from "./unity-arguments";

/**
 * Some of the Unity Props' properties are also part of the Unity Arguments.
 * This type is used to pick the properties that are configurable from the
 * Unity Arguments.
 */
type ConfigurableUnityArguments = Pick<
  UnityArguments,
  "devicePixelRatio" | "matchWebGLToCanvasSize" | "disabledCanvasEvents"
>;

/**
 * The Unity component's props.
 */
type UnityProps = ConfigurableUnityArguments & {
  /**
   * The Provider of the Unity Context which should be rendered be the Unity
   * Component.
   */
  readonly unityProvider: UnityProvider;

  /**
   * The Class Name will be applied to the Canvas.
   */
  readonly className?: string;

  /**
   * The styles will be applied to the Canvas.
   */
  readonly style?: CSSProperties;

  /**
   * The tabIndex of the element. Mitigates the issue that once WebGL is loaded,
   * the keyboard is captured and HTML inputs are not reacting to keyboard
   * strokes anymore.
   * @see https://stackoverflow.com/a/60854680
   */
  readonly tabIndex?: number;

  /**
   * The ID of the canvas element. If not provided, a unique ID will be
   * generated. This is useful for when the user wants to use a custom canvas
   * ID. IDs are used internally by Unity since version 2021.2 to identify the
   * canvas element in the DOM. This is not documented in the Unity
   * documentation, but it is used in the Unity source code.
   */
  readonly id?: string;
};

export type { UnityProps };
