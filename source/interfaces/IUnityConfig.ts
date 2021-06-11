import { UnityVersion } from "../declarations/UnityVersion";

export default interface IUnityConfig {
  /**
   * The unique identifier helps you getting the instance
   * of your context from any other class.
   * @type {string}
   */
  id?: string;

  /**
   * Unity Module injection.
   * @type {Object}
   */
  modules?: Object;

  /**
   * The url where the streaming assets can be found. When using a relative url,
   * keep in mind this is relative from the path where your html file is served.
   * @type {string}
   */
  streamingAssetsUrl?: string;

  /**
   * You can default your Unity Version. The library may
   * contain future patches for specific Unity versions.
   * It's not needed but is recommended to define a version.
   * @type {UnityVersion}
   */
  unityVersion?: UnityVersion;

  /**
   * Since the Unity canvas itself does not respond to the resizing
   * of it's container we have to manually do this. A width and height
   * of 100% does not seem to work, so we have to fetch it's parent's
   * size to adject the canvas.
   * @type {boolean}
   */
  adjustOnWindowResize?: boolean;
}
