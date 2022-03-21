import { CSSProperties } from "react";
import { UnityContext } from "../library/unity-context";

export interface IUnityProps {
  /**
   * The Context which should be rendered be the Unity Component.
   * @public
   * @readonly
   * @type {UnityContext}
   */
  readonly unityContext: UnityContext;

  /**
   * The Class Name will be applied to the Canvas.
   * @public
   * @readonly
   * @type {string}
   */
  className?: string;

  /**
   * The styles will be applied to the Canvas.
   * @public
   * @readonly
   * @type {CSSProperties}
   */
  style?: CSSProperties;

  /**
   * The tabIndex of the element. Mitigates the issue that once WebGL is loaded,
   * the keyboard is captured and HTML inputs are not reacting to keyboard
   * strokes anymore.
   * @public
   * @readonly
   * @type {number}
   * @see https://stackoverflow.com/a/60854680
   */
  tabIndex?: number;

  /**
   * The Canvas can appear too blurry on retina screens. The devicePixelRatio
   * determines how much extra pixel density should be added to allow for a
   * sharper image.
   * @public
   * @readonly
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
   */
  readonly devicePixelRatio?: number;

  /**
   * When disabling the match WebGL to canvas size flag, the canvas allows for
   * client side customization of the WebGL canvas target size instead of
   * requiring it to always match 1:1 with the High DPI CSS size of the canvas.
   * Supported since Unity 2021.1.0b8
   * @public
   * @readonly
   * @type {boolean}
   * @see https://issuetracker.unity3d.com/issues/webgl-builds-dont-allow-separate-control-on-canvas-render-buffer-size
   */
  readonly matchWebGLToCanvasSize?: boolean;
}
