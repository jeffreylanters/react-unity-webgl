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

  public componentDidMount(): void {
    let _unityContent = this.props.unityContent;
    this.unityLoaderService.append(_unityContent.unityLoaderJsPath, () => {
      let _unityInstance = UnityLoader.instantiate(
        "__ReactUnityWebGL",
        _unityContent.buildJsonPath,
        {
          // onProgress: this._onProgress.bind(this), TODO
          Module: _unityContent.unityConfig.modules
        }
      );
      this.unityContent.setUnityInstance(_unityInstance);
    });
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
