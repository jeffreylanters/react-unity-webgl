import * as React from "react";
import IUnityProps from "../interfaces/IUnityProps";
import IUnityState from "../interfaces/IUnityState";

export default class Unity extends React.Component<IUnityProps, IUnityState> {
  constructor(props: IUnityProps) {
    super(props);
  }

  public render(): React.ReactNode {
    return React.createElement(
      "div",
      null,
      "Fullscreen? " + this.props.content.unityConfig.isFullscreen
    );
  }
}
