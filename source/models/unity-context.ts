import { IUnityConfig } from "../interfaces/unity-config";
import { IUnityEvent } from "../interfaces/unity-event";
import { IUnityContextEventMap } from "../interfaces/unity-context-event-map";

// TODO remove from dir
/**
 * The Unity Context.
 */
export class UnityContext {
  /**
   * A reference to the Unity Instance binded to this unityContext.
   * @private
   * @type {UnityInstance}
   */
  private unityInstance?: UnityInstance;

  /**
   * A list of the UnityEvents binded to this unityContext.
   * @private
   * @type {IUnityEvent[]}
   */
  private unityEvents: IUnityEvent[] = [];

  /**
   * Creates a new instance of the Unity context model.
   * @param {IUnityConfig} unityConfig The Unity config used to build the player.
   */
  constructor(public unityConfig: IUnityConfig) {
    if (
      typeof window !== "undefined" &&
      typeof window.ReactUnityWebGL === "undefined"
    )
      window.ReactUnityWebGL = {};
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
    if (typeof this.unityInstance !== "undefined") {
      await this.unityInstance.Quit();
      this.dispatchEventListener("quitted");
      this.unityInstance = undefined;
    }
  }

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @public
   * @param {string} gameObjectName the name of the game object in your Unity scene.
   * @param {string} methodName the name of the public method on the game object.
   * @param {string | number | boolean} parameter an optional method parameter.
   */
  public send(
    gameObjectName: string,
    methodName: string,
    parameter?: string | number | boolean
  ): void {
    if (typeof this.unityInstance !== "undefined")
      if (typeof parameter === "undefined")
        this.unityInstance.SendMessage(gameObjectName, methodName);
      else
        this.unityInstance.SendMessage(gameObjectName, methodName, parameter);
  }

  /**
   * Registers an event listener for the Unity player. These can be
   * system events like when the player is initialized or loader and
   * your custom events from Unity.
   * @public
   * @param {string} eventName the event's name
   * @param {Function} eventListener the event's function
   */
  public on<MapKey extends keyof IUnityContextEventMap | (string & {})>(
    eventName: keyof IUnityContextEventMap | (MapKey & {}),
    eventListener: (
      ...parameters: MapKey extends keyof IUnityContextEventMap
        ? IUnityContextEventMap[MapKey]
        : any
    ) => void
  ): void {
    this.unityEvents.push({ eventName, eventCallback: eventListener });
    if (typeof window !== "undefined")
      window.ReactUnityWebGL[eventName] = (...parameters: any) =>
        eventListener(...parameters);
  }

  /**
   * Removes all the Event Listeners with a specific Event Name.
   * @public
   * @param {string} eventName the event's name
   * @example unityContext.removeEventListener("progress");
   */
  public removeEventListener(eventName: string): void {
    // TODO refactor to "off"?
    for (let _i = 0; _i < this.unityEvents.length; _i++)
      if (this.unityEvents[_i].eventName === eventName)
        this.unityEvents.splice(_i, 1);
    delete window.ReactUnityWebGL[eventName];
  }

  /**
   * Removes all the Event Listeners.
   * @public
   * @example unityContext.removeAllEventListeners();
   */
  public removeAllEventListeners(): void {
    // TODO refactor to "off"?
    for (let _i = 0; _i < this.unityEvents.length; _i++)
      delete window.ReactUnityWebGL[this.unityEvents[_i].eventName];
    this.unityEvents = [];
  }

  /**
   * Dispatches an event listener that has been registered using the on method.
   * @public
   * @param {string} eventName the event's name
   * @param {any} eventValue the event's value
   * @example unityContext.dispatchEventListener("gameOver", 180);
   */
  public dispatchEventListener(eventName: string, eventValue?: any): void {
    for (let _unityEvent of this.unityEvents)
      if (_unityEvent.eventName === eventName)
        _unityEvent.eventCallback(eventValue);
  }

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   * @public
   * @param {boolean} enabled
   */
  public setFullscreen(enabled: boolean): void {
    if (typeof this.unityInstance !== "undefined")
      this.unityInstance.SetFullscreen(enabled === true ? 1 : 0);
  }
}
