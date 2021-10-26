import { IUnityConfig } from "../interfaces/unity-config";

/**
 *
 */
export class UnityContext {
  /**
   *
   */
  private unityInstance: UnityInstance | null = null;

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
    // TODO: implement
    // for (let _unityEvent of this.unityEvents)
    //   if (_unityEvent.eventName === eventName)
    //     _unityEvent.eventCallback(eventValue);
    console.log("DISPATCHING", eventName, eventValue);
  }

  /**
   * Sets the reference of the UnityInstance.
   * @public
   * @param {UnityInstance} unityInstance the target unityInstance.
   */
  public setUnityInstance(unityInstance: UnityInstance): void {
    this.unityInstance = unityInstance;
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
