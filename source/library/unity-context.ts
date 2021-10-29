import { IUnityConfig } from "../interfaces/unity-config";
import { EventSystem } from "./event-system";

/**
 * A Unity Context object can be fed to a Unity component instance to configure
 * the Unity Instance and handle the communication between the two.
 */
export class UnityContext extends EventSystem {
  public unityInstance: UnityInstance | null = null;
  public htmlCanvasElement: HTMLCanvasElement | null = null;

  /**
   * Creates a new Unity Context instance which can be fed to a Unity component
   * in order to render a Unity Instance.
   * @param unityConfig The Unity Config
   */
  constructor(public unityConfig: IUnityConfig) {
    super();
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
    if (this.unityInstance !== null) {
      if (parameter === undefined) {
        this.unityInstance.SendMessage(gameObjectName, methodName);
      } else {
        this.unityInstance.SendMessage(gameObjectName, methodName, parameter);
      }
    }
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
   * Takes a screenshot of the canvas and returns a data URL containing image
   * data. The image data is in .png format unless otherwise specified.
   * @param dataType The image format of the screenshot
   * @param quality The quality of the jpg or webp screenshot
   * @returns a data URL containing image data of a snapshot of the canvas
   * @public
   */
  public takeScreenshot(
    dataType?: "image/png" | "image/jpeg" | "image/webp",
    quality?: number
  ): string | null {
    if (this.htmlCanvasElement !== null) {
      if (
        this.unityConfig.webglContextAttributes?.preserveDrawingBuffer !== true
      ) {
        console.warn("Taking a screenshot requires 'preserveDrawingBuffer'.");
      }
      return this.htmlCanvasElement.toDataURL(dataType, quality);
    }
    return null;
  }

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   * @public
   * @param {boolean} enabled
   */
  public setFullscreen(enabled: boolean): void {
    if (this.unityInstance !== null) {
      this.unityInstance.SetFullscreen(enabled === true ? 1 : 0);
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
      this.dispatchEvent("quitted");
    }
  }
}
