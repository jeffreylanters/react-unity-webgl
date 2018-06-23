import UnityContent from "../UnityContent";

export default interface IUnityProps {
  /**
   * The content that should be rendered within
   * the Unity component.
   */
  unityContent: UnityContent;

  /**
   * The class name for the canvas wrapper.
   */
  className?: string;

  /**
   * The width of the element.
   */
  width?: string | number;

  /**
   * The height of the element.
   */
  height?: string | number;
}
