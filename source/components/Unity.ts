import * as React from "react";
import IUnityProps from "../interfaces/IUnityProps";
import IUnityState from "../interfaces/IUnityState";
import UnityContent from "../UnityContent";
import UnityLoaderService from "../services/UnityLoaderService";
import "../Types";

export default class Unity extends React.Component<IUnityProps, IUnityState> {
  private htmlElement?: HTMLElement;
  private unityContent: UnityContent;
  private unityLoaderService: UnityLoaderService;

  public state: IUnityState = {};

  constructor(props: IUnityProps) {
    super(props);
    this.unityLoaderService = new UnityLoaderService();
    this.unityContent = this.props.unityContent;
    this.unityContent.setComponentInstance(this);
  }

  private onProgress(unityInstance: UnityInstance, progression: number): void {
    this.unityContent.triggerUnityEvent("progress", progression);
    if (progression === 1) this.unityContent.triggerUnityEvent("loaded");
  }

  public componentDidMount(): void {
    // prettier-ignore
    this.unityLoaderService.append(this.props.unityContent.unityLoaderJsPath, () => {
      this.unityContent.setUnityInstance(UnityLoader.instantiate(
        "__ReactUnityWebGL",
        this.props.unityContent.buildJsonPath, {
          onProgress: this.onProgress.bind(this),
          Module: this.props.unityContent.unityConfig.modules
        }));
      }
    );
  }

  public render(): React.ReactNode {
    return React.createElement("div", {
      className: this.props.className || "",
      ref: ref => (this.htmlElement = ref!),
      id: "__ReactUnityWebGL",
      style: {
        width: this.props.width || "800px",
        height: this.props.height || "600px"
      }
    });
  }
}
