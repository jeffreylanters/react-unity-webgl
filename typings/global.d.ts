import { IUnityInstanceParameters } from "../source/interfaces/unity-instance-parameters";

/**
 * Type declaration for global types.
 */
declare global {
  /**
   * Object containing all registered legacy unity event listeners.
   * @deprecated
   */
  var ReactUnityWebGL: {
    [eventName: string]: Function;
  };

  /**
   * Dispatches an event that has been registered to all event systems.
   */
  var dispatchReactUnityEvent: Function;

  /**
   * Creates a new UnityInstance.
   * @param canvasHtmlElement The target html canvas element.
   * @param parameters The paramters needed to load Unity.
   * @param onProgress The on progress event listener.
   * @returns A promise resolving when instantiated successfully.
   */
  function createUnityInstance(
    canvasHtmlElement: HTMLCanvasElement,
    parameters: IUnityInstanceParameters,
    onProgress?: (progression: number) => void
  ): Promise<UnityInstance>;
}
