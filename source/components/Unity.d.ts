import * as React from "react";
import IUnityProps from "../interfaces/IUnityProps";
import IUnityState from "../interfaces/IUnityState";
import "../Types";
export default class Unity extends React.Component<IUnityProps, IUnityState> {
    /**
     * Reference to the wrappers html element.
     * @type {HTMLElement}
     * @private
     */
    private htmlElement?;
    /**
     * The Unity content passed by the props.
     * @type {UnityContent}
     * @private
     */
    private unityContent;
    /**
     * The Unity Loader service instance.
     * @type {UnityLoaderService}
     * @private
     */
    private unityLoaderService;
    /**
     * The component state.
     * @type {IUnityState}
     * @public
     */
    state: IUnityState;
    /**
     * Initialized the component.
     * @param {IUnityProps} props
     */
    constructor(props: IUnityProps);
    /**
     * An event that is triggered by the Unity player. This tracks
     * the loading progression of the player. It will send '1' when
     * the loading is completed.
     * @param {UnityInstance} unityInstance
     * @param {number} progression
     * @private
     */
    private onProgress;
    /**
     * Initialzied the Unity player when the component is mounted.
     * @public
     */
    componentDidMount(): void;
    /**
     * Renders the unity wrapper and player.
     * @returns {React.ReactNode} element
     * @public
     */
    render(): React.ReactNode;
}
