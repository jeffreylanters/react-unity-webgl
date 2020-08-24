import UnityContext from "../models/unityContext";

export default interface IUnityProps {
  /**
   * The content that should be rendered within
   * the Unity component.
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
}
