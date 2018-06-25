import * as React from "react";
import IUnityProps from "../interfaces/IUnityProps";
import IUnityState from "../interfaces/IUnityState";
import "../Types";
export default class Unity extends React.Component<IUnityProps, IUnityState> {
    private htmlElement?;
    private unityContent;
    private unityLoaderService;
    state: IUnityState;
    constructor(props: IUnityProps);
    private onProgress;
    componentDidMount(): void;
    render(): React.ReactNode;
}
//# sourceMappingURL=Unity.d.ts.map