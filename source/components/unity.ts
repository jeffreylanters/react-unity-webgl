import { createElement, PureComponent } from "react";
import IUnityProps from "../interfaces/unity-props";
import UnityContext from "../models/unity-context";
import UnityLoaderService from "../services/unity-loader-service";
import IUnityInstanceParameters from "../interfaces/unity-instance-parameters";

// TODO turn into functional component
export default class Unity extends PureComponent<IUnityProps, {}> {
  /**
   * The UnityContext passed by the props.
   * @private
   * @type {UnityContext}
   */
  private unityContext: UnityContext = this.props.unityContext;

  /**
   * The UnityLoader service instance.
   * @private
   * @type {UnityLoaderService}
   */
  private unityLoaderService: UnityLoaderService = new UnityLoaderService();

  /**
   * A reference to the html canvas element the UnityInstance will use.
   * @private
   * @type {HTMLCanvasElement}
   */
  private htmlCanvasElementReference?: HTMLCanvasElement;

  /**
   * Event invoked by the UnityInstance when the initialization is progressing.
   * Will be used to track the loading progression and invokes the event listeners
   * for both 'progress' and 'loaded' when the progression hits a value of '1'.
   * @private
   * @param {number} progression
   */
  private onProgress(progression: number): void {
    this.unityContext.dispatchEventListener("progress", progression);
    if (progression === 1) {
      this.unityContext.dispatchEventListener("loaded");
      if (typeof this.htmlCanvasElementReference !== "undefined")
        this.unityContext.dispatchEventListener(
          "canvas",
          this.htmlCanvasElementReference!
        );
    }
  }

  /**
   * Event invoked when the component is mounted. This sets the component
   * reference and starts the mounting of the UnityInstance.
   * @public
   */
  public componentDidMount(): void {
    this.mountUnityInstance();
  }

  /**
   * Event invoked when the component will unmount. This force quits the
   * UnityInstance which will clear it from the memory.
   * @public
   */
  public componentWillUnmount(): void {
    this.unityContext.quitUnityInstance();
  }

  /**
   * Initialized the Unity Loader and mounts the UnityInstance to the component.
   * During this cycle the unity loader service will append the loader script
   * using a new script tag and will continue when the script tag is loaded
   * succesfully. Then the Unity Instance Paramters will be constructed, these
   * consist out of the spreaded provided unityConfig, optional devicePixelRatio
   * and matchWebGLToCanvasSize passed via props. Finally the unity Instance
   * will be created.
   * @private
   * @async
   * @returns {Promise<void>} a promise resolving when Unity loaded correctly.
   */
  private async mountUnityInstance(): Promise<void> {
    try {
      await this.unityLoaderService.addFromUrl(
        this.unityContext.unityConfig.loaderUrl
      );
      const _unityInstanceParameters: IUnityInstanceParameters = {
        ...this.unityContext.unityConfig,
        printErr: (message: string) =>
          this.unityContext.dispatchEventListener("error", message),
        print: (message: string) =>
          this.unityContext.dispatchEventListener("debug", message),
      };
      if (this.props.devicePixelRatio !== undefined)
        _unityInstanceParameters.devicePixelRatio = this.props.devicePixelRatio;
      if (this.props.matchWebGLToCanvasSize !== undefined)
        _unityInstanceParameters.matchWebGLToCanvasSize =
          this.props.matchWebGLToCanvasSize;
      const _unityInstance = await createUnityInstance(
        this.htmlCanvasElementReference!,
        _unityInstanceParameters,
        this.onProgress.bind(this)
      );
      this.unityContext.setUnityInstance(_unityInstance);
    } catch (message) {
      this.unityContext.dispatchEventListener("error", message);
      console.error("A problem occurred while mounting", message);
    }
  }

  /**
   * Renders the unity wrapper and player.
   * @public
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
