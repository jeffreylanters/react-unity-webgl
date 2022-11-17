/**
 * The cache control mode determines how the Unity should cache the resource.
 * - `must-revalidate`: The cache returns to an enabled state and the file is
 *   revalidated before being loaded from the cache.
 * - `immutable`: the cache is enabled and the file is loaded from the cache
 *   without revalidation.
 * - `no-store`: The cache is disabled.
 */
declare type UnityCacheControlMode =
  /**
   * The cache returns to an enabled state and the file is revalidated before
   * being loaded from the cache.
   */
  | "must-revalidate"
  /**
   * the cache is enabled and the file is loaded from the cache without revalidation.
   */
  | "immutable"
  /**
   * The cache is disabled.
   */
  | "no-store";
