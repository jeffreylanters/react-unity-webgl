import { UnityVersion } from "../enums/UnityVersion";
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
     * You can default your Unity Version. The library may
     * contain future patches for specific Unity versions.
     * It's not needed but is recommended to define a version.
     * @type {UnityVersion}
     */
    unityVersion?: UnityVersion;
}
//# sourceMappingURL=IUnityConfig.d.ts.map