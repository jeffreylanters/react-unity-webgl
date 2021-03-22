import "../declarations/unity-instance";
import "../declarations/global";
import { createElement, PureComponent } from "react";
import IUnityProps from "../interfaces/unity-props";
import UnityContext from "../models/unity-context";
import UnityLoaderService from "../services/unity-loader-service";
import IUnityInstanceParameters from "../interfaces/unity-instance-parameters";

export default class Unity extends PureComponent<IUnityProps, {}> {
  /**
   * The UnityContext passed by the props.
   * @type {UnityContext}
   */
  private unityContext: UnityContext = this.props.unityContext;

  /**
   * The UnityLoader service instance.
   * @type {UnityLoaderService}
   */
  private unityLoaderService: UnityLoaderService = new UnityLoaderService();

  /**
   * A reference to the html canvas element the UnityInstance will use.
   */
  private htmlCanvasElementReference?: HTMLCanvasElement;

  /**
   * Event invoked by the UnityInstance when the initialization is progressing.
   * Will be used to track the loading progression and invokes the event listeners
   * for both 'progress' and 'loaded' when the progression hits a value of '1'.
   * @param {number} progression
   */
  private onProgress(progression: number): void {
    this.unityContext.invokeEventListener("progress", progression);
    if (progression === 1) {
      this.unityContext.invokeEventListener("loaded");
      if (typeof this.htmlCanvasElementReference !== "undefined")
        this.unityContext.invokeEventListener(
          "canvas",
          this.htmlCanvasElementReference!
        );
    }
  }

  /**
   * Event invoked when the component is mounted. This sets the component
   * reference and starts the mounting of the UnityInstance.
   */
  public componentDidMount(): void {
    this.mountUnityInstance();
  }

  /**
   * Event invoked when the component will unmount. This force quits the
   * UnityInstance which will clear it from the memory.
   */
  public componentWillUnmount(): void {
    this.unityContext.quitUnityInstance();
  }

  /**
   * Initialized the Unity Loader and mounts the UnityInstance to the component.
   */
  private async mountUnityInstance(): Promise<void> {
    try {
      await this.unityLoaderService.addFromUrl(
        this.unityContext.unityConfig.loaderUrl
      );
      const _unityInstanceParameters: IUnityInstanceParameters = {
        ...this.unityContext.unityConfig,
        devicePixelRatio: this.props.devicePixelRatio || undefined,
        matchWebGLToCanvasSize: this.props.matchWebGLToCanvasSize || undefined,
      };
      const _unityInstance = await createUnityInstance(
        this.htmlCanvasElementReference!,
        _unityInstanceParameters,
        this.onProgress.bind(this)
      );
      this.unityContext.setUnityInstance(_unityInstance);
    } catch (message) {
      this.unityContext.invokeEventListener("error", message);
      console.error("A problem occurred while mounting", message);
    }
  }

  /**
   * Renders the unity wrapper and player.
   * @returns {React.ReactNode} element
   */
  public render(): React.ReactNode {
    return createElement("canvas", {
      ref: (ref: HTMLCanvasElement) => (this.htmlCanvasElementReference = ref),
      className: this.props.className || "",
      tabIndex: this.props.tabIndex || undefined,
      style: this.props.style || {},
    });
  }
}
