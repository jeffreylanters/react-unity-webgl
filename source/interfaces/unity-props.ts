import { CSSProperties } from "react";
import UnityContext from "../models/unity-context";

export default interface IUnityProps {
  /**
   * The Context which should be rendered be the Unity Component.
   * @type {UnityContext}
   */
  unityContext: UnityContext;

  /**
   * The Class Name will be applied to the Canvas.
   * @type {string}
   */
  className?: string;

  /**
   * The styles will be applied to the Canvas.
   * @type {CSSProperties}
   */
  style?: CSSProperties;

  /**
   * The tabIndex of the element. Mitigates the issue that once WebGL is loaded,
   * the keyboard is captured and HTML inputs are not reacting to keyboard
   * strokes anymore.
   * @type {number}
   * @see https://stackoverflow.com/a/60854680
   */
  tabIndex?: number;

  /**
   * The Canvas can appear too blurry on retina screens. The devicePixelRatio
   * determines how much extra pixel density should be added to allow for a
   * sharper image.
   * @type {number}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
   */
  devicePixelRatio?: number;
}
