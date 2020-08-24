import "../declarations/unityInstance";
import "../declarations/window";
import { createElement, PureComponent } from "react";
import IUnityProps from "../interfaces/unityProps";
import UnityContext from "../models/unityContext";
import UnityLoaderService from "../services/unityLoaderService";

export default class Unity extends PureComponent<IUnityProps, {}> {
  /**
   * The Unity content passed by the props.
   * @type {UnityContext}
   */
  private unityContext: UnityContext = this.props.unityContext;

  /**
   * The Unity Loader service instance.
   * @type {UnityLoaderService}
   */
  private unityLoaderService: UnityLoaderService = new UnityLoaderService();

  /**
   * A reference to the html canvas element the UnityInstance will use.
   */
  private htmlCanvasElementReference?: HTMLCanvasElement;

  /**
   * An event that is triggered by the Unity player. This tracks
   * the loading progression of the player. It will send '1' when
   * the loading is completed.
   * @param {UnityInstance} unityInstance
   * @param {number} progression
   */
  private onProgress(progression: number): void {
    this.unityContext.triggerUnityEvent("progress", progression);
    if (progression === 1) {
      this.unityContext.triggerUnityEvent("loaded");
    }
  }

  /**
   * Initialzied the Unity player when the component is mounted.
   */
  public async componentDidMount(): Promise<void> {
    this.unityContext.setComponentReference(this);
    await this.unityLoaderService.load(this.unityContext.unityConfig.loaderUrl);
    const _unityInstanceParamters = {
      dataUrl: this.unityContext.unityConfig.dataUrl,
      frameworkUrl: this.unityContext.unityConfig.frameworkUrl,
      codeUrl: this.unityContext.unityConfig.codeUrl,
      streamingAssetsUrl: this.unityContext.unityConfig.streamingAssetsUrl,
      companyName: this.unityContext.unityConfig.companyName,
      productName: this.unityContext.unityConfig.productName,
      productVersion: this.unityContext.unityConfig.productVersion,
    };
    const _unityInstance = await window.createUnityInstance(
      this.htmlCanvasElementReference!,
      _unityInstanceParamters,
      this.onProgress.bind(this)
    );
    this.unityContext.setUnityInstance(_unityInstance);
  }

  /**
   * When the component will be unmounted, the UnityInstance will quit.
   */
  public componentWillUnmount(): void {
    this.unityContext.quitUnityInstance();
  }

  /**
   * Renders the unity wrapper and player.
   * @returns {React.ReactNode} element
   * @public
   */
  public render(): React.ReactNode {
    return createElement("canvas", {
      className: this.props.className || "",
      ref: (r: HTMLCanvasElement) => (this.htmlCanvasElementReference = r),
      style: {
        width: this.props.width || "800px",
        height: this.props.height || "600px",
      },
    });
  }
}
