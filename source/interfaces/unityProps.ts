import UnityContext from "../models/unityContext";

export default interface IUnityProps {
  /**
   * The context that should be rendered within the Unity component.
   * @type {UnityContext}
   */
  unityContext: UnityContext;

  /**
   * The class name for the canvas wrapper.
   * @type {string}
   */
  className?: string;

  /**
   * The width of the element.
   * @type {string | number}
   */
  width?: string | number;

  /**
   * The height of the element.
   * @type {string | number}
   */
  height?: string | number;

  /**
   * The tabIndex of the element. Mitigates the issue that once WebGL is loaded,
   * the keyboard is captured and HTML inputs are not reacting to keyboard
   * strokes anymore.
   * @type {number}
   * @see https://stackoverflow.com/a/60854680
   */
  tabIndex?: number;
}
