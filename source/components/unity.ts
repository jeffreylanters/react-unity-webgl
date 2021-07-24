import { createElement, PureComponent } from "react";
import { IUnityProps } from "../interfaces/unity-props";
import { UnityContext } from "../models/unity-context";
import { UnityLoaderService } from "../services/unity-loader-service";
import { IUnityInstanceParameters } from "../interfaces/unity-instance-parameters";

// TODO turn into functional component
export class Unity extends PureComponent<IUnityProps, {}> {
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
   * A flag representing the component's mount state.
   * @private
   * @type {boolean}
   */
  private isComponentMounted: boolean = false;

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
    this.isComponentMounted = true;
    this.mountUnityInstance();
  }

  /**
   * Event invoked when the component will unmount. This force quits the
   * UnityInstance which will clear it from the memory.
   * @public
   */
  public componentWillUnmount(): void {
    this.unityContext.quitUnityInstance();
    this.isComponentMounted = false;
  }

  /**
   * Initialized the Unity Loader and mounts the UnityInstance to the component.
   * @private
   * @async
   * @returns {Promise<void>} a promise resolving when Unity loaded correctly.
   */
  private async mountUnityInstance(): Promise<void> {
    try {
      // Unity requires the loader script to be appended and loaded before we
      // can safely instantiate Unity and mount the component.
      await this.unityLoaderService.addFromUrl(
        this.unityContext.unityConfig.loaderUrl
      );
      // When the loader service was fetching the required scripts, it is
      // possible for the component to be unmounted. This is why we check if it
      // is still mounted, if not, we do not proceed instantiating Unity.
      if (this.isComponentMounted === false) {
        return;
      }
      // Creating the Unity Instance parameters object which will be passed down
      // to the Unity instantiating method in order to mount correctly.
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
      // Creates the actual Unity Instance and mounts it to the canvas element.
      const _unityInstance = await createUnityInstance(
        this.htmlCanvasElementReference!,
        _unityInstanceParameters,
        this.onProgress.bind(this)
      );
      // Finally pass the instance back to the context object.
      this.unityContext.setUnityInstance(_unityInstance);
      // Since the creation of the Unity Instance is async, we'll check the
      // component's mount state right aftater instantiating. If the component
      // is no longer mounted, we'll quit the Unity instance right away.
      // This needs to occur after the setUnityInstance call because
      // quitUnityInstance requires the instance to be set.
      // HACK requires type cast to boolean due to await between comparisons.
      if ((this.isComponentMounted as boolean) === false)
        return this.unityContext.quitUnityInstance();
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
