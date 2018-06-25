import { UnityVersion } from "../enums/UnityVersion";

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
   * You can default your Unity Version. The library may
   * contain future patches for specific Unity versions.
   * It's not needed but is recommended to define a version.
   * @type {UnityVersion}
   */
  unityVersion?: UnityVersion;
}
