import "../declarations/global";
import IUnityConfig from "../interfaces/unity-config";
import IUnityEvent from "../interfaces/unity-event";
import UnityComponent from "../components/unity";
import IUnityContextEventMap from "../interfaces/unity-context-event-map";

/**
 * The Unity Context.
 */
export default class UnityContext {
  /**
   * A reference to the Unity Component binded to this unityContext.
   * @type {UnityComponent}
   */
  private unityComponentReference?: UnityComponent;

  /**
   * A reference to the Unity Instance binded to this unityContext.
   * @type {UnityInstance}
   */
  private unityInstance?: UnityInstance;

  /**
   * A list of the UnityEvents binded to this unityContext.
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
      typeof (window as any).ReactUnityWebGL === "undefined"
    )
      (window as any).ReactUnityWebGL = {};
  }

  /**
   * Sets the reference to the UnityComponent.
   * @param {UnityComponent} unityComponentReference the target unity component.
   */
  public setComponentReference(unityComponentReference: UnityComponent): void {
    this.unityComponentReference = unityComponentReference;
  }

  /**
   * Sets the reference of the UnityInstance.
   * @param {UnityInstance} unityInstance the target unityInstance.
   */
  public setUnityInstance(unityInstance: UnityInstance): void {
    this.unityInstance = unityInstance;
  }

  /**
   * Quits the Unity Instance and clears it from memory.
   */
  public quitUnityInstance(): void {
    if (typeof this.unityInstance !== "undefined")
      this.unityInstance.Quit().then(() => {
        this.invokeEventListener("quitted");
        this.unityInstance = undefined;
      });
  }

  /**
   * Sends a message to the UnityInstance to invoke a public method.
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
   * @param {string} eventName the event name
   * @param {Function} eventListener the event function
   * @returns {any} The Function
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
      (window as any).ReactUnityWebGL[eventName] = (...parameters: any) =>
        eventListener(...parameters);
  }

  /**
   * Invokes an event listener that has been registered using the on function.
   * @param {string} eventName the event name
   * @param {Function} eventValue the event value
   */
  public invokeEventListener(eventName: string, eventValue?: any): void {
    for (let _unityEvent of this.unityEvents)
      if (_unityEvent.eventName === eventName)
        _unityEvent.eventCallback(eventValue);
  }

  /**
   * Enables or disabled the fullscreen mode of the UnityInstance.
   * @param {boolean} enabled
   */
  public setFullscreen(enabled: boolean): void {
    if (typeof this.unityInstance !== "undefined")
      this.unityInstance.SetFullscreen(enabled === true ? 1 : 0);
  }
}
