import IUnityInstanceParameters from "../interfaces/unity-instance-parameters";

/**
 * Type declaration for global types.
 */
declare global {
  /**
   * Type declaration for the ReactUnityWebGL object.
   */
  var ReactUnityWebGL: { [eventName: string]: Function };

  /**
   * Creates a new UnityInstance.
   * @param canvasHtmlElement The target html canvas element.
   * @param parameters The paramters needed to load Unity.
   * @param onProgress The on progress event listener.
   */
  function createUnityInstance(
    canvasHtmlElement: HTMLCanvasElement,
    parameters: IUnityInstanceParameters,
    onProgress?: (progression: number) => void
  ): Promise<UnityInstance>;
}
