import { IUnityConfig } from "../interfaces/unity-config";

/**
 *
 */
export class UnityContext {
  public unityInstance: UnityInstance | null = null;
  public htmlCanvasElement: HTMLCanvasElement | null = null;

  /**
   * creates a new Unity Context instance which can be fed to a Unity component
   * in order to render a Unity Instance.
   * @param unityConfig The Unity Config
   */
  constructor(public unityConfig: IUnityConfig) {}

  /**
   * Dispatches an event listener that has been registered using the on method.
   * @public
   * @param {string} eventName the event's name
   * @param {any} eventValue the event's value
   * @example unityContext.dispatchEventListener("gameOver", 180);
   */
  public dispatchEventListener(eventName: string, eventValue?: any): void {
    console.log("DISPATCHING", eventName, eventValue);
  }

  /**
   * Asynchronously ask for the pointer to be locked on current canvas. To track
   * the success or failure of the request, it is necessary to listen for the
   * pointerlockchange and pointerlockerror events at the Document level.
   * @public
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock
   */
  public requestPointerLock(): void {
    if (this.htmlCanvasElement !== null) {
      this.htmlCanvasElement.requestPointerLock();
    }
  }

  /**
   * Quits the Unity Instance and clears it from memory.
   * @public
   */
  public async quitUnityInstance(): Promise<void> {
    if (this.unityInstance !== null) {
      await this.unityInstance.Quit();
      this.unityInstance = null;
      this.dispatchEventListener("quitted");
    }
  }
}
