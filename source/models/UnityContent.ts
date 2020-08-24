import "../declarations/UnityLoader";
import "../declarations/UnityInstance";
import "../declarations/ReactUnityWebgl";
import IUnityConfig from "../interfaces/IUnityConfig";
import IUnityEvent from "../interfaces/IUnityEvent";
import UnityComponent from "../components/Unity";

export default class UnityContent {
  /**
   * A reference to the Unity Component binded to this UnityContent.
   * @type {UnityComponent}
   * @private
   */
  private unityComponentReference?: UnityComponent;

  /**
   * A reference to the Unity Instance binded to this UnityContent.
   * @type {UnityInstance}
   * @private
   */
  private unityInstance?: UnityInstance;

  /**
   * A list of the UnityEvents binded to this UnityContent.
   * @type {IUnityEvent[]}
   * @public
   */
  private unityEvents: IUnityEvent[] = [];

  /**
   * Creates a new instance of the Unity Content model.
   * @param {IUnityConfig} unityConfig The Unity config used to build the player.
   */
  constructor(public unityConfig: IUnityConfig) {}

  /**
   * Sets the reference to the UnityComponent.
   * @param unityComponentReference the unity component that will be binded to this content.
   * @public
   */
  public setComponentReference(unityComponentReference: UnityComponent): void {
    this.unityComponentReference = unityComponentReference;
  }

  /**
   * Sets the reference of the UnityInstance.
   * @param unityInstance the unity component that will be binded to this content.
   * @public
   */
  public setUnityInstance(unityInstance: UnityInstance): void {
    this.unityInstance = unityInstance;
  }

  /**
   * Enables or disabled the fullscreen mode of the UnityInstance.
   * @param {boolean} enabled
   * @public
   */
  public setFullscreen(enabled: boolean): void {
    if (this.unityInstance != null) {
      this.unityInstance.SetFullscreen(enabled === true ? 1 : 0);
    }
  }

  /**
   * Quits the Unity Instance and removes it from memory.
   */
  public remove(): void {
    if (typeof this.unityInstance !== "undefined")
      this.unityInstance.Quit(() => {
        this.triggerUnityEvent("quitted");
        this.unityInstance = undefined;
      });
  }

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @param {string} gameObjectName the name of the game object in your Unity scene.
   * @param {string} methodName the name of the public method on the game object.
   * @param {string | number | boolean} parameter an optional parameter to pass along to the method.
   * @public
   */
  public send(
    gameObjectName: string,
    methodName: string,
    parameter?: string | number | boolean
  ): void {
    if (this.unityInstance != null)
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
   * @param {Function} eventCallback the event function
   * @returns {any} The Function
   * @public
   */
  public on(eventName: string, eventCallback: Function): any {
    this.unityEvents.push({ eventName, eventCallback });
    if (typeof (window as any).ReactUnityWebGL === "undefined")
      (window as any).ReactUnityWebGL = {};
    (window as any).ReactUnityWebGL[eventName] = (parameter: any) =>
      eventCallback(parameter);
  }

  /**
   * Triggers an event that has been registered by the on
   * function.
   * @param {string} eventName the event name
   * @param {Function} eventValue the event value
   * @public
   */
  public triggerUnityEvent(eventName: string, eventValue?: any): void {
    for (let _unityEvent of this.unityEvents)
      if (_unityEvent.eventName === eventName)
        _unityEvent.eventCallback(eventValue);
  }
}
