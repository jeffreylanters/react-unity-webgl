/**
 * The status of the Unity loader.
 */
type UnityLoaderStatus =
  /**
   * The Unity loader is idling and awaiting a resource it be loaded.
   */
  | "Idle"

  /**
   * The Unity loader is loading a resource.
   */
  | "Loading"

  /**
   * The Unity loader has loaded a resource.
   */
  | "Loaded"

  /**
   * The Unity loader has failed to load a resource.
   */
  | "Error";

export type { UnityLoaderStatus };
