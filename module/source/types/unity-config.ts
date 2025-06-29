import { UnityArguments } from "./unity-arguments";

/**
 * Most of the Unity Config's properties are also part of the Unity Arguments.
 * This type is used to pick the properties that are configurable from the
 * Unity Arguments.
 */
type ConfigurableUnityArguments = Pick<
  UnityArguments,
  | "dataUrl"
  | "frameworkUrl"
  | "codeUrl"
  | "workerUrl"
  | "streamingAssetsUrl"
  | "memoryUrl"
  | "symbolsUrl"
  | "companyName"
  | "productName"
  | "productVersion"
  | "webglContextAttributes"
  | "cacheControl"
  | "autoSyncPersistentDataPath"
>;

/**
 * The Unity config is provided when instantiating a Unity context. This config
 * will eventually be used to create the Unity Arguments which will be passed
 * to the create Unity instance method in order to initialize it.
 */
type UnityConfig = ConfigurableUnityArguments & {
  /**
   * The url to the build json file generated by Unity. When using a relative url,
   * keep in mind this is relative from the path where your html file is served.
   * It is also possible to use an absolute url, for example when using a CDN.
   */
  readonly loaderUrl: string;
};

export type { UnityConfig };
