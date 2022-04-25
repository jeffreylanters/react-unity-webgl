import { IUnityArguments } from "../source/interfaces/unity-arguments";

/**
 * Type declaration for global types.
 */
declare global {
  /**
   * Dispatches an event that has been registered to all event systems.
   * @param eventName The name of the event.
   * @param parameters The parameters to pass to the event.
   */
  function dispatchReactUnityEvent(
    eventName: string,
    ...parameters: ReactUnityEventParameterType[]
  ): void;

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

  /**
   * Due to some developers wanting to use the window object as a global scope
   * in order to invoke the create Unity Instance and dispatch React Unity Event
   * functions, we need to declare the window object as a global type.
   */
  interface Window {
    /**
     * Dispatches an event that has been registered to all event systems.
     * @param eventName The name of the event.
     * @param parameters The parameters to pass to the event.
     */
    dispatchReactUnityEvent: typeof dispatchReactUnityEvent;

    /**
     * Creates a new UnityInstance.
     * @param canvasHtmlElement The target html canvas element.
     * @param arguments The arguments needed to load Unity.
     * @param onProgress The on progress event listener.
     * @returns A promise resolving when instantiated successfully.
     */
    createUnityInstance: typeof createUnityInstance;
  }
}
