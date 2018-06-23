import { UnityVersion } from "../enums/UnityVerions";

export default interface IUnityConfig {
  /**
   * Defines wether the unity content fullscreen.
   * @type {boolean}
   */
  isFullscreen?: boolean;

  /**
   * Unity Module injection.
   * @type {Object}
   */
  modules?: Object;

  /**
   * Unity Version
   * @type {string}
   */
  unityVersion?: UnityVersion;
}
