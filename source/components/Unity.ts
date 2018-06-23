import * as React from "react";
import IUnityProps from "../interfaces/IUnityProps";
import IUnityState from "../interfaces/IUnityState";
import UnityContent from "../UnityContent";

export default class Unity extends React.Component<IUnityProps, IUnityState> {
  private htmlElement?: HTMLElement;
  private unityContent: UnityContent;

  public state: IUnityState = {};

  constructor(props: IUnityProps) {
    super(props);
    this.unityContent = this.props.unityContent;
    this.unityContent.setComponentInstance(this);
    // this.unityContent.setUnityInstance(this); // TODO
  }

  public render(): React.ReactNode {
    return React.createElement(
      "div",
      {
        className: this.props.className || "",
        ref: ref => (this.htmlElement = ref!),
        style: {
          width: this.props.width || "800px",
          height: this.props.height || "600px"
        }
      },
      "Fullscreen!"
    );
  }
}
