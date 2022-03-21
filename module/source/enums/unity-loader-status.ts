/**
 * The status of the Unity loader.
 */
export enum UnityLoaderStatus {
  /**
   * The Unity loader is idling and awaiting a resource it be loaded.
   */
  Idle = "Idle",

  /**
   * The Unity loader is loading a resource.
   */
  Loading = "Loading",

  /**
   * The Unity loader has loaded a resource.
   */
  Loaded = "Loaded",

  /**
   * The Unity loader has failed to load a resource.
   */
  Error = "Error",
}
