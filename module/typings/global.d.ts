import { IUnityArguments } from "../source/interfaces/unity-arguments";

/**
 * Type declaration for global types.
 */
declare global {
  /**
   * Dispatches an event that has been registered to all event systems.
   * @param eventName The name of the event.
   * @param arguments The arguments to pass to the event.
   */
  const dispatchReactUnityEvent: (
    eventName: string,
    ...arguments: ReactUnityEventArgumentType[]
  ) => void;

  /**
   * Creates a new UnityInstance.
   * @param canvasHtmlElement The target html canvas element.
   * @param arguments The arguments needed to load Unity.
   * @param onProgress The on progress event listener.
   * @returns A promise resolving when instantiated successfully.
   */
  function createUnityInstance(
    canvasHtmlElement: HTMLCanvasElement,
    arguments: IUnityArguments,
    onProgress?: (progression: number) => void
  ): Promise<UnityInstance>;
}
