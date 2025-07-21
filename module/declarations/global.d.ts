import { UnityEventParameter } from "../source/types/unity-event-parameters";
import { UnityArguments } from "../source/types/unity-arguments";
import { UnityInstance } from "../source/types/unity-instance";

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
    ...parameters: UnityEventParameter[]
  ): void;

  /**
   * Creates a new UnityInstance.
   * @param canvasHtmlElement The target html canvas element.
   * @param arguments The arguments needed to load Unity.
   * @param onProgress The on progress event listener.
   * @param onSuccess The on success event listener.
   * @param onError The on error event listener.
   * @returns A promise resolving when instantiated successfully.
   */
  function createUnityInstance(
    canvasHtmlElement: HTMLCanvasElement,
    arguments: UnityArguments,
    onProgress?: (progression: number) => void,
    onSuccess?: (unityInstance: UnityInstance) => void,
    onError?: (error: Error) => void
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
