/**
 * Banners can be used to display non-critical warnings and error messages from
 * the Unity Instance.
 */
type UnityBannerType =
  /**
   * Represents an error banner type. This banner type is used to display
   * critical errors from the Unity Instance.
   */
  | "error"
  /**
   * Represents a warning banner type. This banner type is used to display
   * non-critical warnings from the Unity Instance.
   */
  | "warning";

export type { UnityBannerType };
