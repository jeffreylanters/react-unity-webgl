import * as React from "react";
import IUnityProps from "../interfaces/IUnityProps";
import IUnityState from "../interfaces/IUnityState";
import UnityContent from "../UnityContent";
import UnityLoaderService from "../services/UnityLoaderService";
import "../Types";

export default class Unity extends React.Component<IUnityProps, IUnityState> {
  /**
   * Reference to the wrappers html element.
   * @type {HTMLElement}
   * @private
   */
  private htmlElement?: HTMLElement;

  /**
   * The Unity content passed by the props.
   * @type {UnityContent}
   * @private
   */
  private unityContent: UnityContent;

  /**
   * The Unity Loader service instance.
   * @type {UnityLoaderService}
   * @private
   */
  private unityLoaderService: UnityLoaderService;

  /**
   * The component state.
   * @type {IUnityState}
   * @public
   */
  public state: IUnityState = {};

  /**
   * Initialized the component.
   * @param {IUnityProps} props
   */
  constructor(props: IUnityProps) {
    super(props);
    this.unityLoaderService = new UnityLoaderService();
    this.unityContent = this.props.unityContent;
    this.unityContent.setComponentInstance(this);
  }

  /**
   * An event that is triggered by the Unity player. This tracks
   * the loading progression of the player. It will send '1' when
   * the loading is completed.
   * @param {UnityInstance} unityInstance
   * @param {number} progression
   * @private
   */
  private onProgress(unityInstance: UnityInstance, progression: number): void {
    this.unityContent.triggerUnityEvent("progress", progression);
    if (progression === 1) this.unityContent.triggerUnityEvent("loaded");
  }

  /**
   * Initialzied the Unity player when the component is mounted.
   * @public
   */
  public componentDidMount(): void {
    // prettier-ignore
    this.unityLoaderService.append(this.props.unityContent.unityLoaderJsPath, () => {
      this.unityContent.setUnityInstance(UnityLoader.instantiate(
        `__ReactUnityWebGL_${this.props.unityContent.uniqueID}__`,
        this.props.unityContent.buildJsonPath, {
          onProgress: this.onProgress.bind(this),
          Module: this.props.unityContent.unityConfig.modules
        }));
      }
    );
  }

  /**
   * Renders the unity wrapper and player.
   * @returns {React.ReactNode} element
   * @public
   */
  public render(): React.ReactNode {
    return React.createElement("div", {
      className: this.props.className || "",
      ref: ref => (this.htmlElement = ref!),
      id: `__ReactUnityWebGL_${this.props.unityContent.uniqueID}__`,
      style: {
        width: this.props.width || "800px",
        height: this.props.height || "600px"
      }
    });
  }
}
